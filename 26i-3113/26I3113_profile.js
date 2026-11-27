/**
 * THEATRON LUXURY CINEMA PLATFORM — MEMBER 4 (26I3113)
 * Profile Dashboard Controller: LocalStorage, 3D Card, Live Form Edit, Rewards & Bookings
 */

const DEFAULT_PROFILE = {
  fullName: "Lord Alexander Sterling",
  email: "a.sterling@theatron-privilege.com",
  phone: "+1 (555) 789-2401",
  birthday: "1988-11-14",
  billingAddress: "450 Mayfair Boulevard, Suite 12B, Central District",
  preferredLanguage: "English (UK)",
  memberSince: "October 2021",
  memberId: "TH-8829-GOLD",
  tier: "Gold Sovereign",
  points: 7850,
  targetPoints: 10000,
  homeCinema: "Theatron Grand Palais Flagship",
  seatingPref: "Center Royal Recliner (Row F)",
  soundPref: "Dolby Atmos 128-Ch",
  favoriteDirector: "Christopher Nolan",
  genres: ["Sci-Fi", "Neo-Noir", "Historical Epic", "Psychological Thriller"],
  notifications: {
    smsTickets: true,
    vipInvites: true,
    promoOffers: false,
    champagneAlerts: true,
    weeklyGazette: true
  }
};

document.addEventListener('DOMContentLoaded', () => {
  loadProfileData();
  initDigitalCardFlip();
  initProfileEditForm();
  initAnimatedCounters();
  initRewardsRedemption();
  initUpcomingBooking();
  initPreferencesInteractions();
});

/* 1. LOAD & SYNC PROFILE DATA */
function getProfileData() {
  const saved = localStorage.getItem('theatron_profile_data');
  if (saved) {
    try {
      return { ...DEFAULT_PROFILE, ...JSON.parse(saved) };
    } catch (e) {
      console.error(e);
    }
  }
  return { ...DEFAULT_PROFILE };
}

function saveProfileData(data) {
  localStorage.setItem('theatron_profile_data', JSON.stringify(data));
}

function loadProfileData() {
  const data = getProfileData();

  document.querySelectorAll('.display-full-name').forEach(el => el.textContent = data.fullName);
  document.querySelectorAll('.display-email').forEach(el => el.textContent = data.email);
  document.querySelectorAll('.display-phone').forEach(el => el.textContent = data.phone);
  document.querySelectorAll('.display-birthday').forEach(el => el.textContent = data.birthday);
  document.querySelectorAll('.display-address').forEach(el => el.textContent = data.billingAddress);
  document.querySelectorAll('.display-language').forEach(el => el.textContent = data.preferredLanguage);
  document.querySelectorAll('.display-member-id').forEach(el => el.textContent = data.memberId);
  document.querySelectorAll('.display-points').forEach(el => el.textContent = data.points.toLocaleString());
  document.querySelectorAll('.display-tier').forEach(el => el.textContent = data.tier);
  document.querySelectorAll('.display-home-cinema').forEach(el => el.textContent = data.homeCinema);
  document.querySelectorAll('.display-seating-pref').forEach(el => el.textContent = data.seatingPref);
  document.querySelectorAll('.display-sound-pref').forEach(el => el.textContent = data.soundPref);
  document.querySelectorAll('.display-director').forEach(el => el.textContent = data.favoriteDirector);

  const initials = data.fullName.split(' ').map(n => n[0]).join('').substring(0, 2);
  document.querySelectorAll('.display-initials').forEach(el => el.textContent = initials);

  const progressPercent = Math.min(100, Math.round((data.points / data.targetPoints) * 100));
  const fill = document.getElementById('tier-progress-fill');
  const percentText = document.getElementById('tier-progress-percent');
  const neededText = document.getElementById('tier-points-needed');
  if (fill) fill.style.width = `${progressPercent}%`;
  if (percentText) percentText.textContent = `${progressPercent}%`;
  if (neededText) neededText.textContent = `${(data.targetPoints - data.points).toLocaleString()} pts to Velvet Black`;

  if (data.notifications) {
    Object.keys(data.notifications).forEach(key => {
      const toggle = document.querySelector(`input[data-pref="${key}"]`);
      if (toggle) toggle.checked = data.notifications[key];
    });
  }

  document.querySelectorAll('.genre-chip').forEach(chip => {
    const genre = chip.getAttribute('data-genre');
    if (data.genres.includes(genre)) {
      chip.classList.add('active');
    } else {
      chip.classList.remove('active');
    }
  });
}

