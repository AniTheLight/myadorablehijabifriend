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
| `SITE_URL` (optional) | your domain, no trailing `/` | — | `https://myadorablehijabifriend.com` |

After changing variables, go to **Deployments → ⋯ → Redeploy** so they take effect.

**Never** put a secret key in any `.html` or `.js` file in this repo — the repo is public.

## 3. Test before going live
- Card: on the checkout page use Stripe's test card `4242 4242 4242 4242`, any future date, any CVC.
- Try an order under £25 (should add £3.75 shipping) and one over £25 (free shipping).
- Check the order appears in the Stripe dashboard and the confirmation page says "Order confirmed!".

## 4. Go live
Swap `STRIPE_SECRET_KEY` for your live key (`sk_live_…`), redeploy, and
place one small real order yourself (you can refund it from the dashboard).

## Orders and emails
- Orders and shipping addresses appear in your **Stripe** dashboard.
- Turn on customer receipts: Stripe → Settings → Customer emails → "Successful payments".

## Promo codes
Codes live in `api/_lib/promos.js` (server code only, so customers can't look them up).
`FIRST20` gives free delivery on baskets of £5 or more (before delivery) until the end of
30 November 2026 (UK time). Add or remove a line
there to add or stop a code; change `lastDay` to move a code's end date.
Each order's code shows in Stripe under the payment's **Metadata → promoCode**.

## Changing prices or shipping
Edit `products.js`. Prices and the shipping rule (`MAHF_SHIPPING`) there are what
customers are actually charged — the server reads the same file.

## Customer reviews (Google Sheets)

Reviews are saved to a Google Sheet, and customer photos to a Google Drive folder.
A review only appears on the website after you tick **Approved** in the sheet.

### One-time setup (about 10 minutes)
1. Create a new Google Sheet, e.g. "Website reviews".
2. In the sheet: **Extensions → Apps Script**. Delete what's there, paste in the whole of
   `google-apps-script/Reviews.gs` from this repo, and click **Save**.
3. In the function dropdown at the top choose **setup**, click **Run**, and allow the
   permissions Google asks for (it needs your sheet and Drive to save reviews and photos).
4. Open **Execution log** — copy the long code after "Copy this into Vercel as REVIEWS_SECRET".
5. Click **Deploy → New deployment** → type **Web app**:
   - Execute as: **Me**
   - Who has access: **Anyone**

   Click **Deploy** and copy the **Web app URL** (ends in `/exec`).
   ("Anyone" is needed so Vercel can reach it; without the secret code it refuses every request.)
6. In Vercel → **Settings → Environment Variables**, add:
   - `REVIEWS_SCRIPT_URL` = the Web app URL
   - `REVIEWS_SECRET` = the code from step 4

   Then redeploy.

### Day to day
- New reviews appear as rows in the **Reviews** tab with **Approved** unticked.
- Tick **Approved** to publish one. The website picks it up within about 2 minutes.
- To remove a review, untick it or delete the row. Photos live in the
  "Website review photos" Drive folder.
- Want an Excel copy? **File → Download → Microsoft Excel (.xlsx)**.

If you ever change the script, use **Deploy → Manage deployments → Edit → New version**
so the URL stays the same.
