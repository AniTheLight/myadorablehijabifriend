const Stripe = require('stripe');

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const { items, customerEmail, customerName } = req.body;

  const lineItems = items.map(function(item) {
    return {
      price_data: {
        currency: 'gbp',
        product_data: {
          name: item.name,
          images: item.image ? ['https://yoursite.vercel.app/' + item.image] : []
        },
        unit_amount: Math.round(item.price * 100)
      },
      quantity: item.qty
    };
  });

  const subtotal = items.reduce(function(s, i) { return s + i.price * i.qty; }, 0);
  if (subtotal < 25) {
    lineItems.push({
      price_data: {
        currency: 'gbp',
        product_data: { name: 'Standard Shipping' },
        unit_amount: 399
      },
      quantity: 1
    });
  }

  const session = await stripe.checkout.sessions.create({
    payment_method_types: ['card'],
    mode: 'payment',
    line_items: lineItems,
    customer_email: customerEmail,
    metadata: { customerName: customerName },
    success_url: 'https://yoursite.vercel.app/success.html',
    cancel_url: 'https://yoursite.vercel.app/checkout.html'
  });

  res.status(200).json({ url: session.url });
};
