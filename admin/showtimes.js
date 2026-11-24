// THEATRON Operations Suite - Showtime & Booking Operations JS (LocalStorage Integrated)

document.addEventListener('DOMContentLoaded', () => {
  const tabShowtimes = document.getElementById('tabShowtimes');
  const tabBookings = document.getElementById('tabBookings');
  const showtimesView = document.getElementById('showtimesView');
  const bookingsView = document.getElementById('bookingsView');
  const showtimeCountSpan = document.getElementById('showtimeCount');

  const scheduleForm = document.getElementById('scheduleForm');
  const slotMovie = document.getElementById('slotMovie');
  const slotCinema = document.getElementById('slotCinema');
  const slotAuditorium = document.getElementById('slotAuditorium');
  const slotTime = document.getElementById('slotTime');
  const showtimesTableBody = document.getElementById('showtimesTableBody');
  const bookingsTableBody = document.getElementById('bookingsTableBody');
  const toast = document.getElementById('toastNotification');

  // Booking Modal elements
  const bookingModal = document.getElementById('bookingModal');
  const btnOpenBookingModal = document.getElementById('btnOpenBookingModal');
  const btnCloseBookingModal = document.getElementById('btnCloseBookingModal');
  const btnCancelBookingModal = document.getElementById('btnCancelBookingModal');
  const createBookingForm = document.getElementById('createBookingForm');
  const bookingMovieSelect = document.getElementById('bookingMovie');

  function showToast(message) {
    if (!toast) return;
    toast.querySelector('span').textContent = message || '✓ Action completed successfully!';
    toast.classList.add('show');
    setTimeout(() => {
      toast.classList.remove('show');
    }, 3200);
  }

  // Populate Movies in Schedule and Booking dropdowns from LocalStorage
  function populateMovieDropdowns() {
    if (typeof TheatronStorage === 'undefined') return;
    const movies = TheatronStorage.getMovies();

    // Schedule form movie dropdown
    if (slotMovie) {
      const currentVal = slotMovie.value;
      slotMovie.innerHTML = '';
      movies.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.title;
        opt.textContent = m.title === 'DOOMSDAY: ECLIPSE PROTOCOL' ? 'DOOMSDAY: ECLIPSE PROTOC' : m.title;
        if (m.title === 'DOOMSDAY: ECLIPSE PROTOCOL') opt.selected = true;
        slotMovie.appendChild(opt);
      });
      if (currentVal && movies.some(m => m.title === currentVal)) {
        slotMovie.value = currentVal;
      }
    }

    // Booking modal movie dropdown
    if (bookingMovieSelect) {
      bookingMovieSelect.innerHTML = '';
      movies.forEach(m => {
        const opt = document.createElement('option');
        opt.value = m.title;
        opt.textContent = m.title;
        bookingMovieSelect.appendChild(opt);
      });
    }
  }

  // Render Showtimes Table from LocalStorage
  function renderShowtimes() {
    if (!showtimesTableBody || typeof TheatronStorage === 'undefined') return;
    const showtimes = TheatronStorage.getShowtimes();
    showtimesTableBody.innerHTML = '';

    showtimes.forEach(slot => {
      const tr = document.createElement('tr');
      tr.dataset.id = slot.id;
      tr.innerHTML = `
        <td class="movie-title-cell">${slot.movie}</td>
        <td class="location-cell">${slot.cinema}</td>
        <td class="auditorium-cell">${slot.auditorium} <span class="format-gold">${slot.format}</span></td>
        <td class="time-cell">${slot.time}</td>
        <td class="price-cell">${slot.price}</td>
        <td><button class="btn-remove" data-id="${slot.id}">Remove</button></td>
      `;
      showtimesTableBody.appendChild(tr);
      attachRemoveEvent(tr.querySelector('.btn-remove'), slot);
    });

    if (showtimeCountSpan) {
      showtimeCountSpan.textContent = showtimes.length;
    }
  }

  // Render Bookings from LocalStorage
  function renderBookings() {
    if (!bookingsTableBody || typeof TheatronStorage === 'undefined') return;
    const bookings = TheatronStorage.getBookings();
    bookingsTableBody.innerHTML = '';

    bookings.forEach(b => {
      const tr = document.createElement('tr');
      tr.innerHTML = `
        <td style="color:var(--gold-primary);font-weight:700;">${b.id}</td>
        <td style="color:#ffffff;font-weight:500;">${b.patron}</td>
        <td style="color:#b8aba4;">${b.movie}</td>
        <td style="color:#b8aba4;">${b.seats}</td>
        <td style="color:#ffffff;font-weight:700;">${b.total}</td>
        <td><span class="status-pill ${b.status.toLowerCase()}">${b.status}</span></td>
        <td><button class="btn-remove btn-delete-booking" data-id="${b.id}" style="float:none;">Cancel</button></td>
      `;
      bookingsTableBody.appendChild(tr);

      const btnCancel = tr.querySelector('.btn-delete-booking');
      if (btnCancel) {
        btnCancel.addEventListener('click', () => {
          if (confirm(`Cancel reservation ${b.id} for ${b.patron}? Total bookings and revenue will adjust automatically.`)) {
            TheatronStorage.deleteBooking(b.id);
            renderBookings();
            showToast(`✓ Cancelled booking ${b.id}. LocalStorage metrics updated!`);
          }
        });
      }
    });

    if (tabBookings) {
      tabBookings.textContent = `Customer Bookings (${bookings.length})`;
    }
  }

  // Tab switching
  function switchTab(tab) {
    if (tab === 'bookings') {
      tabBookings.classList.add('active');
      tabShowtimes.classList.remove('active');
      showtimesView.style.display = 'none';
      bookingsView.classList.add('active');
    } else {
      tabShowtimes.classList.add('active');
      tabBookings.classList.remove('active');
      showtimesView.style.display = 'block';
      bookingsView.classList.remove('active');
    }
  }

  if (tabShowtimes && tabBookings) {
    tabShowtimes.addEventListener('click', () => switchTab('showtimes'));
    tabBookings.addEventListener('click', () => switchTab('bookings'));
  }

  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get('tab') === 'bookings') {
    switchTab('bookings');
  }

  function formatTimeTo24h(timeStr) {
    timeStr = timeStr.trim();
    if (timeStr.includes(':') && (timeStr.toUpperCase().includes('AM') || timeStr.toUpperCase().includes('PM'))) {
      const parts = timeStr.split(' ');
      const timeParts = parts[0].split(':');
      let hours = parseInt(timeParts[0], 10);
      const minutes = timeParts[1];
      const modifier = parts[1].toUpperCase();

      if (modifier === 'PM' && hours < 12) hours += 12;
      if (modifier === 'AM' && hours === 12) hours = 0;

      const hh = hours < 10 ? '0' + hours : hours;
      return `${hh} : ${minutes}`;
    }
    return timeStr.replace(':', ' : ');
  }

  function determineFormat(auditorium) {
    const lower = auditorium.toLowerCase();
    if (lower.includes('imax 3d')) return '(IMAX 3D)';
    if (lower.includes('imax')) return '(IMAX Laser)';
    if (lower.includes('dolby')) return '(Dolby Atmos)';
    if (lower.includes('35mm')) return '(35mm Archival)';
    return '(Royal VIP)';
  }

  function determinePrice(auditorium) {
    const lower = auditorium.toLowerCase();
    if (lower.includes('salon')) return '$30';
    if (lower.includes('gold')) return '$26';
    if (lower.includes('35mm')) return '$24';
    if (lower.includes('imax')) return '$22';
    if (lower.includes('dolby')) return '$20';
    return '$26';
  }

  // Handle Publish Showtime Form
  if (scheduleForm) {
    scheduleForm.addEventListener('submit', (e) => {
      e.preventDefault();

      const movie = slotMovie.value.replace(':', ' :');
      const cinema = slotCinema.value;
      const auditorium = slotAuditorium.value.trim() || 'Royal Gold Lounge 3';
      const timeVal = slotTime.value.trim() || '09:30 PM';
      const formattedTime = formatTimeTo24h(timeVal);
      const formatTag = determineFormat(auditorium);
      const basePrice = determinePrice(auditorium);

      const newSlot = {
        id: 'st_' + Date.now(),
        movie: movie.includes('ECLIPSE') ? 'DOOMSDAY : ECLIPSE PROTOCOL' : movie,
        cinema: cinema,
        auditorium: auditorium,
        format: formatTag,
        time: formattedTime,
        price: basePrice
      };

      TheatronStorage.addShowtime(newSlot);
      renderShowtimes();

      if (cinema === 'THEATRON Grand Flagship') {
        slotCinema.value = 'THEATRON Royal Promenade';
      }

      showToast(`✓ Published ${newSlot.movie} to LocalStorage!`);
    });
  }

  function attachRemoveEvent(btn, slot) {
    btn.addEventListener('click', () => {
      const row = btn.closest('tr');
      row.style.transition = 'opacity 0.3s, transform 0.3s';
      row.style.opacity = '0';
      row.style.transform = 'translateX(20px)';
      setTimeout(() => {
        TheatronStorage.deleteShowtime(slot.id);
        renderShowtimes();
        showToast(`✓ Removed screening slot from LocalStorage.`);
      }, 300);
    });
  }

  // Booking Modal handlers
  function openBookingModal() {
    if (bookingModal) {
      bookingModal.style.display = 'flex';
      document.body.style.overflow = 'hidden';
    }
  }

  function closeBookingModal() {
    if (bookingModal) {
      bookingModal.style.display = 'none';
      document.body.style.overflow = '';
    }
  }

  if (btnOpenBookingModal) btnOpenBookingModal.addEventListener('click', openBookingModal);
  if (btnCloseBookingModal) btnCloseBookingModal.addEventListener('click', closeBookingModal);
  if (btnCancelBookingModal) btnCancelBookingModal.addEventListener('click', closeBookingModal);

  if (bookingModal) {
    bookingModal.addEventListener('click', (e) => {
      if (e.target === bookingModal) closeBookingModal();
    });
  }

  if (createBookingForm) {
    createBookingForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const patron = document.getElementById('bookingPatron').value.trim() || 'Julian Hayes';
      const movie = document.getElementById('bookingMovie').value;
      const seats = document.getElementById('bookingSeats').value.trim() || 'H7, H8';
      const totalNum = parseFloat(document.getElementById('bookingTotal').value) || 56.00;
      const totalStr = '$' + totalNum.toFixed(2);

      const newBooking = {
        id: `THT - ${Math.floor(100000 + Math.random() * 900000)}`,
        patron: patron,
        movie: movie,
        seats: seats,
        total: totalStr,
        status: 'Confirmed'
      };

      TheatronStorage.addBooking(newBooking);
      closeBookingModal();
      createBookingForm.reset();
      renderBookings();
      showToast(`✓ Reservation created! Total Bookings & Revenue updated in LocalStorage!`);
    });
  }

  // Initial render
  populateMovieDropdowns();
  renderShowtimes();
  renderBookings();

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
