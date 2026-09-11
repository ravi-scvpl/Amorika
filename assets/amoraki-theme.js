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

// ==========================================================================
// HERO TO HEADER LOGO TRAVEL SCROLL ANIMATION
// ==========================================================================
(function initHeroLogoTravel() {
  const heroWord = document.querySelector('.hero-brand-word');
  const navLogo = document.querySelector('.site-header__logo.nav-logo');
  const heroScript = document.querySelector('.hero .script');
  const nav = document.querySelector('.site-header');

  if (!heroWord || !navLogo) return;

  let startHeroRect = null;
  let targetNavRect = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function calcLogoCoordinates() {
    if (!heroWord || !navLogo) return;

    heroWord.style.transform = 'none';
    startHeroRect = heroWord.getBoundingClientRect();

    const wasHidden = navLogo.style.visibility === 'hidden' || getComputedStyle(navLogo).visibility === 'hidden';
    navLogo.style.visibility = 'visible';
    navLogo.style.opacity = '1';
    targetNavRect = navLogo.getBoundingClientRect();

    if (wasHidden && (!nav || !nav.classList.contains('is-scrolled'))) {
      navLogo.style.visibility = 'hidden';
      navLogo.style.opacity = '0';
    }
  }

  window.addEventListener('load', calcLogoCoordinates);
  window.addEventListener('resize', calcLogoCoordinates);

  function handleLogoTravelScroll() {
    const scrollY = window.scrollY;
    const travelDistance = 180;

    if (scrollY < 15 || !startHeroRect) {
      calcLogoCoordinates();
    }

    if (nav) {
      nav.classList.toggle('is-scrolled', scrollY > 40);
    }

    if (prefersReducedMotion) {
      if (heroWord) heroWord.style.transform = 'none';
      if (navLogo) {
        navLogo.style.visibility = scrollY > 40 ? 'visible' : 'hidden';
        navLogo.style.opacity = scrollY > 40 ? '1' : '0';
      }
      return;
    }

    if (heroWord && startHeroRect && targetNavRect) {
      const progress = Math.min(Math.max(scrollY / travelDistance, 0), 1);

      if (progress < 1) {
        const deltaX = targetNavRect.left - startHeroRect.left;
        const deltaY = targetNavRect.top - startHeroRect.top;
        const targetScale = targetNavRect.height / startHeroRect.height || 0.3;

        const currentX = deltaX * progress;
        const currentY = (deltaY * progress) - (scrollY * (1 - progress));
        const currentScale = 1 - (1 - targetScale) * progress;

        heroWord.style.transform = `translate3d(${currentX.toFixed(2)}px, ${currentY.toFixed(2)}px, 0) scale(${currentScale.toFixed(4)})`;

        if (progress > 0.7) {
          const subFade = (progress - 0.7) / 0.3;
          heroWord.style.opacity = (1 - subFade).toFixed(2);
          navLogo.style.visibility = 'visible';
          navLogo.style.opacity = subFade.toFixed(2);
        } else {
          heroWord.style.opacity = 1;
          navLogo.style.visibility = 'hidden';
          navLogo.style.opacity = '0';
        }
      } else {
        heroWord.style.opacity = 0;
        navLogo.style.visibility = 'visible';
        navLogo.style.opacity = '1';
      }
    }

    if (heroScript) {
      const taglineProgress = Math.min(Math.max(scrollY / 130, 0), 1);
      heroScript.style.opacity = 1 - taglineProgress;
      heroScript.style.transform = `translate3d(0, ${-scrollY * 0.25}px, 0)`;
    }
  }

  window.addEventListener('scroll', handleLogoTravelScroll, { passive: true });
  setTimeout(handleLogoTravelScroll, 50);
})();

