// ─── api/_lib/promos.js ─────────────────────────────────────────────────────
// Promo codes. They live here in the server code (not in products.js) so
// nobody can find them by reading the website's public files.
//
// To add a code, add a line below. To stop a code working, delete its line.
// Codes are not case-sensitive: customers can type first20 or FIRST20.
//
//   freeShipping: true       → delivery is free for that order
//   lastDay: 'YYYY-MM-DD'    → optional; the code works until the END of this
//                              day (UK time), then stops working

const PROMOS = {
  FIRST20: { freeShipping: true, label: 'Free delivery', lastDay: '2026-11-30' }
};

function normaliseCode(code) {
  return String(code || '').trim().toUpperCase();
}

// The day it is right now in the UK, as 'YYYY-MM-DD' (handles GMT/BST).
function ukToday(now) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: 'Europe/London', year: 'numeric', month: '2-digit', day: '2-digit'
  }).format(now);
}

// Looks up a code. Returns:
//   { ok: true, promo }           the code can be used
//   { ok: false, reason: 'expired' | 'unknown' }
function checkPromo(code, now) {
  const key = normaliseCode(code);
  if (!key || !Object.prototype.hasOwnProperty.call(PROMOS, key)) {
    return { ok: false, reason: 'unknown' };
  }
  const promo = Object.assign({ code: key }, PROMOS[key]);
  if (promo.lastDay && ukToday(now || new Date()) > promo.lastDay) {
    return { ok: false, reason: 'expired' };
  }
  return { ok: true, promo: promo };
}

function promoErrorMessage(reason) {
  return reason === 'expired'
    ? 'Sorry, that promo code has expired.'
    : "Sorry, that promo code isn't valid.";
}

module.exports = { checkPromo, promoErrorMessage, normaliseCode };
