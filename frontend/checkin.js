const TOKEN_KEY = 'atlas_token';
const roleKey = 'atlas_user_role';

const els = {
  form: document.getElementById('checkinForm'),
  status: document.getElementById('checkinStatus'),
  submitBtn: document.getElementById('submitCheckin'),
  sliders: [
    { id: 'sleep', label: 'sleep', valueEl: document.getElementById('sleepValue') },
    { id: 'mood', label: 'mood', valueEl: document.getElementById('moodValue') },
    { id: 'energy', label: 'energy', valueEl: document.getElementById('energyValue') },
    { id: 'stress', label: 'stress', valueEl: document.getElementById('stressValue') },
    { id: 'hydration', label: 'hydration', valueEl: document.getElementById('hydrationValue') },
  ],
};

function requireToken() {
  const token = localStorage.getItem(TOKEN_KEY);
  if (!token) {
    window.location.href = '/signin.html';
    return null;
  }
  return token;
}

function setStatus(text, isError = false) {
  els.status.textContent = text;
  els.status.classList.toggle('error', isError);
}

function setLoading(isLoading) {
  els.submitBtn.disabled = isLoading;
  els.submitBtn.innerHTML = isLoading ? '<span class="spinner"></span>Submitting...' : 'Submit Check-in';
}

function attachSliderLabels() {
  const descriptors = {
    sleep: ['Poor', 'Poor', 'Poor', 'Poor', 'Okay', 'Okay', 'Okay', 'Great', 'Great', 'Great', 'Great'],
    mood: ['Low', 'Low', 'Low', 'Low', 'Neutral', 'Neutral', 'Neutral', 'Positive', 'Positive', 'Positive', 'Positive'],
    energy: ['Drained', 'Drained', 'Drained', 'Drained', 'Moderate', 'Moderate', 'Moderate', 'High', 'High', 'High', 'High'],
    stress: ['Calm', 'Calm', 'Calm', 'Calm', 'Moderate', 'Moderate', 'Moderate', 'High', 'High', 'High', 'High'],
    hydration: ['Dehydrated', 'Dehydrated', 'Dehydrated', 'Low', 'Decent', 'Decent', 'Decent', 'Well hydrated', 'Well hydrated', 'Well hydrated', 'Well hydrated'],
  };

  els.sliders.forEach(({ id, valueEl }) => {
    const input = document.getElementById(id);
    const update = () => {
      const numeric = Number(input.value);
      const descriptor = descriptors[id]?.[numeric] || '';
      valueEl.textContent = `${numeric} / 10${descriptor ? ` — ${descriptor}` : ''}`;
    };
    input.addEventListener('input', update);
    update();
  });
}

async function submitCheckin(payload) {
  const token = requireToken();
  if (!token) throw new Error('Not authenticated');

  const response = await fetch('/api/checkin', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });
  if (response.status === 401) {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(roleKey);
    localStorage.removeItem('atlas_user_email');
    localStorage.removeItem('atlas_user_id');
    window.location.href = '/signin.html';
    return;
  }
  const data = await response.json();
  if (!response.ok) {
    throw new Error(data.error || 'Check-in failed');
  }
  return data;
}

els.form.addEventListener('submit', async (e) => {
  e.preventDefault();
  setStatus('');
  setLoading(true);

  const payload = {
    sleep: Number(document.getElementById('sleep').value),
    mood: Number(document.getElementById('mood').value),
    energy: Number(document.getElementById('energy').value),
    stress: Number(document.getElementById('stress').value),
    hydration: Number(document.getElementById('hydration').value),
    notes: document.getElementById('notes').value.trim() || null,
    localDate: new Date().toLocaleDateString('en-CA'), // YYYY-MM-DD in local time
  };

  try {
    const data = await submitCheckin(payload);
    const streakMsg = buildStreakMessage(data.streak);
    setStatus(streakMsg || 'Check-in submitted. Thanks!');
  } catch (error) {
    setStatus(error.message, true);
  } finally {
    setLoading(false);
  }
});

function buildStreakMessage(streak) {
  if (!streak) return null;
  const { currentStreak, longestStreak, alreadyCheckedIn } = streak;
  if (alreadyCheckedIn) return 'Already checked in today. Streak holding strong!';
  if (currentStreak === 1) return 'Check-in submitted. Day 1 — great start!';
  const isNewRecord = currentStreak > 1 && currentStreak === longestStreak;
  if (isNewRecord) return `New record! ${currentStreak}-day streak. Keep it going!`;
  return `Check-in submitted. ${currentStreak}-day streak — keep it up!`;
}

attachSliderLabels();
