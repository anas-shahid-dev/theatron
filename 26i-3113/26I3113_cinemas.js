/**
 * THEATRON LUXURY CINEMA PLATFORM — MEMBER 4 (26I3113)
 * Cinema Destinations Controller: Search, Filter, Sort, Modals, Seat Explorer & Interactive Locator
 */

const CINEMAS_DATA = [
  {
    id: "grand-palais",
    name: "Theatron Grand Palais Flagship",
    city: "Metropolis Central",
    address: "88 Sovereign Boulevard, Grand Suite 100",
    screens: 12,
    rating: 9.9,
    projection: "Dual-Laser IMAX 70mm & Christie 4K",
    sound: "128-Channel Dolby Atmos",
    facilities: ["imax", "atmos", "velvet", "valet", "dining", "accessible"],
    badge: "World Flagship",
    description: "Our crowning architectural achievement. Houses the continental IMAX 70mm Sovereign auditorium with 1.43:1 laser fidelity and dual level Acoustic Maroon Velvet Lounges.",
    showtimes: ["14:30 PM (70mm)", "17:45 PM (IMAX Laser)", "20:30 PM (VIP Box)", "23:00 PM (Night Special)"],
    menuSpecial: "Alba White Truffle Popcorn & Dom Pérignon Vintage Flute",
    parking: "Complimentary Subterranean Valet Porte-Cochère with EV Supercharging"
  },
  {
    id: "mayfair-lounge",
    name: "Theatron Mayfair Velvet Sanctuary",
    city: "Mayfair London",
    address: "14 Curzon Street, Mayfair, London W1J 5HN",
    screens: 6,
    rating: 9.8,
    projection: "Christie 4K Pure Laser",
    sound: "Meyer Sound Expansive Atmos",
    facilities: ["atmos", "velvet", "valet", "dining", "accessible"],
    badge: "Heritage Salon",
    description: "Nestled within an Edwardian mansion, featuring hand-stitched Connolly leather recliners, walnut acoustic paneling, and an extensive private champagne cellar.",
    showtimes: ["15:00 PM", "18:15 PM", "21:00 PM"],
    menuSpecial: "Petrossian Oscietra Caviar Blinis & Billecart-Salmon Rosé",
    parking: "Dedicated Curzon Street Valet Drop-off & Mayfair Parking Subsidy"
  },
  {
    id: "knightsbridge-royale",
    name: "Theatron Knightsbridge Royale",
    city: "Knightsbridge London",
    address: "72 Brompton Road, Knightsbridge, SW3 1ER",
    screens: 8,
    rating: 9.7,
    projection: "Dual-Laser IMAX & 35mm Celluloid",
    sound: "Dolby Atmos 9.1 Studio Mix",
    facilities: ["imax", "atmos", "velvet", "valet", "accessible"],
    badge: "Royal Sovereign Boxes",
    description: "Moments from Harrods, providing private four-guest sovereign boxes with soundproofed glass partitions and private butler call consoles.",
    showtimes: ["14:00 PM", "16:45 PM", "19:30 PM", "22:15 PM"],
    menuSpecial: "Artisan Valrhona Dark Chocolate Pralines & English Sparkling Flute",
    parking: "Brompton Private Gate Valet with Direct Lift Admission"
  },
  {
    id: "beverly-hills",
    name: "Theatron Beverly Hills Pavilion",
    city: "Beverly Hills",
    address: "9400 Wilshire Boulevard, Beverly Hills, CA 90212",
    screens: 10,
    rating: 9.8,
    projection: "Dual-Laser IMAX 1.43:1 & 70mm Special",
    sound: "Dolby Atmos 128-Ch Immersive",
    facilities: ["imax", "atmos", "velvet", "valet", "dining", "accessible"],
    badge: "Premiere Landmark",
    description: "The preferred screening sanctuary for Academy voting members and auteur directors. Features private rooftop terrace lounge and sommelier-curated culinary service.",
    showtimes: ["13:30 PM", "16:15 PM", "19:45 PM", "22:30 PM"],
    menuSpecial: "Wagyu Sliders with Truffle Aioli & Napa Valley Cabernet",
    parking: "Wilshire Subterranean Secure Valet with Private Elevator Portico"
  },
  {
    id: "ginza-sovereign",
    name: "Theatron Ginza Sovereign",
    city: "Tokyo Ginza",
    address: "6-10-1 Ginza, Chuo City, Tokyo 104-0061",
    screens: 7,
    rating: 9.9,
    projection: "Christie 4K Dual-Laser High Contrast",
    sound: "Acoustic Horizon 360 Spatial",
    facilities: ["atmos", "velvet", "dining", "accessible"],
    badge: "Zen Architectural Wonder",
    description: "Mastercrafted with Hinoki cedar acoustic baffles, tatami-inspired private screening suites, and a bespoke rare Japanese whiskey salon.",
    showtimes: ["14:00 PM", "17:15 PM", "20:00 PM"],
    menuSpecial: "Hokkaido Sea Salted Nori Popcorn & Hibiki 21 Highball",
    parking: "Robotic Automated Vehicle Vault with Concierge Reception"
  },
  {
    id: "dubai-palm",
    name: "Theatron Dubai Palm Observatory",
    city: "Dubai Palm",
    address: "Crescent West, Palm Jumeirah, Dubai, UAE",
    screens: 9,
    rating: 9.8,
    projection: "Dual-Laser IMAX & 3D Depth Master",
    sound: "Dolby Atmos Studio 128-Ch",
    facilities: ["imax", "atmos", "velvet", "valet", "dining", "accessible"],
    badge: "Panoramic Sky Sanctuary",
    description: "Suspended over the Arabian Gulf with panoramic water views from the pre-show lounge. Features 24k gold-leaf auditorium accents and private helipad access.",
    showtimes: ["15:30 PM", "18:45 PM", "21:30 PM", "00:15 AM"],
    menuSpecial: "Saffron Spiced Artisan Kernels & Royal Date Mocktail Infusion",
    parking: "Porte-Cochère VIP Chauffeur & Helicopter Transfer Concierge"
  },
  {
    id: "paris-vendome",
    name: "Theatron Place Vendôme",
    city: "Paris 1er",
    address: "22 Place Vendôme, 75001 Paris, France",
    screens: 6,
    rating: 9.7,
    projection: "35mm Archival & 4K Laser Master",
    sound: "L-Acoustics Spatial Audio",
    facilities: ["atmos", "velvet", "dining", "accessible"],
    badge: "Haute Cinéma Salon",
    description: "Housed in a registered 18th-century monument, showcasing restored French New Wave and international classics with velvet salon furnishings.",
    showtimes: ["16:00 PM", "19:00 PM", "21:45 PM"],
    menuSpecial: "French Macaron Trio & Krug Grande Cuvée Brut Reserve",
    parking: "Vendôme Underground Reserved Bay with Concierge Chauffeur"
  },
  {
    id: "manhattan-hudson",
    name: "Theatron Hudson Yards Crown",
    city: "Metropolis Central",
    address: "500 West 33rd Street, Hudson Yards, NY 10001",
    screens: 11,
    rating: 9.8,
    projection: "Dual-Laser IMAX 70mm & Christie 4K",
    sound: "Dolby Atmos 128-Channel",
    facilities: ["imax", "atmos", "velvet", "valet", "dining", "accessible"],
    badge: "Skyline Flagship",
    description: "Elevated high above the Manhattan skyline with floor-to-ceiling acoustic glass lounges and full-width curved IMAX screens.",
    showtimes: ["13:00 PM", "16:00 PM", "19:15 PM", "22:00 PM"],
    menuSpecial: "Truffle Lobster Roll Bites & Smoked Old Fashioned",
    parking: "Private 33rd Street Valet Receiving Terminal with Direct Elevator"
  }
];

