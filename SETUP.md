# Taking payments: setup guide

GitHub Pages can only host plain web pages. Checkout needs a little server code
(the `api/` folder), so the site has to be hosted on **Vercel** (free plan is fine).

## 1. Put the site on Vercel
1. Sign up at vercel.com with your GitHub account.
2. **Add New → Project**, pick `myadorablehijabifriend`, leave every setting as it is, click **Deploy**.
3. Vercel gives you an address like `myadorablehijabifriend.vercel.app`. Later you can
   connect your own domain under **Settings → Domains**.

## 2. Add your payment keys (start in TEST mode)
In Vercel: **Project → Settings → Environment Variables**. Add:

| Name | Where to get it | Test value | Live value |
|---|---|---|---|
| `STRIPE_SECRET_KEY` | dashboard.stripe.com → Developers → API keys | `sk_test_…` | `sk_live_…` |
| `PAYPAL_CLIENT_ID` | developer.paypal.com → Apps & Credentials | Sandbox app's Client ID | Live app's Client ID |
| `PAYPAL_CLIENT_SECRET` | same page | Sandbox secret | Live secret |
| `PAYPAL_ENV` | — | `sandbox` | `live` |
| `SITE_URL` (optional) | your domain, no trailing `/` | — | `https://myadorablehijabifriend.com` |

After changing variables, go to **Deployments → ⋯ → Redeploy** so they take effect.

**Never** put a secret key in any `.html` or `.js` file in this repo — the repo is public.

## 3. Test before going live
- Card: on the checkout page use Stripe's test card `4242 4242 4242 4242`, any future date, any CVC.
- PayPal: log in with a **sandbox personal account** (developer.paypal.com → Sandbox → Accounts).
- Try an order under £25 (should add £3.29 shipping) and one over £25 (free shipping).
- Check the order appears in the Stripe / PayPal dashboard and the confirmation page says "Order confirmed!".

## 4. Go live
Swap the four variables for the live values, set `PAYPAL_ENV` to `live`, redeploy, and
place one small real order yourself (you can refund it from the dashboard).

## Orders and emails
- Orders and shipping addresses appear in your **Stripe** and **PayPal** dashboards.
- Turn on customer receipts: Stripe → Settings → Customer emails → "Successful payments".
  PayPal sends receipts automatically.

## Changing prices or shipping
Edit `products.js`. Prices and the shipping rule (`MAHF_SHIPPING`) there are what
customers are actually charged — the server reads the same file.
