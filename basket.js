// ─── Basket State ───────────────────────────────────
let basket = [];

// ─── Load & Save ────────────────────────────────────
function saveBasket() {
  localStorage.setItem('mahf_basket', JSON.stringify(basket));
}

function loadBasket() {
  const saved = localStorage.getItem('mahf_basket');
  if (saved) {
    try {
      basket = JSON.parse(saved);
    } catch (e) {
      basket = [];
    }
  }
  renderBasket();
}

// ─── Open / Close ────────────────────────────────────
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

// Close on Escape key
document.addEventListener('keydown', function(e) {
  if (e.key === 'Escape') closeBasket();
});

// ─── Add to Basket ───────────────────────────────────
function addToBasket(btn) {
  const name   = btn.dataset.name;
  const price  = parseFloat(btn.dataset.price);
  const colour = btn.dataset.colour;
  const emoji  = btn.dataset.emoji;
  const id     = name.replace(/\s+/g, '-').toLowerCase();

  const existing = basket.find(function(i) { return i.id === id; });
  if (existing) {
    existing.qty++;
  } else {
    basket.push({ id: id, name: name, price: price, colour: colour, emoji: emoji, qty: 1 });
  }

  saveBasket();
  renderBasket();
  showFlash();
}

// ─── Add by product object (for product.html buy now / add buttons) ──
function addToBasketById(id, name, price, colour, emoji, qty) {
  qty = qty || 1;
  const existing = basket.find(function(i) { return i.id === id; });
  if (existing) {
    existing.qty += qty;
  } else {
    basket.push({ id: id, name: name, price: price, colour: colour, emoji: emoji, qty: qty });
  }

  saveBasket();
  renderBasket();
  showFlash();
}

// ─── Change Quantity ─────────────────────────────────
function changeQty(id, delta) {
  const item = basket.find(function(i) { return i.id === id; });
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) {
    basket = basket.filter(function(i) { return i.id !== id; });
  }
  saveBasket();
  renderBasket();
}

// ─── Render Basket ───────────────────────────────────
function renderBasket() {
  const itemsEl    = document.getElementById('basketItems');
  const emptyEl    = document.getElementById('basketEmpty');
  const totalEl    = document.getElementById('basketTotal');
  const countEl    = document.getElementById('basketCount');
  const checkoutEl = document.getElementById('checkoutBtn');

  if (!itemsEl) return; // drawer not on this page yet

  const totalQty   = basket.reduce(function(s, i) { return s + i.qty; }, 0);
  const totalPrice = basket.reduce(function(s, i) { return s + i.price * i.qty; }, 0);

  if (countEl)    countEl.textContent  = totalQty;
  if (totalEl)    totalEl.textContent  = '£' + totalPrice.toFixed(2);
  if (checkoutEl) checkoutEl.disabled  = basket.length === 0;

  // Clear existing item cards (keep empty state element)
  Array.from(itemsEl.children).forEach(function(el) {
    if (!el.classList.contains('basket-empty')) el.remove();
  });

  if (basket.length === 0) {
    if (emptyEl) emptyEl.style.display = 'flex';
    return;
  }

  if (emptyEl) emptyEl.style.display = 'none';

  basket.forEach(function(item) {
    const el = document.createElement('div');
    el.className = 'basket-item';
    el.innerHTML =
      '<div class="basket-item-img" style="background:' + item.colour + '20;">' + item.emoji + '</div>' +
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

// ─── Flash Toast ─────────────────────────────────────
let flashTimer;
function showFlash() {
  const flash = document.getElementById('addFlash');
  if (!flash) return;
  flash.classList.add('show');
  clearTimeout(flashTimer);
  flashTimer = setTimeout(function() {
    flash.classList.remove('show');
  }, 2000);
}

// ─── Checkout ────────────────────────────────────────
function goToCheckout() {
  // Wire this to your Stripe checkout URL or checkout.html
  // Example: window.location.href = 'checkout.html';
  alert('Checkout coming soon!');
}

// ─── Init on page load ───────────────────────────────
document.addEventListener('DOMContentLoaded', loadBasket);
