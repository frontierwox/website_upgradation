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

  // Page Shuttle Transition Controller
  const shuttle = document.getElementById('page-shuttle');
  if (shuttle) {
    setTimeout(() => {
      shuttle.classList.add('shuttle-out');
    }, 450);

    document.querySelectorAll('a[href]').forEach(link => {
      const href = link.getAttribute('href');
      if (
        href &&
        !href.startsWith('#') &&
        !href.startsWith('mailto:') &&
        !href.startsWith('tel:') &&
        !href.startsWith('http') &&
        !link.getAttribute('target')
      ) {
        link.addEventListener('click', (e) => {
          e.preventDefault();
          shuttle.classList.remove('shuttle-out');
          setTimeout(() => {
            window.location.href = href;
          }, 350);
        });
      }
    });
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
     2. HEADER — Top Bar Scroll Away & Logo Shrink
     ===================================================== */
  const headerWrapper = document.querySelector('.header-wrapper');
  const header = document.querySelector('.header');

  const onScroll = () => {
    const scrolled = window.scrollY > 40;
    headerWrapper?.classList.toggle('scrolled', scrolled);
    header?.classList.toggle('scrolled', scrolled);
    
    // Show/hide back-to-top
    backToTop?.classList.toggle('visible', window.scrollY > 350);

    // Update scroll progress bar
    const scrollProgress = document.getElementById('scrollProgress');
    if (scrollProgress) {
      const winScroll = document.body.scrollTop || document.documentElement.scrollTop;
      const height = document.documentElement.scrollHeight - document.documentElement.clientHeight;
      const progress = height > 0 ? (winScroll / height) * 100 : 0;
      scrollProgress.style.width = progress + '%';
    }
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
     7. CONTACT FORM — Direct Mail Dispatch & Ticket Generation
     ===================================================== */
  const contactForm = document.getElementById('contactForm');
  const ticketConfirmation = document.getElementById('ticketConfirmation');

  if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
      e.preventDefault();
      
      const submitBtn = contactForm.querySelector('button[type="submit"]');
      if (!submitBtn) return;

      const fullName       = document.getElementById('fullName')?.value.trim() || 'Valued Partner';
      const emailAddr      = document.getElementById('emailAddr')?.value.trim() || '';
      const phoneNum       = document.getElementById('phoneNum')?.value.trim() || '';
      const orgTypeSelect  = document.getElementById('orgType');
      const orgType        = orgTypeSelect?.options[orgTypeSelect.selectedIndex]?.value || 'Corporate Enterprise / SME';
      const subjSelect     = document.getElementById('inquirySubject');
      const inquirySubject = subjSelect?.options[subjSelect.selectedIndex]?.value || 'General Corporate Inquiry';
      const messageContent = document.getElementById('messageContent')?.value.trim() || '';

      // Generate Unique Corporate Ticket ID
      const ticketId = 'FWT-2026-TKT-' + Math.floor(1000 + Math.random() * 9000);

      // Disable button & show spinner
      const originalHTML = submitBtn.innerHTML;
      submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Generating Ticket & Dispatching Mail...';
      submitBtn.disabled  = true;

      // Construct Email Subject & Body for hr@frontierwox.in
      const emailRecipient = 'hr@frontierwox.in';
      const mailSubject = encodeURIComponent(`[Inquiry Ticket #${ticketId}] - ${inquirySubject} - ${fullName}`);
      
      const mailBodyText = `NEW CORPORATE INQUIRY TRANSMISSION
Ticket Reference ID: ${ticketId}

SENDER INFORMATION:
• Full Name: ${fullName}
• Corporate / Personal Email: ${emailAddr}
• Phone / WhatsApp Number: ${phoneNum}
• Organization Type: ${orgType}

INQUIRY SPECIFICATIONS:
• Primary Area of Interest: ${inquirySubject}

PROJECT REQUIREMENTS & INQUIRY DETAILS:
--------------------------------------------------
${messageContent}
--------------------------------------------------

Target Mailbox: ${emailRecipient}
Transmission Timestamp: ${new Date().toLocaleString()}
FrontierWox Tech Private Limited — A Registered Company under MCA, Govt. of India`;

      const mailtoUrl = `mailto:${emailRecipient}?subject=${mailSubject}&body=${encodeURIComponent(mailBodyText)}`;

      // Launch native email client
      window.location.href = mailtoUrl;

      // Display Ticket Confirmation Receipt Box
      setTimeout(() => {
        contactForm.style.display = 'none';

        if (ticketConfirmation) {
          ticketConfirmation.style.display = 'block';
          ticketConfirmation.innerHTML = `
            <div style="text-align: center; margin-bottom: 2rem;">
              <div style="width: 75px; height: 75px; background: rgba(39, 180, 251, 0.15); border: 2px solid var(--sky-blue); color: var(--sky-blue); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 2.2rem; margin: 0 auto 1.25rem auto; box-shadow: 0 0 30px rgba(39, 180, 251, 0.4);">
                <i class="fas fa-ticket"></i>
              </div>
              <span class="badge-tag" style="margin-bottom: 0.5rem;"><i class="fas fa-circle-check" style="color: #22c55e;"></i> Ticket Registered & Logged</span>
              <h3 style="color: #ffffff; font-size: 1.85rem; margin-bottom: 0.3rem;">Inquiry Ticket #${ticketId}</h3>
              <p style="color: #cbd5e1; font-size: 0.95rem;">Transmitted to <strong>hr@frontierwox.in</strong></p>
            </div>

            <div style="background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.1); border-radius: var(--radius-md); padding: 1.85rem; margin-bottom: 2rem;">
              <p style="font-size: 1.05rem; color: #f8fafc; line-height: 1.8; margin-bottom: 1.25rem;">
                Dear <strong>${fullName}</strong>,
              </p>
              <p style="font-size: 1.05rem; color: #cbd5e1; line-height: 1.8; margin-bottom: 1.5rem;">
                Your inquiry or project has been taken into consideration. Our team will shortly get in touch with you either through WhatsApp or Mail.
              </p>
              <div style="background: rgba(235, 77, 28, 0.12); border-left: 4px solid var(--orange); padding: 1.1rem 1.35rem; border-radius: 0 var(--radius-sm) var(--radius-sm) 0; margin-bottom: 1.5rem;">
                <p style="font-size: 0.95rem; color: #ffedd5; line-height: 1.65; margin: 0;">
                  <i class="fas fa-triangle-exclamation" style="color: var(--orange); margin-right: 0.5rem;"></i>
                  If it goes beyond 12hrs from the inquiry submission, you can contact us through WhatsApp or call us directly at <strong>+91 96268 06328</strong>.
                </p>
              </div>
              <div style="border-top: 1px solid rgba(255,255,255,0.1); padding-top: 1.25rem; color: #cbd5e1; font-size: 0.95rem; line-height: 1.65;">
                <strong>With Regards From,</strong><br>
                <span style="color: var(--sky-blue); font-weight: 600;">Support & Inquiry Team,</span><br>
                <strong style="color: #ffffff;">FrontierWox Tech Private Limited</strong>
              </div>
            </div>

            <div style="display: flex; gap: 1rem; flex-wrap: wrap; justify-content: center;">
              <a href="https://wa.me/919626806328?text=Hi%20FrontierWox%20Support,%20I%20have%20submitted%20Inquiry%20Ticket%20%23${ticketId}%20regarding%20${encodeURIComponent(inquirySubject)}" target="_blank" rel="noopener noreferrer" class="btn btn-orange" style="flex: 1; min-width: 220px;">
                <i class="fab fa-whatsapp"></i> WhatsApp Support (+91 96268 06328)
              </a>
              <a href="tel:+919626806328" class="btn btn-outline-white" style="flex: 1; min-width: 200px;">
                <i class="fas fa-phone"></i> Call Direct (+91 96268 06328)
              </a>
              <button type="button" id="resetFormBtn" class="btn btn-outline-white" style="width: 100%;">
                <i class="fas fa-rotate"></i> Submit Another Inquiry
              </button>
            </div>
          `;

          document.getElementById('resetFormBtn')?.addEventListener('click', () => {
            ticketConfirmation.style.display = 'none';
            contactForm.reset();
            contactForm.style.display = 'block';
            submitBtn.innerHTML = originalHTML;
            submitBtn.disabled = false;
          });
        }
      }, 700);
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
