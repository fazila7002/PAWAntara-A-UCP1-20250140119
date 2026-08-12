// quiet: true supaya dotenv tidak mencetak banner promosi di terminal
require('dotenv').config({ quiet: true });

const express = require('express');
const session = require('express-session');
const path = require('path');
const pencatatRequest = require('./middleware/logger');
const webRoutes = require('./routes/web');
const apiRoutes = require('./routes/api');

const app = express();
const PORT = process.env.PORT || 3000;

// view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware custom (di luar auth): mencatat setiap request ke terminal
app.use(pencatatRequest);

// static file (css, js, gambar)
app.use(express.static(path.join(__dirname, 'public')));

// pembaca body request: JSON untuk Fetch API, urlencoded untuk form biasa
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// sesi login disimpan di server, browser hanya memegang cookie id sesi
app.use(
  session({
    name: 'sesi_toko_ariesta',
    secret: process.env.SESSION_SECRET || 'rahasia-toko-ariesta-dev',
    resave: false,
    saveUninitialized: false,
    cookie: {
      httpOnly: true, // cookie tidak bisa dibaca lewat JavaScript di browser
      maxAge: 1000 * 60 * 60 * 2 // sesi bertahan 2 jam
    }
  })
);

// status login dibagikan ke semua view supaya navbar bisa menyesuaikan menu
app.use((req, res, next) => {
  res.locals.userLogin = req.session.user || null;
  next();
});

// route halaman website
app.use('/', webRoutes);

// route REST API
app.use('/api', apiRoutes);

// halaman tidak ditemukan
app.use((req, res) => {
  res.status(404).render('404', { urlDicari: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
