const runway = document.querySelector('.hero-runway');
const lcd = document.querySelector('#lcd-frame');
const heroHead = document.querySelector('#hero-head');
const trailerVideo = document.querySelector('#hero-trailer-video');
const pauseToggle = document.querySelector('#trailer-play-btn');
const muteToggle = document.querySelector('#trailer-mute-btn');
if (runway && lcd && heroHead && trailerVideo && pauseToggle && muteToggle) {
  let scrollQueued = false;
  let manuallyPaused = false;
  let pausedByScroll = false;

  function syncPlaybackButton() {
    pauseToggle.innerHTML = trailerVideo.paused ? '▶ <span>Play</span>' : '⏸ <span>Pause</span>';
  }

  function playTrailer() {
    trailerVideo.play().catch(error => {
      if (error.name === 'AbortError') return;
      console.error('Unable to play the trailer.', error);
      showToast('Trailer playback is unavailable');
    });
  }

  function updateHeroProgress() {
    const distance = runway.offsetHeight - window.innerHeight;
    const scrollProgress = Math.max(0, Math.min(1, (window.scrollY - runway.offsetTop) / distance));
    const scale = 1 - scrollProgress * 0.28;
    const shift = scrollProgress * -60;
    lcd.style.transform = `scale(${scale}) translateY(${shift}px)`;
    lcd.style.opacity = String(1 - scrollProgress);
    lcd.style.filter = `blur(${scrollProgress * 6}px)`;
    heroHead.style.opacity = String(1 - scrollProgress * 0.82);
    heroHead.style.transform = `translateY(${-scrollProgress * 24}px)`;
    if (scrollProgress >= 0.85) {
      if (!manuallyPaused) {
        pausedByScroll = true;
        if (!trailerVideo.paused) trailerVideo.pause();
      }
    } else if (scrollProgress < 0.85 && pausedByScroll && !manuallyPaused) {
      pausedByScroll = false;
      playTrailer();
    }
    scrollQueued = false;
  }

  window.addEventListener('scroll', () => {
    if (!scrollQueued) {
      scrollQueued = true;
      requestAnimationFrame(updateHeroProgress);
    }
  }, { passive: true });
  updateHeroProgress();

  trailerVideo.addEventListener('play', syncPlaybackButton);
  trailerVideo.addEventListener('pause', syncPlaybackButton);
  syncPlaybackButton();
  pauseToggle.addEventListener('click', () => {
    if (trailerVideo.paused) {
      manuallyPaused = false;
      pausedByScroll = false;
      playTrailer();
    } else {
      manuallyPaused = true;
      pausedByScroll = false;
      trailerVideo.pause();
    }
  });
  muteToggle.addEventListener('click', () => {
    trailerVideo.muted = !trailerVideo.muted;
    muteToggle.innerHTML = trailerVideo.muted ? '🔇 <span>Muted</span>' : '🔊 <span>Unmuted</span>';
  });
}

const sitemap = document.querySelector('.sitemap');
const sitemapTrigger = document.querySelector('.sitemap-trigger');
if (sitemap && sitemapTrigger) {
  sitemapTrigger.addEventListener('click', () => sitemap.classList.toggle('open'));
  document.addEventListener('click', event => {
    if (!sitemap.contains(event.target)) sitemap.classList.remove('open');
  });
}

const searchInput = document.querySelector('#film-search');
if (searchInput) {
  searchInput.addEventListener('input', () => {
    const term = searchInput.value.trim().toLowerCase();
    document.querySelectorAll('.movie-card[data-search]').forEach(card => {
      card.style.display = card.dataset.search.includes(term) ? '' : 'none';
    });
  });
  const findShowtimes = document.querySelector('#find-showtimes');
  if (findShowtimes) {
    findShowtimes.addEventListener('click', () => {
      document.querySelector('#movies').scrollIntoView({ behavior: 'smooth' });
      showToast('Showtimes updated for your selected lounge');
    });
  }
}

const revealObserver = new IntersectionObserver(entries => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('visible');
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => revealObserver.observe(el));

