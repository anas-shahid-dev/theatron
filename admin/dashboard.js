// THEATRON Operations Suite - Dashboard & Analytics JS (LocalStorage Integrated)

document.addEventListener('DOMContentLoaded', () => {
  // Chart toggle elements
  const btn7d = document.getElementById('btnToggle7d');
  const btnMonth = document.getElementById('btnToggleMonth');
  const barsWrapper = document.getElementById('barsWrapper');
  const daysRow = document.getElementById('daysRow');

  const data7Days = [
    { label: 'Mon', val: '$4.2k', height: '35.6%' },
    { label: 'Tue', val: '$5.1k', height: '43.2%' },
    { label: 'Wed', val: '$4.8k', height: '40.7%' },
    { label: 'Thu', val: '$6.9k', height: '58.5%' },
    { label: 'Fri', val: '$9.4k', height: '79.7%' },
    { label: 'Sat', val: '$11.8k', height: '100%' },
    { label: 'Sun', val: '$10.2k', height: '86.4%' }
  ];

  const dataMonthly = [
    { label: 'Week 1', val: '$32.4k', height: '66.2%' },
    { label: 'Week 2', val: '$38.9k', height: '79.5%' },
    { label: 'Week 3', val: '$48.9k', height: '100%' },
    { label: 'Week 4', val: '$41.2k', height: '84.2%' }
  ];

  function renderChart(data) {
    if (!barsWrapper || !daysRow) return;
    barsWrapper.innerHTML = '';
    daysRow.innerHTML = '';

    data.forEach(item => {
      const col = document.createElement('div');
      col.className = 'bar-col';
      col.innerHTML = `
        <span class="bar-val">${item.val}</span>
        <div class="bar-pill" style="height: 0%;"></div>
      `;
      barsWrapper.appendChild(col);

      const lbl = document.createElement('span');
      lbl.className = 'day-label';
      lbl.textContent = item.label;
      daysRow.appendChild(lbl);

      setTimeout(() => {
        const pill = col.querySelector('.bar-pill');
        if (pill) pill.style.height = item.height;
      }, 50);
    });
  }

  // Restore chart preference from localStorage
  const savedRange = localStorage.getItem('theatron_chart_range') || '7d';
  if (savedRange === 'month' && btnMonth) {
    btnMonth.classList.add('active');
    btn7d.classList.remove('active');
    renderChart(dataMonthly);
  } else {
    if (btn7d) btn7d.classList.add('active');
    if (btnMonth) btnMonth.classList.remove('active');
    renderChart(data7Days);
  }

  if (btn7d && btnMonth) {
    btn7d.addEventListener('click', () => {
      btn7d.classList.add('active');
      btnMonth.classList.remove('active');
      localStorage.setItem('theatron_chart_range', '7d');
      renderChart(data7Days);
    });

    btnMonth.addEventListener('click', () => {
      btnMonth.classList.add('active');
      btn7d.classList.remove('active');
      localStorage.setItem('theatron_chart_range', 'month');
      renderChart(dataMonthly);
    });
  }

  // Update Dynamic Telemetry from LocalStorage
  function updateDashboardFromStorage() {
    if (typeof TheatronStorage === 'undefined') return;

    const metrics = TheatronStorage.getMetrics();
    const movies = TheatronStorage.getMovies();
    const bookings = TheatronStorage.getBookings();

    // 1. TOTAL BOOKINGS - Dynamic from LocalStorage
    const statBookings = document.getElementById('statTotalBookings');
    const statBookingsTrend = document.getElementById('statBookingsTrend');
    if (statBookings) {
      statBookings.textContent = Number(metrics.totalBookings || 1423).toLocaleString();
    }
    if (statBookingsTrend && metrics.bookingsTrend) {
      statBookingsTrend.textContent = metrics.bookingsTrend;
    }

    // 2. BOX OFFICE REVENUE - Dynamic from LocalStorage
    const statRevenue = document.getElementById('statBoxOfficeRevenue');
    const statRevenueTrend = document.getElementById('statRevenueTrend');
    if (statRevenue) {
      statRevenue.textContent = '$' + Number(metrics.boxOfficeRevenue || 48921.96).toLocaleString('en-US', {
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      });
    }
    if (statRevenueTrend && metrics.revenueTrend) {
      statRevenueTrend.textContent = metrics.revenueTrend;
    }

    // 3. CATALOGUE TITLES - Dynamic from LocalStorage
    const statTitles = document.getElementById('statCatalogueTitles');
    const statHalls = document.getElementById('statActiveHalls');
    if (statTitles) {
      statTitles.textContent = movies.length;
    }
    if (statHalls) {
      const activeInHalls = movies.filter(m => m.status === 'SHOWING' || m.status === 'Currently Showing').length;
      statHalls.textContent = `${activeInHalls} Active in Halls`;
    }

    // 4. ACTIVE CINEMA LOUNGES - Dynamic from LocalStorage
    const statLounges = document.getElementById('statActiveLounges');
    const statScreens = document.getElementById('statTotalScreens');
    if (statLounges) {
      statLounges.textContent = metrics.activeLounges || 3;
    }
    if (statScreens) {
      statScreens.textContent = `${metrics.totalScreens || 18} Total Screens`;
    }

    // 5. TOP PERFORMING TITLES
    const titlesList = document.querySelector('.titles-list');
    if (titlesList && movies.length > 0) {
      const sorted = [...movies].sort((a, b) => (b.occupancy || 50) - (a.occupancy || 50)).slice(0, 4);
      titlesList.innerHTML = sorted.map((m, idx) => `
        <div class="title-item">
          <div class="title-meta">
            <span class="title-name">${idx + 1}. ${m.title}</span>
            <span class="title-percent">${m.occupancy || 50}% Occupancy</span>
          </div>
          <div class="progress-track">
            <div class="progress-fill" style="width: ${m.occupancy || 50}%;"></div>
          </div>
        </div>
      `).join('');
    }

    // 6. RECENT PATRON RESERVATIONS
    const reservationsTbody = document.querySelector('.custom-table tbody');
    if (reservationsTbody && bookings.length > 0) {
      reservationsTbody.innerHTML = bookings.slice(0, 5).map(b => `
        <tr>
          <td class="booking-id">${b.id}</td>
          <td class="patron-name">${b.patron}</td>
          <td class="movie-title-cell">${b.movie}</td>
          <td class="seats-cell">${b.seats}</td>
          <td class="total-cell">${b.total}</td>
          <td><span class="status-pill ${b.status.toLowerCase()}">${b.status}</span></td>
        </tr>
      `).join('');
    }
  }

  updateDashboardFromStorage();

  // Listen to cross-tab / cross-window storage events
  window.addEventListener('storage', () => {
    updateDashboardFromStorage();
  });

  // Modal Functionality
  const addModal = document.getElementById('addMovieModal');
  const btnOpenModal = document.getElementById('btnOpenAddModal');
  const btnCloseModal = document.getElementById('btnCloseModal');
  const btnCancelModal = document.getElementById('btnCancelModal');
  const addMovieForm = document.getElementById('addMovieForm');
  const toast = document.getElementById('toastNotification');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('span').textContent = message || '✓ Action completed successfully!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  function openModal() {
    if (addModal) {
      addModal.classList.add('active');
      document.body.style.overflow = 'hidden';
    }
  }

  function closeModal() {
    if (addModal) {
      addModal.classList.remove('active');
      document.body.style.overflow = '';
    }
  }

  if (btnOpenModal) btnOpenModal.addEventListener('click', openModal);
  if (btnCloseModal) btnCloseModal.addEventListener('click', closeModal);
  if (btnCancelModal) btnCancelModal.addEventListener('click', closeModal);

  if (addModal) {
    addModal.addEventListener('click', (e) => {
      if (e.target === addModal) closeModal();
    });
  }

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && addModal && addModal.classList.contains('active')) {
      closeModal();
    }
  });

  // Handle Form Submission -> Saves to LocalStorage
  if (addMovieForm) {
    addMovieForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const title = document.getElementById('movieTitle').value.trim() || 'SOVEREIGN SHADOWS';
      const genre = document.getElementById('movieGenre').value.trim() || 'Sci-Fi Thriller';
      const lang = document.getElementById('movieLang').value.trim() || 'English';
      const duration = document.getElementById('movieDuration').value.trim() || '2h 15m';
      const rating = document.getElementById('movieRating').value;
      const status = document.getElementById('movieStatus').value;
      const artwork = document.getElementById('movieArtwork').value;
      const credits = document.getElementById('movieCredits').value.trim() || 'Denis Vance';
      const director = credits.includes(',') ? credits.split(',')[0].trim() : credits;
      const synopsis = document.getElementById('movieSynopsis').value.trim();

      const newMovie = {
        id: 'mov_' + Date.now(),
        title: title,
        director: `Dir. ${director}`,
        genreLang: `${genre} • ${lang}`,
        genre: genre,
        lang: lang,
        duration: duration,
        rating: rating,
        status: status,
        artwork: artwork,
        occupancy: Math.floor(Math.random() * 25) + 65,
        credits: credits,
        synopsis: synopsis
      };

      TheatronStorage.addMovie(newMovie);
      updateDashboardFromStorage();
      closeModal();
      showToast('✓ Motion picture saved to catalogue (LocalStorage)!');
    });
  }

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
