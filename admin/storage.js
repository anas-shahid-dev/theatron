// THEATRON Operations Suite - Centralized LocalStorage Data Service

const TheatronStorage = (() => {
  const MOVIES_KEY = 'theatron_movies_v2';
  const SHOWTIMES_KEY = 'theatron_showtimes_v2';
  const BOOKINGS_KEY = 'theatron_bookings_v2';
  const METRICS_KEY = 'theatron_metrics_v2';
  const CHART_KEY = 'theatron_chart_range';

  const defaultMetrics = {
    totalBookings: 1423,
    boxOfficeRevenue: 48921.96,
    bookingsTrend: '+14.2% vs last wk',
    revenueTrend: '+18.6% vs last wk',
    activeLounges: 3,
    totalScreens: 18
  };

  const defaultMovies = [
    {
      id: "mov_1",
      title: "DOOMSDAY: ECLIPSE PROTOCOL",
      director: "Dir. Denis Vance",
      genreLang: "Sci-Fi Thriller • English",
      genre: "Sci-Fi Thriller",
      lang: "English",
      duration: "2h 28m",
      rating: "PG-13",
      status: "SHOWING",
      artwork: "DOOMSDAY",
      occupancy: 92,
      credits: "Denis Vance, Oscar Isaac, Rebecca Ferguson",
      synopsis: "An unforgettable cinematic event mastered for THEATRON dual-laser auditoriums."
    },
    {
      id: "mov_2",
      title: "THE VELVET SOVEREIGN",
      director: "Dir. Camille Laurent",
      genreLang: "Drama • English",
      genre: "Drama",
      lang: "English",
      duration: "2h 14m",
      rating: "R",
      status: "SHOWING",
      artwork: "VELVET",
      occupancy: 78,
      credits: "Camille Laurent, Marion Cotillard",
      synopsis: "A gripping aristocratic drama set in early 20th century Europe."
    },
    {
      id: "mov_3",
      title: "NOCTURNE IN OBSIDIAN",
      director: "Dir. Lucian Moreau",
      genreLang: "Mystery • French",
      genre: "Mystery",
      lang: "French",
      duration: "2h 05m",
      rating: "R",
      status: "SHOWING",
      artwork: "NOCTURNE",
      occupancy: 64,
      credits: "Lucian Moreau, Vincent Cassel",
      synopsis: "A dark mystery unfolding in Parisian shadows."
    },
    {
      id: "mov_4",
      title: "AETHER & ASH",
      director: "Dir. Marcus Thorne",
      genreLang: "Action • English",
      genre: "Action",
      lang: "English",
      duration: "2h 19m",
      rating: "PG-13",
      status: "SHOWING",
      artwork: "AETHER",
      occupancy: 50,
      credits: "Marcus Thorne, Idris Elba",
      synopsis: "Interstellar battle for the remnants of a dying star."
    },
    {
      id: "mov_5",
      title: "CRIMSON SOLSTICE",
      director: "Dir. Sofia Mendoza",
      genreLang: "Romance • Spanish",
      genre: "Romance",
      lang: "Spanish",
      duration: "1h 58m",
      rating: "PG-13",
      status: "SHOWING",
      artwork: "CRIMSON",
      occupancy: 45,
      credits: "Sofia Mendoza, Javier Bardem",
      synopsis: "A passionate solar romance against all odds."
    },
    {
      id: "mov_6",
      title: "THE NINTH MONOLITH",
      director: "Dir. Hiroshi Takahashi",
      genreLang: "Sci-Fi Thriller • Japanese",
      genre: "Sci-Fi Thriller",
      lang: "Japanese",
      duration: "2h 22m",
      rating: "PG-13",
      status: "SHOWING",
      artwork: "MONOLITH",
      occupancy: 40,
      credits: "Hiroshi Takahashi, Ken Watanabe",
      synopsis: "An ancient alien structure discovered beneath the Pacific Ocean."
    },
    {
      id: "mov_7",
      title: "SOVEREIGN SHADOWS",
      director: "Dir. Julian Vance",
      genreLang: "Thriller • English",
      genre: "Thriller",
      lang: "English",
      duration: "2h 10m",
      rating: "PG-13",
      status: "UPCOMING",
      artwork: "VELVET",
      occupancy: 30,
      credits: "Julian Vance, Florence Pugh",
      synopsis: "Espionage and intrigue in the highest tiers of diplomatic hierarchy."
    },
    {
      id: "mov_8",
      title: "SOLARIS RESURGENT",
      director: "Dir. Elena Rostova",
      genreLang: "Sci-Fi • Russian",
      genre: "Sci-Fi",
      lang: "Russian",
      duration: "2h 35m",
      rating: "PG-13",
      status: "UPCOMING",
      artwork: "DOOMSDAY",
      occupancy: 25,
      credits: "Elena Rostova, Mads Mikkelsen",
      synopsis: "Cosmic consciousness reawakening at the boundaries of charted space."
    },
    {
      id: "mov_9",
      title: "THE GLASS LABYRINTH",
      director: "Dir. Arthur Pendelton",
      genreLang: "Drama • English",
      genre: "Drama",
      lang: "English",
      duration: "1h 52m",
      rating: "PG",
      status: "ARCHIVED",
      artwork: "NOCTURNE",
      occupancy: 20,
      credits: "Arthur Pendelton, Colin Firth",
      synopsis: "A contemplative exploration of memory and architectural illusion."
    }
  ];

  const defaultShowtimes = [
    {
      id: "st_1",
      movie: "DOOMSDAY : ECLIPSE PROTOCOL",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Grand IMAX Laser 1",
      format: "(IMAX Laser)",
      time: "14 : 30",
      price: "$22"
    },
    {
      id: "st_2",
      movie: "DOOMSDAY : ECLIPSE PROTOCOL",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Dolby Atmos Hall 2",
      format: "(Dolby Atmos)",
      time: "18 : 15",
      price: "$20"
    },
    {
      id: "st_3",
      movie: "DOOMSDAY : ECLIPSE PROTOCOL",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Royal Gold Lounge 3",
      format: "(Royal VIP)",
      time: "21 : 45",
      price: "$28"
    },
    {
      id: "st_4",
      movie: "DOOMSDAY : ECLIPSE PROTOCOL",
      cinema: "THEATRON Royal Promenade",
      auditorium: "IMAX 3D Auditorium 2",
      format: "(IMAX 3D)",
      time: "19 : 30",
      price: "$22"
    },
    {
      id: "st_5",
      movie: "THE VELVET SOVEREIGN",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Royal Gold Lounge 3",
      format: "(Royal VIP)",
      time: "17 : 00",
      price: "$26"
    },
    {
      id: "st_6",
      movie: "THE VELVET SOVEREIGN",
      cinema: "THEATRON Velvet Lounge",
      auditorium: "Royal VIP Salon 1",
      format: "(Royal VIP)",
      time: "20 : 30",
      price: "$30"
    },
    {
      id: "st_7",
      movie: "NOCTURNE IN OBSIDIAN",
      cinema: "THEATRON Velvet Lounge",
      auditorium: "Director's Screening Room 2",
      format: "(35mm Archival)",
      time: "19 : 00",
      price: "$24"
    },
    {
      id: "st_8",
      movie: "NOCTURNE IN OBSIDIAN",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Dolby Atmos Hall 2",
      format: "(Dolby Atmos)",
      time: "21 : 15",
      price: "$22"
    },
    {
      id: "st_9",
      movie: "AETHER & ASH",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Grand IMAX Laser 1",
      format: "(IMAX Laser)",
      time: "16 : 45",
      price: "$24"
    },
    {
      id: "st_10",
      movie: "AETHER & ASH",
      cinema: "THEATRON Royal Promenade",
      auditorium: "IMAX 3D Auditorium 2",
      format: "(IMAX 3D)",
      time: "22 : 00",
      price: "$22"
    },
    {
      id: "st_11",
      movie: "CRIMSON SOLSTICE",
      cinema: "THEATRON Velvet Lounge",
      auditorium: "Royal VIP Salon 1",
      format: "(Royal VIP)",
      time: "18 : 30",
      price: "$28"
    },
    {
      id: "st_12",
      movie: "CRIMSON SOLSTICE",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Royal Gold Lounge 3",
      format: "(Royal VIP)",
      time: "20 : 00",
      price: "$26"
    },
    {
      id: "st_13",
      movie: "THE NINTH MONOLITH",
      cinema: "THEATRON Grand Flagship",
      auditorium: "Grand IMAX Laser 1",
      format: "(IMAX Laser)",
      time: "12 : 15",
      price: "$22"
    },
    {
      id: "st_14",
      movie: "THE NINTH MONOLITH",
      cinema: "THEATRON Royal Promenade",
      auditorium: "IMAX 3D Auditorium 2",
      format: "(IMAX 3D)",
      time: "17 : 30",
      price: "$20"
    }
  ];

  const defaultBookings = [
    {
      id: "THT - 849201",
      patron: "Alexander Vance",
      movie: "THE VELVET SOVEREIGN",
      seats: "G5, G6",
      total: "$106.82",
      status: "Confirmed"
    },
    {
      id: "THT - 731904",
      patron: "Alexander Vance",
      movie: "NOCTURNE IN OBSIDIAN",
      seats: "E4, E5",
      total: "$57.23",
      status: "Completed"
    },
    {
      id: "THT - 902418",
      patron: "Sophia Chen",
      movie: "DOOMSDAY: ECLIPSE PROTOCOL",
      seats: "F6, F7, F8",
      total: "$107.91",
      status: "Confirmed"
    }
  ];

  function init() {
    if (!localStorage.getItem(METRICS_KEY)) {
      localStorage.setItem(METRICS_KEY, JSON.stringify(defaultMetrics));
    }
    if (!localStorage.getItem(MOVIES_KEY)) {
      localStorage.setItem(MOVIES_KEY, JSON.stringify(defaultMovies));
    }
    if (!localStorage.getItem(SHOWTIMES_KEY)) {
      localStorage.setItem(SHOWTIMES_KEY, JSON.stringify(defaultShowtimes));
    }
    if (!localStorage.getItem(BOOKINGS_KEY)) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(defaultBookings));
    }
  }

  init();

  return {
    // Metrics
    getMetrics() {
      try {
        const data = localStorage.getItem(METRICS_KEY);
        return data ? JSON.parse(data) : { ...defaultMetrics };
      } catch (e) {
        return { ...defaultMetrics };
      }
    },
    saveMetrics(metrics) {
      localStorage.setItem(METRICS_KEY, JSON.stringify(metrics));
    },

    // Movies
    getMovies() {
      try {
        const data = localStorage.getItem(MOVIES_KEY);
        return data ? JSON.parse(data) : defaultMovies;
      } catch (e) {
        return defaultMovies;
      }
    },
    saveMovies(movies) {
      localStorage.setItem(MOVIES_KEY, JSON.stringify(movies));
    },
    addMovie(movie) {
      const movies = this.getMovies();
      movies.unshift(movie);
      this.saveMovies(movies);
      return movies;
    },
    updateMovie(updatedMovie) {
      let movies = this.getMovies();
      movies = movies.map(m => m.id === updatedMovie.id ? { ...m, ...updatedMovie } : m);
      this.saveMovies(movies);
      return movies;
    },
    deleteMovie(movieId) {
      let movies = this.getMovies();
      movies = movies.filter(m => m.id !== movieId);
      this.saveMovies(movies);
      return movies;
    },

    // Showtimes
    getShowtimes() {
      try {
        const data = localStorage.getItem(SHOWTIMES_KEY);
        return data ? JSON.parse(data) : defaultShowtimes;
      } catch (e) {
        return defaultShowtimes;
      }
    },
    saveShowtimes(showtimes) {
      localStorage.setItem(SHOWTIMES_KEY, JSON.stringify(showtimes));
    },
    addShowtime(slot) {
      const showtimes = this.getShowtimes();
      showtimes.unshift(slot);
      this.saveShowtimes(showtimes);
      return showtimes;
    },
    deleteShowtime(showtimeId) {
      let showtimes = this.getShowtimes();
      showtimes = showtimes.filter(s => s.id !== showtimeId);
      this.saveShowtimes(showtimes);
      return showtimes;
    },

    // Bookings (updates Total Bookings & Box Office Revenue dynamically!)
    getBookings() {
      try {
        const data = localStorage.getItem(BOOKINGS_KEY);
        return data ? JSON.parse(data) : defaultBookings;
      } catch (e) {
        return defaultBookings;
      }
    },
    saveBookings(bookings) {
      localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
    },
    addBooking(booking) {
      const bookings = this.getBookings();
      bookings.unshift(booking);
      this.saveBookings(bookings);

      // Increment Total Bookings & Box Office Revenue dynamically in LocalStorage
      const metrics = this.getMetrics();
      metrics.totalBookings = (metrics.totalBookings || 1423) + 1;
      const numVal = parseFloat(String(booking.total).replace(/[^0-9.]/g, '')) || 0;
      metrics.boxOfficeRevenue = (metrics.boxOfficeRevenue || 48921.96) + numVal;
      this.saveMetrics(metrics);

      return bookings;
    },
    deleteBooking(bookingId) {
      let bookings = this.getBookings();
      const target = bookings.find(b => b.id === bookingId);
      bookings = bookings.filter(b => b.id !== bookingId);
      this.saveBookings(bookings);

      if (target) {
        const metrics = this.getMetrics();
        if (metrics.totalBookings > 0) metrics.totalBookings -= 1;
        const numVal = parseFloat(String(target.total).replace(/[^0-9.]/g, '')) || 0;
        metrics.boxOfficeRevenue = Math.max(0, (metrics.boxOfficeRevenue || 48921.96) - numVal);
        this.saveMetrics(metrics);
      }

      return bookings;
    },

    // Artwork theme mapper
    getArtwork(theme) {
      const map = {
        'DOOMSDAY': { svg: 'assets/poster_doomsday.svg', fallback: 'assets/doomsday.png' },
        'VELVET': { svg: 'assets/poster_velvet.svg', fallback: 'assets/velvet_sovereign.png' },
        'NOCTURNE': { svg: 'assets/poster_nocturne.svg', fallback: 'assets/nocturne.png' },
        'AETHER': { svg: 'assets/poster_aether.svg', fallback: 'assets/aether_ash.png' },
        'CRIMSON': { svg: 'assets/poster_crimson.svg', fallback: 'assets/crimson_solstice.png' },
        'MONOLITH': { svg: 'assets/poster_monolith.svg', fallback: 'assets/ninth_monolith.png' }
      };
      return map[theme] || map['DOOMSDAY'];
    }
  };
})();