document.addEventListener('click', event => {
  if (!(event.target instanceof Element)) return;
  const button = event.target.closest('.reminder');
  if (!button) return;
  const isSet = button.classList.toggle('set');
  button.textContent = isSet ? '✓ Reminder Set' : 'Notify Me';
  showToast(isSet ? 'Premiere reminder has been set' : 'Premiere reminder has been removed');
});

const copyGoldButton = document.querySelector('#copy-gold');
if (copyGoldButton) {
  copyGoldButton.addEventListener('click', async () => {
    try { await navigator.clipboard.writeText('GOLD15'); } catch (_) {}
    showToast('GOLD15 copied — 15% lounge privilege unlocked');
  });
}

const modalBackdrop = document.querySelector('#modal-backdrop');
const modalContent = document.querySelector('#modal-content');

const MOVIES_DATA = [
  {
    id:'doomsday', title:'DOOMSDAY: ECLIPSE PROTOCOL', status:'Currently Showing', poster:'posters/doomsday.jpg',
    rating:'PG-13', language:'English', score:'9.4', genre:'Sci-Fi Thriller', runtime:'2H 28M',
    synopsis:'When an orbital solar array detects an artificial gravitational anomaly approachin...',
    fullSynopsis:'When an orbital solar array detects an artificial gravitational anomaly approaching Earth, an estranged astrophysicist and a covert diplomatic envoy must decode a century-old signal before the eclipse becomes permanent.',
    releaseDate:'Now Exhibiting', director:'Mara Voss', cast:['Elias Ward', 'Nadia Vale', 'Tomas Reed', 'Sera Quinn'],
    format:'Dual-Laser IMAX • Dolby Atmos', trailerVideo:'trailers/doomsday.mp4', isComingSoon:false
  },
  {
    id:'velvet-sovereign', title:'THE VELVET SOVEREIGN', status:'Currently Showing', poster:'posters/velvet-sovereign.jpg',
    rating:'R', language:'English', score:'9.1', genre:'Drama', runtime:'2H 14M',
    synopsis:'Inside a grand European opera house in 1928, a celebrated soprano uncovers a sile...',
    fullSynopsis:'Inside a grand European opera house in 1928, a celebrated soprano uncovers a silent conspiracy woven through her final performance.',
    releaseDate:'Now Exhibiting', director:'Lucien Moreau', cast:['Isla Maren', 'Julian Cross', 'Celine Duvall', 'Hugo Bell'],
    format:'Dolby Atmos • 2.39:1', trailerVideo:'trailers/velvet-sovereign.mp4', isComingSoon:false
  },
  {
    id:'nocturne-obsidian', title:'NOCTURNE IN OBSIDIAN', status:'Currently Showing', poster:'posters/nocturne-obsidian.jpg',
    rating:'R', language:'French', score:'8.9', genre:'Mystery', runtime:'2H 05M',
    synopsis:'A master horologist in Geneva is commissioned to repair a timepiece...',
    fullSynopsis:'A master horologist in Geneva is commissioned to repair a timepiece that appears to count backward through the lives of its owners.',
    releaseDate:'Now Exhibiting', director:'Etienne Ravel', cast:['Camille Laurent', 'Theo Marchand', 'Elise Perrin', 'Marc Delaunay'],
    format:'Dolby Atmos • 35mm Presentation', trailerVideo:'trailers/nocturne-obsidian.mp4', isComingSoon:false
  },
  {
    id:'aether-ash', title:'AETHER & ASH', status:'Currently Showing', poster:'posters/aether-ash.jpg',
    rating:'PG-13', language:'English', score:'8.8', genre:'Action', runtime:'2H 19M',
    synopsis:'Across high-altitude desert outposts, a salvage pilot intercepts an experimental...',
    fullSynopsis:'Across high-altitude desert outposts, a salvage pilot intercepts an experimental vessel carrying an impossible passenger.',
    releaseDate:'Now Exhibiting', director:'Sana Okafor', cast:['Darius Cole', 'Mina Sol', 'Jace Okoro', 'Leena Voss'],
    format:'Dual-Laser IMAX • Dolby Atmos', trailerVideo:'trailers/aether-ash.mp4', isComingSoon:false
  },
  {
    id:'crimson-solstice', title:'CRIMSON SOLSTICE', status:'Currently Showing', poster:'posters/crimson-solstice.jpg',
    rating:'PG-13', language:'Spanish', score:'8.7', genre:'Romance', runtime:'1H 58M',
    synopsis:'Two architects restoring a coastal Andalusian estate over one summer...',
    fullSynopsis:'Two architects restoring a coastal Andalusian estate over one summer discover that their opposing visions for the old house may have more in common than they expected.',
    releaseDate:'Now Exhibiting', director:'Elena Marquez', cast:['Lucia Ferrer', 'Mateo Rios', 'Ines Duarte', 'Rafael Costa'],
    format:'Dolby Atmos • 2.39:1', trailerVideo:'trailers/crimson-solstice.mp4', isComingSoon:false
  },
  {
    id:'ninth-monolith', title:'THE NINTH MONOLITH', status:'Currently Showing', poster:'posters/ninth-monolith.jpg',
    rating:'PG-13', language:'Japanese', score:'9.2', genre:'Sci-Fi Thriller', runtime:'2H 22M',
    synopsis:'Deep beneath the Japan Trench, a bathysphere crew discovers a geometric...',
    fullSynopsis:'Deep beneath the Japan Trench, a bathysphere crew discovers a geometric structure that appears to answer every signal sent from the surface.',
    releaseDate:'Now Exhibiting', director:'Kenji Arata', cast:['Ren Sato', 'Aiko Mori', 'Yuki Tanaka', 'Daichi Kuroda'],
    format:'Dual-Laser IMAX • Dolby Atmos', trailerVideo:'trailers/ninth-monolith.mp4', isComingSoon:false
  },
  {
    id:'dynasty-glass', title:'DYNASTY OF GLASS', status:'Coming Soon', poster:'posters/dynasty-glass.jpg',
    rating:'R', language:'English', score:'9.0', genre:'Drama', runtime:'2H 35M',
    synopsis:'An architectural dynasty fractures over succession rights when their flagship...',
    fullSynopsis:'An architectural dynasty fractures over succession rights when their flagship project becomes the prize in a bitter family struggle.',
    releaseDate:'Coming Soon', director:'Amara Sterling', cast:['Celia Hart', 'Marcus Wynn', 'Evelyn Shaw', 'Adrian Locke'],
    format:'Dolby Atmos • 2.39:1', trailerVideo:'trailers/dynasty-glass.mp4', isComingSoon:true, reminderSet:true
  },
  {
    id:'mirage-kings', title:'MIRAGE OF KINGS', status:'Coming Soon', poster:'posters/mirage-kings.jpg',
    rating:'PG-13', language:'Arabic', score:'8.9', genre:'Action', runtime:'2H 11M',
    synopsis:'An antiquities investigator races across ancient caravan routes to protect an...',
    fullSynopsis:'An antiquities investigator races across ancient caravan routes to protect an artifact whose origins could redraw the history of a vanished kingdom.',
    releaseDate:'Coming Soon', director:'Samir Haddad', cast:['Layla Nasser', 'Omar Farouk', 'Salma Idris', 'Karim Zayed'],
    format:'Dual-Laser IMAX • Dolby Atmos', trailerVideo:'trailers/mirage-kings.mp4', isComingSoon:true
  },
  {
    id:'symphony-zero', title:'SYMPHONY FOR ZERO', status:'Coming Soon', poster:'posters/symphony-zero.jpg',
    rating:'PG-13', language:'English', score:'8.6', genre:'Mystery', runtime:'2H 04M',
    synopsis:'During a live broadcast in Vienna, an anonymous conductor alters a classical...',
    fullSynopsis:'During a live broadcast in Vienna, an anonymous conductor alters a classical score, setting off a chain of clues hidden in the music.',
    releaseDate:'Coming Soon', director:'Nico Bell', cast:['Mira Ellison', 'Jonah Reed', 'Amelie Weiss', 'Stefan Klein'],
    format:'Dolby Atmos • 35mm Presentation', trailerVideo:'trailers/symphony-zero.mp4', isComingSoon:true
  }
];

