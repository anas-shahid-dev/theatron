/**
 * THEATRON LUXURY CINEMA PLATFORM — MEMBER 4 (26I3113)
 * Shared JavaScript Library: Navigation, Toasts, Modals, Audio Chimes, & Scroll Effects
 */

document.addEventListener('DOMContentLoaded', () => {
  initNavigation();
  initScrollEffects();
  initBackToTop();
  initToastSystem();
  initAccordions();
  initNewsletter();
});

/* 1. NAVIGATION & MOBILE DRAWER */
function initNavigation() {
  const header = document.querySelector('.site-header');
  const mobileToggle = document.querySelector('.mobile-toggle');
  const mobileDrawer = document.querySelector('.mobile-drawer');
  const mobileOverlay = document.querySelector('.mobile-drawer-overlay');
  const mobileCloseBtn = document.querySelector('.mobile-close-btn');

  // Sticky header background transition
  window.addEventListener('scroll', () => {
    if (window.scrollY > 40) {
      header?.classList.add('scrolled');
    } else {
      header?.classList.remove('scrolled');
    }
  }, { passive: true });

  // Mobile Drawer Toggle
  function openDrawer() {
    mobileDrawer?.classList.add('active');
    mobileOverlay?.classList.add('active');
    document.body.style.overflow = 'hidden';
    playSubtleChime(320);
  }

  function closeDrawer() {
    mobileDrawer?.classList.remove('active');
    mobileOverlay?.classList.remove('active');
    document.body.style.overflow = '';
  }

  mobileToggle?.addEventListener('click', openDrawer);
  mobileCloseBtn?.addEventListener('click', closeDrawer);
  mobileOverlay?.addEventListener('click', closeDrawer);

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      closeDrawer();
      closeAllModals();
    }
  });

  // Mark current page active in navigation
  const currentPath = window.location.pathname.split('/').pop() || '26I3113_profile.html';
  document.querySelectorAll('.nav-link, .mobile-nav-links a').forEach(link => {
    const href = link.getAttribute('href');
    if (href && (href === currentPath || currentPath.includes(href))) {
      link.classList.add('active');
    }
  });
}

/* 2. SCROLL REVEAL ANIMATIONS */
function initScrollEffects() {
  const revealElements = document.querySelectorAll('.reveal-on-scroll');
  if ('IntersectionObserver' in window) {
    const observer = new IntersectionObserver((entries, obs) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('revealed');
          obs.unobserve(entry.target);
        }
      });
    }, {
      root: null,
      rootMargin: '0px 0px -60px 0px',
      threshold: 0.1
    });

    revealElements.forEach(el => observer.observe(el));
  } else {
    revealElements.forEach(el => el.classList.add('revealed'));
  }
}

/* 3. BACK TO TOP BUTTON */
function initBackToTop() {
  const btn = document.querySelector('.back-to-top');
  if (!btn) return;

  window.addEventListener('scroll', () => {
    if (window.scrollY > 400) {
      btn.classList.add('visible');
    } else {
      btn.classList.remove('visible');
    }
  }, { passive: true });

  btn.addEventListener('click', () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth'
    });
    playSubtleChime(440);
  });
}

/* 4. LUXURY TOAST NOTIFICATION SYSTEM */
function initToastSystem() {
  let container = document.querySelector('.toast-container');
  if (!container) {
    container = document.createElement('div');
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  window.showTheatronToast = function(title, message, type = 'gold') {
    const toast = document.createElement('div');
    toast.className = 'toast';
    
    let iconChar = '★';
    if (type === 'success') iconChar = '✓';
    if (type === 'info') iconChar = '✦';
    if (type === 'warning') iconChar = '⚠';

    toast.innerHTML = `
      <div class="toast-icon">${iconChar}</div>
      <div class="toast-body">
        <h5>${title}</h5>
        <p>${message}</p>
      </div>
    `;

    container.appendChild(toast);
    playSubtleChime(520);

    // Animate in
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto dismiss after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        toast.remove();
      }, 350);
    }, 4000);
  };
}

/* 5. ACCORDION FAQ SYSTEM */
function initAccordions() {
  const headers = document.querySelectorAll('.accordion-header');
  headers.forEach(header => {
    header.addEventListener('click', () => {
      const parent = header.closest('.accordion-item');
      const isOpen = parent.classList.contains('open');

      const siblingItems = parent.parentElement.querySelectorAll('.accordion-item');
      siblingItems.forEach(item => {
        if (item !== parent) item.classList.remove('open');
      });

      parent.classList.toggle('open', !isOpen);
      playSubtleChime(isOpen ? 280 : 380);
    });
  });
}

/* 6. MODAL UTILITIES */
window.openTheatronModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.add('active');
  document.body.style.overflow = 'hidden';
  playSubtleChime(460);
};

window.closeTheatronModal = function(modalId) {
  const modal = document.getElementById(modalId);
  if (!modal) return;
  modal.classList.remove('active');
  document.body.style.overflow = '';
};

function closeAllModals() {
  document.querySelectorAll('.modal-overlay.active').forEach(modal => {
    modal.classList.remove('active');
  });
  document.body.style.overflow = '';
}

document.addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    e.target.classList.remove('active');
    document.body.style.overflow = '';
  }
  if (e.target.closest('.modal-close-btn')) {
    const modal = e.target.closest('.modal-overlay');
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }
});

/* 7. NEWSLETTER SUBSCRIPTION DEMO */
function initNewsletter() {
  const forms = document.querySelectorAll('.newsletter-form');
  forms.forEach(form => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const input = form.querySelector('.newsletter-input');
      const email = input ? input.value.trim() : '';
      if (!email || !email.includes('@')) {
        window.showTheatronToast('Invalid Email', 'Please enter a valid email address for VIP invitations.', 'warning');
        return;
      }
      localStorage.setItem('theatron_newsletter_subscriber', email);
      window.showTheatronToast('Privilege Confirmed', `Welcome ${email} to Theatron Private Gazette. 10% demo code sent!`, 'success');
      form.reset();
    });
  });
}

/* 8. WEB AUDIO LUXURY TACTILE CHIMES */
function playSubtleChime(freq = 440) {
  try {
    const AudioContext = window.AudioContext || window.webkitAudioContext;
    if (!AudioContext) return;
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.type = 'sine';
    osc.frequency.setValueAtTime(freq, ctx.currentTime);
    osc.frequency.exponentialRampToValueAtTime(freq * 1.5, ctx.currentTime + 0.12);

    gain.gain.setValueAtTime(0.025, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.15);

    osc.connect(gain);
    gain.connect(ctx.destination);

    osc.start();
    osc.stop(ctx.currentTime + 0.16);
  } catch (e) {
    // blocked or audio not supported
  }
}
