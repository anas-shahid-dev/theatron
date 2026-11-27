/**
 * ============================================================================
 * THEATRON CINEMA LOUNGES — ADVANCED MOTION & INTERACTION ENGINE
 * MEMBER 4 (Student ID: 26I3113)
 * World-Class Cinematic Motion: Cursor Ambient Lighting, Dynamic 3D Tilts,
 * Magnetic Button Attraction, Specular Card Spotlights & Touch Tactile Feedback
 * ============================================================================
 */

(function () {
  'use strict';

  // Feature detection
  const isFinePointer = window.matchMedia('(pointer: fine)').matches;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  document.addEventListener('DOMContentLoaded', () => {
    initPageEntry();
    initClickRipples();

    if (isFinePointer && !prefersReducedMotion) {
      initAmbientCursorLight();
      initCardSpotlightAndTilt();
      initMagneticButtons();
      initMembershipCardGyro();
      initInteractiveNavGlow();
    }
  });

  /* --------------------------------------------------------------------------
     1. CINEMATIC PAGE ENTRY ORCHESTRATION
     -------------------------------------------------------------------------- */
  function initPageEntry() {
    // Add ready state after first paint
    requestAnimationFrame(() => {
      document.body.classList.add('theatron-page-ready');
    });

    // Staggered reveal for initial viewport hero elements
    const heroElements = document.querySelectorAll('.page-hero .reveal-on-scroll');
    heroElements.forEach((el, index) => {
      setTimeout(() => {
        el.classList.add('revealed');
      }, 150 + index * 120);
    });
  }

  /* --------------------------------------------------------------------------
     2. CURSOR-FOLLOWING AMBIENT LIGHTING (LERP SMOOTHED)
     -------------------------------------------------------------------------- */
  function initAmbientCursorLight() {
    const ambientGlow = document.createElement('div');
    ambientGlow.className = 'theatron-cursor-glow';
    ambientGlow.setAttribute('aria-hidden', 'true');
    document.body.appendChild(ambientGlow);

    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let currentX = mouseX;
    let currentY = mouseY;
    let isHoveringInteractive = false;
    let isVisible = false;

    window.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (!isVisible) {
        isVisible = true;
        ambientGlow.style.opacity = '1';
      }
    }, { passive: true });

    document.addEventListener('mouseleave', () => {
      isVisible = false;
      ambientGlow.style.opacity = '0';
    });

    // Detect hover on interactive components to expand glow
    const interactiveSelectors = 'a, button, .luxury-card, .theatron-media-card, .membership-card-wrap, input, select, textarea';
    document.addEventListener('mouseover', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        if (!isHoveringInteractive) {
          isHoveringInteractive = true;
          ambientGlow.classList.add('glow-expanded');
        }
      }
    }, { passive: true });

    document.addEventListener('mouseout', (e) => {
      if (e.target.closest(interactiveSelectors)) {
        isHoveringInteractive = false;
        ambientGlow.classList.remove('glow-expanded');
      }
    }, { passive: true });

    // Smooth physics loop using linear interpolation
    function renderAmbientGlow() {
      // Lerp formula: current = current + (target - current) * ease
      currentX += (mouseX - currentX) * 0.12;
      currentY += (mouseY - currentY) * 0.12;

      ambientGlow.style.transform = `translate3d(${currentX}px, ${currentY}px, 0)`;
      requestAnimationFrame(renderAmbientGlow);
    }
    requestAnimationFrame(renderAmbientGlow);
  }

  /* --------------------------------------------------------------------------
     3. INTERACTIVE SPOTLIGHT & PERSPECTIVE 3D TILT ON CARDS
     -------------------------------------------------------------------------- */
  function initCardSpotlightAndTilt() {
    const cards = document.querySelectorAll('.luxury-card, .theatron-media-card, .stat-item');

    cards.forEach((card) => {
      let bounds = null;
      let rafId = null;

      function updateBounds() {
        bounds = card.getBoundingClientRect();
      }

      card.addEventListener('mouseenter', () => {
        updateBounds();
        card.classList.add('card-interacting');
      });

      card.addEventListener('mousemove', (e) => {
        if (!bounds) updateBounds();

        // Calculate relative coordinates inside card
        const x = e.clientX - bounds.left;
        const y = e.clientY - bounds.top;

        // Set CSS variables for spotlight reflection gradient
        card.style.setProperty('--mouse-x', `${x}px`);
        card.style.setProperty('--mouse-y', `${y}px`);

        // Compute 3D tilt angles (-7 to +7 degrees)
        const centerX = bounds.width / 2;
        const centerY = bounds.height / 2;
        const rotateY = ((x - centerX) / centerX) * 6.5;
        const rotateX = -((y - centerY) / centerY) * 6.5;

        if (rafId) cancelAnimationFrame(rafId);
        rafId = requestAnimationFrame(() => {
          card.style.transform = `perspective(1000px) rotateX(${rotateX.toFixed(2)}deg) rotateY(${rotateY.toFixed(2)}deg) translateZ(6px)`;
        });
      }, { passive: true });

      card.addEventListener('mouseleave', () => {
        if (rafId) cancelAnimationFrame(rafId);
        card.classList.remove('card-interacting');
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translateZ(0px)';
        bounds = null;
      });

      // Recalculate on window resize
      window.addEventListener('resize', () => { bounds = null; }, { passive: true });
    });
  }

  /* --------------------------------------------------------------------------
     4. MAGNETIC BUTTON ATTRACTION
     -------------------------------------------------------------------------- */
  function initMagneticButtons() {
    const magneticButtons = document.querySelectorAll('.btn-gold, .btn-maroon, .btn-outline-gold, .header-tickets-pill');

    magneticButtons.forEach((btn) => {
      let rect = null;

      btn.addEventListener('mouseenter', () => {
        rect = btn.getBoundingClientRect();
      });

      btn.addEventListener('mousemove', (e) => {
        if (!rect) rect = btn.getBoundingClientRect();

        const btnCenterX = rect.left + rect.width / 2;
        const btnCenterY = rect.top + rect.height / 2;

        const deltaX = e.clientX - btnCenterX;
        const deltaY = e.clientY - btnCenterY;

        // Subtle displacement factor (maximum ~6-8px pull)
        const pullX = deltaX * 0.22;
        const pullY = deltaY * 0.22;

        btn.style.transform = `translate3d(${pullX.toFixed(1)}px, ${pullY.toFixed(1)}px, 0) scale(1.02)`;
      }, { passive: true });

      btn.addEventListener('mouseleave', () => {
        btn.style.transform = 'translate3d(0, 0, 0) scale(1)';
        rect = null;
      });
    });
  }

  /* --------------------------------------------------------------------------
     5. DIGITAL MEMBERSHIP CARD 3D GYRO & HOLOGRAPHIC FOIL
     -------------------------------------------------------------------------- */
  function initMembershipCardGyro() {
    const cardWrap = document.querySelector('.membership-card-wrap');
    const card3D = document.getElementById('digital-membership-card');
    if (!cardWrap || !card3D) return;

    let rect = null;

    cardWrap.addEventListener('mouseenter', () => {
      rect = cardWrap.getBoundingClientRect();
    });

    cardWrap.addEventListener('mousemove', (e) => {
      if (!rect) rect = cardWrap.getBoundingClientRect();

      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const centerX = rect.width / 2;
      const centerY = rect.height / 2;

      const tiltX = -((y - centerY) / centerY) * 12;
      const tiltY = ((x - centerX) / centerX) * 14;

      const isFlipped = card3D.classList.contains('flipped');
      const baseRotation = isFlipped ? 180 : 0;

      card3D.style.transform = `rotateY(${baseRotation + tiltY}deg) rotateX(${tiltX}deg)`;

      // Dynamic sheen shift
      cardWrap.style.setProperty('--sheen-x', `${(x / rect.width) * 100}%`);
      cardWrap.style.setProperty('--sheen-y', `${(y / rect.height) * 100}%`);
    }, { passive: true });

    cardWrap.addEventListener('mouseleave', () => {
      const isFlipped = card3D.classList.contains('flipped');
      card3D.style.transform = isFlipped ? 'rotateY(180deg)' : 'rotateY(0deg)';
      rect = null;
    });
  }

  /* --------------------------------------------------------------------------
     6. INTERACTIVE NAV UNDERLINE GLOW
     -------------------------------------------------------------------------- */
  function initInteractiveNavGlow() {
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach((link) => {
      link.addEventListener('mousemove', (e) => {
        const rect = link.getBoundingClientRect();
        const x = e.clientX - rect.left;
        link.style.setProperty('--link-x', `${x}px`);
      }, { passive: true });
    });
  }

  /* --------------------------------------------------------------------------
     7. LUXURY BUTTON RIPPLE EFFECT ON CLICK
     -------------------------------------------------------------------------- */
  function initClickRipples() {
    document.addEventListener('click', (e) => {
      const btn = e.target.closest('.btn, .header-tickets-pill');
      if (!btn) return;

      const rect = btn.getBoundingClientRect();
      const circle = document.createElement('span');
      const diameter = Math.max(rect.width, rect.height);
      const radius = diameter / 2;

      circle.className = 'theatron-ripple';
      circle.style.width = circle.style.height = `${diameter}px`;
      circle.style.left = `${e.clientX - rect.left - radius}px`;
      circle.style.top = `${e.clientY - rect.top - radius}px`;

      // Clean existing ripples on button
      const oldRipple = btn.querySelector('.theatron-ripple');
      if (oldRipple) oldRipple.remove();

      btn.appendChild(circle);

      setTimeout(() => {
        circle.remove();
      }, 650);
    });
  }

})();
