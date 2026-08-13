const express = require('express');
const session = require('express-session');
const cookieParser = require('cookie-parser');
const path = require('path');
const db = require('./database');
const authRoutes = require('./routes/auth');
const gewinnspielRoutes = require('./routes/gewinnspiele');
const teilnahmeRoutes = require('./routes/teilnahme');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
app.use(session({
  secret: 'gewinnspiel-secret-key-2024',
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false,
    maxAge: 24 * 60 * 60 * 1000
  }
}));

app.use(express.static(path.join(__dirname, 'public')));

app.use('/api/auth', authRoutes);
app.use('/api/gewinnspiele', gewinnspielRoutes);
app.use('/api/teilnahme', teilnahmeRoutes);

app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

app.get('/dashboard', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'dashboard.html'));
});

db.initialize();

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`);
});
