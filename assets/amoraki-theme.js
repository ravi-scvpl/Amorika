/**
 * Amoraki — Liquid Theme JavaScript (Exact Match from preview.html)
 * Handles Hero-to-Header logo travel, carousels, mobile panel, FAQ accordions, 
 * bespoke WhatsApp form integration, and scroll reveal effects.
 */

document.addEventListener('DOMContentLoaded', () => {
  initHeroLogoTravel();
  initNavPanel();
  initScrollReveal();
  initNavDropdown();
  initNotifyMeLinks();
  initInsideCarousel();
  initMocImageSwap();
  initFaqAccordion();
  initBespokeForm();
  initNewsletterForm();
});

// 1. Hero-to-Header Logo Travel Animation
function initHeroLogoTravel() {
  const heroWord = document.querySelector('.hero-brand-word');
  const navLogo = document.querySelector('.nav-logo');
  const heroScript = document.querySelector('.hero .script');
  const nav = document.querySelector('.nav');

  if (!heroWord || !navLogo) return;

  let startHeroRect = null;
  let targetNavRect = null;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  function calcLogoCoordinates() {
    if (!heroWord || !navLogo) return;

    // Measure natural layout positions
    heroWord.style.transform = 'none';
    startHeroRect = heroWord.getBoundingClientRect();

    // Temporarily reveal navLogo to measure target header position
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
    const travelDistance = 180; // Fast travel transition distance

    // Auto-recalculate coordinates near page top to account for mobile address bar resizes
    if (scrollY < 15 || !startHeroRect) {
      calcLogoCoordinates();
    }

    // Activate sticky scrolled header style
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

        // Smooth crossfade: fade travelling hero word out in last 30% of travel, while fading header logo in
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
        // Reached top header bar: complete clean fade handoff to header logo
        heroWord.style.opacity = 0;
        navLogo.style.visibility = 'visible';
        navLogo.style.opacity = '1';
      }
    }

    // Fade & lift the secondary tagline ('A Moment Wrapped.')
    if (heroScript) {
      const taglineProgress = Math.min(Math.max(scrollY / 130, 0), 1);
      heroScript.style.opacity = 1 - taglineProgress;
      heroScript.style.transform = `translate3d(0, ${-scrollY * 0.25}px, 0)`;
    }
  }

  window.addEventListener('scroll', handleLogoTravelScroll, { passive: true });
  setTimeout(handleLogoTravelScroll, 50);
}

// 2. Mobile Nav Panel & Drawer Toggle
function initNavPanel() {
  const navToggle = document.getElementById('navToggle');
  const navPanel = document.getElementById('navPanel');
  const navClose = document.getElementById('navClose');
  const navScrim = document.getElementById('navScrim');

  if (!navToggle || !navPanel) return;

  function openNav() {
    navPanel.classList.add('is-open');
    if (navScrim) navScrim.classList.add('is-open');
  }

  function closeNav() {
    navPanel.classList.remove('is-open');
    if (navScrim) navScrim.classList.remove('is-open');
  }

  navToggle.addEventListener('click', openNav);
  if (navClose) navClose.addEventListener('click', closeNav);
  if (navScrim) navScrim.addEventListener('click', closeNav);
  document.querySelectorAll('.nav-links a').forEach(a => a.addEventListener('click', closeNav));
}

// 3. Scroll Reveal Animation
function initScrollReveal() {
  const revealEls = document.querySelectorAll('.reveal');
  if (!revealEls.length) return;

  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('is-visible');
        io.unobserve(e.target);
      }
    });
  }, { threshold: 0.14 });

  revealEls.forEach(el => io.observe(el));
}

// 4. Nav Collections Dropdown
function initNavDropdown() {
  const navDropdown = document.getElementById('navDropdown');
  const navDropdownBtn = document.getElementById('navDropdownBtn');
  if (navDropdown && navDropdownBtn) {
    navDropdownBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      const isOpen = navDropdown.classList.toggle('is-open');
      navDropdownBtn.setAttribute('aria-expanded', isOpen ? 'true' : 'false');
    });
    document.addEventListener('click', (e) => {
      if (!navDropdown.contains(e.target)) {
        navDropdown.classList.remove('is-open');
        navDropdownBtn.setAttribute('aria-expanded', 'false');
      }
    });
  }
}

// 5. Notify Me Links (WhatsApp integration)
function initNotifyMeLinks() {
  document.querySelectorAll('.notify-link').forEach(link => {
    link.addEventListener('click', (e) => {
      e.preventDefault();
      const parentItem = link.closest('.horizon-item');
      const momentName = parentItem ? parentItem.querySelector('h3').textContent : 'this collection';
      const url = `https://wa.me/919999999999?text=${encodeURIComponent(`Hi, please notify me when ${momentName} launches.`)}`;
      window.open(url, '_blank', 'noopener');
    });
  });
}