document.addEventListener('DOMContentLoaded', () => {
  renderCinemas(CINEMAS_DATA);
  initCinemaFilteringAndSearch();
  initCinemaDetailsModal();
  initSeatFeatureExplorer();
  initInteractiveMapPins();
});

/* 1. RENDER CINEMAS */
function renderCinemas(cinemas) {
  const container = document.getElementById('cinemas-cards-grid');
  const countEl = document.getElementById('cinema-results-count');
  if (!container) return;

  if (countEl) countEl.textContent = `${cinemas.length} Destination${cinemas.length === 1 ? '' : 's'}`;

  if (cinemas.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 4rem 1rem;">
        <h3 style="color: var(--gold-light); margin-bottom: 0.5rem;">No Demonstration Destinations Matched</h3>
        <p style="color: var(--text-muted);">Adjust your search criteria, selected city, or facility filters to discover our sovereign flagship venues.</p>
        <button class="btn btn-outline-gold btn-sm" style="margin-top: 1.5rem;" onclick="resetAllFilters()">Reset All Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = cinemas.map((cinema, idx) => `
    <div class="theatron-media-card reveal-on-scroll stagger-${(idx % 3) + 1}">
      <div class="media-poster-box" style="background-image: linear-gradient(180deg, rgba(10, 6, 9, 0.3) 0%, rgba(20, 7, 16, 0.95) 100%), radial-gradient(circle at center, rgba(66, 15, 39, 0.6) 0%, #14050f 100%);">
        <div class="media-top-badges">
          <span class="badge-tag">${cinema.screens} Halls</span>
          <span class="badge-tag badge-rating">★ ${cinema.rating}</span>
        </div>
        <div style="position: relative; z-index: 2;">
          <div style="font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase; letter-spacing: 0.15em;">${cinema.city}</div>
          <h3 style="font-size: 1.35rem; color: #fff; margin-top: 2px;">${cinema.name}</h3>
        </div>
      </div>

      <div class="media-card-body">
        <p style="font-size: 0.85rem; color: var(--text-secondary); line-height: 1.6; margin-bottom: 1.25rem;">
          ${cinema.description}
        </p>

        <div style="font-size: 0.8rem; margin-bottom: 1.25rem; border-top: 1px solid var(--border-subtle); padding-top: 0.85rem;">
          <div style="color: var(--gold-warm); font-weight: 600; margin-bottom: 3px;">${cinema.projection}</div>
          <div style="color: var(--text-muted);">${cinema.sound}</div>
        </div>

        <div style="display: flex; gap: 0.75rem;">
          <button class="btn btn-maroon btn-sm btn-inspect-cinema" data-id="${cinema.id}" style="flex: 1;">
            Showtimes & Specs
          </button>
          <button class="btn btn-outline-gold btn-sm btn-book-cinema-direct" data-name="${cinema.name}">
            Book Hall
          </button>
        </div>
      </div>
    </div>
  `).join('');

  // Re-attach listeners to dynamic elements
  attachDynamicCardListeners();
}

/* 2. SEARCH & FILTERING */
let activeCityFilter = "all";
let activeFacilityFilters = [];
let activeSortOrder = "screens-desc";
let currentSearchQuery = "";

function initCinemaFilteringAndSearch() {
  const searchInput = document.getElementById('cinema-search-input');
  const citySelect = document.getElementById('cinema-city-select');
  const sortSelect = document.getElementById('cinema-sort-select');
  const facilityPills = document.querySelectorAll('.facility-filter-pill');

  searchInput?.addEventListener('input', (e) => {
    currentSearchQuery = e.target.value.toLowerCase().trim();
    applyFilters();
  });

  citySelect?.addEventListener('change', (e) => {
    activeCityFilter = e.target.value;
    applyFilters();
  });

  sortSelect?.addEventListener('change', (e) => {
    activeSortOrder = e.target.value;
    applyFilters();
  });

  facilityPills.forEach(pill => {
    pill.addEventListener('click', () => {
      const facility = pill.getAttribute('data-facility');
      pill.classList.toggle('active');

      if (pill.classList.contains('active')) {
        activeFacilityFilters.push(facility);
      } else {
        activeFacilityFilters = activeFacilityFilters.filter(f => f !== facility);
      }
      applyFilters();
    });
  });
}

function applyFilters() {
  let filtered = CINEMAS_DATA.filter(cinema => {
    // Text search
    const matchesQuery = !currentSearchQuery || 
      cinema.name.toLowerCase().includes(currentSearchQuery) ||
      cinema.city.toLowerCase().includes(currentSearchQuery) ||
      cinema.projection.toLowerCase().includes(currentSearchQuery) ||
      cinema.address.toLowerCase().includes(currentSearchQuery);

    // City filter
    const matchesCity = activeCityFilter === "all" || cinema.city.toLowerCase().includes(activeCityFilter.toLowerCase());

    // Facility filter (must have all selected facilities)
    const matchesFacilities = activeFacilityFilters.every(fac => cinema.facilities.includes(fac));

    return matchesQuery && matchesCity && matchesFacilities;
  });

  // Sorting
  if (activeSortOrder === "screens-desc") {
    filtered.sort((a, b) => b.screens - a.screens);
  } else if (activeSortOrder === "rating-desc") {
    filtered.sort((a, b) => b.rating - a.rating);
  } else if (activeSortOrder === "name-asc") {
    filtered.sort((a, b) => a.name.localeCompare(b.name));
  }

  renderCinemas(filtered);
}

window.resetAllFilters = function() {
  activeCityFilter = "all";
  activeFacilityFilters = [];
  activeSortOrder = "screens-desc";
  currentSearchQuery = "";

  const searchInput = document.getElementById('cinema-search-input');
  const citySelect = document.getElementById('cinema-city-select');
  const sortSelect = document.getElementById('cinema-sort-select');
  const facilityPills = document.querySelectorAll('.facility-filter-pill');

  if (searchInput) searchInput.value = "";
  if (citySelect) citySelect.value = "all";
  if (sortSelect) sortSelect.value = "screens-desc";
  facilityPills.forEach(p => p.classList.remove('active'));

  applyFilters();
};

/* 3. DYNAMIC CARD LISTENERS & MODAL */
function attachDynamicCardListeners() {
  document.querySelectorAll('.btn-inspect-cinema').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.getAttribute('data-id');
      const cinema = CINEMAS_DATA.find(c => c.id === id);
      if (!cinema) return;

      document.getElementById('modal-cinema-title').textContent = cinema.name;
      document.getElementById('modal-cinema-city').textContent = `${cinema.city} • ${cinema.badge}`;
      document.getElementById('modal-cinema-desc').textContent = cinema.description;
      document.getElementById('modal-cinema-address').textContent = cinema.address;
      document.getElementById('modal-cinema-projection').textContent = cinema.projection;
      document.getElementById('modal-cinema-sound').textContent = cinema.sound;
      document.getElementById('modal-cinema-menu').textContent = cinema.menuSpecial;
      document.getElementById('modal-cinema-parking').textContent = cinema.parking;

      // Render Showtimes list
      const showtimesBox = document.getElementById('modal-cinema-showtimes');
      if (showtimesBox) {
        showtimesBox.innerHTML = cinema.showtimes.map(st => `
          <div style="background: rgba(0, 0, 0, 0.5); border: 1px solid var(--border-gold); padding: 0.6rem 0.9rem; border-radius: var(--radius-sm); display: flex; justify-content: space-between; align-items: center;">
            <span style="font-weight: 600; color: #fff;">${st}</span>
            <button class="btn btn-gold btn-sm" style="padding: 0.25rem 0.65rem; font-size: 0.75rem;" onclick="handleDirectBooking('${cinema.name}')">Select</button>
          </div>
        `).join('');
      }

      window.openTheatronModal('cinema-details-modal');
    });
  });

  document.querySelectorAll('.btn-book-cinema-direct').forEach(btn => {
    btn.addEventListener('click', () => {
      const name = btn.getAttribute('data-name');
      handleDirectBooking(name);
    });
  });
}

