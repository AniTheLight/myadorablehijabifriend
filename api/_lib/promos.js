// ─── api/_lib/promos.js ─────────────────────────────────────────────────────
// Promo codes. They live here in the server code (not in products.js) so
// nobody can find them by reading the website's public files.
//
// To add a code, add a line below. To stop a code working, delete its line.
// Codes are not case-sensitive: customers can type first20 or FIRST20.
//
//   freeShipping: true  → delivery is free for that order

const PROMOS = {
  FIRST20: { freeShipping: true, label: 'Free delivery' }
};

function normaliseCode(code) {
  return String(code || '').trim().toUpperCase();
}

// Returns the promo for a code, or null if the code doesn't exist.
function findPromo(code) {
  const key = normaliseCode(code);
  if (!key || !Object.prototype.hasOwnProperty.call(PROMOS, key)) return null;
  return Object.assign({ code: key }, PROMOS[key]);
}

module.exports = { findPromo, normaliseCode };
