/* ==========================================================================
   FrontierWox Tech Private Limited - Global Interactive Script v3.0
   Features: Mobile nav overlay, scroll reveal stagger, counters, back-to-top,
             ripple effects, typed hero text, header parallax
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {

  /* =====================================================
     1. MOBILE NAVIGATION — Overlay Drawer System
     ===================================================== */
  const mobileToggle = document.querySelector('.mobile-toggle');
  const navMenu      = document.querySelector('.nav-menu');
  let   navOverlay   = document.querySelector('.nav-overlay');

  // Inject overlay element if not in HTML
  if (!navOverlay) {
    navOverlay = document.createElement('div');
    navOverlay.className = 'nav-overlay';
    document.body.appendChild(navOverlay);
  }

  // Inject close button inside mobile menu if not present
  if (navMenu && !navMenu.querySelector('.nav-menu-close')) {
    const closeBtn = document.createElement('button');
    closeBtn.className = 'nav-menu-close';
    closeBtn.innerHTML = '<i class="fas fa-times"></i>';
    closeBtn.setAttribute('aria-label', 'Close Menu');
    navMenu.prepend(closeBtn);
    closeBtn.addEventListener('click', closeNav);
  }

  function openNav() {
    navMenu?.classList.add('active');
    navOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    const icon = mobileToggle?.querySelector('i');
    if (icon) icon.className = 'fas fa-times';
  }

  function closeNav() {
    navMenu?.classList.remove('active');
    navOverlay?.classList.remove('active');
    document.body.style.overflow = '';
    const icon = mobileToggle?.querySelector('i');
    if (icon) icon.className = 'fas fa-bars';
  }

  mobileToggle?.addEventListener('click', () => {
    navMenu?.classList.contains('active') ? closeNav() : openNav();
  });

  navOverlay?.addEventListener('click', closeNav);

  // Close nav when a link is clicked
  document.querySelectorAll('.nav-link').forEach(link => {
    link.addEventListener('click', closeNav);
  });

  // Close on Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeNav();
  });


  /* =====================================================
     2. HEADER — Scroll Glass & Shrink Effect
     ===================================================== */
  const header = document.querySelector('.header');

  const onScroll = () => {
    const scrolled = window.scrollY > 50;
    header?.classList.toggle('scrolled', scrolled);
    // Show/hide back-to-top
    backToTop?.classList.toggle('visible', window.scrollY > 350);
  };

  window.addEventListener('scroll', onScroll, { passive: true });


  /* =====================================================
     3. ACTIVE NAV LINK — Auto-detect current page
     ===================================================== */
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';

  document.querySelectorAll('.nav-link').forEach(link => {
    const href = link.getAttribute('href');
    // Remove any existing active
    link.classList.remove('active');
    if (
      href === currentPage ||
      (currentPage === '' && href === 'index.html') ||
      (currentPage === 'index.html' && href === 'index.html')
    ) {
      link.classList.add('active');
    }
  });


  /* =====================================================
     4. SCROLL REVEAL — IntersectionObserver System
     ===================================================== */
  const revealSelectors = [
    '.sr', '.sr-left', '.sr-right', '.sr-scale',
    '.card', '.izon-card', '.section-title-wrap',
    '.tech-spec-item', '.continuum-step',
    '.contact-item', '.leader-card',
    '.map-wrapper', '.map-header',
    '.footer-recognitions',
  ];

  const revealElements = document.querySelectorAll(revealSelectors.join(', '));

  // Add scroll-reveal class to legacy elements if not already sr-*
  revealElements.forEach(el => {
    if (!el.classList.contains('sr') &&
        !el.classList.contains('sr-left') &&
        !el.classList.contains('sr-right') &&
        !el.classList.contains('sr-scale')) {
      el.classList.add('sr');
    }
  });

  if ('IntersectionObserver' in window) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          revealObserver.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.08,
      rootMargin: '0px 0px -50px 0px',
    });

    revealElements.forEach(el => revealObserver.observe(el));
  } else {
    // Fallback: reveal all immediately
    revealElements.forEach(el => el.classList.add('revealed'));
  }


  /* =====================================================
     5. ANIMATED STAT COUNTERS
        — Triggers when stat numbers enter viewport
     ===================================================== */
  const statNumbers = document.querySelectorAll('.tech-spec-num, [data-count]');

  if ('IntersectionObserver' in window && statNumbers.length > 0) {
    const counterObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const el      = entry.target;
          const rawText = el.getAttribute('data-count') || el.textContent.trim();
          const numMatch = rawText.match(/[\d.]+/);
          if (!numMatch) return;

          const target   = parseFloat(numMatch[0]);
          const suffix   = rawText.replace(/[\d.]+/, '').trim();
          const isFloat  = rawText.includes('.');
          const duration = 1800;
          const start    = performance.now();

          const tick = (now) => {
            const elapsed  = Math.min(now - start, duration);
            const progress = elapsed / duration;
            // Ease-out cubic
            const eased    = 1 - Math.pow(1 - progress, 3);
            const current  = target * eased;

            el.textContent = (isFloat ? current.toFixed(1) : Math.round(current)) + suffix;
            if (elapsed < duration) requestAnimationFrame(tick);
          };

          requestAnimationFrame(tick);
          counterObserver.unobserve(el);
        }
      });
    }, { threshold: 0.5 });

    statNumbers.forEach(el => counterObserver.observe(el));
  }


  /* =====================================================
     6. INTERACTIVE TABS CONTROLLER
     ===================================================== */
  const tabBtns  = document.querySelectorAll('.tab-btn');
  const tabPanes = document.querySelectorAll('.tab-pane');

  if (tabBtns.length > 0) {
    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.getAttribute('data-tab');
        tabBtns.forEach(b  => b.classList.remove('active'));
        tabPanes.forEach(p => p.classList.remove('active'));
        btn.classList.add('active');
        document.getElementById(targetId)?.classList.add('active');
      });
    });
  }


  /* =====================================================
     7. CONTACT FORM — Animated Submit Feedback
     ===================================================== */
  const contactForm = document.getElementById('contactForm');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Transmitting Inquiry...';
      submitBtn.disabled  = true;

      setTimeout(() => {
        // Success state
        submitBtn.innerHTML = '<i class="fas fa-check-circle"></i> Message Sent Successfully!';
        submitBtn.style.background = 'linear-gradient(135deg, #22c55e, #16a34a)';

        setTimeout(() => {
          contactForm.reset();
          submitBtn.innerHTML = originalHTML;
          submitBtn.style.background = '';
          submitBtn.disabled  = false;
        }, 3000);
      }, 1500);
    });
  }


  /* =====================================================
     8. BACK TO TOP BUTTON — Inject & Control
     ===================================================== */
  let backToTop = document.querySelector('.back-to-top');

  if (!backToTop) {
    backToTop = document.createElement('a');
    backToTop.className   = 'back-to-top';
    backToTop.href        = '#';
    backToTop.title       = 'Back to top';
    backToTop.innerHTML   = '<i class="fas fa-arrow-up"></i>';
    backToTop.setAttribute('aria-label', 'Back to top');
    document.body.appendChild(backToTop);
  }

  backToTop.addEventListener('click', (e) => {
    e.preventDefault();
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });


  /* =====================================================
     9. BUTTON RIPPLE EFFECT
     ===================================================== */
  document.querySelectorAll('.btn').forEach(btn => {
    btn.addEventListener('click', function(e) {
      const rect    = btn.getBoundingClientRect();
      const x       = e.clientX - rect.left;
      const y       = e.clientY - rect.top;
      const ripple  = document.createElement('span');
      const size    = Math.max(rect.width, rect.height) * 2;

      ripple.style.cssText = `
        position: absolute;
        width: ${size}px;
        height: ${size}px;
        left: ${x - size / 2}px;
        top: ${y - size / 2}px;
        background: rgba(255, 255, 255, 0.25);
        border-radius: 50%;
        transform: scale(0);
        animation: rippleAnim 0.6s linear;
        pointer-events: none;
      `;

      btn.appendChild(ripple);
      setTimeout(() => ripple.remove(), 650);
    });
  });

  // Inject ripple keyframe once
  if (!document.getElementById('fwt-ripple-style')) {
    const style  = document.createElement('style');
    style.id     = 'fwt-ripple-style';
    style.textContent = `
      @keyframes rippleAnim {
        to { transform: scale(1); opacity: 0; }
      }
    `;
    document.head.appendChild(style);
  }


  /* =====================================================
     10. CARD TILT EFFECT (subtle 3D tilt on mouse move)
     ===================================================== */
  const tiltCards = document.querySelectorAll('.hero-glass-card, .izon-card');

  tiltCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect   = card.getBoundingClientRect();
      const x      = (e.clientX - rect.left) / rect.width;
      const y      = (e.clientY - rect.top)  / rect.height;
      const tiltX  = (y - 0.5) * 8;   // up/down tilt
      const tiltY  = (x - 0.5) * -8;  // left/right tilt

      card.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg) translateZ(5px)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transform = '';
      card.style.transition = 'transform 0.5s ease';
      setTimeout(() => { card.style.transition = ''; }, 500);
    });
  });


  /* =====================================================
     11. NAV-LINK HOVER BACKGROUND PILL (desktop only)
     ===================================================== */
  // On touch devices skip - handled by CSS already


  /* =====================================================
     12. STAGGER CHILDREN — apply sr to grids
     ===================================================== */
  document.querySelectorAll('.stagger-children').forEach(parent => {
    Array.from(parent.children).forEach(child => {
      if (!child.classList.contains('sr')) {
        child.classList.add('sr');
      }
    });
  });


  /* =====================================================
     Trigger initial scroll check
     ===================================================== */
  onScroll();
});
