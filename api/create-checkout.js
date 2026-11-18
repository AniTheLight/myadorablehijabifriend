// ─── api/create-checkout.js ─────────────────────────────────────────────────
// Starts a Stripe Checkout payment.
//
// Environment variables (set in the Vercel dashboard):
//   STRIPE_SECRET_KEY  →  sk_test_... while testing, sk_live_... when going live
//   SITE_URL           →  optional, e.g. https://myadorablehijabifriend.com (no trailing slash)

const Stripe = require('stripe');
const { buildOrder, siteUrl, readBody, OrderError } = require('./_lib/order');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  if (!process.env.STRIPE_SECRET_KEY) {
    return res.status(500).json({ error: 'Card payments are not set up yet.' });
  }

  const body = readBody(req);
  const base = siteUrl(req);

  let order;
  try {
    order = buildOrder(body.items);
  } catch (err) {
    if (err instanceof OrderError) return res.status(400).json({ error: err.message });
    throw err;
  }

  const lineItems = order.lines.map(function (line) {
    return {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: line.name,
          images: line.image ? [base + '/' + line.image] : []
        },
        unit_amount: line.unitPence
      },
      quantity: line.qty
    };
  });

  const email = typeof body.customerEmail === 'string' && body.customerEmail.includes('@')
    ? body.customerEmail.trim()
    : undefined;

  try {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    const session = await stripe.checkout.sessions.create({
      mode: 'payment',
      line_items: lineItems,
      customer_email: email,
      metadata: { customerName: String(body.customerName || '').slice(0, 200) },
      shipping_address_collection: { allowed_countries: ['GB'] },
      shipping_options: [{
        shipping_rate_data: {
          type: 'fixed_amount',
          display_name: order.shippingPence === 0 ? 'Free shipping' : 'Standard shipping',
          fixed_amount: { amount: order.shippingPence, currency: 'gbp' }
        }
      }],
      success_url: base + '/success.html?provider=stripe&id={CHECKOUT_SESSION_ID}',
      cancel_url: base + '/checkout.html'
    });

    res.status(200).json({ url: session.url });
  } catch (err) {
    console.error('Stripe error:', err);
    res.status(500).json({ error: 'Could not start card payment. Please try again.' });
  }
};
