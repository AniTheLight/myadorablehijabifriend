// ─── api/paypal-config.js ───────────────────────────────────────────────────
// Gives the checkout page the PayPal Client ID (public, safe to share), so
// switching between sandbox and live only means changing Vercel settings.

module.exports = function handler(req, res) {
  res.status(200).json({ clientId: process.env.PAYPAL_CLIENT_ID || null });
};
