const Database = require('better-sqlite3');
const path = require('path');

const db = new Database(path.join(__dirname, 'gewinnspiele.db'));

function initialize() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      email TEXT UNIQUE NOT NULL,
      password TEXT NOT NULL,
      vorname TEXT NOT NULL,
      nachname TEXT NOT NULL,
      region TEXT NOT NULL,
      auto_teilnahme INTEGER DEFAULT 1,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS gewinnspiele (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      titel TEXT NOT NULL,
      beschreibung TEXT,
      preis TEXT NOT NULL,
      region TEXT NOT NULL,
      kostenlos INTEGER DEFAULT 1,
      enddatum DATE NOT NULL,
      veranstalter TEXT,
      teilnahme_url TEXT,
      created_at DATETIME DEFAULT CURRENT_TIMESTAMP
    );

    CREATE TABLE IF NOT EXISTS teilnahmen (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      user_id INTEGER NOT NULL,
      gewinnspiel_id INTEGER NOT NULL,
      status TEXT DEFAULT 'erfolgreich',
      teilnahme_datum DATETIME DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id),
      FOREIGN KEY (gewinnspiel_id) REFERENCES gewinnspiele(id),
      UNIQUE(user_id, gewinnspiel_id)
    );
  `);

  const count = db.prepare('SELECT COUNT(*) as count FROM gewinnspiele').get();
  if (count.count === 0) {
    seedGewinnspiele();
  }

  console.log('Datenbank initialisiert');
}

function seedGewinnspiele() {
  const gewinnspiele = [
    { titel: 'Samsung Galaxy S24 Verlosung', beschreibung: 'Gewinne das neueste Samsung Smartphone!', preis: 'Samsung Galaxy S24 Ultra', region: 'deutschland', enddatum: '2026-09-15', veranstalter: 'TechMagazin' },
    { titel: 'Wellness-Wochenende für 2', beschreibung: 'Entspannung pur im 5-Sterne Spa Resort', preis: 'Wellness-Wochenende im Wert von 800€', region: 'bayern', enddatum: '2026-08-30', veranstalter: 'Reise-Portal' },
    { titel: 'Gaming PC Setup', beschreibung: 'High-End Gaming Setup mit RTX 4080', preis: 'Gaming PC + Monitor + Zubehör', region: 'deutschland', enddatum: '2026-09-20', veranstalter: 'GamersWorld' },
    { titel: 'Jahresvorrat Kaffee', beschreibung: 'Premium Kaffee für ein ganzes Jahr', preis: '52 Packungen Premium Kaffee', region: 'nrw', enddatum: '2026-08-25', veranstalter: 'KaffeeKult' },
    { titel: 'E-Bike Verlosung', beschreibung: 'Modernes City E-Bike', preis: 'E-Bike im Wert von 2.500€', region: 'baden-württemberg', enddatum: '2026-09-10', veranstalter: 'BikeShop24' },
    { titel: 'Konzert-Tickets Taylor Swift', beschreibung: '2x VIP Tickets + Meet & Greet', preis: 'VIP Konzerttickets', region: 'berlin', enddatum: '2026-09-01', veranstalter: 'EventPro' },
    { titel: 'Amazon Gutschein 500€', beschreibung: 'Shopping-Guthaben bei Amazon', preis: '500€ Amazon Gutschein', region: 'deutschland', enddatum: '2026-08-28', veranstalter: 'OnlineDeals' },
    { titel: 'Traumreise Malediven', beschreibung: '7 Tage All-Inclusive Malediven für 2 Personen', preis: 'Malediven Reise im Wert von 5.000€', region: 'deutschland', enddatum: '2026-10-01', veranstalter: 'TravelDreams' },
    { titel: 'Apple MacBook Pro', beschreibung: 'Das neueste MacBook Pro 14 Zoll', preis: 'MacBook Pro M3', region: 'hessen', enddatum: '2026-09-05', veranstalter: 'AppleFans' },
    { titel: 'Küchen-Ausstattung', beschreibung: 'Komplettes Küchenmaschinen-Set von KitchenAid', preis: 'KitchenAid Set im Wert von 1.200€', region: 'sachsen', enddatum: '2026-09-12', veranstalter: 'KüchenWelt' },
    { titel: 'PlayStation 5 Bundle', beschreibung: 'PS5 mit 3 Spielen und 2 Controllern', preis: 'PS5 Premium Bundle', region: 'hamburg', enddatum: '2026-08-31', veranstalter: 'GamingStore' },
    { titel: 'Fitnessstudio Jahresmitgliedschaft', beschreibung: '12 Monate Premium Mitgliedschaft', preis: 'Fitness-Jahreskarte', region: 'münchen', enddatum: '2026-09-08', veranstalter: 'FitLife' },
    { titel: 'Designer Handtasche', beschreibung: 'Original Louis Vuitton Tasche', preis: 'LV Neverfull', region: 'deutschland', enddatum: '2026-09-18', veranstalter: 'FashionQueen' },
    { titel: 'Smart Home Starter-Kit', beschreibung: 'Komplettes Smart Home System', preis: 'Smart Home Set im Wert von 600€', region: 'niedersachsen', enddatum: '2026-09-22', veranstalter: 'SmartTech' },
    { titel: 'Weinkeller-Ausstattung', beschreibung: '24 Flaschen Premium-Weine aus aller Welt', preis: 'Premium Weinkollektion', region: 'rheinland-pfalz', enddatum: '2026-09-25', veranstalter: 'WeinWelt' }
  ];

  const insert = db.prepare(`
    INSERT INTO gewinnspiele (titel, beschreibung, preis, region, kostenlos, enddatum, veranstalter)
    VALUES (@titel, @beschreibung, @preis, @region, 1, @enddatum, @veranstalter)
  `);

  for (const g of gewinnspiele) {
    insert.run(g);
  }

  console.log('Demo-Gewinnspiele eingefügt');
}

module.exports = {
  db,
  initialize
};