/* 2. DIGITAL MEMBERSHIP CARD 3D FLIP */
function initDigitalCardFlip() {
  const card = document.getElementById('digital-membership-card');
  const flipTrigger = document.getElementById('flip-card-btn');

  function toggleFlip() {
    if (card) {
      card.classList.toggle('flipped');
      if (window.showTheatronToast) {
        const isBack = card.classList.contains('flipped');
        window.showTheatronToast('Digital Card Rotated', isBack ? 'Displaying Secure QR & Magnetic Barcode' : 'Displaying Embossed Identity & Status', 'info');
      }
    }
  }

  if (card) card.addEventListener('click', toggleFlip);
  if (flipTrigger) flipTrigger.addEventListener('click', (e) => {
    e.stopPropagation();
    toggleFlip();
  });
}

/* 3. PROFILE EDIT FORM & MODAL */
function initProfileEditForm() {
  const form = document.getElementById('edit-profile-form');
  const openBtn = document.getElementById('open-edit-profile-modal');

  if (openBtn) {
    openBtn.addEventListener('click', () => {
      const data = getProfileData();
      document.getElementById('input-name').value = data.fullName;
      document.getElementById('input-email').value = data.email;
      document.getElementById('input-phone').value = data.phone;
      document.getElementById('input-birthday').value = data.birthday;
      document.getElementById('input-address').value = data.billingAddress;
      document.getElementById('input-language').value = data.preferredLanguage;
      document.getElementById('input-home-cinema').value = data.homeCinema;
      document.getElementById('input-director').value = data.favoriteDirector;
      window.openTheatronModal('profile-edit-modal');
    });
  }

  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const current = getProfileData();
      const updated = {
        ...current,
        fullName: document.getElementById('input-name').value.trim(),
        email: document.getElementById('input-email').value.trim(),
        phone: document.getElementById('input-phone').value.trim(),
        birthday: document.getElementById('input-birthday').value,
        billingAddress: document.getElementById('input-address').value.trim(),
        preferredLanguage: document.getElementById('input-language').value,
        homeCinema: document.getElementById('input-home-cinema').value,
        favoriteDirector: document.getElementById('input-director').value.trim()
      };

      saveProfileData(updated);
      loadProfileData();
      window.closeTheatronModal('profile-edit-modal');
      window.showTheatronToast('Profile Updated', 'Personal credentials and cinema settings saved successfully.', 'success');
    });
  }
}

/* 4. ANIMATED COUNTERS */
function initAnimatedCounters() {
  const counters = document.querySelectorAll('.animate-stat-number');
  if (!counters.length) return;

  const observer = new IntersectionObserver((entries, obs) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const target = parseInt(entry.target.getAttribute('data-target') || '0', 10);
        animateValue(entry.target, 0, target, 1600);
        obs.unobserve(entry.target);
      }
    });
  }, { threshold: 0.2 });

  counters.forEach(c => observer.observe(c));

  function animateValue(obj, start, end, duration) {
    let startTimestamp = null;
    const step = (timestamp) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const easeProgress = 1 - Math.pow(1 - progress, 3);
      const current = Math.floor(easeProgress * (end - start) + start);
      obj.textContent = current.toLocaleString();
      if (progress < 1) {
        window.requestAnimationFrame(step);
      } else {
        obj.textContent = end.toLocaleString();
      }
    };
    window.requestAnimationFrame(step);
  }
}

