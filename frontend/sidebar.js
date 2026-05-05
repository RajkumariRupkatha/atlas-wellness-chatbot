(function initSharedSidebar() {
  const SIDEBAR_HTML = `
    <div class="sidebar-top-row">
      <span id="topbarUserName" class="topbar-user-chip"></span>
      <button id="sidebarToggle" class="sidebar-toggle-btn" type="button" aria-label="Collapse sidebar">
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <polyline points="15 18 9 12 15 6"></polyline>
        </svg>
      </button>
    </div>

    <div class="sidebar-hero">
      <p class="chat-heading-kicker">Daily Wellness Companion</p>
      <h1 class="chat-heading-title">Atlas</h1>
      <p class="chat-heading-sub">Your wellness companion for better routines, lower stress, and sustainable healthy habits.</p>
    </div>

    <div class="sidebar-streak" id="sidebarStreak">
      <span class="sidebar-streak-flame">🔥</span>
      <span class="sidebar-streak-count" id="sidebarStreakCount">—</span>
      <span class="sidebar-streak-label">day streak</span>
    </div>

    <div class="sidebar-settings">
      <p class="prev-sessions-label">Quick Access</p>
      <div class="settings-list">
        <button class="settings-item" id="newChatBtn" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
          New chat
        </button>
        <a class="settings-item" href="/checkin.html">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 11l3 3L22 4"/><path d="M21 12v7a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11"/></svg>
          Daily Check-in
        </a>
        <a class="settings-item" href="/dashboard.html">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>
          Dashboard
        </a>
        <a class="settings-item" href="/history.html">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
          History
        </a>
      </div>
    </div>

    <div class="prev-sessions">
      <p class="prev-sessions-label">Previous conversations</p>
      <div id="sessionList" class="session-list">
        <p class="session-empty">Your past conversations will appear here.</p>
      </div>
    </div>

    <div class="sidebar-settings">
      <p class="prev-sessions-label">Settings</p>
      <div class="settings-list">
        <a class="settings-item" href="/profile.html">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="12" cy="8" r="4"/><path d="M4 20c0-4 3.6-7 8-7s8 3 8 7"/></svg>
          Profile
        </a>
        <button class="settings-item" id="sidebarSignOut" type="button">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
          Sign out
        </button>
      </div>
    </div>
  `;

  var heroPanel = document.querySelector('.hero-panel');
  if (!heroPanel) return;
  heroPanel.innerHTML = SIDEBAR_HTML;

  // Populate username chip from localStorage
  var nameEl = document.getElementById('topbarUserName');
  if (nameEl) {
    var savedName = localStorage.getItem('atlas_user_name') || '';
    var savedEmail = localStorage.getItem('atlas_user_email') || '';
    nameEl.textContent = savedName || (savedEmail ? savedEmail.split('@')[0] : '');
  }

  // Mark the active nav item
  var path = window.location.pathname;
  heroPanel.querySelectorAll('a.settings-item').forEach(function(el) {
    var href = el.getAttribute('href') || '';
    if (path === href || path.endsWith(href.replace(/^\//, ''))) {
      el.classList.add('active');
    }
  });

  // On non-chat pages, "New chat" navigates to the chat page
  var newChatBtn = document.getElementById('newChatBtn');
  if (newChatBtn && !path.endsWith('chat.html') && path !== '/') {
    newChatBtn.addEventListener('click', function() {
      window.location.href = '/chat.html';
    });
  }

  // Sidebar collapse/expand
  var shell = document.querySelector('.app-shell');
  var toggle = document.getElementById('sidebarToggle');
  var expandBtn = document.getElementById('sidebarExpandBtn');
  var MIN_W = 180;
  var MAX_W = 560;

  var savedW = parseInt(localStorage.getItem('atlas_sidebar_width'), 10);
  if (savedW >= MIN_W && savedW <= MAX_W) {
    heroPanel.style.flexBasis = savedW + 'px';
    heroPanel.style.width = savedW + 'px';
  }

  if (localStorage.getItem('atlas_sidebar_collapsed') === 'true') {
    shell && shell.classList.add('sidebar-collapsed');
  }

  function toggleSidebar() {
    if (!shell) return;
    var collapsed = shell.classList.toggle('sidebar-collapsed');
    localStorage.setItem('atlas_sidebar_collapsed', String(collapsed));
  }

  if (toggle) toggle.addEventListener('click', toggleSidebar);
  if (expandBtn) expandBtn.addEventListener('click', toggleSidebar);

  // Drag-to-resize
  var handle = document.getElementById('resizeHandle');
  if (handle) {
    handle.addEventListener('mousedown', function(e) {
      e.preventDefault();
      var startX = e.clientX;
      var startW = heroPanel.getBoundingClientRect().width;
      handle.classList.add('is-dragging');
      document.body.style.cursor = 'col-resize';
      document.body.style.userSelect = 'none';
      heroPanel.classList.add('no-transition');

      function onMove(e) {
        var w = Math.min(MAX_W, Math.max(MIN_W, startW + e.clientX - startX));
        heroPanel.style.flexBasis = w + 'px';
        heroPanel.style.width = w + 'px';
      }

      function onUp() {
        heroPanel.classList.remove('no-transition');
        handle.classList.remove('is-dragging');
        document.body.style.cursor = '';
        document.body.style.userSelect = '';
        localStorage.setItem('atlas_sidebar_width', parseInt(heroPanel.style.width, 10));
        document.removeEventListener('mousemove', onMove);
        document.removeEventListener('mouseup', onUp);
      }

      document.addEventListener('mousemove', onMove);
      document.addEventListener('mouseup', onUp);
    });
  }

  // Sign out
  function signOut() {
    ['atlas_token', 'atlas_user_email', 'atlas_user_role', 'atlas_user_id', 'atlas_user_name']
      .forEach(function(k) { localStorage.removeItem(k); });
    window.location.href = '/signin.html';
  }

  var signOutBtn = document.getElementById('sidebarSignOut');
  if (signOutBtn) signOutBtn.addEventListener('click', signOut);

  // Load streak
  var token = localStorage.getItem('atlas_token');
  if (token) {
    var localDate = new Date().toLocaleDateString('en-CA');
    fetch('/api/streak?localDate=' + localDate, {
      headers: { Authorization: 'Bearer ' + token },
    })
      .then(function(r) { return r.ok ? r.json() : null; })
      .then(function(data) {
        if (!data) return;
        var countEl = document.getElementById('sidebarStreakCount');
        if (countEl) countEl.textContent = data.currentStreak || 0;
      })
      .catch(function() {});
  }
}());