const MOVIES_CATALOG = Object.fromEntries(MOVIES_DATA.map(movie => [movie.id, {
  ...movie,
  status: movie.isComingSoon ? 'COMING SOON' : 'NOW EXHIBITING',
  posterImg: movie.poster,
  trailerVideo: movie.trailerVideo || 'trailers/doomsday.mp4',
  synopsis: movie.fullSynopsis || movie.synopsis
}]));

function findMovie(movieName) {
  return MOVIES_DATA.find(movie => movie.title === movieName) || MOVIES_DATA[0];
}

function renderCatalogue(catalogueGrid) {
  catalogueGrid.innerHTML = MOVIES_DATA.map(movie => {
    const comingSoon = movie.status === 'Coming Soon';
    const meta = [
      movie.genre,
      movie.language,
      movie.rating,
      movie.director,
      movie.cast.join(' '),
      movie.synopsis,
      movie.fullSynopsis
    ].join(' ').toLowerCase();
    const status = movie.status.toLowerCase().replace(/\s+/g, '-');
    const action = comingSoon
      ? `<button class="reminder catalog-reminder${movie.reminderSet ? ' set' : ''}" type="button" data-movie="${movie.title}">${movie.reminderSet ? '✓ Reminder Set' : 'Notify Me'}</button>`
      : `<button class="btn crimson book-btn" type="button" data-movie="${movie.title}">Book Tickets</button>`;
    const subtag = comingSoon ? 'COMING SOON' : movie.genre.toUpperCase();
    return `<article class="movie-card catalog-card" data-movie-id="${movie.id}" data-title="${movie.title.toLowerCase()}" data-genre="${movie.genre.toLowerCase()}" data-lang="${movie.language.toLowerCase()}" data-rating="${movie.rating.toLowerCase()}" data-status="${status}" data-meta="${meta}" data-movie="${movie.title}">
      <div class="poster-frame catalog-poster">
        <img class="movie-poster-img" src="${movie.poster}" alt="${movie.title} poster" onerror="this.style.display='none'">
        <div class="poster-badges"><span>${movie.rating}</span><span>${movie.language}</span><span>★ ${movie.score}</span></div>
        <div class="catalog-subtag">${subtag}</div>
        <h3 class="movie-title">${movie.title}</h3>
        <div class="poster-tag">${movie.genre.toUpperCase()} • ${movie.runtime}</div>
      </div>
      <p>${movie.synopsis}</p>
      <div class="catalog-card-actions">${action}<button class="btn outline details-btn" type="button" data-movie="${movie.title}">Details</button></div>
    </article>`;
  }).join('');
}

