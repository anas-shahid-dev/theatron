/**
 * THEATRON CINEMA LOUNGES — ANIMATION CONTROLLER
 * Canvas Particles, IntersectionObserver Reveals, 3D Card Tilt, Animated Counters
 */

(function () {
  'use strict';

  // --- 1. Ambient Gold Dust Particle Canvas ---
  function initAmbientCanvas() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const canvas = document.getElementById('ambient-canvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    let animationFrameId;
    const particles = [];
    const particleCount = Math.min(Math.floor(width / 35), 45); // Responsive count

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        radius: Math.random() * 1.5 + 0.4,
        speedX: (Math.random() - 0.5) * 0.35,
        speedY: (Math.random() - 0.5) * 0.4 - 0.1, // Slight upward drift
        alpha: Math.random() * 0.5 + 0.2,
        pulseSpeed: Math.random() * 0.02 + 0.005,
      });
    }

    function render() {
      ctx.clearRect(0, 0, width, height);

      particles.forEach((p) => {
        p.x += p.speedX;
        p.y += p.speedY;

        // Wrap around screen boundaries
        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Subtle alpha pulsation
        p.alpha += Math.sin(Date.now() * p.pulseSpeed) * 0.005;
        const currentAlpha = Math.max(0.1, Math.min(0.7, p.alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(230, 185, 111, ${currentAlpha})`;
        ctx.shadowBlur = 8;
        ctx.shadowColor = 'rgba(241, 189, 114, 0.4)';
        ctx.fill();
      });

      animationFrameId = requestAnimationFrame(render);
    }

    render();

    window.addEventListener(
      'resize',
      () => {
        width = canvas.width = window.innerWidth;
        height = canvas.height = window.innerHeight;
      },
      { passive: true }
    );
  }

  // --- 2. Scroll-Triggered Reveal Animations ---
  function initScrollReveals() {
    const revealElements = document.querySelectorAll('.reveal-on-scroll');
    if (!revealElements.length) return;

    if (!('IntersectionObserver' in window)) {
      revealElements.forEach((el) => el.classList.add('revealed'));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('revealed');
            obs.unobserve(entry.target);
          }
        });
      },
      {
        root: null,
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px',
      }
    );

    revealElements.forEach((el) => observer.observe(el));
  }

  // --- 3. 3D Card Interactive Tilt ---
  function initCardTilt() {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const cards = document.querySelectorAll('.tilt-card');
    cards.forEach((card) => {
      // Add glare element if not present
      if (!card.querySelector('.card-glare')) {
        const glare = document.createElement('div');
        glare.className = 'card-glare';
        card.appendChild(glare);
      }

      function handleMouseMove(e) {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;

        const centerX = rect.width / 2;
        const centerY = rect.height / 2;

        const rotateX = ((y - centerY) / centerY) * -10;
        const rotateY = ((x - centerX) / centerX) * 10;

        card.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale3d(1.02, 1.02, 1.02)`;

        card.style.setProperty('--mouse-x', `${(x / rect.width) * 100}%`);
        card.style.setProperty('--mouse-y', `${(y / rect.height) * 100}%`);
      }

      function handleMouseLeave() {
        card.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) scale3d(1, 1, 1)';
      }

      card.addEventListener('mousemove', handleMouseMove);
      card.addEventListener('mouseleave', handleMouseLeave);
    });
  }

  // --- 4. Animated Number Counters ---
  function initCounters() {
    const counterElements = document.querySelectorAll('[data-counter-target]');
    if (!counterElements.length) return;

    const observer = new IntersectionObserver(
      (entries, obs) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const el = entry.target;
            const targetVal = parseFloat(el.getAttribute('data-counter-target'));
            const prefix = el.getAttribute('data-counter-prefix') || '';
            const suffix = el.getAttribute('data-counter-suffix') || '';
            const duration = 1800; // ms
            const startTime = performance.now();

            function updateCounter(currentTime) {
              const elapsed = currentTime - startTime;
              const progress = Math.min(elapsed / duration, 1);
              // Ease-out cubic curve
              const easeOut = 1 - Math.pow(1 - progress, 3);
              const currentVal = Math.floor(easeOut * targetVal);

              el.textContent = `${prefix}${currentVal.toLocaleString()}${suffix}`;

              if (progress < 1) {
                requestAnimationFrame(updateCounter);
              } else {
                el.textContent = `${prefix}${targetVal.toLocaleString()}${suffix}`;
              }
            }

            requestAnimationFrame(updateCounter);
            obs.unobserve(el);
          }
        });
      },
      { threshold: 0.25 }
    );

    counterElements.forEach((el) => observer.observe(el));
  }

  // Initialize all animation components
  document.addEventListener('DOMContentLoaded', () => {
    initAmbientCanvas();
    initScrollReveals();
    initCardTilt();
    initCounters();
  });
})();
