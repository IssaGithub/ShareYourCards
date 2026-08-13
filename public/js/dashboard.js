let currentUser = null;
let userTeilnahmen = [];

document.addEventListener('DOMContentLoaded', async () => {
  await checkAuth();
  await loadRegionen();
  await loadStatistik();
  await loadGewinnspiele();
  await loadTeilnahmen();
});

async function checkAuth() {
  try {
    const response = await fetch('/api/auth/me');
    if (!response.ok) {
      window.location.href = '/';
      return;
    }
    const data = await response.json();
    currentUser = data.user;
    
    document.getElementById('user-name').textContent = currentUser.vorname;
    document.getElementById('settings-region').value = currentUser.region;
    
    const toggle = document.getElementById('auto-teilnahme-toggle');
    if (currentUser.auto_teilnahme) {
      toggle.classList.add('active');
    }
  } catch (error) {
    window.location.href = '/';
  }
}

async function loadRegionen() {
  try {
    const response = await fetch('/api/gewinnspiele/regionen');
    const data = await response.json();
    
    const filterSelect = document.getElementById('region-filter');
    const settingsSelect = document.getElementById('settings-region');
    
    data.regionen.forEach(region => {
      const option1 = document.createElement('option');
      option1.value = region.value;
      option1.textContent = region.label;
      filterSelect.appendChild(option1);
      
      const option2 = document.createElement('option');
      option2.value = region.value;
      option2.textContent = region.label;
      settingsSelect.appendChild(option2);
    });

    if (currentUser) {
      filterSelect.value = currentUser.region;
      settingsSelect.value = currentUser.region;
    }
  } catch (error) {
    console.error('Fehler beim Laden der Regionen:', error);
  }
}

async function loadStatistik() {
  try {
    const response = await fetch('/api/teilnahme/statistik');
    const data = await response.json();
    
    document.getElementById('stat-teilnahmen').textContent = data.statistik.gesamt || 0;
    document.getElementById('stat-aktiv').textContent = data.statistik.aktiv || 0;
    document.getElementById('stat-verfuegbar').textContent = data.statistik.verfuegbar || 0;

    const banner = document.getElementById('auto-teilnahme-banner');
    if (data.statistik.verfuegbar > 0) {
      banner.style.display = 'flex';
    } else {
      banner.style.display = 'none';
    }
  } catch (error) {
    console.error('Fehler beim Laden der Statistik:', error);
  }
}

