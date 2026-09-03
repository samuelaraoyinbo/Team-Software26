// =========================================================
// ELEMENT REFERENCES
// =========================================================
const loginForm = document.getElementById('loginForm');
const usernameInput = document.getElementById('username');
const passwordInput = document.getElementById('password');
const usernameError = document.getElementById('usernameError');
const passwordError = document.getElementById('passwordError');
const togglePasswordBtn = document.getElementById('togglePassword');
const iconEye = togglePasswordBtn.querySelector('.icon-eye');
const iconEyeSlash = togglePasswordBtn.querySelector('.icon-eye-slash');
const rememberMeCheckbox = document.getElementById('rememberMe');
const loginBtn = document.getElementById('loginBtn');
const loginBtnText = loginBtn.querySelector('.login-btn__text');
const passwordWarning = document.getElementById('passwordWarning');

// =========================================================
// PASSWORD WARNING ROW
// Visible whenever the password requirement isn't met yet
// (field empty / failed validation) or while a login attempt
// is still awaiting a response.
// =========================================================
let awaitingResponse = false;

function updatePasswordWarning() {
  const requirementNotMet = !passwordInput.value.trim();
  const shouldShow = requirementNotMet || awaitingResponse;

  passwordWarning.hidden = !shouldShow;
  passwordWarning.classList.toggle('warning-row--visible', shouldShow);
}

// =========================================================
// PASSWORD VISIBILITY TOGGLE
// =========================================================
togglePasswordBtn.addEventListener('click', () => {
  const isHidden = passwordInput.type === 'password';

  passwordInput.type = isHidden ? 'text' : 'password';

  iconEye.hidden = isHidden;
  iconEyeSlash.hidden = !isHidden;

  togglePasswordBtn.setAttribute('aria-pressed', String(isHidden));
  togglePasswordBtn.setAttribute(
    'aria-label',
    isHidden ? 'Hide password' : 'Show password'
  );
});

// =========================================================
// REMEMBER ME — persist preference in localStorage
// =========================================================
function initRememberMe() {
  try {
    const saved = localStorage.getItem('cuPortalRememberMe');
    if (saved === 'true') {
      rememberMeCheckbox.checked = true;
    }
  } catch (e) {
    // localStorage unavailable (e.g. privacy mode) — fail silently
  }
}

rememberMeCheckbox.addEventListener('change', () => {
  try {
    localStorage.setItem('cuPortalRememberMe', String(rememberMeCheckbox.checked));
  } catch (e) {
    // ignore storage errors
  }
});

initRememberMe();

// =========================================================
// VALIDATION HELPERS
// =========================================================
function setFieldError(inputEl, errorEl, message) {
  inputEl.classList.toggle('input-field--error', Boolean(message));
  errorEl.textContent = message || '';
}

function validateForm() {
  let isValid = true;

  if (!usernameInput.value.trim()) {
    setFieldError(usernameInput, usernameError, 'Please enter your username.');
    isValid = false;
  } else {
    setFieldError(usernameInput, usernameError, '');
  }

  if (!passwordInput.value) {
    setFieldError(passwordInput, passwordError, 'Please enter your password.');
    isValid = false;
  } else {
    setFieldError(passwordInput, passwordError, '');
  }

  return isValid;
}

// Clear individual field errors as the user types
usernameInput.addEventListener('input', () => {
  if (usernameInput.value.trim()) setFieldError(usernameInput, usernameError, '');
});

passwordInput.addEventListener('input', () => {
  if (passwordInput.value) setFieldError(passwordInput, passwordError, '');
  updatePasswordWarning();
});

passwordInput.addEventListener('focus', updatePasswordWarning);

// =========================================================
// FORM SUBMISSION (simulated — no real backend)
// =========================================================
loginForm.addEventListener('submit', (event) => {
  event.preventDefault();

  if (!validateForm()) {
    updatePasswordWarning();
    return;
  }

  // Enter loading state — still awaiting a response, so keep the
  // case-sensitivity reminder visible in case it's the cause of failure
  loginBtn.disabled = true;
  loginBtn.style.opacity = '0.7';
  loginBtnText.textContent = 'Signing in...';
  awaitingResponse = true;
  updatePasswordWarning();

  setTimeout(() => {
    // Reset button state (no real backend to redirect to)
    loginBtn.disabled = false;
    loginBtn.style.opacity = '1';
    loginBtnText.textContent = 'Login';
    awaitingResponse = false;
    updatePasswordWarning();
  }, 1500);
});

// Set initial visibility on page load
updatePasswordWarning();