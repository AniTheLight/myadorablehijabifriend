// ─── api/paypal-create-order.js ─────────────────────────────────────────────
// Creates a PayPal order using prices from products.js (not from the browser).

const { buildOrder, penceToString, readBody, OrderError } = require('./_lib/order');
const { paypalRequest } = require('./_lib/paypal');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  let order;
  try {
    order = buildOrder(readBody(req).items);
  } catch (err) {
    if (err instanceof OrderError) return res.status(400).json({ error: err.message });
    throw err;
  }

  const money = function (pence) { return { currency_code: 'GBP', value: penceToString(pence) }; };

  try {
    const created = await paypalRequest('POST', '/v2/checkout/orders', {
      intent: 'CAPTURE',
      purchase_units: [{
        amount: {
          currency_code: 'GBP',
          value: penceToString(order.totalPence),
          breakdown: {
            item_total: money(order.subtotalPence),
            shipping: money(order.shippingPence)
          }
        },
        items: order.lines.map(function (line) {
          return {
            name: line.name.slice(0, 127),
            sku: line.id,
            unit_amount: money(line.unitPence),
            quantity: String(line.qty),
            category: 'PHYSICAL_GOODS'
          };
        })
      }],
      payment_source: {
        paypal: {
          experience_context: {
            brand_name: 'My Adorable Hijabi Friend',
            shipping_preference: 'GET_FROM_FILE',
            user_action: 'PAY_NOW'
          }
        }
      }
    });
    res.status(200).json({ id: created.id });
  } catch (err) {
    console.error(err, err.paypal);
    res.status(500).json({ error: 'Could not start PayPal payment. Please try again.' });
  }
};
