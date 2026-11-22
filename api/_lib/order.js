// ─── api/_lib/order.js ──────────────────────────────────────────────────────
// Turns a basket sent by the browser into a trusted order.
//
// The browser only tells us WHICH products and HOW MANY. Names and prices
// always come from products.js, so a customer can't change what they pay.
// (Files in api/_lib are helpers, not public endpoints.)

const { itemMap, shipping } = require('../../products.js');
const { checkPromo, promoErrorMessage, meetsMinSpend, minSpendMessage, normaliseCode } = require('./promos');

const MAX_QTY_PER_ITEM = 20;

class OrderError extends Error {}

// Returns amounts in pence to avoid rounding problems.
function buildOrder(items, promoCode) {
  if (!Array.isArray(items) || items.length === 0) {
    throw new OrderError('Your basket is empty.');
  }

  const lines = items.map(function (item) {
    const product = item && itemMap[item.id];
    if (!product) {
      throw new OrderError('A product in your basket is no longer available. Please remove it and try again.');
    }
    const qty = Number(item.qty);
    if (!Number.isInteger(qty) || qty < 1 || qty > MAX_QTY_PER_ITEM) {
      throw new OrderError('Please choose between 1 and ' + MAX_QTY_PER_ITEM + ' of each item.');
    }
    return {
      id: product.id,
      name: product.name,
      image: product.image,
      unitPence: Math.round(product.price * 100),
      qty: qty
    };
  });

  // An unknown code is an error (rather than silently ignored) so the
  // customer is never charged a price they weren't expecting.
  let promo = null;
  if (normaliseCode(promoCode)) {
    const check = checkPromo(promoCode);
    if (!check.ok) throw new OrderError(promoErrorMessage(check.reason) + ' Please remove it and try again.');
    promo = check.promo;
  }

  const subtotalPence = lines.reduce(function (s, l) { return s + l.unitPence * l.qty; }, 0);
  if (promo && !meetsMinSpend(promo, subtotalPence)) {
    throw new OrderError('Sorry, ' + minSpendMessage(promo) + ' Please remove it and try again.');
  }
  const freeShipping = (promo && promo.freeShipping) || subtotalPence >= Math.round(shipping.freeOver * 100);
  const shippingPence = freeShipping ? 0 : Math.round(shipping.cost * 100);

  return {
    lines: lines,
    subtotalPence: subtotalPence,
    shippingPence: shippingPence,
    promo: promo,
    totalPence: subtotalPence + shippingPence
  };
}

function penceToString(pence) {
  return (pence / 100).toFixed(2);
}

// The site's own address, e.g. https://myadorablehijabifriend.com
function siteUrl(req) {
  if (process.env.SITE_URL) return process.env.SITE_URL.replace(/\/$/, '');
  const proto = req.headers['x-forwarded-proto'] || 'https';
  return proto + '://' + req.headers.host;
}

// Vercel normally parses JSON bodies, but be safe if it arrives as text.
function readBody(req) {
  if (typeof req.body === 'string') {
    try { return JSON.parse(req.body); } catch (e) { return {}; }
  }
  return req.body || {};
}

module.exports = { buildOrder, penceToString, siteUrl, readBody, OrderError };
