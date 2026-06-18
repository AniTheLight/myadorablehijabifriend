// ─── nav.js — shared navigation injected into every page ───────────────────
// Add <div id="navMount"></div> at the top of <body>, then <script src="nav.js"></script>
// basket.js must also be loaded on the page for basket functions to work.

(function () {
  var basketSVG =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2" stroke-linecap="round" stroke-linejoin="round">' +
    '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
    '<line x1="3" y1="6" x2="21" y2="6"/>' +
    '<path d="M16 10a4 4 0 01-8 0"/>' +
    '</svg>';

  var closeSVG =
    '<svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.5" stroke-linecap="round">' +
    '<line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>' +
    '</svg>';

  var emptySVG =
    '<svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#ccc" ' +
    'stroke-width="1.5" stroke-linecap="round">' +
    '<path d="M6 2L3 6v14a2 2 0 002 2h14a2 2 0 002-2V6l-3-4z"/>' +
    '<line x1="3" y1="6" x2="21" y2="6"/>' +
    '<path d="M16 10a4 4 0 01-8 0"/>' +
    '</svg>';

  var lockSVG =
    '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" ' +
    'stroke-width="2.5" stroke-linecap="round">' +
    '<rect x="3" y="11" width="18" height="11" rx="2"/>' +
    '<path d="M7 11V7a5 5 0 0110 0v4"/>' +
    '</svg>';

  var html =
    // ── Sticky nav ──────────────────────────────────────────────────────────
    '<nav class="nav" role="navigation">' +
      '<ul class="nav-links">' +
        '<li><a href="index.html">Home</a></li>' +
        '<li><a href="shop.html">Shop</a></li>' +
      '</ul>' +
      '<a class="nav-basket" aria-label="Open basket" onclick="event.preventDefault();openBasket();">' +
        basketSVG +
        '<span class="basket-count" id="basketCount">0</span>' +
      '</a>' +
    '</nav>' +

    // ── Basket overlay ───────────────────────────────────────────────────────
    '<div class="basket-overlay" id="basketOverlay" onclick="closeBasket()"></div>' +

    // ── Basket drawer ────────────────────────────────────────────────────────
    '<div class="basket-drawer" id="basketDrawer" role="dialog" aria-label="Your basket">' +
      '<div class="basket-header">' +
        '<span class="basket-title">Your Basket</span>' +
        '<button class="basket-close" onclick="closeBasket()" aria-label="Close basket">' + closeSVG + '</button>' +
      '</div>' +
      '<div class="basket-items" id="basketItems">' +
        '<div class="basket-empty" id="basketEmpty">' +
          emptySVG +
          '<p>Your basket is empty</p>' +
          '<p style="font-size:12px;font-weight:400;color:#ccc;">Add a friend to get started!</p>' +
        '</div>' +
      '</div>' +
      '<div class="basket-footer">' +
        '<div class="basket-total-row">' +
          '<span class="basket-total-label">Total</span>' +
          '<span class="basket-total-price" id="basketTotal">£0.00</span>' +
        '</div>' +
        '<button class="checkout-btn" id="checkoutBtn" onclick="goToCheckout()" disabled>' +
          'Continue to checkout →' +
        '</button>' +
        '<div class="secure-note" style="margin-top:10px;">' +
          lockSVG + ' Secured by Stripe · 256-bit SSL' +
        '</div>' +
      '</div>' +
    '</div>' +

    // ── Added-to-basket toast ────────────────────────────────────────────────
    '<div class="add-flash" id="addFlash">✦ Added to basket!</div>';

  // Inject into #navMount if it exists, otherwise prepend to body
  var mount = document.getElementById('navMount');
  if (mount) {
    mount.innerHTML = html;
  } else {
    var wrapper = document.createElement('div');
    wrapper.innerHTML = html;
    document.body.insertBefore(wrapper, document.body.firstChild);
  }
})();
