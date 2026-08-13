document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadRegionen();
});

async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me');
    if (response.ok) {
      window.location.href = '/dashboard';
    }
  } catch (error) {
    console.log('Nicht angemeldet');
  }
}

async function loadRegionen() {
  try {
    const response = await fetch('/api/gewinnspiele/regionen');
    const data = await response.json();
    
    const select = document.getElementById('reg-region');
    data.regionen.forEach(region => {
      const option = document.createElement('option');
      option.value = region.value;
      option.textContent = region.label;
      select.appendChild(option);
    });
  } catch (error) {
    console.error('Fehler beim Laden der Regionen:', error);
  }
}

function showAuthModal() {
  document.getElementById('auth-modal').classList.add('active');
}

function closeAuthModal() {
  document.getElementById('auth-modal').classList.remove('active');
  clearAuthAlert();
}

function switchAuthTab(tab) {
  const tabs = document.querySelectorAll('.auth-tab');
  const loginForm = document.getElementById('login-form');
  const registerForm = document.getElementById('register-form');
  
  tabs.forEach(t => t.classList.remove('active'));
  clearAuthAlert();

  if (tab === 'login') {
    tabs[0].classList.add('active');
    loginForm.style.display = 'block';
    registerForm.style.display = 'none';
    document.getElementById('auth-title').textContent = 'Anmelden';
  } else {
    tabs[1].classList.add('active');
    loginForm.style.display = 'none';
    registerForm.style.display = 'block';
    document.getElementById('auth-title').textContent = 'Registrieren';
  }
}

function showAuthAlert(message, type = 'error') {
  const alertDiv = document.getElementById('auth-alert');
  alertDiv.innerHTML = `<div class="alert alert-${type}">${message}</div>`;
}

function clearAuthAlert() {
  document.getElementById('auth-alert').innerHTML = '';
}

async function handleLogin(event) {
  event.preventDefault();
  
  const email = document.getElementById('login-email').value;
  const password = document.getElementById('login-password').value;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });

    const data = await response.json();

    if (response.ok) {
      showAuthAlert('Anmeldung erfolgreich! Weiterleitung...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      showAuthAlert(data.error || 'Anmeldung fehlgeschlagen');
    }
  } catch (error) {
    showAuthAlert('Netzwerkfehler. Bitte versuche es erneut.');
  }
}

async function handleRegister(event) {
  event.preventDefault();
  
  const vorname = document.getElementById('reg-vorname').value;
  const nachname = document.getElementById('reg-nachname').value;
  const email = document.getElementById('reg-email').value;
  const password = document.getElementById('reg-password').value;
  const region = document.getElementById('reg-region').value;

  if (!region) {
    showAuthAlert('Bitte wähle eine Region aus');
    return;
  }

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ vorname, nachname, email, password, region })
    });

    const data = await response.json();

    if (response.ok) {
      showAuthAlert('Registrierung erfolgreich! Weiterleitung...', 'success');
      setTimeout(() => {
        window.location.href = '/dashboard';
      }, 1000);
    } else {
      showAuthAlert(data.error || 'Registrierung fehlgeschlagen');
    }
  } catch (error) {
    showAuthAlert('Netzwerkfehler. Bitte versuche es erneut.');
  }
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeAuthModal();
  }
});

document.getElementById('auth-modal').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeAuthModal();
  }
});
