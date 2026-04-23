// Auth utility functions

function saveAuth(token, user) {
  localStorage.setItem('token', token);
  localStorage.setItem('user', JSON.stringify(user));
}

function getToken() {
  return localStorage.getItem('token');
}

function getUser() {
  const user = localStorage.getItem('user');
  if (!user) return null;

  try {
    return JSON.parse(user);
  } catch (error) {
    localStorage.removeItem('user');
    return null;
  }
}

function isLoggedIn() {
  return !!getToken();
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = window.location.pathname.includes('/pages/')
    ? '../index.html'
    : 'index.html';
}

function requireAuth() {
  if (!isLoggedIn()) {
    window.location.href = window.location.pathname.includes('/pages/')
      ? 'login.html'
      : 'pages/login.html';
  }
}

function requireAdmin() {
  const user = getUser();
  if (!user || user.role !== 'admin') {
    window.location.href = window.location.pathname.includes('/pages/')
      ? 'login.html'
      : 'pages/login.html';
  }
}

// Dynamic navbar
function updateNavbar() {
  const navLinksEl = document.getElementById('navLinks');
  if (!navLinksEl) return;

  const user = getUser();
  const isInPages = window.location.pathname.includes('/pages/');
  const prefix = isInPages ? '' : 'pages/';
  const homeLink = isInPages ? '../index.html' : 'index.html';

  if (user) {
    let menuLinks = '';

    if (user.role === 'admin') {
      menuLinks = `
        <li><a class="profile-flyout-link" href="${prefix}admin.html"><i class="fas fa-tachometer-alt me-2"></i>Dashboard</a></li>
      `;
    } else {
      menuLinks = `
        <li><a class="profile-flyout-link" href="${prefix}dashboard.html"><i class="fas fa-chart-line me-2"></i>Dashboard</a></li>
        <li><a class="profile-flyout-link" href="${prefix}assessment.html"><i class="fas fa-clipboard-list me-2"></i>Assessment</a></li>
        <li><a class="profile-flyout-link" href="${prefix}results.html"><i class="fas fa-file-alt me-2"></i>Results</a></li>
      `;
    }

    const links = `
      <li class="nav-item position-relative profile-menu-wrap">
        <a class="nav-link text-white" href="#" data-action="toggle-profile-menu" aria-expanded="false">
          <i class="fas fa-user-circle me-1"></i> ${user.name}
          <i class="fas fa-chevron-down ms-1 small"></i>
        </a>
        <ul class="profile-flyout-menu" data-role="profile-menu">
          <li><span class="profile-flyout-meta">${user.email}</span></li>
          <li><span class="profile-flyout-role">${user.role}</span></li>
          <li class="profile-flyout-divider"></li>
          ${menuLinks}
          <li class="profile-flyout-divider"></li>
          <li><a class="profile-flyout-link text-danger" href="#" data-action="logout"><i class="fas fa-sign-out-alt me-2"></i>Logout</a></li>
        </ul>
      </li>
      <li class="nav-item ms-2">
        <button class="btn btn-sm btn-outline-light rounded-pill" onclick="toggleDarkMode()" title="Toggle Dark Mode">
          <i class="fas fa-moon" id="darkModeIcon"></i>
        </button>
      </li>
    `;

    navLinksEl.innerHTML = links;
  } else {
    navLinksEl.innerHTML = `
      <li class="nav-item"><a class="nav-link text-white" href="${prefix}login.html"><i class="fas fa-sign-in-alt me-1"></i> Login</a></li>
      <li class="nav-item"><a class="nav-link text-white" href="${prefix}register.html"><i class="fas fa-user-plus me-1"></i> Register</a></li>
      <li class="nav-item ms-2">
        <button class="btn btn-sm btn-outline-light rounded-pill" onclick="toggleDarkMode()" title="Toggle Dark Mode">
          <i class="fas fa-moon" id="darkModeIcon"></i>
        </button>
      </li>
    `;
  }

  // Apply dark mode on load
  if (localStorage.getItem('darkMode') === 'true') {
    document.body.classList.add('dark-mode');
    const icon = document.getElementById('darkModeIcon');
    if (icon) icon.className = 'fas fa-sun';
  }
}

// Dark mode toggle
function toggleDarkMode() {
  document.body.classList.toggle('dark-mode');
  const isDark = document.body.classList.contains('dark-mode');
  localStorage.setItem('darkMode', isDark);
  const icon = document.getElementById('darkModeIcon');
  if (icon) icon.className = isDark ? 'fas fa-sun' : 'fas fa-moon';
}

document.addEventListener('DOMContentLoaded', () => {
  const navLinksEl = document.getElementById('navLinks');
  if (navLinksEl) {
    updateNavbar();
  }

  document.addEventListener('click', (event) => {
    const profileToggle = event.target.closest('[data-action="toggle-profile-menu"]');
    if (profileToggle) {
      event.preventDefault();
      const wrap = profileToggle.closest('.profile-menu-wrap');
      const menu = wrap?.querySelector('[data-role="profile-menu"]');
      if (!menu) return;

      const willOpen = !menu.classList.contains('show');
      document.querySelectorAll('[data-role="profile-menu"].show').forEach((item) => {
        item.classList.remove('show');
      });
      menu.classList.toggle('show', willOpen);
      profileToggle.setAttribute('aria-expanded', willOpen ? 'true' : 'false');
      return;
    }

    const logoutLink = event.target.closest('[data-action="logout"]');
    if (logoutLink) {
      event.preventDefault();
      logout();
      return;
    }

    if (!event.target.closest('.profile-menu-wrap')) {
      document.querySelectorAll('[data-role="profile-menu"].show').forEach((item) => {
        item.classList.remove('show');
      });
      document.querySelectorAll('[data-action="toggle-profile-menu"]').forEach((toggle) => {
        toggle.setAttribute('aria-expanded', 'false');
      });
    }
  });
});
