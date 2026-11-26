/**
 * THEATRON CINEMA LOUNGES — CINEMAS DIRECTORY CONTROLLER
 * Live Search, Facility Filters, Sorting, Details Modal & Interactive Map Explorer
 */

(function () {
  'use strict';

  // Cinema Data Store for modal and map interactivity
  const cinemaData = {
    flagship: {
      id: 'flagship',
      name: 'THEATRON Grand Flagship',
      city: 'Sovereign City',
      address: '88 Sovereign Boulevard, Suite 100',
      halls: 8,
      technologies: ['Dual-Laser IMAX', 'Dolby Atmos 128-Channel', '4K Christie RGB Laser'],
      seating: 'Motorized Royal Gold Italian Leather Recliners with heated seat technology',
      lounges: 'Maroon Velvet Champagne Sanctuary & Concierge Bar',
      dining: 'Artisan Concessions, Truffle Pommes Frites, Caviar Service',
      hours: 'Open Daily: 10:00 AM — 02:00 AM',
      image: 'assets/images/flagship-cinema.svg',
    },
    elysium: {
      id: 'elysium',
      name: 'THEATRON Elysium Palace',
      city: 'Metropolis',
      address: '420 Monarch Avenue, Royal Heights',
      halls: 6,
      technologies: ['Dolby Cinema', 'Acoustic Velvet Isolation Pods', '4K High Frame Rate'],
      seating: 'Sovereign Duo Suites with private partitions and cashmere blankets',
      lounges: 'Elysian Gold Lounge & Private Sommelier Cellar',
      dining: 'Gourmet In-Seat Butler Dining & Signature Mocktail Bar',
      hours: 'Open Daily: 11:00 AM — 01:30 AM',
      image: 'assets/images/elysium-palace.svg',
    },
    celestial: {
      id: 'celestial',
      name: 'THEATRON Celestial Pavilion',
      city: 'Crown District',
      address: '15 Aurora Crest Drive, Skyline Plaza',
      halls: 10,
      technologies: ['70mm Film Projector', 'Dual-Laser IMAX', 'DTS:X Surround Sound'],
      seating: 'Luxury Zero-Gravity Recliners with personal console table',
      lounges: 'Starlight Mezzanine Lounge & Private Screening Salon',
      dining: 'Artisan Pastries, Organic Truffle Popcorn, Single-Origin Espresso',
      hours: 'Open Daily: 09:30 AM — 02:00 AM',
      image: 'assets/images/celestial-pavilion.svg',
    },
    astral: {
      id: 'astral',
      name: 'THEATRON Astral Sanctuary',
      city: 'Marina Bay',
      address: '77 Marina Promenade, Pier 4',
      halls: 5,
      technologies: ['270-Degree ScreenX', 'Dolby Atmos', 'Laser 4K Projection'],
      seating: 'Acoustic Maroon Velvet Pods with built-in wireless chargers',
      lounges: 'Waterfront Terrace Lounge & Sunset Cocktail Terrace',
      dining: 'Mediterranean Artisan Tapas & Champagne Flight Pairings',
      hours: 'Open Daily: 12:00 PM — 02:00 AM',
      image: 'assets/images/astral-sanctuary.svg',
    },
  };

  // --- 1. Search, Filter & Sort Controller ---
  function initCinemaFilters() {
    const searchInput = document.getElementById('search-cinema-input');
    const citySelect = document.getElementById('filter-city-select');
    const sortSelect = document.getElementById('sort-cinema-select');
    const facilityChips = document.querySelectorAll('.facility-filter-chip');
    const clearBtn = document.getElementById('btn-clear-cinema-filters');
    const cinemaCards = document.querySelectorAll('.cinema-card-item');

    function applyFilters() {
      const searchTerm = searchInput ? searchInput.value.toLowerCase().trim() : '';
      const selectedCity = citySelect ? citySelect.value.toLowerCase() : '';
      const selectedFacilities = [];

      document.querySelectorAll('.facility-filter-chip.active').forEach((chip) => {
        selectedFacilities.push(chip.getAttribute('data-facility').toLowerCase());
      });

      let visibleCards = [];

      cinemaCards.forEach((card) => {
        const name = (card.getAttribute('data-name') || '').toLowerCase();
        const city = (card.getAttribute('data-city') || '').toLowerCase();
        const facilities = (card.getAttribute('data-facilities') || '').toLowerCase();

        // 1. Text Search matching name or address
        const matchesSearch = !searchTerm || name.includes(searchTerm) || city.includes(searchTerm);

        // 2. City Filter
        const matchesCity = !selectedCity || selectedCity === 'all' || city === selectedCity;

        // 3. Facilities Filter (must match all selected facility chips)
        const matchesFacilities =
          !selectedFacilities.length ||
          selectedFacilities.every((fac) => facilities.includes(fac));

        if (matchesSearch && matchesCity && matchesFacilities) {
          card.classList.remove('filtering-out');
          card.classList.add('filtering-in');
          card.style.display = '';
          visibleCards.push(card);
        } else {
          card.classList.add('filtering-out');
          card.classList.remove('filtering-in');
          setTimeout(() => {
            if (card.classList.contains('filtering-out')) {
              card.style.display = 'none';
            }
          }, 250);
        }
      });

      // Apply Sorting
      if (sortSelect) {
        const sortVal = sortSelect.value;
        const grid = document.querySelector('.cinemas-grid');
        if (grid && visibleCards.length > 1) {
          const sorted = Array.from(visibleCards).sort((a, b) => {
            const hallsA = parseInt(a.getAttribute('data-halls') || '0', 10);
            const hallsB = parseInt(b.getAttribute('data-halls') || '0', 10);
            const nameA = a.getAttribute('data-name') || '';
            const nameB = b.getAttribute('data-name') || '';

            if (sortVal === 'halls-desc') return hallsB - hallsA;
            if (sortVal === 'halls-asc') return hallsA - hallsB;
            if (sortVal === 'name-asc') return nameA.localeCompare(nameB);
            return 0;
          });

          sorted.forEach((card) => grid.appendChild(card));
        }
      }
    }

    if (searchInput) searchInput.addEventListener('input', applyFilters);
    if (citySelect) citySelect.addEventListener('change', applyFilters);
    if (sortSelect) sortSelect.addEventListener('change', applyFilters);

    facilityChips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        applyFilters();
      });
    });

    if (clearBtn) {
      clearBtn.addEventListener('click', () => {
        if (searchInput) searchInput.value = '';
        if (citySelect) citySelect.value = '';
        if (sortSelect) sortSelect.value = 'default';
        facilityChips.forEach((chip) => chip.classList.remove('active'));
        applyFilters();
        window.showToast('Filters Cleared', 'Displaying all signature destinations.', '✦');
      });
    }
  }

  // --- 2. Cinema Details Modal ---
  function initCinemaModal() {
    const modal = document.getElementById('cinema-details-modal');
    if (!modal) return;

    const modalClose = modal.querySelector('.modal-close-btn');
    const detailButtons = document.querySelectorAll('.btn-view-cinema, .btn-explore-cinema');

    detailButtons.forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const cinemaKey = btn.getAttribute('data-cinema-key') || 'flagship';
        const data = cinemaData[cinemaKey] || cinemaData.flagship;

        modal.querySelector('.modal-cinema-title').textContent = data.name;
        modal.querySelector('.modal-cinema-address').textContent = data.address;
        modal.querySelector('.modal-cinema-halls').textContent = `${data.halls} Exclusive Auditoriums`;
        modal.querySelector('.modal-cinema-img').src = data.image;
        modal.querySelector('.modal-cinema-tech').textContent = data.technologies.join(' • ');
        modal.querySelector('.modal-cinema-seating').textContent = data.seating;
        modal.querySelector('.modal-cinema-lounge').textContent = data.lounges;
        modal.querySelector('.modal-cinema-dining').textContent = data.dining;
        modal.querySelector('.modal-cinema-hours').textContent = data.hours;

        modal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    function closeModal() {
      modal.classList.remove('active');
      document.body.style.overflow = '';
    }

    if (modalClose) modalClose.addEventListener('click', closeModal);

    modal.addEventListener('click', (e) => {
      if (e.target === modal) closeModal();
    });

    const bookShowtimesBtn = modal.querySelector('#btn-modal-book-showtimes');
    if (bookShowtimesBtn) {
      bookShowtimesBtn.addEventListener('click', () => {
        closeModal();
        window.showToast('Showtimes Concierge', 'Redirecting to luxury screening selector...', '🎟️');
      });
    }

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal.classList.contains('active')) {
        closeModal();
      }
    });
  }

  // --- 3. Interactive Map Pins Explorer ---
  function initMapExplorer() {
    const hotspots = document.querySelectorAll('.map-hotspot');
    const destTitle = document.querySelector('.map-dest-title');
    const destAddress = document.querySelector('.map-dest-address');
    const destHalls = document.querySelector('.map-dest-halls');
    const destSound = document.querySelector('.map-dest-sound');

    hotspots.forEach((hotspot) => {
      hotspot.addEventListener('click', () => {
        const key = hotspot.getAttribute('data-cinema-key');
        const data = cinemaData[key];
        if (!data) return;

        // Highlight hotspot pin
        hotspots.forEach((h) => h.classList.remove('active'));
        hotspot.classList.add('active');

        // Update preview pane
        if (destTitle) destTitle.textContent = data.name;
        if (destAddress) destAddress.textContent = data.address;
        if (destHalls) destHalls.textContent = `${data.halls} Halls`;
        if (destSound) destSound.textContent = data.technologies[0];

        // Flash target cinema card in grid
        const targetCard = document.querySelector(`.cinema-card-item[data-cinema-key="${key}"]`);
        if (targetCard) {
          targetCard.scrollIntoView({ behavior: 'smooth', block: 'center' });
          targetCard.classList.add('gold-pulse');
          setTimeout(() => targetCard.classList.remove('gold-pulse'), 2500);
        }

        window.showToast('Destination Selected', data.name, '📍');
      });
    });
  }

  // Initialize Cinemas Page
  document.addEventListener('DOMContentLoaded', () => {
    initCinemaFilters();
    initCinemaModal();
    initMapExplorer();
  });
})();
