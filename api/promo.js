// ─── api/promo.js ───────────────────────────────────────────────────────────
// Lets the checkout page check a promo code before paying.
// GET /api/promo?code=FIRST20
// The code is checked again when the payment is created, so this is only
// for showing the customer the new total.

const { checkPromo, promoErrorMessage } = require('./_lib/promos');

module.exports = function handler(req, res) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const result = checkPromo(req.query.code);
  if (!result.ok) {
    return res.status(404).json({ valid: false, error: promoErrorMessage(result.reason) });
  }
  const promo = result.promo;
  res.status(200).json({
    valid: true,
    code: promo.code,
    label: promo.label,
    freeShipping: !!promo.freeShipping
  });
};