function handleDirectBooking(cinemaName) {
  if (window.showTheatronToast) {
    window.showTheatronToast('Sovereign Auditorium Reserved', `Reserved demonstration seating at ${cinemaName}. Notification dispatched to digital wallet.`, 'success');
  }
}

/* 4. ROYAL RECLINER INTERACTIVE SEAT EXPLORER */
function initSeatFeatureExplorer() {
  const tabs = document.querySelectorAll('.seat-feature-tab');
  const titleEl = document.getElementById('seat-feature-title');
  const descEl = document.getElementById('seat-feature-desc');
  const specEl = document.getElementById('seat-feature-spec');

  const SEAT_FEATURES = {
    leather: {
      title: "Hand-Stitched Italian Connolly Leather",
      desc: "Full-grain semi-aniline hides sourced from Northern Italy, hand-finished with double burgundy stitching and breathable micro-perforations for optimal acoustic dampening.",
      spec: "100% Top-Grain Connolly • Maroon Velvet Trim"
    },
    motorized: {
      title: "Whisper-Quiet Quad-Motor Recline",
      desc: "Independent dual-actuator motors allowing 170-degree ergonomic zero-gravity inclination. Powered by ultra-low decibel servo drives ensuring zero auditory disruption during films.",
      spec: "170° Infinite Articulation • Silent Brushless Motors"
    },
    concierge: {
      title: "Tactile Sommelier Call Console",
      desc: "Discreet brushed brass button integrated into your right armrest. Summons a dedicated theater attendant directly to your recliner with zero light pollution.",
      spec: "Silent Infrared Calling • Dedicated Lounge Attendant"
    },
    climate: {
      title: "Dual-Zone Climate & Ergonomic Lumbar Heat",
      desc: "Personal temperature adjustment with carbon-fiber heating grids and cooling ventilation integrated into both the lumbar cushion and motorized leg rest.",
      spec: "Adjustable 18°C - 26°C Range • Independent Cushion Zones"
    }
  };

  tabs.forEach(tab => {
    tab.addEventListener('click', () => {
      tabs.forEach(t => t.classList.remove('active'));
      tab.classList.add('active');

      const featureKey = tab.getAttribute('data-feature');
      const data = SEAT_FEATURES[featureKey];
      if (data && titleEl && descEl && specEl) {
        titleEl.textContent = data.title;
        descEl.textContent = data.desc;
        specEl.textContent = data.spec;
      }
    });
  });
}

