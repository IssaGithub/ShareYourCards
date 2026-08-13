const express = require('express');
const bcrypt = require('bcryptjs');
const { db } = require('../database');

const router = express.Router();

router.post('/register', async (req, res) => {
  try {
    const { email, password, vorname, nachname, region } = req.body;

    if (!email || !password || !vorname || !nachname || !region) {
      return res.status(400).json({ error: 'Alle Felder sind erforderlich' });
    }

    const existing = db.prepare('SELECT id FROM users WHERE email = ?').get(email);
    if (existing) {
      return res.status(400).json({ error: 'Diese E-Mail ist bereits registriert' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = db.prepare(`
      INSERT INTO users (email, password, vorname, nachname, region)
      VALUES (?, ?, ?, ?, ?)
    `).run(email, hashedPassword, vorname, nachname, region);

    req.session.userId = result.lastInsertRowid;
    req.session.userEmail = email;
    req.session.userRegion = region;

    res.json({ 
      success: true, 
      message: 'Registrierung erfolgreich!',
      user: { id: result.lastInsertRowid, email, vorname, nachname, region }
    });
  } catch (error) {
    console.error('Registrierungsfehler:', error);
    res.status(500).json({ error: 'Serverfehler bei der Registrierung' });
  }
});

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ error: 'E-Mail und Passwort sind erforderlich' });
    }

    const user = db.prepare('SELECT * FROM users WHERE email = ?').get(email);
    if (!user) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(401).json({ error: 'Ungültige Anmeldedaten' });
    }

    req.session.userId = user.id;
    req.session.userEmail = user.email;
    req.session.userRegion = user.region;

    res.json({ 
      success: true, 
      message: 'Anmeldung erfolgreich!',
      user: { 
        id: user.id, 
        email: user.email, 
        vorname: user.vorname, 
        nachname: user.nachname, 
        region: user.region,
        auto_teilnahme: user.auto_teilnahme
      }
    });
  } catch (error) {
    console.error('Anmeldefehler:', error);
    res.status(500).json({ error: 'Serverfehler bei der Anmeldung' });
  }
});

router.post('/logout', (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({ error: 'Fehler beim Abmelden' });
    }
    res.json({ success: true, message: 'Abmeldung erfolgreich' });
  });
});

router.get('/me', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Nicht angemeldet' });
  }

  const user = db.prepare('SELECT id, email, vorname, nachname, region, auto_teilnahme FROM users WHERE id = ?')
    .get(req.session.userId);

  if (!user) {
    return res.status(404).json({ error: 'Benutzer nicht gefunden' });
  }

  res.json({ user });
});

router.put('/settings', (req, res) => {
  if (!req.session.userId) {
    return res.status(401).json({ error: 'Nicht angemeldet' });
  }

  const { region, auto_teilnahme } = req.body;

  db.prepare('UPDATE users SET region = ?, auto_teilnahme = ? WHERE id = ?')
    .run(region, auto_teilnahme ? 1 : 0, req.session.userId);

  req.session.userRegion = region;

  res.json({ success: true, message: 'Einstellungen gespeichert' });
});

module.exports = router;
