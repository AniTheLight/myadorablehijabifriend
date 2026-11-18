// ─── api/paypal-capture-order.js ────────────────────────────────────────────
// Takes the money once the customer approves the payment in PayPal.

const { readBody } = require('./_lib/order');
const { paypalRequest } = require('./_lib/paypal');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const orderId = String(readBody(req).orderId || '');
  if (!/^[A-Z0-9]{5,40}$/.test(orderId)) return res.status(400).json({ error: 'Invalid order.' });

  try {
    const result = await paypalRequest('POST', '/v2/checkout/orders/' + orderId + '/capture');
    res.status(200).json({ id: result.id, status: result.status });
  } catch (err) {
    console.error(err, err.paypal);
    const declined = err.paypal && JSON.stringify(err.paypal).includes('INSTRUMENT_DECLINED');
    res.status(declined ? 402 : 500).json({
      error: declined ? 'INSTRUMENT_DECLINED' : 'PayPal payment could not be completed.'
    });
  }
};