let activeCatalogueStatus = 'all';

function applyCatalogueFilters() {
  const catalogueGrid = document.getElementById('catalogue-grid');
  if (!catalogueGrid) return;

  const query = document.getElementById('catalogue-search').value.trim().toLowerCase();
  const selectedGenre = document.getElementById('filter-genre').value.trim().toLowerCase();
  const selectedLang = document.getElementById('filter-lang').value.trim().toLowerCase();
  const selectedRating = document.getElementById('filter-rating').value.trim().toLowerCase();
  const filtered = MOVIES_DATA.filter(movie => {
    const searchMatch = !query
      || movie.title.toLowerCase().includes(query)
      || movie.genre.toLowerCase().includes(query)
      || movie.language.toLowerCase().includes(query)
      || (movie.director && movie.director.toLowerCase().includes(query))
      || (movie.cast && movie.cast.join(' ').toLowerCase().includes(query));
    const genreMatch = selectedGenre === 'all' || movie.genre.toLowerCase() === selectedGenre;
    const languageMatch = selectedLang === 'all' || movie.language.toLowerCase() === selectedLang;
    const ratingMatch = selectedRating === 'all' || movie.rating.toLowerCase() === selectedRating;
    const statusMatch = activeCatalogueStatus === 'all'
      || movie.status.toLowerCase().replace(/\s+/g, '-') === activeCatalogueStatus;
    return searchMatch && genreMatch && languageMatch && ratingMatch && statusMatch;
  });
  const filteredTitles = new Set(filtered.map(movie => movie.title));
  catalogueGrid.querySelectorAll('.catalog-card').forEach(card => {
    const isMatch = filteredTitles.has(card.dataset.movie);
    card.classList.toggle('is-hidden', !isMatch);
    card.hidden = !isMatch;
  });
  document.getElementById('catalogue-count').innerHTML = `Showing <strong>${filtered.length}</strong> ${filtered.length === 1 ? 'title' : 'titles'}`;
  document.getElementById('catalog-empty').hidden = filtered.length !== 0;
}