// 6. Inside Collection Carousel
function initInsideCarousel() {
  const insideTrack = document.getElementById('insideTrack');
  if (!insideTrack) return;

  const prevBtn = document.querySelector('.carousel-arrow--prev');
  const nextBtn = document.querySelector('.carousel-arrow--next');
  const scrollAmt = () => (insideTrack.querySelector('.inside-card')?.offsetWidth || 270) + 22;

  prevBtn?.addEventListener('click', () => insideTrack.scrollBy({ left: -scrollAmt(), behavior: 'smooth' }));
  nextBtn?.addEventListener('click', () => insideTrack.scrollBy({ left: scrollAmt(), behavior: 'smooth' }));

  document.querySelectorAll('.inside-card').forEach(card => {
    card.addEventListener('click', () => {
      if (window.matchMedia('(hover: none)').matches) {
        document.querySelectorAll('.inside-card').forEach(c => { if (c !== card) c.classList.remove('is-active'); });
        card.classList.toggle('is-active');
      }
    });
  });
}

// 7. Moment of Care Hamper Image Hover Swap
function initMocImageSwap() {
  const mocRight = document.querySelector('.moc-right');
  const mocImg = document.querySelector('.moc-right-img');
  if (mocRight && mocImg) {
    let originalSrc = mocImg.src;
    mocRight.addEventListener('mouseenter', () => {
      const insideImgs = Array.from(document.querySelectorAll('.inside-card .inside-img'))
        .map(img => img.src)
        .filter(Boolean);
      if (insideImgs.length > 0) {
        const available = insideImgs.filter(src => src !== mocImg.src);
        const pool = available.length > 0 ? available : insideImgs;
        const randomSrc = pool[Math.floor(Math.random() * pool.length)];
        mocImg.style.opacity = '0.3';
        setTimeout(() => {
          mocImg.src = randomSrc;
          mocImg.style.opacity = '1';
        }, 150);
      }
    });
    mocRight.addEventListener('mouseleave', () => {
      mocImg.style.opacity = '0.3';
      setTimeout(() => {
        mocImg.src = originalSrc;
        mocImg.style.opacity = '1';
      }, 150);
    });
  }
}

// 8. FAQ Teaser and Accordion
function initFaqAccordion() {
  const faqTeaser = document.getElementById('faqTeaser');
  const faqList = document.getElementById('faqList');
  if (faqTeaser && faqList) {
    faqTeaser.addEventListener('click', () => {
      const isOpen = faqList.classList.contains('is-open');
      if (isOpen) {
        faqList.style.maxHeight = faqList.scrollHeight + 'px';
        requestAnimationFrame(() => { faqList.style.maxHeight = '0px'; });
        faqList.classList.remove('is-open');
      } else {
        faqList.classList.add('is-open');
        faqList.style.maxHeight = faqList.scrollHeight + 'px';
        setTimeout(() => { faqList.style.maxHeight = 'none'; }, 520);
      }
    });
  }

  document.querySelectorAll('.faq-item').forEach(item => {
    const q = item.querySelector('.faq-q');
    const a = item.querySelector('.faq-a');
    if (q && a) {
      q.addEventListener('click', () => {
        const isOpen = item.classList.contains('is-open');
        document.querySelectorAll('.faq-item').forEach(i => {
          i.classList.remove('is-open');
          const innerA = i.querySelector('.faq-a');
          if (innerA) innerA.style.maxHeight = null;
        });
        if (!isOpen) {
          item.classList.add('is-open');
          a.style.maxHeight = a.scrollHeight + 'px';
        }
      });
    }
  });
}

// 9. Bespoke Custom Form (WhatsApp Order trigger)
function initBespokeForm() {
  const openCustomFormBtns = document.querySelectorAll('.js-open-custom-form');
  const customFormWrap = document.getElementById('customFormWrap');
  if (customFormWrap) {
    openCustomFormBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const isOpen = customFormWrap.classList.contains('is-open');
        if (isOpen) {
          customFormWrap.style.maxHeight = customFormWrap.scrollHeight + 'px';
          requestAnimationFrame(() => { customFormWrap.style.maxHeight = '0px'; });
          customFormWrap.classList.remove('is-open');
        } else {
          customFormWrap.classList.add('is-open');
          customFormWrap.style.maxHeight = customFormWrap.scrollHeight + 'px';
          setTimeout(() => { customFormWrap.style.maxHeight = 'none'; }, 520);
          setTimeout(() => {
            const nameInput = document.getElementById('cf-name');
            if (nameInput) nameInput.focus();
          }, 300);
          customFormWrap.scrollIntoView({ behavior: 'smooth', block: 'center' });
        }
      });
    });
  }

  const customForm = document.getElementById('customForm');
  if (customForm) {
    const WHATSAPP_NUMBER = "919999999999";
    customForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const name = document.getElementById('cf-name')?.value || '';
      const contact = document.getElementById('cf-contact')?.value || '';
      const moment = document.getElementById('cf-moment')?.value || '';
      const qty = document.getElementById('cf-qty')?.value || 'not specified';
      const text = `Hi Amoraki, I'd like to enquire about a bespoke/custom order.\n\nName: ${name}\nContact: ${contact}\nQuantity: ${qty}\nAbout the moment: ${moment}`;
      window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(text)}`, '_blank');
    });
  }
}

// 10. Newsletter Form
function initNewsletterForm() {
  const stayForm = document.getElementById('stayForm');
  if (stayForm) {
    stayForm.addEventListener('submit', function (e) {
      e.preventDefault();
      const email = document.getElementById('stayEmail')?.value || '';
      window.location.href = `mailto:hello@amoraki.in?subject=Newsletter%20Signup&body=Please%20add%20me%20to%20the%20Amoraki%20newsletter%3A%20${encodeURIComponent(email)}`;
    });
  }
}
