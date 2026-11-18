// ─── api/order-status.js ────────────────────────────────────────────────────
// Lets the confirmation page check that a payment really went through.
// GET /api/order-status?provider=stripe&id=cs_...   or   ?provider=paypal&id=...

const Stripe = require('stripe');
const { paypalRequest } = require('./_lib/paypal');

module.exports = async function handler(req, res) {
  const provider = req.query.provider;
  const id = String(req.query.id || '');

  try {
    if (provider === 'stripe' && /^cs_[A-Za-z0-9_]+$/.test(id)) {
      const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
      const session = await stripe.checkout.sessions.retrieve(id);
      return res.status(200).json({
        paid: session.payment_status === 'paid',
        total: (session.amount_total / 100).toFixed(2),
        email: session.customer_details ? session.customer_details.email : null
      });
    }

    if (provider === 'paypal' && /^[A-Z0-9]{5,40}$/.test(id)) {
      const order = await paypalRequest('GET', '/v2/checkout/orders/' + id);
      const unit = order.purchase_units && order.purchase_units[0];
      return res.status(200).json({
        paid: order.status === 'COMPLETED',
        total: unit ? unit.amount.value : null,
        email: order.payer ? order.payer.email_address : null
      });
    }

    res.status(400).json({ paid: false, error: 'Unknown order.' });
  } catch (err) {
    console.error(err);
    res.status(404).json({ paid: false, error: 'Order not found.' });
  }
};
