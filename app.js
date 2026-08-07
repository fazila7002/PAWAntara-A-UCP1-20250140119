const express = require('express');
const path = require('path');
const webRoutes = require('./routes/web');

const app = express();
const PORT = process.env.PORT || 3000;

// view engine EJS
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// middleware custom: mencatat setiap request yang masuk ke terminal
app.use((req, res, next) => {
  const waktu = new Date().toLocaleTimeString('id-ID');
  console.log(`[${waktu}] ${req.method} ${req.originalUrl}`);
  next();
});

// static file (css, js, gambar)
app.use(express.static(path.join(__dirname, 'public')));

// route halaman website
app.use('/', webRoutes);

// halaman tidak ditemukan
app.use((req, res) => {
  res.status(404).render('404', { urlDicari: req.originalUrl });
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
