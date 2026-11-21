// ─── api/reviews.js ─────────────────────────────────────────────────────────
// Customer reviews, stored in a Google Sheet (see google-apps-script/Reviews.gs).
//
//   GET  /api/reviews?product=<id>   → approved reviews + rating summary for one product
//   GET  /api/reviews?summary=1      → rating summary for every product (shop page)
//   POST /api/reviews                → submit a review (shows once approved in the sheet)
//
// Environment variables (set in the Vercel dashboard):
//   REVIEWS_SCRIPT_URL  →  the Apps Script "Web app" URL (ends in /exec)
//   REVIEWS_SECRET      →  the secret printed by the script's setup() function

const { productMap } = require('../products.js');
const { readBody } = require('./_lib/order');

const MAX_PHOTOS = 3;
const MAX_PHOTO_BYTES = 1.2 * 1024 * 1024; // after the browser shrinks them
const PHOTO_TYPES = ['image/jpeg', 'image/png', 'image/webp'];

function configured() {
  return !!(process.env.REVIEWS_SCRIPT_URL && process.env.REVIEWS_SECRET);
}

async function fetchApproved() {
  const url = process.env.REVIEWS_SCRIPT_URL + '?secret=' + encodeURIComponent(process.env.REVIEWS_SECRET);
  const res = await fetch(url, { redirect: 'follow' });
  const data = await res.json();
  if (data.error || !Array.isArray(data.reviews)) throw new Error('Sheet error: ' + (data.error || 'bad response'));
  return data.reviews;
}

function summarise(reviews) {
  const counts = [0, 0, 0, 0, 0]; // 5★ … 1★
  let sum = 0;
  reviews.forEach(function (r) {
    const n = Math.min(5, Math.max(1, Math.round(r.rating)));
    counts[5 - n]++;
    sum += n;
  });
  const total = reviews.length;
  return {
    total: total,
    avg: total ? Math.round((sum / total) * 10) / 10 : 0,
    bars: counts.map(function (c) { return total ? Math.round((c / total) * 100) : 0; })
  };
}

// Only send the fields the page displays.
function publicReview(r) {
  return {
    name: r.name,
    rating: r.rating,
    text: r.text,
    photos: (r.photos || []).filter(function (u) { return /^https:\/\/drive\.google\.com\/thumbnail\?id=[\w-]+&sz=w\d+$/.test(u); }),
    date: r.date
  };
}

async function handleGet(req, res) {
  if (!configured()) return res.status(200).json({ configured: false, reviews: [], summary: summarise([]) });

  const all = await fetchApproved();
  // Cache at Vercel's edge for 2 minutes so the sheet isn't hit on every page view.
  res.setHeader('Cache-Control', 'public, s-maxage=120, stale-while-revalidate=600');

  if (req.query.summary) {
    const byProduct = {};
    Object.keys(productMap).forEach(function (id) {
      byProduct[id] = summarise(all.filter(function (r) { return r.productId === id; }));
    });
    return res.status(200).json({ summaries: byProduct });
  }

  const id = String(req.query.product || '');
  if (!productMap[id]) return res.status(400).json({ error: 'Unknown product.' });
  const mine = all.filter(function (r) { return r.productId === id; });
  return res.status(200).json({ reviews: mine.map(publicReview), summary: summarise(mine) });
}

function validate(body) {
  if (body.website) return 'spam'; // hidden "honeypot" field — real people leave it empty
  const product = productMap[body.productId];
  if (!product) return 'Unknown product.';

  const rating = Number(body.rating);
  if (!Number.isInteger(rating) || rating < 1 || rating > 5) return 'Please choose a star rating.';

  const name = String(body.name || '').trim();
  if (name.length < 1 || name.length > 50) return 'Please enter your name (up to 50 characters).';

  const text = String(body.text || '').trim();
  if (text.length < 10) return 'Please write a few more words (at least 10 characters).';
  if (text.length > 1500) return 'Please keep your review under 1500 characters.';

  const photos = Array.isArray(body.photos) ? body.photos : [];
  if (photos.length > MAX_PHOTOS) return 'You can add up to ' + MAX_PHOTOS + ' photos.';
  for (const p of photos) {
    if (!p || PHOTO_TYPES.indexOf(p.type) === -1 || typeof p.data !== 'string' || !/^[A-Za-z0-9+/=]+$/.test(p.data)) {
      return 'Photos must be JPG, PNG or WEBP images.';
    }
    if (p.data.length * 0.75 > MAX_PHOTO_BYTES) return 'One of the photos is too large.';
  }

  return { productId: product.id, productName: product.name, rating, name, text, photos };
}

async function handlePost(req, res) {
  if (!configured()) return res.status(503).json({ error: 'Reviews are not set up yet.' });

  const result = validate(readBody(req));
  if (result === 'spam') return res.status(200).json({ ok: true }); // pretend success for bots
  if (typeof result === 'string') return res.status(400).json({ error: result });

  const sheetRes = await fetch(process.env.REVIEWS_SCRIPT_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'text/plain' }, // Apps Script reads the raw body
    body: JSON.stringify(Object.assign({ secret: process.env.REVIEWS_SECRET }, result)),
    redirect: 'follow'
  });
  const data = await sheetRes.json().catch(function () { return {}; });
  if (!data.ok) throw new Error('Sheet error: ' + (data.error || sheetRes.status));

  return res.status(200).json({ ok: true });
}

module.exports = async function handler(req, res) {
  try {
    if (req.method === 'GET') return await handleGet(req, res);
    if (req.method === 'POST') return await handlePost(req, res);
    return res.status(405).json({ error: 'Method not allowed' });
  } catch (err) {
    console.error(err);
    return res.status(502).json({ error: 'Reviews are unavailable right now. Please try again later.' });
  }
};