/* 5. REWARDS REDEMPTION */
function initRewardsRedemption() {
  document.querySelectorAll('.btn-redeem-reward').forEach(btn => {
    btn.addEventListener('click', () => {
      const rewardName = btn.getAttribute('data-reward-name');
      const cost = parseInt(btn.getAttribute('data-reward-cost') || '0', 10);
      const data = getProfileData();

      if (data.points < cost) {
        window.showTheatronToast('Insufficient Loyalty Points', `You require ${cost.toLocaleString()} points for ${rewardName}. You have ${data.points.toLocaleString()} pts.`, 'warning');
        return;
      }

      data.points -= cost;
      saveProfileData(data);
      loadProfileData();

      window.showTheatronToast('Voucher Unlocked!', `Redeemed ${rewardName} for ${cost.toLocaleString()} pts. Voucher sent to wallet.`, 'success');
    });
  });
}

/* 6. UPCOMING BOOKING DEMO */
function initUpcomingBooking() {
  const timerEl = document.getElementById('screening-countdown');
  if (timerEl) {
    const targetDate = new Date();
    targetDate.setDate(targetDate.getDate() + 3);
    targetDate.setHours(19, 45, 0, 0);

    function updateCountdown() {
      const now = new Date().getTime();
      const distance = targetDate.getTime() - now;

      if (distance < 0) {
        timerEl.textContent = "Screening in Progress";
        return;
      }

      const days = Math.floor(distance / (1000 * 60 * 60 * 24));
      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      timerEl.textContent = `${days}d ${hours}h ${minutes}m ${seconds}s`;
    }

    updateCountdown();
    setInterval(updateCountdown, 1000);
  }

  document.querySelectorAll('.btn-view-ticket').forEach(btn => {
    btn.addEventListener('click', () => {
      const title = btn.getAttribute('data-ticket-title') || 'Dune: Part Two (IMAX 70mm)';
      const cinema = btn.getAttribute('data-ticket-cinema') || 'Theatron Grand Palais Flagship - Auditorium 1';
      const seats = btn.getAttribute('data-ticket-seats') || 'Royal Box Sovereign F12, F13';
      const time = btn.getAttribute('data-ticket-time') || 'Friday, 19:45 PM';

      document.getElementById('modal-ticket-title').textContent = title;
      document.getElementById('modal-ticket-cinema').textContent = cinema;
      document.getElementById('modal-ticket-seats').textContent = seats;
      document.getElementById('modal-ticket-time').textContent = time;

      window.openTheatronModal('eticket-modal');
    });
  });

  const cancelBtn = document.getElementById('btn-reschedule-ticket');
  if (cancelBtn) {
    cancelBtn.addEventListener('click', () => {
      window.showTheatronToast('Concierge Reschedule', 'VIP Concierge hotline opened: Member privileges allow complimentary rebooking up to 2 hours prior.', 'info');
    });
  }
}

/* 7. PREFERENCES & GENRES */
function initPreferencesInteractions() {
  document.querySelectorAll('.genre-chip').forEach(chip => {
    chip.addEventListener('click', () => {
      const genre = chip.getAttribute('data-genre');
      const data = getProfileData();
      if (data.genres.includes(genre)) {
        data.genres = data.genres.filter(g => g !== genre);
        chip.classList.remove('active');
      } else {
        data.genres.push(genre);
        chip.classList.add('active');
      }
      saveProfileData(data);
      window.showTheatronToast('Cinema Taste Updated', `${genre} preference ${chip.classList.contains('active') ? 'added' : 'removed'}.`, 'info');
    });
  });

  document.querySelectorAll('input[data-pref]').forEach(input => {
    input.addEventListener('change', () => {
      const prefKey = input.getAttribute('data-pref');
      const data = getProfileData();
      data.notifications = data.notifications || {};
      data.notifications[prefKey] = input.checked;
      saveProfileData(data);
      window.showTheatronToast('Preference Saved', `${prefKey} is now ${input.checked ? 'Enabled' : 'Disabled'}.`, 'info');
    });
  });

  const supportForm = document.getElementById('concierge-inquiry-form');
  if (supportForm) {
    supportForm.addEventListener('submit', (e) => {
      e.preventDefault();
      const msg = document.getElementById('concierge-message').value.trim();
      if (!msg) return;
      window.showTheatronToast('Concierge Notified', 'Your private concierge request has been dispatched. Expected response within 15 minutes.', 'success');
      supportForm.reset();
    });
  }
}
