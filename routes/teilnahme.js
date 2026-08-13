const express = require('express');
const { db } = require('../database');

const router = express.Router();

function authMiddleware(req, res, next) {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Nicht angemeldet' });
  }
  next();
}

router.use(authMiddleware);

router.post('/einzeln/:gewinnspielId', (req, res) => {
  const { gewinnspielId } = req.params;
  const userId = req.session.userId;

  const gewinnspiel = db.prepare('SELECT * FROM gewinnspiele WHERE id = ?').get(gewinnspielId);
  if (!gewinnspiel) {
    return res.status(404).json({ error: 'Gewinnspiel nicht gefunden' });
  }

  const existing = db.prepare('SELECT * FROM teilnahmen WHERE user_id = ? AND gewinnspiel_id = ?')
    .get(userId, gewinnspielId);
  
  if (existing) {
    return res.status(400).json({ error: 'Sie nehmen bereits an diesem Gewinnspiel teil' });
  }

  db.prepare('INSERT INTO teilnahmen (user_id, gewinnspiel_id, status) VALUES (?, ?, ?)')
    .run(userId, gewinnspielId, 'erfolgreich');

  res.json({ 
    success: true, 
    message: `Teilnahme an "${gewinnspiel.titel}" erfolgreich!` 
  });
});

router.post('/auto', (req, res) => {
  const userId = req.session.userId;
  const userRegion = req.session.userRegion;

  const user = db.prepare('SELECT * FROM users WHERE id = ?').get(userId);
  if (!user.auto_teilnahme) {
    return res.status(400).json({ error: 'Automatische Teilnahme ist deaktiviert' });
  }

  const gewinnspiele = db.prepare(`
    SELECT g.* FROM gewinnspiele g
    WHERE g.kostenlos = 1 
    AND g.enddatum >= date('now')
    AND (g.region = ? OR g.region = 'deutschland')
    AND g.id NOT IN (
      SELECT gewinnspiel_id FROM teilnahmen WHERE user_id = ?
    )
  `).all(userRegion, userId);

  const insertTeilnahme = db.prepare(`
    INSERT INTO teilnahmen (user_id, gewinnspiel_id, status) VALUES (?, ?, 'erfolgreich')
  `);

  let erfolgreiche = 0;
  const teilnahmenDetails = [];

  for (const g of gewinnspiele) {
    try {
      insertTeilnahme.run(userId, g.id);
      erfolgreiche++;
      teilnahmenDetails.push({
        gewinnspiel_id: g.id,
        titel: g.titel,
        preis: g.preis
      });
    } catch (err) {
      console.error(`Fehler bei Teilnahme an ${g.titel}:`, err);
    }
  }

  res.json({ 
    success: true, 
    message: `Automatisch an ${erfolgreiche} Gewinnspielen teilgenommen!`,
    neue_teilnahmen: erfolgreiche,
    details: teilnahmenDetails
  });
});

router.get('/meine', (req, res) => {
  const userId = req.session.userId;

  const teilnahmen = db.prepare(`
    SELECT t.*, g.titel, g.beschreibung, g.preis, g.enddatum, g.veranstalter, g.region
    FROM teilnahmen t
    JOIN gewinnspiele g ON t.gewinnspiel_id = g.id
    WHERE t.user_id = ?
    ORDER BY t.teilnahme_datum DESC
  `).all(userId);

  res.json({ teilnahmen });
});

router.get('/statistik', (req, res) => {
  const userId = req.session.userId;

  const stats = db.prepare(`
    SELECT 
      COUNT(*) as gesamt,
      SUM(CASE WHEN g.enddatum >= date('now') THEN 1 ELSE 0 END) as aktiv,
      SUM(CASE WHEN g.enddatum < date('now') THEN 1 ELSE 0 END) as abgelaufen
    FROM teilnahmen t
    JOIN gewinnspiele g ON t.gewinnspiel_id = g.id
    WHERE t.user_id = ?
  `).get(userId);

  const verfuegbar = db.prepare(`
    SELECT COUNT(*) as count FROM gewinnspiele g
    WHERE g.kostenlos = 1 
    AND g.enddatum >= date('now')
    AND g.id NOT IN (SELECT gewinnspiel_id FROM teilnahmen WHERE user_id = ?)
  `).get(userId);

  res.json({ 
    statistik: {
      ...stats,
      verfuegbar: verfuegbar.count
    }
  });
});

router.delete('/:gewinnspielId', (req, res) => {
  const { gewinnspielId } = req.params;
  const userId = req.session.userId;

  const result = db.prepare('DELETE FROM teilnahmen WHERE user_id = ? AND gewinnspiel_id = ?')
    .run(userId, gewinnspielId);

  if (result.changes === 0) {
    return res.status(404).json({ error: 'Teilnahme nicht gefunden' });
  }

  res.json({ success: true, message: 'Teilnahme zurückgezogen' });
});

module.exports = router;
