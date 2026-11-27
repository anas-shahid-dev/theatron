/**
 * THEATRON CINEMA LOUNGES — USER PROFILE CONTROLLER
 * Handles Profile Editing, Validation, LocalStorage Persistence, Preferences & Booking Details
 */

(function () {
  'use strict';

  const STORAGE_KEY_PROFILE = 'theatron_user_profile';
  const STORAGE_KEY_PREFS = 'theatron_user_preferences';

  // Default VIP Profile State
  const defaultProfile = {
    fullName: 'Lord Alistair Vance',
    email: 'alistair.vance@theatron-vip.com',
    phone: '+1 (555) 839-2810',
    dob: '1988-11-14',
    gender: 'Male',
    language: 'English (US)',
    city: 'Sovereign City',
    membershipId: 'TH-9842-ROYAL',
    membershipTier: 'ROYAL GOLD CONNOISSEUR',
    memberSince: 'OCTOBER 2022',
  };

  const defaultPreferences = {
    preferredCinema: 'THEATRON Grand Flagship',
    preferredGenres: ['Sci-Fi Thriller', 'Mystery', 'Historical Drama'],
    audioTrack: 'English (Dolby Atmos)',
    emailNotifications: true,
    promoNotifications: true,
    bookingNotifications: true,
  };

  // State loading helpers
  function loadProfile() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PROFILE);
      return stored ? { ...defaultProfile, ...JSON.parse(stored) } : defaultProfile;
    } catch (e) {
      return defaultProfile;
    }
  }

  function saveProfile(data) {
    try {
      localStorage.setItem(STORAGE_KEY_PROFILE, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save profile to localStorage', e);
    }
  }

  function loadPreferences() {
    try {
      const stored = localStorage.getItem(STORAGE_KEY_PREFS);
      return stored ? { ...defaultPreferences, ...JSON.parse(stored) } : defaultPreferences;
    } catch (e) {
      return defaultPreferences;
    }
  }

  function savePreferences(data) {
    try {
      localStorage.setItem(STORAGE_KEY_PREFS, JSON.stringify(data));
    } catch (e) {
      console.warn('Could not save preferences to localStorage', e);
    }
  }

  // --- 1. Populate UI from Storage ---
  function populateProfileUI() {
    const profile = loadProfile();

    // Hero Section
    const nameDisplays = document.querySelectorAll('.user-name-display');
    const emailDisplays = document.querySelectorAll('.user-email-display');
    const memberIdDisplays = document.querySelectorAll('.user-id-display');

    nameDisplays.forEach((el) => (el.textContent = profile.fullName));
    emailDisplays.forEach((el) => (el.textContent = profile.email));
    memberIdDisplays.forEach((el) => (el.textContent = profile.membershipId));

    // Form inputs
    const inputName = document.getElementById('input-name');
    const inputEmail = document.getElementById('input-email');
    const inputPhone = document.getElementById('input-phone');
    const inputDob = document.getElementById('input-dob');
    const inputGender = document.getElementById('input-gender');
    const inputLanguage = document.getElementById('input-language');
    const inputCity = document.getElementById('input-city');

    if (inputName) inputName.value = profile.fullName;
    if (inputEmail) inputEmail.value = profile.email;
    if (inputPhone) inputPhone.value = profile.phone;
    if (inputDob) inputDob.value = profile.dob;
    if (inputGender) inputGender.value = profile.gender;
    if (inputLanguage) inputLanguage.value = profile.language;
    if (inputCity) inputCity.value = profile.city;
  }

  function populatePreferencesUI() {
    const prefs = loadPreferences();

    const cinemaSelect = document.getElementById('pref-cinema');
    if (cinemaSelect) cinemaSelect.value = prefs.preferredCinema;

    const emailSwitch = document.getElementById('pref-email-notif');
    const promoSwitch = document.getElementById('pref-promo-notif');
    const bookingSwitch = document.getElementById('pref-booking-notif');

    if (emailSwitch) emailSwitch.checked = prefs.emailNotifications;
    if (promoSwitch) promoSwitch.checked = prefs.promoNotifications;
    if (bookingSwitch) bookingSwitch.checked = prefs.bookingNotifications;

    // Genre Chips
    const chips = document.querySelectorAll('.genre-chip');
    chips.forEach((chip) => {
      const genre = chip.getAttribute('data-genre');
      if (prefs.preferredGenres.includes(genre)) {
        chip.classList.add('active');
      } else {
        chip.classList.remove('active');
      }
    });
  }

  // --- 2. Profile Editing Mode & Validation ---
  function initProfileEditing() {
    const editBtn = document.getElementById('btn-edit-profile');
    const saveBtn = document.getElementById('btn-save-profile');
    const cancelBtn = document.getElementById('btn-cancel-profile');
    const formActions = document.getElementById('profile-form-actions');
    const formInputs = document.querySelectorAll('#profile-form input, #profile-form select');

    if (!editBtn || !saveBtn || !cancelBtn) return;

    function setEditingMode(isEditing) {
      formInputs.forEach((input) => {
        if (isEditing) {
          input.removeAttribute('readonly');
          input.removeAttribute('disabled');
        } else {
          input.setAttribute('readonly', 'true');
          if (input.tagName === 'SELECT') {
            input.setAttribute('disabled', 'true');
          }
        }
      });

      if (formActions) {
        formActions.style.display = isEditing ? 'flex' : 'none';
      }
      editBtn.style.display = isEditing ? 'none' : 'inline-flex';
    }

    editBtn.addEventListener('click', () => {
      setEditingMode(true);
      const inputName = document.getElementById('input-name');
      if (inputName) inputName.focus();
    });

    cancelBtn.addEventListener('click', () => {
      populateProfileUI(); // revert to saved values
      setEditingMode(false);
      window.showToast('Edit Cancelled', 'Profile changes were discarded.', '✕');
    });

    // Form Save & Validation
    const profileForm = document.getElementById('profile-form');
    if (profileForm) {
      profileForm.addEventListener('submit', (e) => {
        e.preventDefault();

        const inputName = document.getElementById('input-name');
        const inputEmail = document.getElementById('input-email');
        const inputPhone = document.getElementById('input-phone');
        const inputDob = document.getElementById('input-dob');
        const inputGender = document.getElementById('input-gender');
        const inputLanguage = document.getElementById('input-language');
        const inputCity = document.getElementById('input-city');

        let isValid = true;

        // Name Validation
        if (!inputName.value.trim() || inputName.value.trim().length < 2) {
          showInputError(inputName, 'Please enter a valid full name.');
          isValid = false;
        } else {
          clearInputError(inputName);
        }

        // Email Validation
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(inputEmail.value.trim())) {
          showInputError(inputEmail, 'Please enter a valid email address.');
          isValid = false;
        } else {
          clearInputError(inputEmail);
        }

        // Phone Validation
        if (!inputPhone.value.trim() || inputPhone.value.trim().length < 7) {
          showInputError(inputPhone, 'Please enter a valid telephone number.');
          isValid = false;
        } else {
          clearInputError(inputPhone);
        }

        if (!isValid) return;

        const updatedProfile = {
          ...loadProfile(),
          fullName: inputName.value.trim(),
          email: inputEmail.value.trim(),
          phone: inputPhone.value.trim(),
          dob: inputDob ? inputDob.value : '',
          gender: inputGender ? inputGender.value : 'Other',
          language: inputLanguage ? inputLanguage.value : 'English (US)',
          city: inputCity ? inputCity.value.trim() : 'Sovereign City',
        };

        saveProfile(updatedProfile);
        populateProfileUI();
        setEditingMode(false);

        window.showToast('Profile Updated', 'VIP Credentials successfully synchronized.', '★');
      });
    }

    function showInputError(input, message) {
      const parent = input.closest('.form-group');
      if (!parent) return;
      parent.classList.add('has-error');
      let errorEl = parent.querySelector('.form-error');
      if (!errorEl) {
        errorEl = document.createElement('span');
        errorEl.className = 'form-error';
        parent.appendChild(errorEl);
      }
      errorEl.textContent = message;
    }

    function clearInputError(input) {
      const parent = input.closest('.form-group');
      if (parent) {
        parent.classList.remove('has-error');
      }
    }
  }

  // --- 3. Interactive Preferences ---
  function initPreferencesInteractions() {
    const cinemaSelect = document.getElementById('pref-cinema');
    const emailSwitch = document.getElementById('pref-email-notif');
    const promoSwitch = document.getElementById('pref-promo-notif');
    const bookingSwitch = document.getElementById('pref-booking-notif');
    const chips = document.querySelectorAll('.genre-chip');

    function updateAndSavePrefs() {
      const activeGenres = [];
      document.querySelectorAll('.genre-chip.active').forEach((c) => {
        activeGenres.push(c.getAttribute('data-genre'));
      });

      const updatedPrefs = {
        preferredCinema: cinemaSelect ? cinemaSelect.value : defaultPreferences.preferredCinema,
        preferredGenres: activeGenres,
        emailNotifications: emailSwitch ? emailSwitch.checked : true,
        promoNotifications: promoSwitch ? promoSwitch.checked : true,
        bookingNotifications: bookingSwitch ? bookingSwitch.checked : true,
      };

      savePreferences(updatedPrefs);
      window.showToast('Preferences Saved', 'Your luxury cinema settings have been updated.', '✦');
    }

    if (cinemaSelect) cinemaSelect.addEventListener('change', updateAndSavePrefs);
    if (emailSwitch) emailSwitch.addEventListener('change', updateAndSavePrefs);
    if (promoSwitch) promoSwitch.addEventListener('change', updateAndSavePrefs);
    if (bookingSwitch) bookingSwitch.addEventListener('change', updateAndSavePrefs);

    chips.forEach((chip) => {
      chip.addEventListener('click', () => {
        chip.classList.toggle('active');
        updateAndSavePrefs();
      });
    });
  }

  // --- 4. Membership Card Copy Interaction ---
  function initCardCopy() {
    const memberCard = document.querySelector('.digital-member-card');
    if (!memberCard) return;

    memberCard.addEventListener('click', () => {
      const profile = loadProfile();
      if (navigator.clipboard && navigator.clipboard.writeText) {
        navigator.clipboard.writeText(profile.membershipId).then(() => {
          window.showToast('Membership Copied', `Card ID ${profile.membershipId} copied to clipboard!`, '💳');
        });
      } else {
        window.showToast('VIP Card Active', `Membership ID: ${profile.membershipId}`, '💳');
      }
    });
  }

  // --- 5. Ticket Activity Modal ---
  function initActivityModals() {
    const activityButtons = document.querySelectorAll('.btn-view-booking');
    const ticketModal = document.getElementById('ticket-activity-modal');

    if (!ticketModal) return;

    const modalClose = ticketModal.querySelector('.modal-close-btn');

    activityButtons.forEach((btn) => {
      btn.addEventListener('click', () => {
        const title = btn.getAttribute('data-movie-title') || 'DOOMSDAY: ECLIPSE PROTOCOL';
        const cinema = btn.getAttribute('data-cinema') || 'THEATRON Grand Flagship';
        const date = btn.getAttribute('data-date') || 'Today • 20:30 PM';
        const hall = btn.getAttribute('data-hall') || 'Auditorium 01 (Dual-Laser IMAX)';
        const seats = btn.getAttribute('data-seats') || 'VIP Recliners H-14, H-15';
        const status = btn.getAttribute('data-status') || 'Confirmed';

        ticketModal.querySelector('.modal-ticket-title').textContent = title;
        ticketModal.querySelector('.modal-ticket-cinema').textContent = cinema;
        ticketModal.querySelector('.modal-ticket-date').textContent = date;
        ticketModal.querySelector('.modal-ticket-hall').textContent = hall;
        ticketModal.querySelector('.modal-ticket-seats').textContent = seats;
        ticketModal.querySelector('.modal-ticket-status').textContent = status;

        ticketModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      });
    });

    if (modalClose) {
      modalClose.addEventListener('click', () => {
        ticketModal.classList.remove('active');
        document.body.style.overflow = '';
      });
    }

    ticketModal.addEventListener('click', (e) => {
      if (e.target === ticketModal) {
        ticketModal.classList.remove('active');
        document.body.style.overflow = '';
      }
    });
  }

  // Initialize Profile Page
  document.addEventListener('DOMContentLoaded', () => {
    populateProfileUI();
    populatePreferencesUI();
    initProfileEditing();
    initPreferencesInteractions();
    initCardCopy();
    initActivityModals();
  });
})();
