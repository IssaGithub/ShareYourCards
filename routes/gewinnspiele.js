const express = require('express');
const { db } = require('../database');

const router = express.Router();

router.get('/', (req, res) => {
  const { region } = req.query;
  
  let query = `
    SELECT * FROM gewinnspiele 
    WHERE kostenlos = 1 AND enddatum >= date('now')
  `;
  const params = [];

  if (region && region !== 'alle') {
    query += ` AND (region = ? OR region = 'deutschland')`;
    params.push(region);
  }

  query += ' ORDER BY enddatum ASC';

  const gewinnspiele = db.prepare(query).all(...params);
  res.json({ gewinnspiele });
});

router.get('/regionen', (req, res) => {
  const regionen = [
    { value: 'deutschland', label: 'Ganz Deutschland' },
    { value: 'bayern', label: 'Bayern' },
    { value: 'baden-württemberg', label: 'Baden-Württemberg' },
    { value: 'berlin', label: 'Berlin' },
    { value: 'brandenburg', label: 'Brandenburg' },
    { value: 'bremen', label: 'Bremen' },
    { value: 'hamburg', label: 'Hamburg' },
    { value: 'hessen', label: 'Hessen' },
    { value: 'mecklenburg-vorpommern', label: 'Mecklenburg-Vorpommern' },
    { value: 'niedersachsen', label: 'Niedersachsen' },
    { value: 'nrw', label: 'Nordrhein-Westfalen' },
    { value: 'rheinland-pfalz', label: 'Rheinland-Pfalz' },
    { value: 'saarland', label: 'Saarland' },
    { value: 'sachsen', label: 'Sachsen' },
    { value: 'sachsen-anhalt', label: 'Sachsen-Anhalt' },
    { value: 'schleswig-holstein', label: 'Schleswig-Holstein' },
    { value: 'thüringen', label: 'Thüringen' },
    { value: 'münchen', label: 'München' }
  ];
  res.json({ regionen });
});

router.get('/:id', (req, res) => {
  const gewinnspiel = db.prepare('SELECT * FROM gewinnspiele WHERE id = ?').get(req.params.id);
  
  if (!gewinnspiel) {
    return res.status(404).json({ error: 'Gewinnspiel nicht gefunden' });
  }

  res.json({ gewinnspiel });
});

module.exports = router;