async function loadGewinnspiele() {
  const container = document.getElementById('gewinnspiele-list');
  const region = document.getElementById('region-filter').value;

  container.innerHTML = '<div class="loading"><div class="spinner"></div></div>';

  try {
    const [gewinnspielResponse, teilnahmenResponse] = await Promise.all([
      fetch(`/api/gewinnspiele?region=${region}`),
      fetch('/api/teilnahme/meine')
    ]);

    const gewinnspielData = await gewinnspielResponse.json();
    const teilnahmenData = await teilnahmenResponse.json();
    
    userTeilnahmen = teilnahmenData.teilnahmen.map(t => t.gewinnspiel_id);

    if (gewinnspielData.gewinnspiele.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>Keine Gewinnspiele gefunden</h3>
          <p>In dieser Region sind aktuell keine kostenlosen Gewinnspiele verfügbar.</p>
        </div>
      `;
      return;
    }

    container.innerHTML = gewinnspielData.gewinnspiele.map(g => {
      const istTeilgenommen = userTeilnahmen.includes(g.id);
      const enddatum = new Date(g.enddatum).toLocaleDateString('de-DE');
      
      return `
        <div class="gewinnspiel-card ${istTeilgenommen ? 'teilgenommen' : ''}">
          <span class="gewinnspiel-tag">${getRegionLabel(g.region)}</span>
          <h3>${escapeHtml(g.titel)}</h3>
          <p class="beschreibung">${escapeHtml(g.beschreibung)}</p>
          <p class="gewinnspiel-preis">🎁 ${escapeHtml(g.preis)}</p>
          <div class="gewinnspiel-meta">
            <span>📅 Endet: ${enddatum}</span>
            <span>🏢 ${escapeHtml(g.veranstalter)}</span>
          </div>
          <div class="gewinnspiel-actions">
            ${istTeilgenommen 
              ? `<button class="btn btn-secondary btn-sm" disabled>Bereits teilgenommen</button>
                 <button class="btn btn-danger btn-sm" onclick="zurueckziehen(${g.id})">Zurückziehen</button>`
              : `<button class="btn btn-success btn-sm" onclick="teilnehmen(${g.id})">Jetzt teilnehmen</button>`
            }
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Fehler beim Laden</h3>
        <p>Die Gewinnspiele konnten nicht geladen werden. Bitte versuche es erneut.</p>
      </div>
    `;
  }
}

async function loadTeilnahmen() {
  const container = document.getElementById('teilnahmen-list');

  try {
    const response = await fetch('/api/teilnahme/meine');
    const data = await response.json();

    if (data.teilnahmen.length === 0) {
      container.innerHTML = `
        <div class="empty-state">
          <h3>Noch keine Teilnahmen</h3>
          <p>Du hast noch an keinem Gewinnspiel teilgenommen. Starte jetzt mit der Auto-Teilnahme!</p>
        </div>
      `;
      return;
    }

    container.innerHTML = data.teilnahmen.map(t => {
      const enddatum = new Date(t.enddatum).toLocaleDateString('de-DE');
      const teilnahmeDatum = new Date(t.teilnahme_datum).toLocaleDateString('de-DE');
      const istAktiv = new Date(t.enddatum) >= new Date();
      
      return `
        <div class="teilnahme-item">
          <div class="teilnahme-info">
            <h4>${escapeHtml(t.titel)}</h4>
            <p>🎁 ${escapeHtml(t.preis)} | 📅 Endet: ${enddatum} | Teilnahme: ${teilnahmeDatum}</p>
          </div>
          <div class="teilnahme-status">
            <span class="status-badge ${istAktiv ? 'status-aktiv' : 'status-erfolgreich'}">
              ${istAktiv ? 'Aktiv' : 'Abgelaufen'}
            </span>
            ${istAktiv ? `<button class="btn btn-danger btn-sm" onclick="zurueckziehen(${t.gewinnspiel_id})">Zurückziehen</button>` : ''}
          </div>
        </div>
      `;
    }).join('');
  } catch (error) {
    container.innerHTML = `
      <div class="empty-state">
        <h3>Fehler beim Laden</h3>
        <p>Die Teilnahmen konnten nicht geladen werden.</p>
      </div>
    `;
  }
}

async function teilnehmen(gewinnspielId) {
  try {
    const response = await fetch(`/api/teilnahme/einzeln/${gewinnspielId}`, {
      method: 'POST'
    });

    const data = await response.json();

    if (response.ok) {
      await loadStatistik();
      await loadGewinnspiele();
      await loadTeilnahmen();
    } else {
      alert(data.error || 'Teilnahme fehlgeschlagen');
    }
  } catch (error) {
    alert('Netzwerkfehler. Bitte versuche es erneut.');
  }
}

async function zurueckziehen(gewinnspielId) {
  if (!confirm('Möchtest du deine Teilnahme wirklich zurückziehen?')) {
    return;
  }

  try {
    const response = await fetch(`/api/teilnahme/${gewinnspielId}`, {
      method: 'DELETE'
    });

    if (response.ok) {
      await loadStatistik();
      await loadGewinnspiele();
      await loadTeilnahmen();
    } else {
      const data = await response.json();
      alert(data.error || 'Zurückziehen fehlgeschlagen');
    }
  } catch (error) {
    alert('Netzwerkfehler. Bitte versuche es erneut.');
  }
}

async function startAutoTeilnahme() {
  try {
    const response = await fetch('/api/teilnahme/auto', {
      method: 'POST'
    });

    const data = await response.json();

    if (response.ok) {
      showResultModal(data);
      await loadStatistik();
      await loadGewinnspiele();
      await loadTeilnahmen();
    } else {
      alert(data.error || 'Auto-Teilnahme fehlgeschlagen');
    }
  } catch (error) {
    alert('Netzwerkfehler. Bitte versuche es erneut.');
  }
}

function showResultModal(data) {
  const modal = document.getElementById('result-modal');
  const content = document.getElementById('result-content');

  if (data.neue_teilnahmen === 0) {
    content.innerHTML = `
      <div class="alert alert-info">
        Du nimmst bereits an allen verfügbaren Gewinnspielen teil!
      </div>
    `;
  } else {
    content.innerHTML = `
      <div class="alert alert-success">
        Erfolgreich an ${data.neue_teilnahmen} Gewinnspielen teilgenommen!
      </div>
      <div class="auto-teilnahme-results">
        ${data.details.map(d => `
          <div class="result-item">
            <span class="check">✓</span>
            <div>
              <strong>${escapeHtml(d.titel)}</strong>
              <div style="color: var(--text-secondary); font-size: 0.9rem;">🎁 ${escapeHtml(d.preis)}</div>
            </div>
          </div>
        `).join('')}
      </div>
    `;
  }

  modal.classList.add('active');
}

function closeResultModal() {
  document.getElementById('result-modal').classList.remove('active');
}

function toggleAutoTeilnahme() {
  const toggle = document.getElementById('auto-teilnahme-toggle');
  toggle.classList.toggle('active');
}

async function saveSettings() {
  const region = document.getElementById('settings-region').value;
  const autoTeilnahme = document.getElementById('auto-teilnahme-toggle').classList.contains('active');

  try {
    const response = await fetch('/api/auth/settings', {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ region, auto_teilnahme: autoTeilnahme })
    });

    if (response.ok) {
      alert('Einstellungen gespeichert!');
      document.getElementById('region-filter').value = region;
      currentUser.region = region;
      currentUser.auto_teilnahme = autoTeilnahme;
      await loadStatistik();
      await loadGewinnspiele();
    } else {
      const data = await response.json();
      alert(data.error || 'Speichern fehlgeschlagen');
    }
  } catch (error) {
    alert('Netzwerkfehler. Bitte versuche es erneut.');
  }
}

async function handleLogout() {
  try {
    await fetch('/api/auth/logout', { method: 'POST' });
    window.location.href = '/';
  } catch (error) {
    window.location.href = '/';
  }
}

function getRegionLabel(region) {
  const labels = {
    'deutschland': 'Ganz Deutschland',
    'bayern': 'Bayern',
    'baden-württemberg': 'Baden-Württemberg',
    'berlin': 'Berlin',
    'brandenburg': 'Brandenburg',
    'bremen': 'Bremen',
    'hamburg': 'Hamburg',
    'hessen': 'Hessen',
    'mecklenburg-vorpommern': 'Mecklenburg-Vorpommern',
    'niedersachsen': 'Niedersachsen',
    'nrw': 'NRW',
    'rheinland-pfalz': 'Rheinland-Pfalz',
    'saarland': 'Saarland',
    'sachsen': 'Sachsen',
    'sachsen-anhalt': 'Sachsen-Anhalt',
    'schleswig-holstein': 'Schleswig-Holstein',
    'thüringen': 'Thüringen',
    'münchen': 'München'
  };
  return labels[region] || region;
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

document.addEventListener('keydown', (e) => {
  if (e.key === 'Escape') {
    closeResultModal();
  }
});

document.getElementById('result-modal').addEventListener('click', (e) => {
  if (e.target.classList.contains('modal-overlay')) {
    closeResultModal();
  }
});
