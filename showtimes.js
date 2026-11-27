(() => {
  'use strict';

  const T = window.Theatron;

  const MOVIES = [
    {
      id: 'doomsday',
      title: 'DOOMSDAY: ECLIPSE PROTOCOL',
      rating: 'PG-13',
      language: 'English',
      runtime: '2H 28M',
      genre: 'Sci-Fi Thriller',
      score: '9.4',
      poster: 'posters/doomsday.jpg',
      accentTop: '#4A141D',
      accentBottom: '#120C0D',
      synopsis:
        'An estranged astrophysicist and a covert diplomatic envoy race to decode a century-old orbital signal before an artificial eclipse becomes permanent.',
    },
    {
      id: 'velvet-sovereign',
      title: 'THE VELVET SOVEREIGN',
      rating: 'R',
      language: 'English',
      runtime: '2H 14M',
      genre: 'Drama',
      score: '9.1',
      poster: 'posters/velvet-sovereign.jpg',
      accentTop: '#521822',
      accentBottom: '#120C0D',
      synopsis:
        'Inside a grand European opera house in 1928, a celebrated soprano uncovers a silent conspiracy woven through her final gala performance.',
    },
    {
      id: 'nocturne-obsidian',
      title: 'NOCTURNE IN OBSIDIAN',
      rating: 'R',
      language: 'French',
      runtime: '2H 05M',
      genre: 'Mystery',
      score: '8.9',
      poster: 'posters/nocturne-obsidian.jpg',
      accentTop: '#22263D',
      accentBottom: '#120C0D',
      synopsis:
        'A master horologist in Geneva is commissioned to repair a timepiece that counts backward through the hidden histories of its owners.',
    },
    {
      id: 'aether-ash',
      title: 'AETHER & ASH',
      rating: 'PG-13',
      language: 'English',
      runtime: '2H 19M',
      genre: 'Action',
      score: '8.8',
      poster: 'posters/aether-ash.jpg',
      accentTop: '#3E2318',
      accentBottom: '#120C0D',
      synopsis:
        'Across high-altitude desert outposts, a salvage pilot intercepts an experimental vessel carrying an impossible passenger.',
    },
    {
      id: 'crimson-solstice',
      title: 'CRIMSON SOLSTICE',
      rating: 'PG-13',
      language: 'Spanish',
      runtime: '1H 58M',
      genre: 'Romance',
      score: '8.7',
      poster: 'posters/crimson-solstice.jpg',
      accentTop: '#591B24',
      accentBottom: '#120C0D',
      synopsis:
        'Two architects restoring a coastal Andalusian estate over one summer discover competing blueprints that bring them together.',
    },
    {
      id: 'ninth-monolith',
      title: 'THE NINTH MONOLITH',
      rating: 'PG-13',
      language: 'Japanese',
      runtime: '2H 22M',
      genre: 'Sci-Fi Thriller',
      score: '9.2',
      poster: 'posters/ninth-monolith.jpg',
      accentTop: '#1B2D36',
      accentBottom: '#120C0D',
      synopsis:
        'Deep beneath the Japan Trench, a bathysphere crew uncovers a geometric monolith answering acoustic pulses from the surface.',
    },
  ];

  const CINEMAS = [
    {
      id: 'flagship',
      name: 'THEATRON Grand Flagship',
      address: '88 Sovereign Boulevard, Suite 100 • Sovereign City',
      badge: '8 Luxury Halls',
    },
    {
      id: 'elysium',
      name: 'THEATRON Elysium Palace',
      address: '420 Monarch Avenue, Royal Heights',
      badge: '6 Velvet Halls',
    },
    {
      id: 'celestial',
      name: 'THEATRON Celestial Pavilion',
      address: '15 Aurora Crest Drive, Skyline Plaza',
      badge: '10 Screening Salons',
    },
    {
      id: 'astral',
      name: 'THEATRON Astral Sanctuary',
      address: '77 Marina Promenade, Pier 4',
      badge: '5 Waterfront Halls',
    },
  ];

  const FORMATS = [
    { id: 'imax', label: 'Dual-Laser IMAX', basePrice: 36 },
    { id: 'royal-gold', label: 'Royal Gold Lounge', basePrice: 46 },
    { id: 'dolby-atmos', label: 'Dolby Atmos Suite', basePrice: 30 },
    { id: 'velvet-salon', label: 'Velvet Sovereign Salon', basePrice: 54 },
    { id: 'archival', label: '35mm Archival', basePrice: 34 },
  ];

  const state = {
    dates: [],
    showtimes: [],
    filters: {
      movieId: 'all',
      cinemaId: 'all',
      dateIso: '',
      formatId: 'all',
    },
    selectedShowtimeId: null,
  };

  /**
   * Formats a Date into canonical ticket display format (e.g. "Fri, Nov 27, 2026") and ISO key.
   * @param {Date} dateObj
   * @param {number} offset
   * @returns {{ iso: string, ticketDate: string, dayBadge: string, shortDate: string }}
   */
  function buildDateEntry(dateObj, offset) {
    const year = dateObj.getFullYear();
    const monthNum = String(dateObj.getMonth() + 1).padStart(2, '0');
    const dayNum = String(dateObj.getDate()).padStart(2, '0');
    const iso = `${year}-${monthNum}-${dayNum}`;

    const weekday = dateObj.toLocaleDateString('en-US', { weekday: 'short' });
    const month = dateObj.toLocaleDateString('en-US', { month: 'short' });
    const day = dateObj.getDate();

    const dayBadge = offset === 0 ? 'Today' : offset === 1 ? 'Tomorrow' : weekday;
    return {
      iso,
      ticketDate: `${weekday}, ${month} ${day}, ${year}`,
      dayBadge,
      shortDate: `${month} ${day}`,
      isToday: offset === 0,
    };
  }

  /**
   * Generates a 5-day exhibition window starting from the current local date.
   * @returns {Array<object>}
   */
  function generateDateWindow() {
    const base = new Date();
    base.setHours(0, 0, 0, 0);
    const list = [];
    for (let i = 0; i < 5; i += 1) {
      const next = new Date(base);
      next.setDate(base.getDate() + i);
      list.push(buildDateEntry(next, i));
    }
    return list;
  }

  /**
   * Converts HH:MM into minutes since midnight.
   * @param {string} timeStr
   * @returns {number}
   */
  function toMinutes(timeStr) {
    const [h, m] = String(timeStr || '00:00')
      .split(':')
      .map((n) => parseInt(n, 10));
    return (Number.isFinite(h) ? h : 0) * 60 + (Number.isFinite(m) ? m : 0);
  }

  /**
   * Deterministic exhibition schedule across all 5 dates, 6 films, 4 cinemas, and 5 formats.
   * Includes realistic morning/matinee/evening/late slots, plus sold-out and past slot states.
   * @param {Array<object>} dates
   * @returns {Array<object>}
   */
  function buildSchedule(dates) {
    const templates = [
      { movieId: 'doomsday', cinemaId: 'flagship', formatId: 'imax', hall: 'IMAX Laser Sanctuary 1', time: '10:30', price: 36, seatsLeft: 24 },
      { movieId: 'doomsday', cinemaId: 'flagship', formatId: 'imax', hall: 'IMAX Laser Sanctuary 1', time: '16:15', price: 38, seatsLeft: 6 },
      { movieId: 'doomsday', cinemaId: 'flagship', formatId: 'royal-gold', hall: 'Royal Gold Lounge 3', time: '20:30', price: 48, seatsLeft: 0 },
      { movieId: 'doomsday', cinemaId: 'celestial', formatId: 'imax', hall: 'Celestial IMAX Dome', time: '18:45', price: 36, seatsLeft: 14 },
      { movieId: 'doomsday', cinemaId: 'astral', formatId: 'dolby-atmos', hall: 'Marina Atmos Hall 2', time: '21:30', price: 32, seatsLeft: 19 },

      { movieId: 'velvet-sovereign', cinemaId: 'flagship', formatId: 'royal-gold', hall: 'Royal Gold Lounge 3', time: '12:00', price: 44, seatsLeft: 12 },
      { movieId: 'velvet-sovereign', cinemaId: 'flagship', formatId: 'royal-gold', hall: 'Royal Gold Lounge 3', time: '20:30', price: 46, seatsLeft: 4 },
      { movieId: 'velvet-sovereign', cinemaId: 'elysium', formatId: 'velvet-salon', hall: 'Velvet Sovereign Suite 1', time: '19:15', price: 54, seatsLeft: 0 },
      { movieId: 'velvet-sovereign', cinemaId: 'elysium', formatId: 'dolby-atmos', hall: 'Monarch Atmos Hall 4', time: '22:00', price: 30, seatsLeft: 16 },
      { movieId: 'velvet-sovereign', cinemaId: 'celestial', formatId: 'archival', hall: 'Aurora Heritage Salon 5', time: '15:30', price: 34, seatsLeft: 11 },

      { movieId: 'nocturne-obsidian', cinemaId: 'elysium', formatId: 'velvet-salon', hall: 'Velvet Sovereign Suite 2', time: '11:15', price: 52, seatsLeft: 9 },
      { movieId: 'nocturne-obsidian', cinemaId: 'elysium', formatId: 'archival', hall: 'Elysium Celluloid Room', time: '19:00', price: 34, seatsLeft: 5 },
      { movieId: 'nocturne-obsidian', cinemaId: 'flagship', formatId: 'dolby-atmos', hall: 'Sovereign Atmos Hall 5', time: '17:45', price: 30, seatsLeft: 21 },
      { movieId: 'nocturne-obsidian', cinemaId: 'astral', formatId: 'royal-gold', hall: 'Pier Gold Lounge 1', time: '21:15', price: 46, seatsLeft: 8 },

      { movieId: 'aether-ash', cinemaId: 'flagship', formatId: 'imax', hall: 'IMAX Laser Sanctuary 1', time: '13:45', price: 36, seatsLeft: 15 },
      { movieId: 'aether-ash', cinemaId: 'celestial', formatId: 'imax', hall: 'Celestial IMAX Dome', time: '20:00', price: 38, seatsLeft: 0 },
      { movieId: 'aether-ash', cinemaId: 'celestial', formatId: 'dolby-atmos', hall: 'Skyline Atmos Hall 3', time: '22:30', price: 30, seatsLeft: 26 },
      { movieId: 'aether-ash', cinemaId: 'astral', formatId: 'dolby-atmos', hall: 'Marina Atmos Hall 1', time: '16:30', price: 30, seatsLeft: 13 },

      { movieId: 'crimson-solstice', cinemaId: 'elysium', formatId: 'royal-gold', hall: 'Elysium Gold Lounge 2', time: '14:15', price: 44, seatsLeft: 17 },
      { movieId: 'crimson-solstice', cinemaId: 'astral', formatId: 'velvet-salon', hall: 'Waterfront Velvet Salon', time: '18:30', price: 54, seatsLeft: 3 },
      { movieId: 'crimson-solstice', cinemaId: 'flagship', formatId: 'dolby-atmos', hall: 'Sovereign Atmos Hall 6', time: '21:00', price: 30, seatsLeft: 22 },

      { movieId: 'ninth-monolith', cinemaId: 'celestial', formatId: 'imax', hall: 'Celestial IMAX Dome', time: '11:45', price: 36, seatsLeft: 18 },
      { movieId: 'ninth-monolith', cinemaId: 'celestial', formatId: 'archival', hall: 'Aurora Heritage Salon 5', time: '17:15', price: 36, seatsLeft: 7 },
      { movieId: 'ninth-monolith', cinemaId: 'flagship', formatId: 'imax', hall: 'IMAX Laser Sanctuary 1', time: '22:15', price: 38, seatsLeft: 11 },
      { movieId: 'ninth-monolith', cinemaId: 'astral', formatId: 'royal-gold', hall: 'Pier Gold Lounge 1', time: '19:45', price: 46, seatsLeft: 0 },
    ];

    const now = new Date();
    const currentMinutes = now.getHours() * 60 + now.getMinutes();
    const entries = [];

    dates.forEach((dateInfo, dayIdx) => {
      templates.forEach((tpl, idx) => {
        // Vary availability across subsequent days so each date feels organic
        let seatsLeft = tpl.seatsLeft;
        if (dayIdx > 0 && seatsLeft === 0 && (idx + dayIdx) % 2 === 1) {
          seatsLeft = 5 + ((idx + dayIdx) % 9);
        } else if (dayIdx > 0 && seatsLeft > 10 && (idx + dayIdx) % 7 === 0) {
          seatsLeft = 0;
        }

        const slotMinutes = toMinutes(tpl.time);
        const isPast = dateInfo.isToday && slotMinutes <= currentMinutes;
        const isSoldOut = !isPast && seatsLeft <= 0;

        entries.push({
          id: `${dateInfo.iso}_${tpl.movieId}_${tpl.cinemaId}_${tpl.time.replace(':', '')}_${idx}`,
          dateIso: dateInfo.iso,
          ticketDate: dateInfo.ticketDate,
          movieId: tpl.movieId,
          cinemaId: tpl.cinemaId,
          formatId: tpl.formatId,
          hall: tpl.hall,
          time: tpl.time,
          price: tpl.price,
          seatsLeft,
          isPast,
          isSoldOut,
        });
      });
    });

    return entries;
  }

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  function getMovieById(id) {
    return MOVIES.find((m) => m.id === id) || MOVIES[0];
  }

  function getCinemaById(id) {
    return CINEMAS.find((c) => c.id === id) || CINEMAS[0];
  }

  function getFormatById(id) {
    return FORMATS.find((f) => f.id === id) || FORMATS[0];
  }

  /**
   * Populates the Movie, Cinema, Format dropdowns and quick-filter chips.
   */
  function populateFilterControls() {
    const movieSelect = document.getElementById('filter-movie');
    const cinemaSelect = document.getElementById('filter-cinema');
    const formatSelect = document.getElementById('filter-format');
    const formatChips = document.getElementById('format-chips');

    if (movieSelect) {
      movieSelect.innerHTML = [
        '<option value="all">All Feature Films</option>',
        ...MOVIES.map(
          (m) => `<option value="${escapeHtml(m.id)}">${escapeHtml(m.title)} (${escapeHtml(m.runtime)})</option>`
        ),
      ].join('');
    }

    if (cinemaSelect) {
      cinemaSelect.innerHTML = [
        '<option value="all">All Signature Cinemas</option>',
        ...CINEMAS.map((c) => `<option value="${escapeHtml(c.id)}">${escapeHtml(c.name)}</option>`),
      ].join('');
    }

    if (formatSelect) {
      formatSelect.innerHTML = [
        '<option value="all">All Lounge Formats</option>',
        ...FORMATS.map((f) => `<option value="${escapeHtml(f.id)}">${escapeHtml(f.label)}</option>`),
      ].join('');
    }

    if (formatChips) {
      formatChips.innerHTML = [
        '<button type="button" class="format-chip is-active" data-format="all" aria-pressed="true">All Formats</button>',
        ...FORMATS.map(
          (f) =>
            `<button type="button" class="format-chip" data-format="${escapeHtml(f.id)}" aria-pressed="false">${escapeHtml(f.label)}</button>`
        ),
      ].join('');
    }
  }

  /**
   * Renders the 5-day screening date selector strip with matching counts.
   */
  function renderDateStrip() {
    const strip = document.getElementById('date-strip');
    if (!strip) return;

    strip.innerHTML = state.dates
      .map((d) => {
        const countForDate = state.showtimes.filter((slot) => {
          if (slot.dateIso !== d.iso) return false;
          if (state.filters.movieId !== 'all' && slot.movieId !== state.filters.movieId) return false;
          if (state.filters.cinemaId !== 'all' && slot.cinemaId !== state.filters.cinemaId) return false;
          if (state.filters.formatId !== 'all' && slot.formatId !== state.filters.formatId) return false;
          return true;
        }).length;

        const isActive = state.filters.dateIso === d.iso;
        return `
          <button
            type="button"
            class="date-pill${isActive ? ' is-active' : ''}"
            role="tab"
            aria-selected="${isActive ? 'true' : 'false'}"
            data-date-iso="${escapeHtml(d.iso)}"
          >
            <span class="date-pill-day">${escapeHtml(d.dayBadge)}</span>
            <span class="date-pill-label">${escapeHtml(d.shortDate)}</span>
            <span class="date-pill-count">${countForDate} ${countForDate === 1 ? 'slot' : 'slots'}</span>
          </button>
        `;
      })
      .join('');
  }

  /**
   * Applies query-string presets (e.g. ?movie=doomsday&cinema=flagship&format=imax&date=YYYY-MM-DD).
   */
  function applyQueryParams() {
    const params = new URLSearchParams(window.location.search);
    const rawMovie = (params.get('movie') || '').trim().toLowerCase();
    const rawCinema = (params.get('cinema') || '').trim().toLowerCase();
    const rawFormat = (params.get('format') || '').trim().toLowerCase();
    const rawDate = (params.get('date') || '').trim();

    if (rawMovie) {
      const matchedMovie = MOVIES.find(
        (m) => m.id.toLowerCase() === rawMovie || m.title.toLowerCase() === rawMovie
      );
      if (matchedMovie) state.filters.movieId = matchedMovie.id;
    }

    if (rawCinema) {
      const matchedCinema = CINEMAS.find(
        (c) => c.id.toLowerCase() === rawCinema || c.name.toLowerCase() === rawCinema
      );
      if (matchedCinema) state.filters.cinemaId = matchedCinema.id;
    }

    if (rawFormat) {
      const matchedFormat = FORMATS.find(
        (f) => f.id.toLowerCase() === rawFormat || f.label.toLowerCase().includes(rawFormat)
      );
      if (matchedFormat) state.filters.formatId = matchedFormat.id;
    }

    if (rawDate && state.dates.some((d) => d.iso === rawDate)) {
      state.filters.dateIso = rawDate;
    }
  }

  /**
   * Synchronizes filter UI controls with current filter state.
   */
  function syncControlsToState() {
    const movieSelect = document.getElementById('filter-movie');
    const cinemaSelect = document.getElementById('filter-cinema');
    const formatSelect = document.getElementById('filter-format');
    const resetBtn = document.getElementById('btn-reset-filters');

    if (movieSelect) movieSelect.value = state.filters.movieId;
    if (cinemaSelect) cinemaSelect.value = state.filters.cinemaId;
    if (formatSelect) formatSelect.value = state.filters.formatId;

    document.querySelectorAll('#format-chips .format-chip').forEach((chip) => {
      const active = chip.dataset.format === state.filters.formatId;
      chip.classList.toggle('is-active', active);
      chip.setAttribute('aria-pressed', String(active));
    });

    const isDefault =
      state.filters.movieId === 'all' &&
      state.filters.cinemaId === 'all' &&
      state.filters.formatId === 'all' &&
      state.filters.dateIso === state.dates[0].iso;

    if (resetBtn) {
      resetBtn.disabled = isDefault;
    }
  }

  /**
   * Filters showtimes according to active movie, cinema, date, and lounge format.
   * @returns {Array<object>}
   */
  function getFilteredShowtimes() {
    return state.showtimes.filter((slot) => {
      if (slot.dateIso !== state.filters.dateIso) return false;
      if (state.filters.movieId !== 'all' && slot.movieId !== state.filters.movieId) return false;
      if (state.filters.cinemaId !== 'all' && slot.cinemaId !== state.filters.cinemaId) return false;
      if (state.filters.formatId !== 'all' && slot.formatId !== state.filters.formatId) return false;
      return true;
    });
  }

  /**
   * Renders the filtered showtime cards grouped by Movie -> Cinema -> Slot.
   */
  function renderShowtimes() {
    renderDateStrip();
    syncControlsToState();

    const listEl = document.getElementById('showtimes-list');
    const emptyEl = document.getElementById('empty-state');
    const countEl = document.getElementById('results-count');
    const emptyDescEl = document.getElementById('empty-description');
    if (!listEl || !emptyEl || !countEl) return;

    const filtered = getFilteredShowtimes();

    if (filtered.length === 0) {
      listEl.innerHTML = '';
      emptyEl.hidden = false;
      countEl.innerHTML = 'Showing <strong>0</strong> screenings';

      if (emptyDescEl) {
        const activeDate = state.dates.find((d) => d.iso === state.filters.dateIso);
        const dateLabel = activeDate ? activeDate.ticketDate : 'the selected date';
        emptyDescEl.textContent = `No screenings are scheduled on ${dateLabel} for the current film, cinema, and lounge format filters.`;
      }
      return;
    }

    emptyEl.hidden = true;

    // Group slots by movie order, then by cinema order
    const movieBuckets = new Map();
    for (const slot of filtered) {
      if (!movieBuckets.has(slot.movieId)) {
        movieBuckets.set(slot.movieId, new Map());
      }
      const cinemaMap = movieBuckets.get(slot.movieId);
      if (!cinemaMap.has(slot.cinemaId)) {
        cinemaMap.set(slot.cinemaId, []);
      }
      cinemaMap.get(slot.cinemaId).push(slot);
    }

    const activeDateObj = state.dates.find((d) => d.iso === state.filters.dateIso);
    const activeDateText = activeDateObj ? activeDateObj.ticketDate : '';

    countEl.innerHTML = `Showing <strong>${filtered.length}</strong> ${
      filtered.length === 1 ? 'screening' : 'screenings'
    } across <strong>${movieBuckets.size}</strong> ${
      movieBuckets.size === 1 ? 'film' : 'films'
    } &bull; ${escapeHtml(activeDateText)}`;

    const html = Array.from(movieBuckets.entries())
      .map(([movieId, cinemaMap]) => {
        const movie = getMovieById(movieId);
        const fallbackPoster = T.createPosterPlaceholder(
          movie.title,
          movie.accentTop,
          movie.accentBottom
        );

        const cinemaBlocksHtml = Array.from(cinemaMap.entries())
          .map(([cinemaId, slots]) => {
            const cinema = getCinemaById(cinemaId);
            const sortedSlots = [...slots].sort((a, b) => toMinutes(a.time) - toMinutes(b.time));
            const openCount = sortedSlots.filter((s) => !s.isPast && !s.isSoldOut).length;

            const slotsHtml = sortedSlots
              .map((slot) => {
                const format = getFormatById(slot.formatId);
                const isDisabled = slot.isPast || slot.isSoldOut;
                const isSelected = !isDisabled && state.selectedShowtimeId === slot.id;

                let statusClass = 'status-available';
                let statusText = `${slot.seatsLeft} seats`;
                let slotModifierClass = '';
                let ctaLabel = 'Select Seats &rarr;';

                if (slot.isPast) {
                  statusClass = 'status-past';
                  statusText = 'Past';
                  slotModifierClass = ' is-past is-disabled';
                  ctaLabel = 'Screening Ended';
                } else if (slot.isSoldOut) {
                  statusClass = 'status-soldout';
                  statusText = 'Sold Out';
                  slotModifierClass = ' is-sold-out is-disabled';
                  ctaLabel = 'Waitlist Closed';
                } else if (slot.seatsLeft <= 6) {
                  statusClass = 'status-limited';
                  statusText = `Only ${slot.seatsLeft} left`;
                }

                return `
                  <button
                    type="button"
                    class="showtime-slot${slotModifierClass}${isSelected ? ' is-selected' : ''}"
                    data-slot-id="${escapeHtml(slot.id)}"
                    ${isDisabled ? 'disabled aria-disabled="true"' : ''}
                    aria-label="${escapeHtml(movie.title)} at ${escapeHtml(cinema.name)}, ${escapeHtml(slot.time)} in ${escapeHtml(slot.hall)} (${escapeHtml(format.label)}), $${slot.price.toFixed(2)}, ${statusText}"
                  >
                    <div class="slot-top">
                      <span class="slot-time">${escapeHtml(slot.time)}</span>
                      <span class="slot-status-pill ${statusClass}">${escapeHtml(statusText)}</span>
                    </div>
                    <div class="slot-hall-block">
                      <span class="slot-hall-name">${escapeHtml(slot.hall)}</span>
                      <span class="slot-format-name">${escapeHtml(format.label)}</span>
                    </div>
                    <div class="slot-bottom">
                      <span class="slot-price">$${slot.price.toFixed(2)} <span class="slot-price-unit">/ seat</span></span>
                      <span class="slot-cta">${ctaLabel}</span>
                    </div>
                  </button>
                `;
              })
              .join('');

            return `
              <div class="cinema-group">
                <div class="cinema-group-header">
                  <div>
                    <h3 class="cinema-name">${escapeHtml(cinema.name)}</h3>
                    <p class="cinema-address">${escapeHtml(cinema.address)}</p>
                  </div>
                  <span class="cinema-slots-badge">${openCount} ${openCount === 1 ? 'Open Slot' : 'Open Slots'}</span>
                </div>
                <div class="slots-grid">
                  ${slotsHtml}
                </div>
              </div>
            `;
          })
          .join('');

        return `
          <article class="movie-showtime-card" data-movie-id="${escapeHtml(movie.id)}">
            <aside class="movie-aside">
              <div class="movie-poster-wrap">
                <img
                  src="${escapeHtml(movie.poster)}"
                  alt="${escapeHtml(movie.title)} poster"
                  loading="lazy"
                  data-fallback-poster="${escapeHtml(fallbackPoster)}"
                />
                <span class="poster-score-badge">&#9733; ${escapeHtml(movie.score)}</span>
              </div>
              <div class="movie-meta-badges">
                <span class="meta-pill">${escapeHtml(movie.rating)}</span>
                <span class="meta-pill">${escapeHtml(movie.language)}</span>
                <span class="meta-pill">${escapeHtml(movie.runtime)}</span>
              </div>
              <h2 class="movie-card-title">${escapeHtml(movie.title)}</h2>
              <p class="movie-card-genre">${escapeHtml(movie.genre)}</p>
              <p class="movie-card-synopsis">${escapeHtml(movie.synopsis)}</p>
              <a href="movie-details.html?id=${encodeURIComponent(movie.id)}" class="movie-details-link">
                Film Details &amp; Cast &rarr;
              </a>
            </aside>

            <div class="cinema-groups-col">
              ${cinemaBlocksHtml}
            </div>
          </article>
        `;
      })
      .join('');

    listEl.innerHTML = html;

    // Attach poster fallback using window.Theatron.createPosterPlaceholder if any asset fails to load
    listEl.querySelectorAll('img[data-fallback-poster]').forEach((img) => {
      img.addEventListener(
        'error',
        () => {
          const fallback = img.getAttribute('data-fallback-poster');
          if (fallback && img.src !== fallback) {
            img.src = fallback;
          }
        },
        { once: true }
      );
    });
  }

  /**
   * Saves the chosen showtime payload into theatron_latest_booking and navigates to seat-selection.html.
   * @param {string} slotId
   */
  function selectShowtimeAndProceed(slotId) {
    const slot = state.showtimes.find((s) => s.id === slotId);
    if (!slot || slot.isPast || slot.isSoldOut) return;

    const movie = getMovieById(slot.movieId);
    const cinema = getCinemaById(slot.cinemaId);
    const format = getFormatById(slot.formatId);
    const currentUser = T.getCurrentUser();
    const patronName =
      (currentUser && currentUser.name) || T.DEFAULT_BOOKING.patron;

    const latestBookingDraft = {
      showtimeId: slot.id,
      movieId: movie.id,
      movieTitle: movie.title,
      poster: movie.poster || T.createPosterPlaceholder(movie.title, movie.accentTop, movie.accentBottom),
      posterFallback: T.createPosterPlaceholder(movie.title, movie.accentTop, movie.accentBottom),
      cinemaId: cinema.id,
      cinema: cinema.name,
      cinemaAddress: cinema.address,
      hall: slot.hall,
      formatId: format.id,
      format: format.label,
      dateIso: slot.dateIso,
      date: slot.ticketDate,
      time: slot.time,
      pricePerSeat: slot.price,
      rating: movie.rating,
      runtime: movie.runtime,
      language: movie.language,
      seats: [],
      patron: patronName,
      timestamp: new Date().toISOString(),
    };

    state.selectedShowtimeId = slot.id;
    T.writeStorage(T.STORAGE_KEYS.LATEST, latestBookingDraft);
    window.location.href = 'seat-selection.html';
  }

  /**
   * Resets all filters to default values and re-renders.
   */
  function resetAllFilters() {
    state.filters.movieId = 'all';
    state.filters.cinemaId = 'all';
    state.filters.formatId = 'all';
    state.filters.dateIso = state.dates[0].iso;
    renderShowtimes();
  }

  /**
   * Binds DOM event listeners for filters, date pills, reset buttons, and showtime cards.
   */
  function bindEvents() {
    const movieSelect = document.getElementById('filter-movie');
    const cinemaSelect = document.getElementById('filter-cinema');
    const formatSelect = document.getElementById('filter-format');
    const formatChips = document.getElementById('format-chips');
    const dateStrip = document.getElementById('date-strip');
    const resetBtn = document.getElementById('btn-reset-filters');
    const emptyResetBtn = document.getElementById('btn-empty-reset');
    const showtimesList = document.getElementById('showtimes-list');

    if (movieSelect) {
      movieSelect.addEventListener('change', () => {
        state.filters.movieId = movieSelect.value;
        renderShowtimes();
      });
    }

    if (cinemaSelect) {
      cinemaSelect.addEventListener('change', () => {
        state.filters.cinemaId = cinemaSelect.value;
        renderShowtimes();
      });
    }

    if (formatSelect) {
      formatSelect.addEventListener('change', () => {
        state.filters.formatId = formatSelect.value;
        renderShowtimes();
      });
    }

    if (formatChips) {
      formatChips.addEventListener('click', (event) => {
        const chip = event.target.closest('.format-chip');
        if (!chip) return;
        state.filters.formatId = chip.dataset.format || 'all';
        renderShowtimes();
      });
    }

    if (dateStrip) {
      dateStrip.addEventListener('click', (event) => {
        const pill = event.target.closest('.date-pill');
        if (!pill || !pill.dataset.dateIso) return;
        state.filters.dateIso = pill.dataset.dateIso;
        renderShowtimes();
      });
    }

    if (resetBtn) {
      resetBtn.addEventListener('click', resetAllFilters);
    }

    if (emptyResetBtn) {
      emptyResetBtn.addEventListener('click', resetAllFilters);
    }

    if (showtimesList) {
      showtimesList.addEventListener('click', (event) => {
        const slotBtn = event.target.closest('.showtime-slot');
        if (!slotBtn || slotBtn.disabled) return;
        const slotId = slotBtn.getAttribute('data-slot-id');
        if (slotId) {
          selectShowtimeAndProceed(slotId);
        }
      });
    }
  }

  /**
   * Initializes navbar state, schedule data, URL presets, and showtimes grid.
   */
  function initShowtimesPage() {
    const storedBookings = T.readStorage(T.STORAGE_KEYS.BOOKINGS);
    const bookings = Array.isArray(storedBookings) ? storedBookings : [];
    T.updateNavbarState(bookings);

    const latestBooking = T.readStorage(T.STORAGE_KEYS.LATEST);
    if (latestBooking && typeof latestBooking === 'object' && latestBooking.showtimeId) {
      state.selectedShowtimeId = latestBooking.showtimeId;
    }

    state.dates = generateDateWindow();
    state.filters.dateIso = state.dates[0].iso;
    state.showtimes = buildSchedule(state.dates);

    populateFilterControls();
    applyQueryParams();
    bindEvents();
    renderShowtimes();
  }

  document.addEventListener('DOMContentLoaded', initShowtimesPage);
})();