function initializeCatalogue() {
  const catalogueGrid = document.getElementById('catalogue-grid');
  if (!catalogueGrid) return;

  const searchInput = document.getElementById('catalogue-search');
  const genreSelect = document.getElementById('filter-genre');
  const languageSelect = document.getElementById('filter-lang');
  const ratingSelect = document.getElementById('filter-rating');
  const count = document.getElementById('catalogue-count');
  const emptyState = document.getElementById('catalog-empty');
  const resetButton = document.getElementById('reset-filters-btn');
  const resetEmptyButton = document.getElementById('reset-all-filters');
  const statusPills = document.querySelectorAll('.status-pill');
  if (!searchInput || !genreSelect || !languageSelect || !ratingSelect || !count || !emptyState || !resetButton || !resetEmptyButton || !statusPills.length) return;

  renderCatalogue(catalogueGrid);
  const updateStatusPills = activePill => statusPills.forEach(pill => {
    const active = pill === activePill;
    pill.classList.toggle('active', active);
    pill.setAttribute('aria-pressed', String(active));
  });
  const resetFilters = () => {
    searchInput.value = '';
    [genreSelect, languageSelect, ratingSelect].forEach(select => {
      select.value = 'all';
    });
    activeCatalogueStatus = 'all';
    updateStatusPills([...statusPills].find(pill => pill.dataset.status === 'all'));
    applyCatalogueFilters();
  };
  const queryParams = new URLSearchParams(window.location.search);
  searchInput.value = queryParams.get('search') || '';
  [[genreSelect, 'genre'], [languageSelect, 'lang'], [ratingSelect, 'rating']].forEach(([select, key]) => {
    const requestedValue = queryParams.get(key)?.trim().toLowerCase();
    if (requestedValue && [...select.options].some(option => option.value === requestedValue)) {
      select.value = requestedValue;
    }
  });
  const requestedStatus = queryParams.get('status')?.trim().toLowerCase().replace(/\s+/g, '-');
  if (requestedStatus && [...statusPills].some(pill => pill.dataset.status === requestedStatus)) {
    activeCatalogueStatus = requestedStatus;
  }
  updateStatusPills([...statusPills].find(pill => pill.dataset.status === activeCatalogueStatus));

  searchInput.addEventListener('input', applyCatalogueFilters);
  [genreSelect, languageSelect, ratingSelect].forEach(select => select.addEventListener('change', applyCatalogueFilters));
  statusPills.forEach(pill => pill.addEventListener('click', () => {
    activeCatalogueStatus = pill.dataset.status;
    updateStatusPills(pill);
    applyCatalogueFilters();
  }));
  resetButton.addEventListener('click', resetFilters);
  resetEmptyButton.addEventListener('click', resetFilters);
  applyCatalogueFilters();
}

document.addEventListener('DOMContentLoaded', initializeCatalogue, { once:true });

function modalMovieHeader(movieName, movie) {
  return `<div class="modal-movie-header"><img class="modal-poster-img" src="${movie.poster}" alt="${movieName} poster" onerror="this.style.display='none'"><h2 id="modal-title">${movieName}</h2></div>`;
}

function openDetails(movieName) {
  const movie = findMovie(movieName);
  modalContent.innerHTML = `${modalMovieHeader(movieName, movie)}<div class="detail-meta"><span>${movie.rating}</span><span>${movie.language}</span><span>${movie.runtime}</span><span>${movie.format}</span><span>Director: ${movie.director}</span><span>Cast: ${movie.cast.join(', ')}</span></div><p class="synopsis">${movie.fullSynopsis}</p><button class="btn gold details-reserve" type="button" data-movie="${movieName}">Reserve Seats</button>`;
  openModal();
  modalContent.querySelector('.details-reserve').addEventListener('click', event => openBooking(event.currentTarget.dataset.movie));
}

