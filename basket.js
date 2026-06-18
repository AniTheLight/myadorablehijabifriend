// ─── basket.js ──────────────────────────────────────────────────────────────
// Shared basket logic used by index, shop, product, and checkout pages.

// ─── State ──────────────────────────────────────────────────────────────────
var basket = [];

// ─── Persist ────────────────────────────────────────────────────────────────
function saveBasket() {
  localStorage.setItem('mahf_basket', JSON.stringify(basket));
}

function loadBasket() {
  var saved = localStorage.getItem('mahf_basket');
  if (saved) {
    try { basket = JSON.parse(saved); } catch (e) { basket = []; }
  }
  renderBasket();
}

// ─── Open / Close drawer ────────────────────────────────────────────────────
function openBasket(e) {
  if (e) e.preventDefault();
  document.getElementById('basketDrawer').classList.add('open');
  document.getElementById('basketOverlay').classList.add('open');
  document.body.style.overflow = 'hidden';
}

function closeBasket() {
  document.getElementById('basketDrawer').classList.remove('open');
  document.getElementById('basketOverlay').classList.remove('open');
  document.body.style.overflow = '';
}

document.addEventListener('keydown', function (e) {
  if (e.key === 'Escape') closeBasket();
});

// ─── Add to basket (card buttons using data-* attributes) ───────────────────
function addToBasket(btn) {
  var name   = btn.dataset.name;
  var price  = parseFloat(btn.dataset.price);
  var colour = btn.dataset.colour;
  var image  = btn.dataset.image || null;
  var id     = btn.dataset.id || name.replace(/\s+/g, '-').toLowerCase();

  var existing = basket.find(function (i) { return i.id === id; });
  if (existing) {
    existing.qty++;
  } else {
    basket.push({ id: id, name: name, price: price, colour: colour, image: image, qty: 1 });
  }

  saveBasket();
  renderBasket();
  showFlash();
}

// ─── Add by values (used by shop grid and product page) ─────────────────────
function addToBasketById(id, name, price, colour, qty, image) {
  qty   = qty   || 1;
  image = image || null;

  var existing = basket.find(function (i) { return i.id === id; });
  if (existing) {
    existing.qty += qty;
  } else {
    basket.push({ id: id, name: name, price: price, colour: colour, qty: qty, image: image });
  }

  saveBasket();
  renderBasket();
  showFlash();
}

// ─── Buy now — add then go straight to checkout ──────────────────────────────
function buyNow(id, name, price, colour, image) {
  addToBasketById(id, name, price, colour, 1, image);
  window.location.href = 'checkout.html';
}

// ─── Change quantity (basket drawer) ────────────────────────────────────────
function changeQty(id, delta) {
  var item = basket.find(function (i) { return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    basket = basket.filter(function (i) { return i.id !== id; });
  }
  saveBasket();
  renderBasket();
}

// ─── Render basket drawer ───────────────────────────────────────────────────
function renderBasket() {
  var itemsEl    = document.getElementById('basketItems');
  var emptyEl    = document.getElementById('basketEmpty');
  var totalEl    = document.getElementById('basketTotal');
  var countEl    = document.getElementById('basketCount');
  var checkoutEl = document.getElementById('checkoutBtn');

  if (!itemsEl) return; // drawer not mounted yet

  var totalQty   = basket.reduce(function (s, i) { return s + i.qty; }, 0);
  var totalPrice = basket.reduce(function (s, i) { return s + i.price * i.qty; }, 0);

  if (countEl)    countEl.textContent = totalQty;
  if (totalEl)    totalEl.textContent = '£' + totalPrice.toFixed(2);
  if (checkoutEl) checkoutEl.disabled = basket.length === 0;

  // Clear item cards (keep empty-state element)
  Array.from(itemsEl.children).forEach(function (el) {
    if (!el.classList.contains('basket-empty')) el.remove();
  });

  if (basket.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  basket.forEach(function (item) {
    var el = document.createElement('div');
    el.className = 'basket-item';

    // Image thumbnail: use product image if available, else coloured block
    var imgContent = item.image
      ? '<img src="' + item.image + '" alt="' + item.name + '" style="width:100%;height:100%;object-fit:cover;border-radius:8px;">'
      : '';

    el.innerHTML =
      '<div class="basket-item-img" style="background:' + (item.colour || '#EDC1BB') + '20;">' +
        imgContent +
      '</div>' +
      '<div class="basket-item-info">' +
        '<p class="basket-item-name">' + item.name + '</p>' +
        '<p class="basket-item-price">£' + (item.price * item.qty).toFixed(2) + '</p>' +
      '</div>' +
      '<div class="basket-item-qty">' +
        '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', -1)">−</button>' +
        '<span class="qty-num">' + item.qty + '</span>' +
        '<button class="qty-btn" onclick="changeQty(\'' + item.id + '\', 1)">+</button>' +
      '</div>';

    itemsEl.appendChild(el);
  });
}

// ─── Flash toast ─────────────────────────────────────────────────────────────
var flashTimer;
function showFlash() {
  var flash = document.getElementById('addFlash');
  if (!flash) return;
  flash.classList.add('show');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(function () { flash.classList.remove('show'); }, 2000);
}

// ─── Go to checkout ──────────────────────────────────────────────────────────
function goToCheckout() {
  window.location.href = 'checkout.html';
}

// ─── Init ────────────────────────────────────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadBasket);
