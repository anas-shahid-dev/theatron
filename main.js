/**
 * THEATRON CINEMA LOUNGES — MAIN CORE JAVASCRIPT
 * Handles Header, Navigation Drawer, Tickets Modal, and Toast Notification System
 */

(function () {
  'use strict';

  // --- 1. Global Toast Notification Helper ---
  window.showToast = function (title, message, icon) {
    let container = document.getElementById('toast-container');
    if (!container) {
      container = document.createElement('div');
      container.id = 'toast-container';
      document.body.appendChild(container);
    }

    const toast = document.createElement('div');
    toast.className = 'toast';
    toast.setAttribute('role', 'alert');
    toast.setAttribute('aria-live', 'polite');

    const iconHtml = icon || '✦';
    toast.innerHTML = `
      <div class="toast-icon">${iconHtml}</div>
      <div class="toast-content">
        <div class="toast-title">${title}</div>
        <div class="toast-message">${message}</div>
      </div>
    `;

    container.appendChild(toast);

    // Trigger reveal transition
    requestAnimationFrame(() => {
      toast.classList.add('show');
    });

    // Auto-remove after 4 seconds
    setTimeout(() => {
      toast.classList.remove('show');
      setTimeout(() => {
        if (toast.parentNode) {
          toast.parentNode.removeChild(toast);
        }
      }, 400);
    }, 4000);
  };

  // --- 2. Site Header Sticky & Scroll Effect ---
  function initHeaderScroll() {
    const header = document.querySelector('.site-header');
    if (!header) return;

    const handleScroll = () => {
      if (window.scrollY > 20) {
        header.classList.add('scrolled');
      } else {
        header.classList.remove('scrolled');
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll();
  }

  // --- 3. Mobile Navigation Drawer ---
  function initMobileDrawer() {
    const hamburgerBtn = document.querySelector('.hamburger-btn');
    const drawer = document.querySelector('.mobile-drawer');
    const backdrop = document.querySelector('.mobile-drawer-backdrop');
    const closeBtn = document.querySelector('.drawer-close-btn');

    if (!hamburgerBtn || !drawer || !backdrop) return;

    function openDrawer() {
      drawer.classList.add('open');
      backdrop.classList.add('active');
      hamburgerBtn.classList.add('open');
      hamburgerBtn.setAttribute('aria-expanded', 'true');
      document.body.style.overflow = 'hidden';
    }

    function closeDrawer() {
      drawer.classList.remove('open');
      backdrop.classList.remove('active');
      hamburgerBtn.classList.remove('open');
      hamburgerBtn.setAttribute('aria-expanded', 'false');
      document.body.style.overflow = '';
    }

    hamburgerBtn.addEventListener('click', (e) => {
      e.stopPropagation();
      if (drawer.classList.contains('open')) {
        closeDrawer();
      } else {
        openDrawer();
      }
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeDrawer);
    }

    backdrop.addEventListener('click', closeDrawer);

    // Close on Escape key
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && drawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // --- 4. Tickets Quick-View Drawer / Modal ---
  function initTicketsModal() {
    const ticketsBtn = document.querySelector('.btn-tickets');
    const ticketsModal = document.getElementById('tickets-modal');

    if (!ticketsBtn || !ticketsModal) return;

    const closeBtn = ticketsModal.querySelector('.modal-close-btn');

    function openTickets() {
      ticketsModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }

    function closeTickets() {
      ticketsModal.classList.remove('active');
      document.body.style.overflow = '';
    }

    ticketsBtn.addEventListener('click', (e) => {
      e.preventDefault();
      openTickets();
    });

    if (closeBtn) {
      closeBtn.addEventListener('click', closeTickets);
    }

    ticketsModal.addEventListener('click', (e) => {
      if (e.target === ticketsModal) {
        closeTickets();
      }
    });

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && ticketsModal.classList.contains('active')) {
        closeTickets();
      }
    });
  }

  // --- 5. Active Link Highlight Based on URL ---
  function highlightActiveNav() {
    const currentPath = window.location.pathname.split('/').pop() || 'index.html';
    const navLinks = document.querySelectorAll('.nav-link, .drawer-link');

    navLinks.forEach((link) => {
      const href = link.getAttribute('href');
      if (href && (href === currentPath || (currentPath === '' && href === 'index.html'))) {
        link.classList.add('active');
      }
    });
  }

  // Initialize on DOMContentLoaded
  document.addEventListener('DOMContentLoaded', () => {
    initHeaderScroll();
    initMobileDrawer();
    initTicketsModal();
    highlightActiveNav();
  });
})();
