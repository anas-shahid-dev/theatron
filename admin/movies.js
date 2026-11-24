// THEATRON Operations Suite - Movie Catalogue Management JS (LocalStorage Integrated)

document.addEventListener('DOMContentLoaded', () => {
  const modal = document.getElementById('addMovieModal');
  const btnOpenModal = document.getElementById('btnOpenAddModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const form = document.getElementById('addMovieForm');
  const modalHeading = document.getElementById('modalHeading');
  const editMovieId = document.getElementById('editMovieId');

  const searchFilter = document.getElementById('searchFilter');
  const statusFilter = document.getElementById('statusFilter');
  const tableBody = document.getElementById('movieTableBody');
  const toast = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('span').textContent = message || '✓ Action completed successfully!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function renderCatalogue() {
    if (!tableBody) return;
    const movies = TheatronStorage.getMovies();
    tableBody.innerHTML = '';

    movies.forEach(movie => {
      const art = TheatronStorage.getArtwork(movie.artwork);
      const isR = movie.rating === 'R';
      const ratingClass = isR ? 'badge-rating r' : 'badge-rating pg13';
      const isShowing = movie.status === 'SHOWING' || movie.status === 'Currently Showing';
      const statusClass = isShowing ? 'badge-status showing' : 'badge-status upcoming';
      const statusText = isShowing ? 'SHOWING' : 'UPCOMING';

      const tr = document.createElement('tr');
      tr.dataset.id = movie.id;
      tr.dataset.title = movie.title;
      tr.dataset.genre = movie.genreLang || `${movie.genre} • ${movie.lang}`;
      tr.dataset.status = statusText;

      tr.innerHTML = `
        <td>
          <div class="poster-title-cell">
            <img src="${art.svg}" alt="${movie.title} Poster" class="poster-thumbnail" onerror="this.src='${art.fallback}'">
            <div class="movie-info">
              <span class="movie-title-text">${movie.title}</span>
              <span class="movie-dir-text">${movie.director.startsWith('Dir.') ? movie.director : 'Dir. ' + movie.director}</span>
            </div>
          </div>
        </td>
        <td class="genre-lang-cell">${movie.genreLang || (movie.genre + ' • ' + movie.lang)}</td>
        <td class="duration-cell">${movie.duration}</td>
        <td><span class="${ratingClass}">${movie.rating}</span></td>
        <td><span class="${statusClass}">${statusText}</span></td>
        <td>
          <div class="actions-cell">
            <button class="btn-action-edit" data-id="${movie.id}">Edit</button>
            <button class="btn-action-delete" data-id="${movie.id}">Delete</button>
          </div>
        </td>
      `;

      tableBody.appendChild(tr);
      attachRowEvents(tr, movie);
    });

    applyFilters();
  }

  function openModal(isEdit = false, movieData = null) {
    if (!modal) return;
    if (isEdit && movieData) {
      modalHeading.textContent = 'EDIT MOTION PICTURE';
      editMovieId.value = movieData.id;
      document.getElementById('movieTitle').value = movieData.title;
      document.getElementById('movieGenre').value = movieData.genre;
      document.getElementById('movieLang').value = movieData.lang;
      document.getElementById('movieDuration').value = movieData.duration;
      document.getElementById('movieRating').value = movieData.rating;
      document.getElementById('movieStatus').value = (movieData.status === 'SHOWING' || movieData.status === 'Currently Showing') ? 'Currently Showing' : 'Upcoming';
      document.getElementById('movieArtwork').value = movieData.artwork || 'DOOMSDAY';
      document.getElementById('movieCredits').value = movieData.credits || movieData.director;
      document.getElementById('movieSynopsis').value = movieData.synopsis || 'An unforgettable cinematic event mastered for THEATRON dual-laser auditoriums.';
    } else {
      modalHeading.textContent = 'ADD NEW MOTION PICTURE';
      editMovieId.value = '';
      form.reset();
      document.getElementById('movieTitle').value = '';
      document.getElementById('movieTitle').placeholder = 'e.g., SOVEREIGN SHADOWS';
      document.getElementById('movieGenre').value = 'Sci-Fi Thriller';
      document.getElementById('movieLang').value = 'English';
      document.getElementById('movieDuration').value = '2h 15m';
      document.getElementById('movieRating').value = 'PG-13';
      document.getElementById('movieStatus').value = 'Currently Showing';
      document.getElementById('movieArtwork').value = 'DOOMSDAY';
      document.getElementById('movieCredits').value = 'Christopher Nolan, Rebecca Ferguson, Oscar Isaac';
      document.getElementById('movieSynopsis').value = 'An unforgettable cinematic event mastered for THEATRON dual-laser auditoriums.';
    }
    modal.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeModal() {
    if (modal) {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', () => openModal(false));
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (modal) {
    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal && modal.classList.contains('active')) {
      closeModal();
    }
  });

  // Filter & Search Logic
  function applyFilters() {
    if (!searchFilter || !statusFilter || !tableBody) return;
    const query = searchFilter.value.toLowerCase().trim();
    const statusVal = statusFilter.value;
    const rows = tableBody.querySelectorAll('tr');

    rows.forEach(row => {
      const title = (row.dataset.title || '').toLowerCase();
      const genre = (row.dataset.genre || '').toLowerCase();
      const status = (row.dataset.status || '').toUpperCase();

      const matchesQuery = !query || title.includes(query) || genre.includes(query);
      let matchesStatus = true;
      if (statusVal !== 'ALL') {
        matchesStatus = status.includes(statusVal) || (statusVal === 'SHOWING' && status.includes('SHOWING'));
      }

      row.style.display = (matchesQuery && matchesStatus) ? '' : 'none';
    });
  }

  if (searchFilter) searchFilter.addEventListener('input', applyFilters);
  if (statusFilter) statusFilter.addEventListener('change', applyFilters);

  // Form submission (Add or Edit in LocalStorage)
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('movieTitle').value.trim() || 'SOVEREIGN SHADOWS';
      const genre = document.getElementById('movieGenre').value.trim() || 'Sci-Fi Thriller';
      const lang = document.getElementById('movieLang').value.trim() || 'English';
      const duration = document.getElementById('movieDuration').value.trim() || '2h 15m';
      const rating = document.getElementById('movieRating').value;
      const status = document.getElementById('movieStatus').value;
      const artwork = document.getElementById('movieArtwork').value;
      const credits = document.getElementById('movieCredits').value.trim() || 'Denis Vance';
      const synopsis = document.getElementById('movieSynopsis').value.trim();
      const director = credits.includes(',') ? credits.split(',')[0].trim() : credits;

      if (editMovieId.value) {
        // Update existing movie
        TheatronStorage.updateMovie({
          id: editMovieId.value,
          title: title,
          director: `Dir. ${director}`,
          genreLang: `${genre} • ${lang}`,
          genre: genre,
          lang: lang,
          duration: duration,
          rating: rating,
          status: status.includes('Showing') ? 'SHOWING' : 'UPCOMING',
          artwork: artwork,
          credits: credits,
          synopsis: synopsis
        });
        showToast('✓ Motion picture updated in LocalStorage!');
      } else {
        // Add new movie
        const newMovie = {
          id: 'mov_' + Date.now(),
          title: title,
          director: `Dir. ${director}`,
          genreLang: `${genre} • ${lang}`,
          genre: genre,
          lang: lang,
          duration: duration,
          rating: rating,
          status: status.includes('Showing') ? 'SHOWING' : 'UPCOMING',
          artwork: artwork,
          occupancy: Math.floor(Math.random() * 25) + 65,
          credits: credits,
          synopsis: synopsis
        };
        TheatronStorage.addMovie(newMovie);
        showToast('✓ Motion picture added to catalogue (LocalStorage)!');
      }

      closeModal();
      renderCatalogue();
    });
  }

  // Row Event Delegation (Edit & Delete)
  function attachRowEvents(row, movie) {
    const btnEdit = row.querySelector('.btn-action-edit');
    const btnDelete = row.querySelector('.btn-action-delete');

    if (btnEdit) {
      btnEdit.addEventListener('click', () => {
        openModal(true, movie);
      });
    }

    if (btnDelete) {
      btnDelete.addEventListener('click', () => {
        if (confirm(`Are you sure you want to retire "${movie.title}" from the active catalogue?`)) {
          row.style.transition = 'opacity 0.3s, transform 0.3s';
          row.style.opacity = '0';
          row.style.transform = 'translateX(20px)';
          setTimeout(() => {
            TheatronStorage.deleteMovie(movie.id);
            renderCatalogue();
            showToast(`✓ Removed "${movie.title}" from LocalStorage.`);
          }, 300);
        }
      });
    }
  }

  // Initial load from LocalStorage
  renderCatalogue();

  // Mobile drawer handlers
  const mobileMenuBtn = document.getElementById('mobileMenuBtn');
  const sidebar = document.getElementById('sidebar');
  const sidebarBackdrop = document.getElementById('sidebarBackdrop');
  const sidebarCloseBtn = document.getElementById('sidebarCloseBtn');

  function openMobileSidebar() {
    if (sidebar) sidebar.classList.add('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.add('active');
    document.body.style.overflow = 'hidden';
  }

  function closeMobileSidebar() {
    if (sidebar) sidebar.classList.remove('mobile-open');
    if (sidebarBackdrop) sidebarBackdrop.classList.remove('active');
    document.body.style.overflow = '';
  }

  if (mobileMenuBtn) mobileMenuBtn.addEventListener('click', openMobileSidebar);
  if (sidebarCloseBtn) sidebarCloseBtn.addEventListener('click', closeMobileSidebar);
  if (sidebarBackdrop) sidebarBackdrop.addEventListener('click', closeMobileSidebar);

  // Footer buttons
  const btnArchMap = document.getElementById('btnArchMap');
  const btnCustomerSite = document.getElementById('btnCustomerSite');

  if (btnArchMap) {
    btnArchMap.addEventListener('click', () => {
      showToast('ℹ Opening 18-Page Operations Map...');
    });
  }

  if (btnCustomerSite) {
    btnCustomerSite.addEventListener('click', () => {
      showToast('ℹ Navigating to Customer Facing Experience...');
    });
  }
});
