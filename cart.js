// ═══════════════════════════════════════════
// PROTEIN SNADDER UB – Shared Cart
// Inkluderes på alle sider
// ═══════════════════════════════════════════

(function() {

// ── CSS ──
const css = `
  .cart-overlay { position:fixed; inset:0; z-index:300; background:rgba(0,0,0,.7); backdrop-filter:blur(4px); opacity:0; pointer-events:none; transition:opacity .3s; }
  .cart-overlay.open { opacity:1; pointer-events:all; }
  .cart-drawer { position:fixed; top:0; right:0; bottom:0; z-index:301; width:min(420px,100vw); background:#111410; border-left:1px solid rgba(255,255,255,0.07); display:flex; flex-direction:column; transform:translateX(100%); transition:transform .32s cubic-bezier(.4,0,.2,1); font-family:'DM Sans',sans-serif; color:#f2ede4; }
  .cart-drawer.open { transform:translateX(0); }
  .cart-header { display:flex; align-items:center; justify-content:space-between; padding:1.4rem 1.8rem; border-bottom:1px solid rgba(255,255,255,0.07); }
  .cart-header h2 { font-family:'Bebas Neue',sans-serif; font-size:1.6rem; letter-spacing:2px; margin:0; }
  .cart-close { background:none; border:none; color:#f2ede4; font-size:1.2rem; cursor:pointer; opacity:.5; padding:.3rem; transition:opacity .2s; }
  .cart-close:hover { opacity:1; }
  .cart-items { flex:1; overflow-y:auto; padding:1.2rem 1.8rem; display:flex; flex-direction:column; gap:1rem; }
  .cart-empty { opacity:.4; font-size:.9rem; margin-top:2rem; text-align:center; }
  .cart-item { display:flex; align-items:center; gap:1rem; background:rgba(255,255,255,.04); border:1px solid rgba(255,255,255,0.07); border-radius:10px; padding:.9rem 1rem; }
  .cart-item-img { width:48px; height:48px; border-radius:7px; background:#1a1f14; display:flex; align-items:center; justify-content:center; flex-shrink:0; overflow:hidden; }
  .cart-item-img img { width:100%; height:100%; object-fit:cover; }
  .cart-item-info { flex:1; min-width:0; }
  .cart-item-name { font-weight:700; font-size:.88rem; white-space:nowrap; overflow:hidden; text-overflow:ellipsis; }
  .cart-item-price { font-size:.8rem; color:#c5f135; margin-top:.2rem; font-weight:600; }
  .cart-item-qty { display:flex; align-items:center; gap:.5rem; flex-shrink:0; }
  .qty-btn { width:26px; height:26px; border-radius:50%; border:1px solid rgba(255,255,255,.15); background:none; color:#f2ede4; font-size:1rem; cursor:pointer; display:flex; align-items:center; justify-content:center; transition:background .15s; }
  .qty-btn:hover { background:rgba(255,255,255,.08); }
  .qty-num { font-size:.88rem; font-weight:700; min-width:18px; text-align:center; }
  .cart-related { padding:1rem 1.8rem; border-top:1px solid rgba(255,255,255,0.07); }
  .cart-related-title { font-size:.65rem; font-weight:800; letter-spacing:3px; text-transform:uppercase; opacity:.4; margin-bottom:.8rem; }
  .cart-related-list { display:flex; flex-direction:column; gap:.6rem; }
  .cart-related-item { display:flex; align-items:center; gap:.8rem; background:rgba(255,255,255,.03); border:1px solid rgba(255,255,255,0.07); border-radius:8px; padding:.7rem .9rem; cursor:pointer; transition:border-color .2s; }
  .cart-related-item:hover { border-color:rgba(197,241,53,.25); }
  .cart-related-img { width:38px; height:38px; border-radius:6px; background:#1a1f14; display:flex; align-items:center; justify-content:center; flex-shrink:0; }
  .cart-related-info { flex:1; min-width:0; }
  .cart-related-name { font-size:.8rem; font-weight:600; }
  .cart-related-price { font-size:.72rem; color:#c5f135; font-weight:700; margin-top:.1rem; }
  .cart-related-add { background:rgba(197,241,53,.12); border:1px solid rgba(197,241,53,.2); color:#c5f135; font-family:'DM Sans',sans-serif; font-size:.72rem; font-weight:800; padding:.32rem .7rem; border-radius:5px; cursor:pointer; white-space:nowrap; flex-shrink:0; }
  .cart-footer { padding:1.4rem 1.8rem; border-top:1px solid rgba(255,255,255,0.07); }
  .cart-minimum { margin:.8rem 0 0; padding:.65rem .9rem; background:rgba(255,180,0,.07); border:1px solid rgba(255,180,0,.18); border-radius:7px; font-size:.75rem; color:#ffb800; font-weight:600; text-align:center; display:none; }
  .cart-total { display:flex; justify-content:space-between; align-items:center; margin-bottom:1.2rem; margin-top:.8rem; }
  .cart-total-label { font-size:.82rem; opacity:.5; font-weight:600; letter-spacing:1px; text-transform:uppercase; }
  .cart-total-price { font-family:'Bebas Neue',sans-serif; font-size:2rem; color:#c5f135; }
  .ps-checkout-btn { width:100%; background:#c5f135; color:#080909; font-family:'DM Sans',sans-serif; font-weight:800; font-size:.95rem; letter-spacing:1px; padding:1rem; border-radius:7px; border:none; cursor:pointer; transition:box-shadow .2s,transform .15s; }
  .ps-checkout-btn:hover { box-shadow:0 8px 28px rgba(197,241,53,.3); transform:translateY(-1px); }
`;

// ── INJECT CSS ──
const styleEl = document.createElement('style');
styleEl.textContent = css;
document.head.appendChild(styleEl);

// ── INJECT HTML ──
const cartHTML = `
<div class="cart-overlay" id="psCartOverlay" onclick="psCloseCart()"></div>
<div class="cart-drawer" id="psCartDrawer">
  <div class="cart-header">
    <h2>Handlekurv</h2>
    <button class="cart-close" onclick="psCloseCart()">✕</button>
  </div>
  <div class="cart-items" id="psCartItems">
    <div class="cart-empty" id="psCartEmpty">Handlekurven er tom</div>
  </div>
  <div class="cart-related" id="psCartRelated" style="display:none">
    <div class="cart-related-title">Andre kjøper også</div>
    <div class="cart-related-list" id="psCartRelatedList"></div>
  </div>
  <div class="cart-footer">
    <div class="cart-minimum" id="psCartMinimum"></div>
    <div class="cart-total">
      <span class="cart-total-label">Totalt</span>
      <span class="cart-total-price" id="psCartTotal">0 kr</span>
    </div>
    <button class="ps-checkout-btn" id="psCheckoutBtn" onclick="psGoCheckout()">Gå til bestilling</button>
  </div>
</div>`;

document.body.insertAdjacentHTML('beforeend', cartHTML);

// ── DATA ──
const MIN_ORDER = 60;
const DEFAULT_PRODUCTS = [
  { id:1, name:'Proteinbar – Sjokolade',  price:30, protein:'~20g protein', img:null },
  { id:2, name:'Proteinpudding – Vanilje', price:35, protein:'~15g protein', img:null },
  { id:3, name:'Proteinbar – Peanøttsmør', price:30, protein:'~21g protein', img:null },
  { id:4, name:'Proteinbar – Jordbær',     price:30, protein:'~19g protein', img:null }
];

function getProducts() {
  const s = localStorage.getItem('ps_stock');
  return s ? JSON.parse(s) : DEFAULT_PRODUCTS;
}

function getCart() { return JSON.parse(localStorage.getItem('ps_cart') || '[]'); }
function saveCart(cart) { localStorage.setItem('ps_cart', JSON.stringify(cart)); }

// ── RENDER ──
function psRenderCart() {
  const cart = getCart();
  const products = getProducts();
  const total = cart.reduce((s,i) => s+i.price*i.qty, 0);
  const count = cart.reduce((s,i) => s+i.qty, 0);

  // Update nav badge
  document.querySelectorAll('.ps-cart-count').forEach(el => {
    el.textContent = count;
    el.style.display = count > 0 ? 'inline-flex' : 'none';
  });

  document.getElementById('psCartTotal').textContent = total + ' kr';
  const itemsEl = document.getElementById('psCartItems');
  itemsEl.querySelectorAll('.cart-item').forEach(el => el.remove());

  if (!cart.length) {
    document.getElementById('psCartEmpty').style.display = 'block';
    document.getElementById('psCartRelated').style.display = 'none';
    document.getElementById('psCartMinimum').style.display = 'none';
    document.getElementById('psCheckoutBtn').style.opacity = '1';
    document.getElementById('psCheckoutBtn').style.pointerEvents = 'auto';
    return;
  }

  document.getElementById('psCartEmpty').style.display = 'none';

  cart.forEach(item => {
    const el = document.createElement('div');
    el.className = 'cart-item';
    el.innerHTML = `
      <div class="cart-item-img">${item.img ? `<img src="${item.img}" alt="${item.name}">` : `<svg width="26" height="26" viewBox="0 0 52 52" fill="none"><rect x="4" y="10" width="44" height="34" rx="5" stroke="rgba(255,255,255,0.2)" stroke-width="2"/><path d="M4 36 L16 24 L24 32 L34 20 L48 38" stroke="rgba(255,255,255,0.2)" stroke-width="2"/></svg>`}</div>
      <div class="cart-item-info">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">${item.price*item.qty} kr</div>
      </div>
      <div class="cart-item-qty">
        <button class="qty-btn" onclick="psUpdateQty(${item.id},-1)">−</button>
        <span class="qty-num">${item.qty}</span>
        <button class="qty-btn" onclick="psUpdateQty(${item.id},1)">+</button>
      </div>`;
    itemsEl.appendChild(el);
  });

  // Min order
  const minEl = document.getElementById('psCartMinimum');
  const btn = document.getElementById('psCheckoutBtn');
  if (total < MIN_ORDER) {
    minEl.innerHTML = `Vi beklager, men minimum bestilling er ${MIN_ORDER} kr. Legg til for <strong style="color:#ffb800">${MIN_ORDER-total} kr</strong> til for å fortsette.`;
    minEl.style.display = 'block';
    btn.style.opacity = '.45';
    btn.style.pointerEvents = 'none';
  } else {
    minEl.style.display = 'none';
    btn.style.opacity = '1';
    btn.style.pointerEvents = 'auto';
  }

  // Related products
  const cartIds = cart.map(i => i.id);
  const related = products.filter(p => !cartIds.includes(p.id)).slice(0,2);
  const relEl = document.getElementById('psCartRelated');
  const relList = document.getElementById('psCartRelatedList');
  if (related.length) {
    relEl.style.display = 'block';
    relList.innerHTML = related.map(p => `
      <div class="cart-related-item" onclick="psAddToCart(${p.id})">
        <div class="cart-related-img"><svg width="22" height="22" viewBox="0 0 52 52" fill="none"><rect x="4" y="10" width="44" height="34" rx="5" stroke="rgba(255,255,255,0.2)" stroke-width="2"/></svg></div>
        <div class="cart-related-info">
          <div class="cart-related-name">${p.name}</div>
          <div class="cart-related-price">${p.price} kr</div>
        </div>
        <button class="cart-related-add" onclick="event.stopPropagation();psAddToCart(${p.id})">+ Legg til</button>
      </div>`).join('');
  } else {
    relEl.style.display = 'none';
  }
}

// ── ACTIONS ──
window.psOpenCart = function() {
  document.getElementById('psCartOverlay').classList.add('open');
  document.getElementById('psCartDrawer').classList.add('open');
  psRenderCart();
};
window.psCloseCart = function() {
  document.getElementById('psCartOverlay').classList.remove('open');
  document.getElementById('psCartDrawer').classList.remove('open');
};
window.psAddToCart = function(id) {
  const products = getProducts();
  const p = products.find(x => x.id === id);
  if (!p) return;
  const cart = getCart();
  const ex = cart.find(x => x.id === id);
  ex ? ex.qty++ : cart.push({...p, qty:1});
  saveCart(cart);
  psRenderCart();
  psOpenCart();
};
window.psUpdateQty = function(id, delta) {
  let cart = getCart();
  const item = cart.find(x => x.id === id);
  if (!item) return;
  item.qty += delta;
  if (item.qty <= 0) cart = cart.filter(x => x.id !== id);
  saveCart(cart);
  psRenderCart();
};
window.psGoCheckout = function() {
  window.location.href = 'index.html#handlekurv';
};

// ── INIT ──
psRenderCart();

})();
