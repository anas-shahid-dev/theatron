Build showtimes.html, showtimes.css, and showtimes.js in the root folder of E_Group_Theatron. Match the exact navbar, footer, colors, and fonts from theatron-shared.css and index.html, and use window.Theatron from theatron-shared.js (STORAGE_KEYS, createPosterPlaceholder, updateNavbarState). Include filters for movie, cinema, date, and lounge format, interactive showtime cards with hall names and pricing, disabled states for sold-out/past slots, empty-filter reset handling, and save the chosen showtime to theatron_latest_booking before navigating to seat-selection.html. Use realistic cinema data with no lorem ipsum.

Built showtimes.html, showtimes.css, and showtimes.js in the root of E_Group_Theatron.

Summary of Implementation

  

  

Shared Design, Navbar & Footer (showtimes.html, showtimes.css):


  

  
Uses theatron-shared.css and the Google Fonts stack (Cinzel, Plus Jakarta Sans, Inter, Playfair Display, JetBrains Mono) with the shared .site-header navigation bar (Home, Movies, Coming Soon, Cinemas, Showtimes marked is-active, Tickets badge #nav-tickets-count, Patron pill #nav-patron-initials / #nav-patron-name) and .site-footer.

  
Uses window.Theatron from theatron-shared.js: STORAGE_KEYS (BOOKINGS, LATEST), updateNavbarState, createPosterPlaceholder (as error fallback on poster images and fallback payload field), readStorage, writeStorage, getCurrentUser, and DEFAULT_BOOKING.

  

  

  

  

Filters, Schedule & Interactive Showtime Cards (showtimes.js):


  

  
Realistic Cinema Data: 6 currently showing feature films (DOOMSDAY: ECLIPSE PROTOCOL, THE VELVET SOVEREIGN, NOCTURNE IN OBSIDIAN, AETHER & ASH, CRIMSON SOLSTICE, THE NINTH MONOLITH), 4 signature venues (THEATRON Grand Flagship, THEATRON Elysium Palace, THEATRON Celestial Pavilion, THEATRON Astral Sanctuary), and 5 lounge formats (Dual-Laser IMAX, Royal Gold Lounge, Dolby Atmos Suite, Velvet Sovereign Salon, 35mm Archival).

  
Filters: Dynamic 5-day date strip (#date-strip), Motion Picture select (#filter-movie), Cinema Sanctuary select (#filter-cinema), Lounge Format select (#filter-format) synced with quick-filter chips (#format-chips), plus URL query-parameter presets (?movie=, ?cinema=, ?format=, ?date=).

  
Slot States & Reset Handling: Each .showtime-slot button displays screening time, hall name, lounge format, per-seat pricing, and availability status (seats left, Only X left, Sold Out, Past). Sold-out and past slots (computed against local time for today) render with disabled, aria-disabled="true", and muted/strikethrough styling. When filters produce zero matches, #empty-state renders with #btn-empty-reset (alongside #btn-reset-filters).

  
Booking Handoff: Clicking an available showtime card persists the selected screening payload (showtimeId, movieId, movieTitle, poster, cinema, hall, format, date, time, pricePerSeat, rating, runtime, language, patron, seats: [], timestamp) to localStorage under theatron_latest_booking and navigates to seat-selection.html.

  

  

  
Verification

  
Verified via PowerShell static checks on showtimes.html and showtimes.js: all 11 getElementById references match elements in showtimes.html (Missing IDs empty) and all 6 poster paths resolve in posters/. (node was not installed in this environment, and interactive browser verification was not run.)

  