const tokenKey = 'atlas_token';
const roleKey = 'atlas_user_role';

const els = {
  profileSubtitle: document.getElementById('profileSubtitle'),
  profileDisplayName: document.getElementById('profileDisplayName'),
  profileDisplayEmail: document.getElementById('profileDisplayEmail'),
  profileAvatarInitial: document.getElementById('profileAvatarInitial'),
  nameForm: document.getElementById('nameForm'),
  nameInput: document.getElementById('nameInput'),
  nameStatus: document.getElementById('nameStatus'),
  currentEmail: document.getElementById('currentEmail'),
  newEmail: document.getElementById('newEmail'),
  emailForm: document.getElementById('emailForm'),
  emailStatus: document.getElementById('emailStatus'),
  passwordForm: document.getElementById('passwordForm'),
  currentPassword: document.getElementById('currentPassword'),
  newPassword: document.getElementById('newPassword'),
  confirmPassword: document.getElementById('confirmPassword'),
  passwordStatus: document.getElementById('passwordStatus'),
  requestResetForm: document.getElementById('requestResetForm'),
  resetEmail: document.getElementById('resetEmail'),
  requestResetStatus: document.getElementById('requestResetStatus'),
  completeResetForm: document.getElementById('completeResetForm'),
  resetToken: document.getElementById('resetToken'),
  resetPassword: document.getElementById('resetPassword'),
  completeResetStatus: document.getElementById('completeResetStatus'),
  logoutAllBtn: document.getElementById('logoutAllBtn'),
  logoutAllStatus: document.getElementById('logoutAllStatus'),
  logoutBtn: document.getElementById('logoutBtn'),
};

function requireToken() {
  const token = localStorage.getItem(tokenKey);
  if (!token) {
    window.location.href = '/signin.html';
    return null;
  }
  return token;
}

async function requestJson(url, options = {}) {
  const token = requireToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch(url, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
      ...(options.headers || {}),
    },
  });

  const data = await response.json();
  if (response.status === 401) {
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(roleKey);
    localStorage.removeItem('atlas_user_email');
    localStorage.removeItem('atlas_user_id');
    window.location.href = '/signin.html';
    throw new Error('Unauthorized');
  }
  if (!response.ok) {
    throw new Error(data.error || 'Request failed');
  }
  return data;
}

function setStatus(el, text, isError = false) {
  el.textContent = text;
  el.classList.toggle('error', isError);
}

function applyValidationMessages() {
  const requiredInputs = [
    els.nameInput,
    els.newEmail,
    els.currentPassword,
    els.newPassword,
    els.resetEmail,
    els.resetToken,
    els.resetPassword,
  ];
  requiredInputs.forEach((field) => {
    if (!field) return;
    field.addEventListener('invalid', () => field.setCustomValidity('Please complete this field.'));
    field.addEventListener('input', () => field.setCustomValidity(''));
  });
}

async function loadProfile() {
  try {
    const { user } = await requestJson('/api/auth/me', { headers: { 'Content-Type': 'application/json' } });
    if (els.nameInput) {
      els.nameInput.value = user.fullName || localStorage.getItem('atlas_user_name') || '';
    }
    if (els.currentEmail) {
      els.currentEmail.value = user.email || '';
    }
    if (user.fullName) {
      localStorage.setItem('atlas_user_name', user.fullName);
    }
    const displayName = user.fullName || localStorage.getItem('atlas_user_name') || 'Atlas User';
    if (els.profileDisplayName) els.profileDisplayName.textContent = displayName;
    if (els.profileDisplayEmail) els.profileDisplayEmail.textContent = user.email || '';
    if (els.profileAvatarInitial) {
      els.profileAvatarInitial.textContent = (displayName[0] || 'A').toUpperCase();
    }
    if (els.profileSubtitle) {
      els.profileSubtitle.textContent = `Signed in as ${user.email || user.userId || ''}`;
    }
    return user;
  } catch {
    window.location.href = '/signin.html';
    return null;
  }
}

