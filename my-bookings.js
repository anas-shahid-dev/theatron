(() => {
  'use strict';

  const T = window.Theatron;

  const state = {
    activeTab: 'upcoming',
    bookings: [],
    pendingCancelId: null,
  };

  /**
   * Builds realistic pre-seeded bookings when theatron_bookings is empty on first visit.
   * @returns {Array<object>}
   */
  function createSampleBookings() {
    return [
      T.normalizeBooking({
        id: 'THT-849201',
        movieTitle: 'THE VELVET SOVEREIGN',
        poster: T.createPosterPlaceholder('THE VELVET SOVEREIGN', '#4A141D', '#120C0D'),
        cinema: 'THEATRON Grand Flagship',
        hall: 'Royal Gold Lounge 3',
        date: 'Fri, Nov 27, 2026',
        time: '20:30',
        seats: ['G5', 'G6'],
        totalPaid: '$106.82',
        patron: 'Alexander Vance',
        dining: "1x The Sovereign Couple's Duet",
        status: 'CONFIRMED',
        timestamp: '2026-11-25T09:15:00.000Z',
      }),
      T.normalizeBooking({
        id: 'THT-517394',
        movieTitle: 'NOCTURNE IN OBSIDIAN',
        poster: T.createPosterPlaceholder('NOCTURNE IN OBSIDIAN', '#22263D', '#120C0D'),
        cinema: 'THEATRON Mayfair Atelier',
        hall: 'Velvet Sovereign Suite 1',
        date: 'Sun, Nov 29, 2026',
        time: '19:15',
        seats: ['D3', 'D4'],
        totalPaid: '$94.00',
        patron: 'Alexander Vance',
        dining: '2x Truffle Reserve Popcorn & Sparkling Reserve',
        status: 'CONFIRMED',
        timestamp: '2026-11-24T18:40:00.000Z',
      }),
      T.normalizeBooking({
        id: 'THT-309482',
        movieTitle: 'THE GILDED HORIZON',
        poster: T.createPosterPlaceholder('THE GILDED HORIZON', '#3B2814', '#120C0D'),
        cinema: 'THEATRON Grand Flagship',
        hall: 'Imperial Screening Room 2',
        date: 'Sat, Nov 14, 2026',
        time: '21:00',
        seats: ['F7', 'F8'],
        totalPaid: '$88.50',
        patron: 'Alexander Vance',
        dining: '',
        status: 'COMPLETED',
        timestamp: '2026-11-12T14:20:00.000Z',
      }),
    ];
  }

  /**
   * Loads bookings from localStorage and seeds sample data if empty.
   * @returns {Array<object>}
   */
  function loadBookings() {
    const stored = T.readStorage(T.STORAGE_KEYS.BOOKINGS);
    if (!Array.isArray(stored) || stored.length === 0) {
      const seeded = createSampleBookings();
      T.writeStorage(T.STORAGE_KEYS.BOOKINGS, seeded);
      return seeded;
    }
    return stored.map((item) => T.normalizeBooking(item));
  }

  /**
   * Splits bookings into Upcoming (CONFIRMED) and History (COMPLETED / CANCELLED).
   * @param {Array<object>} bookings
   * @returns {{ upcoming: Array<object>, history: Array<object> }}
   */
  function partitionBookings(bookings) {
    const upcoming = [];
    const history = [];

    for (const booking of bookings) {
      if (booking.status === 'CONFIRMED') {
        upcoming.push(booking);
      } else {
        history.push(booking);
      }
    }

    return { upcoming, history };
  }

  /**
   * Escapes HTML text to avoid injection from dynamic localStorage fields.
   * @param {string} value
   * @returns {string}
   */
  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  /**
   * Maps booking status to pill CSS class and label.
   * @param {string} status
   * @returns {{ cls: string, label: string }}
   */
  function getStatusBadgeMeta(status) {
    if (status === 'CANCELLED') {
      return { cls: 'status-cancelled', label: 'CANCELLED' };
    }
    if (status === 'COMPLETED') {
      return { cls: 'status-completed', label: 'COMPLETED' };
    }
    return { cls: 'status-confirmed', label: 'CONFIRMED' };
  }

  /**
   * Builds a booking card DOM element for the vault list.
   * @param {object} booking
   * @param {boolean} isUpcomingTab
   * @returns {HTMLElement}
   */
  function createBookingCard(booking, isUpcomingTab) {
    const card = document.createElement('article');
    card.className = 'booking-card';
    card.dataset.bookingId = booking.id;

    const statusMeta = getStatusBadgeMeta(booking.status);
    const seatsText = Array.isArray(booking.seats) ? booking.seats.join(', ') : String(booking.seats || '');
    const fallbackPoster = T.createPosterPlaceholder(booking.movieTitle);
    const posterSrc = booking.poster || fallbackPoster;

    const cancelButtonHtml =
      isUpcomingTab && booking.status === 'CONFIRMED'
        ? `<button type="button" class="btn-secondary" data-action="cancel" data-id="${escapeHtml(booking.id)}">Cancel</button>`
        : '';

    card.innerHTML = `
      <div class="booking-poster">
        <img src="${escapeHtml(posterSrc)}" alt="${escapeHtml(booking.movieTitle)} poster" loading="lazy" />
      </div>

      <div class="booking-details">
        <div class="booking-top-meta">
          <span class="booking-id">${escapeHtml(booking.id)}</span>
          <span class="status-pill ${statusMeta.cls}">${statusMeta.label}</span>
        </div>

        <h2 class="booking-movie-title">${escapeHtml(booking.movieTitle)}</h2>

        <p class="booking-venue-line">
          ${escapeHtml(booking.cinema)} &bull; ${escapeHtml(booking.hall)} &bull; ${escapeHtml(booking.date)} at ${escapeHtml(booking.time)}
        </p>

        <p class="booking-summary-line">
          Seats: ${escapeHtml(seatsText)} &bull; Total Paid: ${escapeHtml(booking.totalPaid)}
        </p>
      </div>

      <div class="booking-actions">
        <button type="button" class="btn-primary" data-action="view" data-id="${escapeHtml(booking.id)}">
          View Digital Ticket &amp; QR
        </button>
        ${cancelButtonHtml}
      </div>
    `;

    const img = card.querySelector('img');
    if (img) {
      img.addEventListener('error', () => {
        if (img.src !== fallbackPoster) {
          img.src = fallbackPoster;
        }
      });
    }

    return card;
  }

  /**
   * Renders tabs, counters, booking list, empty state, and navbar badge.
   */
  function renderVault() {
    const { upcoming, history } = partitionBookings(state.bookings);

    const upcomingCountEl = document.getElementById('count-upcoming');
    const historyCountEl = document.getElementById('count-history');
    if (upcomingCountEl) upcomingCountEl.textContent = String(upcoming.length);
    if (historyCountEl) historyCountEl.textContent = String(history.length);

    const upcomingTabBtn = document.getElementById('tab-upcoming');
    const historyTabBtn = document.getElementById('tab-history');
    const isUpcoming = state.activeTab === 'upcoming';

    if (upcomingTabBtn) {
      upcomingTabBtn.classList.toggle('is-active', isUpcoming);
      upcomingTabBtn.setAttribute('aria-selected', String(isUpcoming));
    }
    if (historyTabBtn) {
      historyTabBtn.classList.toggle('is-active', !isUpcoming);
      historyTabBtn.setAttribute('aria-selected', String(!isUpcoming));
    }

    const activeItems = isUpcoming ? upcoming : history;
    const listEl = document.getElementById('bookings-list');
    const emptyEl = document.getElementById('empty-state');
    const emptyDescEl = document.getElementById('empty-description');

    if (listEl) {
      listEl.innerHTML = '';
      for (const booking of activeItems) {
        listEl.appendChild(createBookingCard(booking, isUpcoming));
      }
      listEl.hidden = activeItems.length === 0;
    }

    if (emptyEl) {
      emptyEl.hidden = activeItems.length > 0;
    }

    if (emptyDescEl) {
      emptyDescEl.textContent = isUpcoming
        ? 'Your upcoming private screenings will appear here once reserved.'
        : 'You have no past or cancelled reservations in your vault.';
    }

    T.updateNavbarState(state.bookings);
  }

  /**
   * Opens the Digital Ticket & QR modal for a given booking ID.
   * @param {string} bookingId
   */
  function openTicketModal(bookingId) {
    const booking = state.bookings.find((item) => item.id === bookingId);
    if (!booking) return;

    const modal = document.getElementById('ticket-modal');
    const ticketCard = document.getElementById('modal-ticket-card');
    if (!modal || !ticketCard) return;

    T.populateTicketCard(ticketCard, booking);
    modal.hidden = false;
    document.body.style.overflow = 'hidden';

    const closeBtn = document.getElementById('ticket-modal-close');
    if (closeBtn) closeBtn.focus();
  }

  function closeTicketModal() {
    const modal = document.getElementById('ticket-modal');
    if (modal) modal.hidden = true;
    document.body.style.overflow = '';
  }

  /**
   * Opens the cancellation confirmation modal for a given booking ID.
   * @param {string} bookingId
   */
  function openCancelModal(bookingId) {
    const booking = state.bookings.find((item) => item.id === bookingId);
    if (!booking) return;

    state.pendingCancelId = bookingId;

    const modal = document.getElementById('cancel-modal');
    const copyEl = document.getElementById('cancel-modal-copy');
    if (copyEl) {
      copyEl.textContent = `Are you sure you want to cancel reservation ${booking.id} for "${booking.movieTitle}"? This pass will be marked as CANCELLED and moved to History.`;
    }
    if (modal) {
      modal.hidden = false;
      document.body.style.overflow = 'hidden';
    }

    const keepBtn = document.getElementById('cancel-keep-btn');
    if (keepBtn) keepBtn.focus();
  }

  function closeCancelModal() {
    state.pendingCancelId = null;
    const modal = document.getElementById('cancel-modal');
    if (modal) modal.hidden = true;
    document.body.style.overflow = '';
  }

  /**
   * Marks the pending booking as CANCELLED in localStorage and refreshes the UI.
   */
  function confirmCancellation() {
    if (!state.pendingCancelId) return;

    state.bookings = state.bookings.map((booking) =>
      booking.id === state.pendingCancelId ? { ...booking, status: 'CANCELLED' } : booking
    );
    T.writeStorage(T.STORAGE_KEYS.BOOKINGS, state.bookings);

    // Keep theatron_latest_booking in sync if it matches the cancelled reservation.
    const latest = T.readStorage(T.STORAGE_KEYS.LATEST);
    if (latest && latest.id === state.pendingCancelId) {
      T.writeStorage(T.STORAGE_KEYS.LATEST, { ...latest, status: 'CANCELLED' });
    }

    closeCancelModal();
    renderVault();
  }

  function bindEvents() {
    const tabGroup = document.querySelector('.tab-toggle-group');
    if (tabGroup) {
      tabGroup.addEventListener('click', (event) => {
        const btn = event.target.closest('[data-tab]');
        if (!btn) return;
        const nextTab = btn.dataset.tab;
        if (nextTab && nextTab !== state.activeTab) {
          state.activeTab = nextTab;
          renderVault();
        }
      });
    }

    const listEl = document.getElementById('bookings-list');
    if (listEl) {
      listEl.addEventListener('click', (event) => {
        const actionBtn = event.target.closest('[data-action]');
        if (!actionBtn) return;
        const { action, id } = actionBtn.dataset;
        if (action === 'view' && id) {
          openTicketModal(id);
        } else if (action === 'cancel' && id) {
          openCancelModal(id);
        }
      });
    }

    const ticketModal = document.getElementById('ticket-modal');
    const ticketCloseBtn = document.getElementById('ticket-modal-close');
    const modalPrintBtn = document.getElementById('modal-print-btn');

    if (ticketCloseBtn) ticketCloseBtn.addEventListener('click', closeTicketModal);
    if (modalPrintBtn) modalPrintBtn.addEventListener('click', () => window.print());
    if (ticketModal) {
      ticketModal.addEventListener('click', (event) => {
        if (event.target === ticketModal) closeTicketModal();
      });
    }

    const cancelModal = document.getElementById('cancel-modal');
    const keepBtn = document.getElementById('cancel-keep-btn');
    const confirmCancelBtn = document.getElementById('cancel-confirm-btn');

    if (keepBtn) keepBtn.addEventListener('click', closeCancelModal);
    if (confirmCancelBtn) confirmCancelBtn.addEventListener('click', confirmCancellation);
    if (cancelModal) {
      cancelModal.addEventListener('click', (event) => {
        if (event.target === cancelModal) closeCancelModal();
      });
    }

    document.addEventListener('keydown', (event) => {
      if (event.key !== 'Escape') return;
      if (ticketModal && !ticketModal.hidden) closeTicketModal();
      if (cancelModal && !cancelModal.hidden) closeCancelModal();
    });
  }

  function initMyBookingsPage() {
    state.bookings = loadBookings();
    bindEvents();
    renderVault();
  }

  document.addEventListener('DOMContentLoaded', initMyBookingsPage);
})();