/* 5. INTERACTIVE MAP PINS */
function initInteractiveMapPins() {
  document.querySelectorAll('.map-locator-pin').forEach(pin => {
    pin.addEventListener('click', () => {
      const cinemaId = pin.getAttribute('data-cinema-id');
      const cinema = CINEMAS_DATA.find(c => c.id === cinemaId);
      if (!cinema) return;

      document.querySelectorAll('.map-locator-pin').forEach(p => p.classList.remove('active'));
      pin.classList.add('active');

      const previewBox = document.getElementById('map-pin-preview');
      if (previewBox) {
        previewBox.innerHTML = `
          <div style="font-size: 0.75rem; color: var(--gold-primary); text-transform: uppercase;">Selected Venue Coordinates</div>
          <h4 style="color: #fff; margin: 2px 0 6px;">${cinema.name}</h4>
          <p style="font-size: 0.85rem; color: var(--text-secondary); margin-bottom: 0.75rem;">${cinema.address}</p>
          <div style="display: flex; gap: 0.5rem;">
            <button class="btn btn-sm btn-gold" onclick="document.querySelector('.btn-inspect-cinema[data-id=\\'${cinema.id}\\']')?.click()">Inspect Showtimes</button>
            <button class="btn btn-sm btn-outline-gold" onclick="window.showTheatronToast('Directions Dispatched', 'Encrypted GPS waypoint transmitted to vehicle nav console.', 'info')">Send GPS to Car</button>
          </div>
        `;
        previewBox.style.display = 'block';
      }
    });
  });
}