if (els.nameForm) els.nameForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus(els.nameStatus, '');
  const nameToSave = els.nameInput.value.trim();
  if (!nameToSave) {
    setStatus(els.nameStatus, 'Please enter a name.', true);
    return;
  }
  try {
    await requestJson('/api/auth/profile', {
      method: 'POST',
      body: JSON.stringify({ fullName: nameToSave }),
    });
    els.nameInput.value = nameToSave;
    localStorage.setItem('atlas_user_name', nameToSave);
    if (els.profileDisplayName) els.profileDisplayName.textContent = nameToSave;
    if (els.profileAvatarInitial) els.profileAvatarInitial.textContent = (nameToSave[0] || 'A').toUpperCase();
    setStatus(els.nameStatus, 'Name saved.');
  } catch (error) {
    setStatus(els.nameStatus, error.message, true);
  }
});

if (els.emailForm) els.emailForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus(els.emailStatus, '');
  try {
    await requestJson('/api/auth/profile', {
      method: 'POST',
      body: JSON.stringify({ email: els.newEmail.value.trim() || undefined }),
    });
    setStatus(els.emailStatus, 'Email updated');
    await loadProfile();
    els.newEmail.value = '';
  } catch (error) {
    setStatus(els.emailStatus, error.message, true);
  }
});

els.passwordForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus(els.passwordStatus, '');
  if (els.confirmPassword && els.newPassword.value !== els.confirmPassword.value) {
    setStatus(els.passwordStatus, 'New password and confirmation must match.', true);
    return;
  }
  try {
    await requestJson('/api/auth/profile', {
      method: 'POST',
      body: JSON.stringify({
        currentPassword: els.currentPassword.value,
        newPassword: els.newPassword.value,
      }),
    });
    setStatus(els.passwordStatus, 'Password updated. Redirecting to sign in...');
    els.currentPassword.value = '';
    els.newPassword.value = '';
    if (els.confirmPassword) els.confirmPassword.value = '';
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(roleKey);
    localStorage.removeItem('atlas_user_email');
    localStorage.removeItem('atlas_user_id');
    setTimeout(() => {
      window.location.href = '/signin.html';
    }, 900);
  } catch (error) {
    setStatus(els.passwordStatus, error.message, true);
  }
});

if (els.requestResetForm) els.requestResetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus(els.requestResetStatus, '');
  try {
    const data = await requestJson('/api/auth/request-reset', {
      method: 'POST',
      body: JSON.stringify({ email: els.resetEmail.value.trim() }),
    });
    setStatus(els.requestResetStatus, data.token ? `Reset token (demo): ${data.token}` : data.message);
  } catch (error) {
    setStatus(els.requestResetStatus, error.message, true);
  }
});

if (els.completeResetForm) els.completeResetForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus(els.completeResetStatus, '');
  try {
    await requestJson('/api/auth/reset', {
      method: 'POST',
      body: JSON.stringify({ token: els.resetToken.value.trim(), password: els.resetPassword.value }),
    });
    setStatus(els.completeResetStatus, 'Password reset. Please sign in again.');
    els.resetToken.value = '';
    els.resetPassword.value = '';
  } catch (error) {
    setStatus(els.completeResetStatus, error.message, true);
  }
});

els.logoutAllBtn.addEventListener('click', async () => {
  setStatus(els.logoutAllStatus, '');
  try {
    await requestJson('/api/auth/logout-all', { method: 'POST' });
    setStatus(els.logoutAllStatus, 'All sessions logged out. Redirecting...');
    localStorage.removeItem(tokenKey);
    localStorage.removeItem(roleKey);
    localStorage.removeItem('atlas_user_email');
    localStorage.removeItem('atlas_user_id');
    setTimeout(() => {
      window.location.href = '/signin.html';
    }, 900);
  } catch (error) {
    setStatus(els.logoutAllStatus, error.message, true);
  }
});

els.logoutBtn.addEventListener('click', () => {
  localStorage.removeItem(tokenKey);
  localStorage.removeItem(roleKey);
  localStorage.removeItem('atlas_user_email');
  localStorage.removeItem('atlas_user_id');
  window.location.href = '/signin.html';
});

applyValidationMessages();
loadProfile();