function openBooking(movieName) {
  const movie = findMovie(movieName);
  modalContent.innerHTML = `
    ${modalMovieHeader(movieName, movie)}
    <div class="showtime-pills" aria-label="Showtimes">
      <button class="active" type="button">4:30 PM</button><button type="button">7:45 PM</button><button type="button">10:30 PM</button>
    </div>
    <div class="screen-curve">CURVED CINEMA SCREEN</div>
    <div class="seat-grid" aria-label="Seat selection"></div>
    <div class="seat-labels"><span><i class="available"></i>Available</span><span><i class="selected"></i>Selected</span><span><i class="occupied"></i>Occupied</span></div>
    <div class="checkout">
      <label>PROMO CODE<input id="promo-input" type="text" placeholder="Enter code"></label>
      <strong id="seat-total">$0.00</strong>
      <button class="btn gold" id="confirm-reservation" type="button">Confirm Reservation</button>
    </div>`;
  openModal();
  const grid = modalContent.querySelector('.seat-grid');
  const occupied = new Set([2, 7, 18, 19, 31, 42, 47]);
  for (let i = 0; i < 50; i++) {
    const seat = document.createElement('button');
    seat.type = 'button';
    seat.className = `seat ${occupied.has(i) ? 'occupied' : 'available'}`;
    seat.setAttribute('aria-label', `Seat ${i + 1}`);
    if (!occupied.has(i)) seat.addEventListener('click', () => {
      seat.classList.toggle('selected');
      updateTotal();
    });
    grid.appendChild(seat);
  }
  modalContent.querySelectorAll('.showtime-pills button').forEach(button => {
    button.addEventListener('click', () => {
      modalContent.querySelectorAll('.showtime-pills button').forEach(b => b.classList.remove('active'));
      button.classList.add('active');
    });
  });
  modalContent.querySelector('#promo-input').addEventListener('input', updateTotal);
  modalContent.querySelector('#confirm-reservation').addEventListener('click', () => {
    const selected = modalContent.querySelectorAll('.seat.selected').length;
    if (!selected) {
      showToast('Select at least one seat to continue');
      return;
    }
    const count = document.querySelector('#ticket-count');
    const nextCount = Number(count.textContent) + selected;
    count.textContent = String(nextCount);
    document.querySelector('#utility-ticket-count').textContent = `My Tickets (${nextCount})`;
    closeModal();
    showToast(`Reservation confirmed — ${selected} seat${selected > 1 ? 's' : ''} added`);
  });
  updateTotal();
}

function updateTotal() {
  const selected = modalContent.querySelectorAll('.seat.selected').length;
  const promo = modalContent.querySelector('#promo-input')?.value.trim().toUpperCase();
  const discount = promo === 'GOLD15' ? 0.85 : 1;
  const total = selected * 42 * discount;
  const totalEl = modalContent.querySelector('#seat-total');
  if (totalEl) totalEl.textContent = `$${total.toFixed(2)}${promo === 'GOLD15' && selected ? ' • GOLD15' : ''}`;
}

function openModal() {
  modalBackdrop.classList.add('open');
  modalBackdrop.setAttribute('aria-hidden', 'false');
  document.body.style.overflow = 'hidden';
}
function closeModal() {
  modalBackdrop.classList.remove('open');
  modalBackdrop.setAttribute('aria-hidden', 'true');
  document.body.style.overflow = '';
}
document.querySelector('.modal-close').addEventListener('click', closeModal);
modalBackdrop.addEventListener('click', event => { if (event.target === modalBackdrop) closeModal(); });
document.addEventListener('keydown', event => { if (event.key === 'Escape') closeModal(); });

document.addEventListener('click', event => {
  const target = event.target instanceof Element ? event.target : null;
  if (!target) return;
  const card = target.closest('.movie-card[data-movie-id], .coming-card[data-movie-id]');
  const bookingButton = target.closest('.reserve-btn,.book-btn');
  const reminderButton = target.closest('.reminder');
  if (card && !bookingButton && !reminderButton && card.dataset.movieId) {
    window.location.href = `movie-details.html?id=${card.dataset.movieId}`;
    return;
  }
  if (bookingButton) {
    openBooking(bookingButton.dataset.movie);
    return;
  }
  const detailsButton = target.closest('.details-btn');
  if (detailsButton) openDetails(detailsButton.dataset.movie);
});

