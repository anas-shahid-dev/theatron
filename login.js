(() => {
  'use strict';

  const T = window.Theatron;

  const DEMO_USER = {
    id: 'MEM-0001',
    name: 'Alexander Vance',
    email: 'a.vance@theatron.luxury',
    password: 'theatron2026',
    tier: 'Sovereign Gold',
  };

  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
  const MEMBER_ID_REGEX = /^(?:THT-\d{6}|MEM-\d{4,})$/i;

  const state = {
    mode: 'login', // 'login' | 'signup'
    touched: {
      fullName: false,
      email: false,
      password: false,
      confirm: false,
    },
  };

  /**
   * Loads registered users from localStorage, ensuring the built-in demo account is available.
   * @returns {Array<object>}
   */
  function loadUsers() {
    const raw = T.readStorage(T.STORAGE_KEYS.USERS);
    const list = Array.isArray(raw) ? raw : [];
    const hasDemo = list.some(
      (u) => u && String(u.email || '').toLowerCase() === DEMO_USER.email
    );
    if (!hasDemo) {
      list.unshift({ ...DEMO_USER });
      T.writeStorage(T.STORAGE_KEYS.USERS, list);
    }
    return list;
  }

  /**
   * Computes password strength score (0-4) and descriptive label.
   * @param {string} password
   * @returns {{ level: number, text: string }}
   */
  function evaluatePasswordStrength(password) {
    if (!password) {
      return { level: 0, text: 'Enter at least 8 characters' };
    }
    let score = 0;
    if (password.length >= 8) score += 1;
    if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score += 1;
    if (/\d/.test(password)) score += 1;
    if (/[^A-Za-z0-9]/.test(password) || password.length >= 12) score += 1;

    if (password.length < 8) {
      return { level: 1, text: 'Weak — minimum 8 characters required' };
    }
    if (score <= 2) {
      return { level: 2, text: 'Fair — add uppercase letters, numbers, or symbols' };
    }
    if (score === 3) {
      return { level: 3, text: 'Good — strong membership passkey' };
    }
    return { level: 4, text: 'Strong — Sovereign-grade security' };
  }

  /**
   * Updates visual error/valid states on a field.
   * @param {HTMLInputElement} input
   * @param {HTMLElement} errorEl
   * @param {string} errorMessage
   * @param {boolean} showValidity
   */
  function applyFieldFeedback(input, errorEl, errorMessage, showValidity) {
    if (!input || !errorEl) return;
    errorEl.textContent = errorMessage;
    input.classList.toggle('is-invalid', Boolean(errorMessage));
    input.classList.toggle('is-valid', Boolean(showValidity && !errorMessage && input.value.trim()));
  }

  function validateFullName(force = false) {
    const input = document.getElementById('input-fullname');
    const errorEl = document.getElementById('error-fullname');
    if (state.mode !== 'signup') {
      applyFieldFeedback(input, errorEl, '', false);
      return true;
    }
    const value = input.value.trim();
    const shouldShow = force || state.touched.fullName;
    let msg = '';
    if (!value) {
      msg = 'Please enter your full name.';
    } else if (value.length < 2) {
      msg = 'Full name must be at least 2 characters.';
    }
    if (shouldShow) applyFieldFeedback(input, errorEl, msg, true);
    return !msg;
  }

  function validateEmail(force = false) {
    const input = document.getElementById('input-email');
    const errorEl = document.getElementById('error-email');
    const value = input.value.trim();
    const shouldShow = force || state.touched.email;

    let msg = '';
    if (!value) {
      msg = state.mode === 'signup' ? 'Email address is required.' : 'Please enter your email or Member ID.';
    } else if (state.mode === 'signup') {
      if (!EMAIL_REGEX.test(value)) {
        msg = 'Please enter a valid email address (e.g. a.vance@theatron.luxury).';
      }
    } else if (!EMAIL_REGEX.test(value) && !MEMBER_ID_REGEX.test(value)) {
      msg = 'Enter a valid email address or Member ID (THT-XXXXXX).';
    }

    if (shouldShow) applyFieldFeedback(input, errorEl, msg, true);
    return !msg;
  }

  function validatePassword(force = false) {
    const input = document.getElementById('input-password');
    const errorEl = document.getElementById('error-password');
    const value = input.value;
    const shouldShow = force || state.touched.password;

    let msg = '';
    if (!value) {
      msg = 'Password is required.';
    } else if (value.length < 8) {
      msg = 'Password must be at least 8 characters.';
    }

    if (shouldShow) applyFieldFeedback(input, errorEl, msg, true);
    return !msg;
  }

  function validateConfirmPassword(force = false) {
    const input = document.getElementById('input-confirm');
    const errorEl = document.getElementById('error-confirm');
    if (state.mode !== 'signup') {
      applyFieldFeedback(input, errorEl, '', false);
      return true;
    }
    const password = document.getElementById('input-password').value;
    const confirm = input.value;
    const shouldShow = force || state.touched.confirm;

    let msg = '';
    if (!confirm) {
      msg = 'Please confirm your password.';
    } else if (confirm !== password) {
      msg = 'Passwords do not match.';
    }

    if (shouldShow) applyFieldFeedback(input, errorEl, msg, true);
    return !msg;
  }

  function updateStrengthMeter() {
    const meter = document.getElementById('strength-meter');
    const label = document.getElementById('strength-label');
    const password = document.getElementById('input-password').value;
    if (!meter || !label) return;

    const { level, text } = evaluatePasswordStrength(password);
    meter.dataset.level = String(level);
    label.textContent = text;
  }

  function hideBanners() {
    const resetBanner = document.getElementById('reset-banner');
    const errorBanner = document.getElementById('form-error-banner');
    if (resetBanner) resetBanner.hidden = true;
    if (errorBanner) errorBanner.hidden = true;
  }

  function showFormError(message) {
    const errorBanner = document.getElementById('form-error-banner');
    const errorText = document.getElementById('form-error-text');
    if (errorText) errorText.textContent = message;
    if (errorBanner) errorBanner.hidden = false;
  }

  function showResetNotice(message) {
    const resetBanner = document.getElementById('reset-banner');
    const resetText = document.getElementById('reset-banner-text');
    if (resetText) resetText.textContent = message;
    if (resetBanner) resetBanner.hidden = false;
  }

  /**
   * Switches smoothly between Login and Sign Up modes.
   * @param {'login'|'signup'} nextMode
   */
  function setMode(nextMode) {
    state.mode = nextMode;
    const isSignup = nextMode === 'signup';

    state.touched = {
      fullName: false,
      email: false,
      password: false,
      confirm: false,
    };

    hideBanners();

    const heading = document.getElementById('auth-heading');
    const subtitle = document.getElementById('auth-subtitle');
    const emailLabel = document.getElementById('label-email');
    const emailInput = document.getElementById('input-email');
    const passwordInput = document.getElementById('input-password');
    const submitBtn = document.getElementById('auth-submit-btn');
    const promptText = document.getElementById('mode-prompt-text');
    const switchBtn = document.getElementById('mode-switch-btn');

    document.getElementById('group-fullname').hidden = !isSignup;
    document.getElementById('group-confirm').hidden = !isSignup;
    document.getElementById('strength-meter').hidden = !isSignup;
    document.getElementById('utility-row').hidden = isSignup;

    if (heading) heading.textContent = isSignup ? 'CREATE MEMBERSHIP' : 'MEMBER SIGN IN';
    if (subtitle) {
      subtitle.textContent = isSignup
        ? 'Join THEATRON Private Lounges for bespoke screenings & priority seating.'
        : 'Access your Sovereign Gold reservations & digital passes.';
    }
    if (emailLabel) emailLabel.textContent = isSignup ? 'Email Address' : 'Email or Member ID';
    if (emailInput) emailInput.setAttribute('autocomplete', isSignup ? 'email' : 'username');
    if (passwordInput) {
      passwordInput.setAttribute('autocomplete', isSignup ? 'new-password' : 'current-password');
    }
    if (submitBtn) {
      submitBtn.textContent = isSignup ? 'Create Member Account' : 'Sign In to THEATRON';
    }
    if (promptText) {
      promptText.textContent = isSignup
        ? 'Already a member?'
        : 'New to THEATRON Private Lounges?';
    }
    if (switchBtn) {
      switchBtn.textContent = isSignup ? 'Sign In' : 'Create Account';
    }

    // Clear residual validation messages when toggling modes.
    for (const id of ['input-fullname', 'input-email', 'input-password', 'input-confirm']) {
      const el = document.getElementById(id);
      if (el) el.classList.remove('is-invalid', 'is-valid');
    }
    for (const id of ['error-fullname', 'error-email', 'error-password', 'error-confirm']) {
      const el = document.getElementById(id);
      if (el) el.textContent = '';
    }

    if (isSignup) updateStrengthMeter();
  }

  /**
   * Persists the authenticated user session and transitions to success / redirect state.
   * @param {object} user
   * @param {boolean} rememberSession
   * @param {boolean} isNewMember
   */
  function completeAuthentication(user, rememberSession, isNewMember) {
    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      tier: user.tier || 'Sovereign Gold',
      signedInAt: new Date().toISOString(),
    };

    try {
      if (rememberSession) {
        localStorage.setItem(T.STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
        sessionStorage.removeItem(T.STORAGE_KEYS.CURRENT_USER);
      } else {
        sessionStorage.setItem(T.STORAGE_KEYS.CURRENT_USER, JSON.stringify(sessionUser));
        localStorage.removeItem(T.STORAGE_KEYS.CURRENT_USER);
      }
    } catch {
      // Ignore storage errors gracefully.
    }

    const bookings = T.readStorage(T.STORAGE_KEYS.BOOKINGS);
    T.updateNavbarState(Array.isArray(bookings) ? bookings : [], sessionUser.name, {
      fallbackLabel: 'Sign In',
      fallbackInitials: 'SI',
    });

    const form = document.getElementById('auth-form');
    const footer = document.getElementById('auth-card-footer');
    const successPanel = document.getElementById('auth-success-panel');
    const tierPill = document.getElementById('success-tier-pill');
    const successTitle = document.getElementById('success-title');
    const successCopy = document.getElementById('success-copy');

    hideBanners();
    if (form) form.hidden = true;
    if (footer) footer.hidden = true;
    if (tierPill) tierPill.textContent = String(sessionUser.tier).toUpperCase();
    if (successTitle) {
      successTitle.textContent = isNewMember
        ? `Welcome to THEATRON, ${sessionUser.name}`
        : `Welcome back, ${sessionUser.name}`;
    }
    if (successCopy) {
      successCopy.textContent = isNewMember
        ? 'Your Sovereign Gold membership is now active. Redirecting to your Digital Ticket Vault...'
        : 'Your private lounge session is verified. Redirecting to your Digital Ticket Vault...';
    }
    if (successPanel) successPanel.hidden = false;

    window.setTimeout(() => {
      window.location.href = 'my-bookings.html';
    }, 1400);
  }

  function handleFormSubmit(event) {
    event.preventDefault();
    hideBanners();

    state.touched.fullName = true;
    state.touched.email = true;
    state.touched.password = true;
    state.touched.confirm = true;

    const validName = validateFullName(true);
    const validEmail = validateEmail(true);
    const validPass = validatePassword(true);
    const validConfirm = validateConfirmPassword(true);

    if (!validName || !validEmail || !validPass || !validConfirm) {
      return;
    }

    const users = loadUsers();
    const emailOrId = document.getElementById('input-email').value.trim();
    const normalizedInput = emailOrId.toLowerCase();
    const password = document.getElementById('input-password').value;

    if (state.mode === 'signup') {
      const fullName = document.getElementById('input-fullname').value.trim();
      const duplicate = users.some(
        (u) => u && String(u.email || '').toLowerCase() === normalizedInput
      );
      if (duplicate) {
        showFormError('An account with this email already exists. Please sign in instead.');
        return;
      }

      const newUser = {
        id: `MEM-${Math.floor(1000 + Math.random() * 9000)}`,
        name: fullName,
        email: normalizedInput,
        password,
        tier: 'Sovereign Gold',
        createdAt: new Date().toISOString(),
      };
      users.push(newUser);
      T.writeStorage(T.STORAGE_KEYS.USERS, users);
      completeAuthentication(newUser, true, true);
      return;
    }

    // Login validation against saved users (including built-in demo account)
    const matchedUser = users.find((u) => {
      if (!u) return false;
      const matchesEmail = String(u.email || '').toLowerCase() === normalizedInput;
      const matchesId = String(u.id || '').toLowerCase() === normalizedInput;
      return (matchesEmail || matchesId) && u.password === password;
    });

    if (!matchedUser) {
      showFormError(
        'Invalid credentials. Verify your email/password or try the demo account a.vance@theatron.luxury / theatron2026.'
      );
      return;
    }

    const rememberSession = Boolean(document.getElementById('input-remember').checked);
    completeAuthentication(matchedUser, rememberSession, false);
  }

  function bindPasswordToggles() {
    document.querySelectorAll('.password-toggle-btn').forEach((btn) => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.toggleTarget;
        const input = targetId ? document.getElementById(targetId) : null;
        if (!input) return;

        const isHidden = input.type === 'password';
        input.type = isHidden ? 'text' : 'password';
        btn.setAttribute('aria-pressed', String(isHidden));
        btn.setAttribute('aria-label', isHidden ? 'Hide password' : 'Show password');

        const eyeIcon = btn.querySelector('.icon-eye');
        const eyeOffIcon = btn.querySelector('.icon-eye-off');
        if (eyeIcon) eyeIcon.hidden = isHidden;
        if (eyeOffIcon) eyeOffIcon.hidden = !isHidden;
      });
    });
  }

  function bindValidationEvents() {
    const fullNameInput = document.getElementById('input-fullname');
    const emailInput = document.getElementById('input-email');
    const passwordInput = document.getElementById('input-password');
    const confirmInput = document.getElementById('input-confirm');

    if (fullNameInput) {
      fullNameInput.addEventListener('blur', () => {
        state.touched.fullName = true;
        validateFullName();
      });
      fullNameInput.addEventListener('input', () => {
        if (state.touched.fullName) validateFullName();
      });
    }

    if (emailInput) {
      emailInput.addEventListener('blur', () => {
        state.touched.email = true;
        validateEmail();
      });
      emailInput.addEventListener('input', () => {
        hideBanners();
        if (state.touched.email) validateEmail();
      });
    }

    if (passwordInput) {
      passwordInput.addEventListener('blur', () => {
        state.touched.password = true;
        validatePassword();
      });
      passwordInput.addEventListener('input', () => {
        hideBanners();
        if (state.mode === 'signup') {
          updateStrengthMeter();
          if (state.touched.confirm || confirmInput.value) {
            state.touched.confirm = true;
            validateConfirmPassword();
          }
        }
        if (state.touched.password) validatePassword();
      });
    }

    if (confirmInput) {
      confirmInput.addEventListener('blur', () => {
        state.touched.confirm = true;
        validateConfirmPassword();
      });
      confirmInput.addEventListener('input', () => {
        if (state.touched.confirm || confirmInput.value) {
          state.touched.confirm = true;
          validateConfirmPassword();
        }
      });
    }
  }

  function initAuthPage() {
    loadUsers();

    const bookings = T.readStorage(T.STORAGE_KEYS.BOOKINGS);
    T.updateNavbarState(Array.isArray(bookings) ? bookings : [], null, {
      fallbackLabel: 'Sign In',
      fallbackInitials: 'SI',
    });

    const params = new URLSearchParams(window.location.search);
    if (params.get('mode') === 'signup') {
      setMode('signup');
    } else {
      setMode('login');
    }

    bindPasswordToggles();
    bindValidationEvents();

    const form = document.getElementById('auth-form');
    if (form) form.addEventListener('submit', handleFormSubmit);

    const switchBtn = document.getElementById('mode-switch-btn');
    if (switchBtn) {
      switchBtn.addEventListener('click', () => {
        setMode(state.mode === 'login' ? 'signup' : 'login');
      });
    }

    const forgotBtn = document.getElementById('forgot-password-btn');
    if (forgotBtn) {
      forgotBtn.addEventListener('click', () => {
        hideBanners();
        const emailVal = document.getElementById('input-email').value.trim();
        const target = EMAIL_REGEX.test(emailVal) ? emailVal : 'your registered email address';
        showResetNotice(
          `Velvet Concierge passkey reset instructions have been sent to ${target}.`
        );
      });
    }

    const navMemberPill = document.getElementById('nav-member-pill');
    if (navMemberPill) {
      if (T.getCurrentUser()) {
        navMemberPill.setAttribute('href', 'my-bookings.html');
      }
      navMemberPill.addEventListener('click', (event) => {
        if (!T.getCurrentUser()) {
          event.preventDefault();
          document.getElementById('input-email').focus();
        } else {
          navMemberPill.setAttribute('href', 'my-bookings.html');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', initAuthPage);
})();
