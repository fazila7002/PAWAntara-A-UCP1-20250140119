const express = require('express');
const path = require('path');

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

app.get('/', (req, res) => {
  res.render('beranda');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
