/**
 * Moments By Amoraki - Theme JavaScript
 * Handles cart drawer, AJAX interactions, mobile menu & micro-interactions
 */

document.addEventListener('DOMContentLoaded', () => {
  initCartDrawer();
  initMobileMenu();
  initQuickAdd();
  initNewsletter();
});

// Cart Drawer State & Controllers
function initCartDrawer() {
  const drawer = document.getElementById('CartDrawer');
  const overlay = document.getElementById('CartOverlay');
  const openButtons = document.querySelectorAll('.js-open-cart');
  const closeButtons = document.querySelectorAll('.js-close-cart');

  if (!drawer || !overlay) return;

  function openDrawer() {
    drawer.classList.add('is-active');
    overlay.classList.add('is-active');
    document.body.style.overflow = 'hidden';
  }

  function closeDrawer() {
    drawer.classList.remove('is-active');
    overlay.classList.remove('is-active');
    document.body.style.overflow = '';
  }

  openButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    openDrawer();
  }));

  closeButtons.forEach(btn => btn.addEventListener('click', (e) => {
    e.preventDefault();
    closeDrawer();
  }));

  overlay.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && drawer.classList.contains('is-active')) {
      closeDrawer();
    }
  });

  window.amorakiCart = {
    open: openDrawer,
    close: closeDrawer,
    addItem: (item) => {
      // If connected to live Shopify AJAX API
      if (window.Shopify && window.Shopify.theme) {
        fetch('/cart/add.js', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(item)
        })
        .then(res => res.json())
        .then(() => {
          updateCartUI();
          openDrawer();
          showToast('Added to your curated moments');
        })
        .catch(err => console.error('Cart Error', err));
      } else {
        // UI Demo simulation
        openDrawer();
        showToast('Moment of Care added to your bag');
      }
    }
  };
}

// Quick Add Handler
function initQuickAdd() {
  const addButtons = document.querySelectorAll('.js-add-to-cart, .js-quick-add');
  addButtons.forEach(btn => {
    btn.addEventListener('click', (e) => {
      e.preventDefault();
      const variantId = btn.getAttribute('data-variant-id') || '456789123';
      if (window.amorakiCart) {
        window.amorakiCart.addItem({ id: variantId, quantity: 1 });
      }
    });
  });
}

// Mobile Menu Toggle
function initMobileMenu() {
  const toggleBtn = document.querySelector('.js-mobile-menu-toggle');
  const nav = document.querySelector('.site-nav');

  if (!toggleBtn || !nav) return;

  toggleBtn.addEventListener('click', () => {
    const isExpanded = nav.style.display === 'flex';
    nav.style.display = isExpanded ? 'none' : 'flex';
    if (!isExpanded) {
      nav.style.flexDirection = 'column';
      nav.style.position = 'absolute';
      nav.style.top = '80px';
      nav.style.left = '0';
      nav.style.right = '0';
      nav.style.background = 'var(--color-bg)';
      nav.style.padding = '1.5rem 2rem';
      nav.style.borderBottom = '1px solid var(--color-border)';
      nav.style.boxShadow = 'var(--shadow-hover)';
    }
  });
}

// Newsletter Form Handler
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      const emailInput = form.querySelector('input[type="email"]');
      if (emailInput && emailInput.value) {
        showToast('Thank you for staying close to our world of moments.');
      }
    });
  });
}

// Toast Notifications
function showToast(message) {
  let toast = document.getElementById('ToastNotice');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'ToastNotice';
    toast.className = 'toast-notice';
    document.body.appendChild(toast);
  }
  toast.innerHTML = `
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#A37B42" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
    <span>${message}</span>
  `;
  toast.classList.add('is-active');

  setTimeout(() => {
    toast.classList.remove('is-active');
  }, 3800);
}
