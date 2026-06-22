// ─── api/create-checkout.js ─────────────────────────────────────────────────
// Vercel / Netlify serverless function for Stripe Checkout.
// Deploy this file to /api/create-checkout.js in your Vercel project.
//
// Environment variables to set in Vercel dashboard:
//   STRIPE_SECRET_KEY  →  sk_live_... (or sk_test_... for testing)
//   SITE_URL           →  https://myadorablehijabifriend.com  (no trailing slash)

const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  // CORS headers (needed if your site and this function are on different origins)
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const siteUrl = process.env.SITE_URL || 'https://myadorablehijabifriend.com';

  const { items, customerEmail, customerName } = req.body;

  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }

  // Build Stripe line items from basket
  const lineItems = items.map(function (item) {
    return {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          images: item.image ? [siteUrl + '/' + item.image] : []
        },
        unit_amount: Math.round(item.price * 100) // pence
      },
      quantity: item.qty
    };
  });

  // Add shipping if subtotal < £25
  const subtotal = items.reduce(function (s, i) { return s + i.price * i.qty; }, 0);
  if (subtotal < 25) {
    lineItems.push({
      price_data: {
        currency: 'gbp',
        product_data: { name: 'Standard Shipping' },
        unit_amount: 329 // £3.29
      },
      quantity: 1
    });
  }

  try {
    const session = await stripe.checkout.sessions.create({
      payment_method_types: ['card'],
      mode: 'payment',
      line_items: lineItems,
      customer_email: customerEmail,
      metadata: { customerName: customerName || '' },
      shipping_address_collection: {
        allowed_countries: ['GB']
      },
      success_url: siteUrl + '/success.html',
      cancel_url:  siteUrl + '/checkout.html'
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: err.message });
  }
};
