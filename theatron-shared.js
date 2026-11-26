(() => {
  'use strict';

  const STORAGE_KEYS = {
    LATEST: 'theatron_latest_booking',
    BOOKINGS: 'theatron_bookings',
    USERS: 'theatron_users',
    CURRENT_USER: 'theatron_current_user',
  };

  const DEFAULT_BOOKING = {
    movieTitle: 'THE VELVET SOVEREIGN',
    cinema: 'THEATRON Grand Flagship',
    hall: 'Royal Gold Lounge 3',
    date: 'Tue, Nov 24, 2026',
    time: '20:30',
    seats: ['G5', 'G6'],
    totalPaid: '$106.82',
    patron: 'Alexander Vance',
    dining: "1x The Sovereign Couple's Duet",
  };

  /**
   * Generates a crisp bespoke SVG poster placeholder so thumbnails never break offline.
   * @param {string} title
   * @param {string} [accentTop]
   * @param {string} [accentBottom]
   * @returns {string}
   */
  function createPosterPlaceholder(title, accentTop = '#4A141D', accentBottom = '#120C0D') {
    const safeTitle = String(title || 'THEATRON')
      .replace(/[<>&"']/g, '')
      .toUpperCase();
    const words = safeTitle.split(/\s+/).filter(Boolean);
    const lines = [];
    let current = '';
    for (const word of words) {
      if ((current + ' ' + word).trim().length <= 13) {
        current = (current + ' ' + word).trim();
      } else {
        if (current) lines.push(current);
        current = word;
      }
    }
    if (current) lines.push(current);

    const startY = 205 - (lines.length - 1) * 14;
    const textEls = lines
      .slice(0, 4)
      .map(
        (line, idx) =>
          `<text x="150" y="${startY + idx * 28}" fill="#FAF5F0" font-family="Georgia,serif" font-size="20" font-weight="bold" text-anchor="middle" letter-spacing="3">${line}</text>`
      )
      .join('');

    const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 450"><defs><linearGradient id="bg" x1="0" y1="0" x2="0.85" y2="1"><stop offset="0%" stop-color="${accentTop}"/><stop offset="100%" stop-color="${accentBottom}"/></linearGradient></defs><rect width="300" height="450" fill="url(#bg)"/><rect x="14" y="14" width="272" height="422" fill="none" stroke="#E2B45A" stroke-opacity="0.48" stroke-width="1.5"/><circle cx="150" cy="112" r="28" fill="none" stroke="#E2B45A" stroke-opacity="0.55" stroke-width="1.2"/><path d="M138 112L150 96L162 112L150 128Z" fill="#E2B45A" fill-opacity="0.28" stroke="#E2B45A" stroke-width="1.2"/>${textEls}<line x1="95" y1="305" x2="205" y2="305" stroke="#E2B45A" stroke-opacity="0.45" stroke-width="1"/><text x="150" y="330" fill="#E2B45A" font-family="sans-serif" font-size="10" font-weight="600" text-anchor="middle" letter-spacing="4">THEATRON LOUNGES</text></svg>`;
    return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
  }

  /**
   * Safely parses JSON from localStorage.
   * @param {string} key
   * @returns {any}
   */
  function readStorage(key) {
    try {
      const raw = localStorage.getItem(key);
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Safely serializes JSON to localStorage.
   * @param {string} key
   * @param {any} value
   */
  function writeStorage(key, value) {
    try {
      localStorage.setItem(key, JSON.stringify(value));
    } catch {
      // Gracefully ignore private-mode or quota errors.
    }
  }

  /**
   * Generates a unique THT-XXXXXX reference that does not collide with existing bookings.
   * @param {Array<object>} existingBookings
   * @returns {string}
   */
  function generateBookingId(existingBookings = []) {
    const usedIds = new Set(existingBookings.map((item) => item && item.id).filter(Boolean));
    let candidate = '';
    do {
      const num = Math.floor(100000 + Math.random() * 900000);
      candidate = `THT-${num}`;
    } while (usedIds.has(candidate));
    return candidate;
  }

  /**
   * Normalizes seat representations (array or comma string) into an array of seat labels.
   * @param {string|Array<string>} rawSeats
   * @returns {Array<string>}
   */
  function normalizeSeats(rawSeats) {
    if (Array.isArray(rawSeats) && rawSeats.length > 0) {
      return rawSeats.map((s) => String(s).trim()).filter(Boolean);
    }
    if (typeof rawSeats === 'string' && rawSeats.trim()) {
      return rawSeats
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    return [...DEFAULT_BOOKING.seats];
  }

  /**
   * Formats totalPaid as currency string while preserving pre-formatted values.
   * @param {number|string} rawTotal
   * @returns {string}
   */
  function formatTotalPaid(rawTotal) {
    if (typeof rawTotal === 'number' && Number.isFinite(rawTotal)) {
      return `$${rawTotal.toFixed(2)}`;
    }
    if (typeof rawTotal === 'string' && rawTotal.trim()) {
      const trimmed = rawTotal.trim();
      if (/^\d+(\.\d+)?$/.test(trimmed)) {
        return `$${Number(trimmed).toFixed(2)}`;
      }
      return trimmed.replace(/\s*\(Confirmed\)$/i, '');
    }
    return DEFAULT_BOOKING.totalPaid;
  }

  /**
   * Normalizes optional dining/add-on data into a readable string.
   * @param {object} raw
   * @param {boolean} fallbackDefault
   * @returns {string}
   */
  function normalizeDining(raw, fallbackDefault = false) {
    const candidate = raw.dining ?? raw.inSeatDining ?? raw.addOn ?? raw.addOns;
    if (candidate === null || candidate === '') return '';
    if (Array.isArray(candidate)) {
      return candidate.filter(Boolean).join(', ');
    }
    if (typeof candidate === 'string') {
      return candidate.trim();
    }
    return fallbackDefault ? DEFAULT_BOOKING.dining : '';
  }

  /**
   * Normalizes a booking object from any upstream checkout/storage shape into canonical fields.
   * @param {object} raw
   * @param {{ existingBookings?: Array<object>, useDefaultDining?: boolean }} [options]
   * @returns {object}
   */
  function normalizeBooking(raw = {}, options = {}) {
    const existingBookings = options.existingBookings || [];
    const movieTitle = String(
      raw.movieTitle || raw.title || raw.movie || DEFAULT_BOOKING.movieTitle
    ).trim();

    const id =
      String(raw.id || raw.bookingId || raw.reference || '').trim() ||
      generateBookingId(existingBookings);

    const status = String(raw.status || 'CONFIRMED').trim().toUpperCase();

    return {
      id,
      movieTitle,
      poster: raw.poster || raw.posterUrl || createPosterPlaceholder(movieTitle),
      cinema: String(raw.cinema || raw.cinemaLounge || raw.theater || DEFAULT_BOOKING.cinema).trim(),
      hall: String(raw.hall || raw.auditorium || raw.screen || DEFAULT_BOOKING.hall).trim(),
      date: String(raw.date || raw.showDate || DEFAULT_BOOKING.date).trim(),
      time: String(raw.time || raw.showTime || DEFAULT_BOOKING.time).trim(),
      seats: normalizeSeats(raw.seats),
      totalPaid: formatTotalPaid(raw.totalPaid ?? raw.total ?? raw.amount),
      patron: String(
        raw.patron || raw.customerName || raw.guestName || raw.name || DEFAULT_BOOKING.patron
      ).trim(),
      dining: normalizeDining(raw, Boolean(options.useDefaultDining)),
      status,
      timestamp: raw.timestamp || new Date().toISOString(),
    };
  }

  /**
   * Computes deterministic 32-bit FNV-1a hash from a string.
   * @param {string} str
   * @returns {number}
   */
  function fnv1aHash(str) {
    let h = 0x811c9dc5;
    for (let i = 0; i < str.length; i += 1) {
      h ^= str.charCodeAt(i);
      h = Math.imul(h, 0x01000193);
    }
    return h >>> 0;
  }

  /**
   * Renders a crisp deterministic 25x25 QR-style SVG pattern seeded by booking payload.
   * @param {HTMLElement} container
   * @param {string} payload
   */
  function renderQrSvg(container, payload) {
    const size = 25;
    const matrix = Array.from({ length: size }, () => Array(size).fill(null));

    const placeFinder = (rowOffset, colOffset) => {
      for (let r = -1; r <= 7; r += 1) {
        for (let c = -1; c <= 7; c += 1) {
          const rr = rowOffset + r;
          const cc = colOffset + c;
          if (rr < 0 || rr >= size || cc < 0 || cc >= size) continue;
          const isOuterRing = r === 0 || r === 6 || c === 0 || c === 6;
          const isInnerCore = r >= 2 && r <= 4 && c >= 2 && c <= 4;
          const isSeparator = r === -1 || r === 7 || c === -1 || c === 7;
          matrix[rr][cc] = !isSeparator && (isOuterRing || isInnerCore);
        }
      }
    };

    placeFinder(0, 0);
    placeFinder(0, size - 7);
    placeFinder(size - 7, 0);

    for (let r = -2; r <= 2; r += 1) {
      for (let c = -2; c <= 2; c += 1) {
        const isEdge = Math.abs(r) === 2 || Math.abs(c) === 2;
        const isCenter = r === 0 && c === 0;
        matrix[18 + r][18 + c] = isEdge || isCenter;
      }
    }

    for (let i = 8; i < size - 8; i += 1) {
      if (matrix[6][i] === null) matrix[6][i] = i % 2 === 0;
      if (matrix[i][6] === null) matrix[i][6] = i % 2 === 0;
    }

    let state = fnv1aHash(payload) || 1;
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (matrix[r][c] !== null) continue;
        state ^= state << 13;
        state ^= state >>> 17;
        state ^= state << 5;
        matrix[r][c] = ((state >>> 0) % 100) < 48;
      }
    }

    const rects = [];
    for (let r = 0; r < size; r += 1) {
      for (let c = 0; c < size; c += 1) {
        if (matrix[r][c]) {
          rects.push(`<rect x="${c}" y="${r}" width="1" height="1" rx="0.12" />`);
        }
      }
    }

    container.innerHTML = `
      <svg viewBox="0 0 ${size} ${size}" xmlns="http://www.w3.org/2000/svg" role="img" aria-label="Digital Ticket QR Code">
        <g fill="#120C0D">
          ${rects.join('')}
        </g>
      </svg>
    `;
  }

  /**
   * Populates a .ticket-card container using data-ticket-field attributes and renders its QR code.
   * @param {HTMLElement} cardEl
   * @param {object} booking
   */
  function populateTicketCard(cardEl, booking) {
    if (!cardEl || !booking) return;

    const setField = (field, text) => {
      const el = cardEl.querySelector(`[data-ticket-field="${field}"]`);
      if (el) el.textContent = text;
    };

    const statusLabel = booking.status === 'CANCELLED' ? 'Cancelled' : booking.status === 'COMPLETED' ? 'Completed' : 'Confirmed';

    setField('headerId', `ID: ${booking.id}`);
    setField('movieTitle', booking.movieTitle);
    setField('cinema', booking.cinema);
    setField('hall', booking.hall);
    setField('datetime', `${booking.date} \u2022 ${booking.time}`);
    setField('seats', Array.isArray(booking.seats) ? booking.seats.join(', ') : String(booking.seats || ''));
    setField('settlement', `${booking.totalPaid} (${statusLabel})`);
    setField('patron', booking.patron);
    setField('stubId', booking.id);

    const addonRow = cardEl.querySelector('[data-ticket-addon-row]');
    if (addonRow) {
      if (booking.dining) {
        setField('dining', booking.dining);
        addonRow.hidden = false;
      } else {
        addonRow.hidden = true;
      }
    }

    const qrContainer = cardEl.querySelector('[data-ticket-qr]');
    if (qrContainer) {
      const qrPayload = [
        booking.id,
        booking.movieTitle,
        booking.cinema,
        booking.hall,
        booking.date,
        booking.time,
        Array.isArray(booking.seats) ? booking.seats.join(',') : booking.seats,
      ].join('|');
      renderQrSvg(qrContainer, qrPayload);
    }
  }

  /**
   * Returns 2-letter initials from a patron name.
   * @param {string} name
   * @returns {string}
   */
  function getInitials(name) {
    const parts = String(name || 'AV')
      .trim()
      .split(/\s+/)
      .filter(Boolean);
    if (parts.length === 0) return 'AV';
    if (parts.length === 1) return parts[0].slice(0, 2).toUpperCase();
    return `${parts[0][0]}${parts[parts.length - 1][0]}`.toUpperCase();
  }

  /**
   * Counts active upcoming (CONFIRMED) bookings for the navbar Tickets badge.
   * @param {Array<object>} bookings
   * @returns {number}
   */
  function getActiveTicketsCount(bookings) {
    return (Array.isArray(bookings) ? bookings : []).filter(
      (b) => b && String(b.status || 'CONFIRMED').toUpperCase() === 'CONFIRMED'
    ).length;
  }

  /**
   * Returns the active signed-in member from localStorage or sessionStorage.
   * @returns {object|null}
   */
  function getCurrentUser() {
    const localUser = readStorage(STORAGE_KEYS.CURRENT_USER);
    if (localUser && typeof localUser === 'object') return localUser;
    try {
      const sessionRaw = sessionStorage.getItem(STORAGE_KEYS.CURRENT_USER);
      return sessionRaw ? JSON.parse(sessionRaw) : null;
    } catch {
      return null;
    }
  }

  /**
   * Synchronizes the shared navbar Tickets badge and Patron profile pill.
   * @param {Array<object>} bookings
   * @param {string} [preferredPatron]
   * @param {{ fallbackLabel?: string, fallbackInitials?: string }} [options]
   */
  function updateNavbarState(bookings, preferredPatron, options = {}) {
    const countEl = document.getElementById('nav-tickets-count');
    if (countEl) {
      countEl.textContent = String(getActiveTicketsCount(bookings));
    }

    const currentUser = getCurrentUser();
    const patron =
      (currentUser && currentUser.name) ||
      preferredPatron ||
      (Array.isArray(bookings) && bookings[0] && bookings[0].patron) ||
      options.fallbackLabel ||
      DEFAULT_BOOKING.patron;

    const initials =
      patron === options.fallbackLabel && options.fallbackInitials
        ? options.fallbackInitials
        : getInitials(patron);

    const nameEl = document.getElementById('nav-patron-name');
    const initialsEl = document.getElementById('nav-patron-initials');
    if (nameEl) nameEl.textContent = patron;
    if (initialsEl) initialsEl.textContent = initials;
  }

  window.Theatron = {
    STORAGE_KEYS,
    DEFAULT_BOOKING,
    createPosterPlaceholder,
    readStorage,
    writeStorage,
    getCurrentUser,
    generateBookingId,
    normalizeBooking,
    renderQrSvg,
    populateTicketCard,
    getInitials,
    getActiveTicketsCount,
    updateNavbarState,
  };
})();