let toastTimer;
function showToast(message) {
  const toast = document.querySelector('#toast');
  toast.textContent = message;
  toast.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => toast.classList.remove('show'), 3000);
}

function initializeMovieDetailPage() {
  const detailPage = document.querySelector('#movie-detail-page');
  if (!detailPage) return;

  const movieId = new URLSearchParams(window.location.search).get('id') || 'doomsday';
  const movie = MOVIES_CATALOG[movieId] || MOVIES_CATALOG.doomsday;
  document.title = `${movie.title} — THEATRON Cinema Lounges`;

  const poster = document.querySelector('#detail-poster-img');
  poster.src = movie.posterImg;
  poster.alt = `${movie.title} poster`;
  document.querySelector('#detail-poster-title').textContent = movie.title;
  document.querySelector('#detail-status-badge').textContent = movie.status;
  document.querySelector('#detail-title').textContent = movie.title;
  document.querySelector('#detail-release-date').textContent = movie.releaseDate;
  document.querySelector('#detail-director').textContent = movie.director;
  document.querySelector('#detail-synopsis').textContent = movie.synopsis;
  document.querySelector('#detail-meta-pills').innerHTML = [
    movie.rating,
    movie.genre,
    movie.runtime,
    movie.language,
    `★ ${movie.score} / 10`
  ].map(item => `<span>${item}</span>`).join('');
  document.querySelector('#detail-cast-grid').innerHTML = [
    `<article class="detail-cast-card"><span>DIRECTOR</span><strong>${movie.director}</strong></article>`,
    ...movie.cast.map(actor => `<article class="detail-cast-card"><span>STARRING</span><strong>${actor}</strong></article>`)
  ].join('');
  document.querySelector('#detail-recommendations').innerHTML = Object.values(MOVIES_CATALOG)
    .filter(recommended => recommended.id !== movie.id)
    .slice(0, 4)
    .map(recommended => `<a class="detail-recommendation-card" href="movie-details.html?id=${recommended.id}">
      <div class="detail-recommendation-poster"><img src="${recommended.posterImg}" alt="${recommended.title} poster" onerror="this.style.display='none'"></div>
      <span>${recommended.status}</span>
      <strong class="movie-title">${recommended.title}</strong>
    </a>`).join('');

  const primaryButton = document.querySelector('#detail-primary-cta');
  if (movie.isComingSoon) {
    primaryButton.textContent = 'Notify Me of Premiere';
    let reminderIsSet = false;
    primaryButton.addEventListener('click', () => {
      reminderIsSet = !reminderIsSet;
      primaryButton.textContent = reminderIsSet ? '✓ Premiere Reminder Set' : 'Notify Me of Premiere';
      showToast(reminderIsSet ? 'Premiere reminder has been set' : 'Premiere reminder has been removed');
    });
  } else {
    primaryButton.textContent = 'Book Tickets Now';
    primaryButton.addEventListener('click', () => openBooking(movie.title));
  }

  const trailerModal = document.querySelector('#detail-trailer-modal');
  const trailerVideo = document.querySelector('#detail-trailer-video');
  const trailerSource = document.querySelector('#detail-trailer-source');
  const closeTrailer = () => {
    trailerVideo.pause();
    trailerModal.classList.remove('open');
    trailerModal.setAttribute('aria-hidden', 'true');
  };
  trailerSource.src = movie.trailerVideo || 'trailers/doomsday.mp4';
  trailerVideo.load();
  document.querySelector('#detail-trailer-open').addEventListener('click', () => {
    trailerModal.classList.add('open');
    trailerModal.setAttribute('aria-hidden', 'false');
    trailerVideo.play().catch(error => {
      if (error.name === 'AbortError') return;
      console.error('Unable to play the movie trailer.', error);
      showToast('Trailer playback is unavailable');
    });
  });
  document.querySelector('#detail-trailer-close').addEventListener('click', closeTrailer);
  trailerModal.addEventListener('click', event => {
    if (event.target === trailerModal) closeTrailer();
  });
  document.addEventListener('keydown', event => {
    if (event.key === 'Escape') closeTrailer();
  });
}

document.addEventListener('DOMContentLoaded', initializeMovieDetailPage, { once:true });
