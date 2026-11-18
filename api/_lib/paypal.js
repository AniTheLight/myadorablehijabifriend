// ─── api/_lib/paypal.js ─────────────────────────────────────────────────────
// Minimal PayPal REST client.
//
// Environment variables (set in the Vercel dashboard):
//   PAYPAL_CLIENT_ID      →  from developer.paypal.com → Apps & Credentials
//   PAYPAL_CLIENT_SECRET  →  same page (keep secret — never put it in the site's HTML)
//   PAYPAL_ENV            →  "sandbox" for testing, "live" for real payments

function apiBase() {
  return process.env.PAYPAL_ENV === 'live'
    ? 'https://api-m.paypal.com'
    : 'https://api-m.sandbox.paypal.com';
}

async function getAccessToken() {
  const id = process.env.PAYPAL_CLIENT_ID;
  const secret = process.env.PAYPAL_CLIENT_SECRET;
  if (!id || !secret) throw new Error('PayPal is not configured on the server.');

  const res = await fetch(apiBase() + '/v1/oauth2/token', {
    method: 'POST',
    headers: {
      Authorization: 'Basic ' + Buffer.from(id + ':' + secret).toString('base64'),
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: 'grant_type=client_credentials'
  });
  const data = await res.json();
  if (!res.ok) throw new Error('PayPal sign-in failed: ' + (data.error_description || res.status));
  return data.access_token;
}

async function paypalRequest(method, path, body) {
  const token = await getAccessToken();
  const res = await fetch(apiBase() + path, {
    method: method,
    headers: { Authorization: 'Bearer ' + token, 'Content-Type': 'application/json' },
    body: body ? JSON.stringify(body) : undefined
  });
  const data = await res.json();
  if (!res.ok) {
    const detail = data.details && data.details[0] ? data.details[0].issue : data.message;
    const err = new Error('PayPal error: ' + (detail || res.status));
    err.paypal = data;
    throw err;
  }
  return data;
}

module.exports = { paypalRequest };
