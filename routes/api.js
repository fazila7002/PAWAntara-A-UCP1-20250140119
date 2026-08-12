const express = require('express');
const store = require('../data/store');
const users = require('../data/users');
const { wajibLoginApi } = require('../middleware/auth');

const router = express.Router();

/* ==========================================================================
   AUTENTIKASI
   ========================================================================== */

/**
 * POST /api/login
 * Memvalidasi username & password, lalu membuat sesi login di server.
 * Akses: publik.
 */
router.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  // validasi juga dilakukan di server, bukan hanya di frontend
  if (!username || !password) {
    return res.status(400).json({
      status: 'error',
      message: 'Username dan password wajib diisi'
    });
  }

  const user = users.cariUsername(username);

  // pesan error sengaja disamakan untuk username salah maupun password salah,
  // supaya tidak membocorkan username mana yang benar-benar terdaftar
  if (!user || !users.cocokkanPassword(password, user)) {
    return res.status(401).json({
      status: 'error',
      message: 'Username atau password salah'
    });
  }

  req.session.user = users.untukSesi(user);

  return res.status(200).json({
    status: 'success',
    message: 'Login berhasil',
    data: req.session.user
  });
});

/**
 * POST /api/logout
 * Menghapus sesi login beserta cookie-nya.
 * Akses: harus sudah login.
 */
router.post('/logout', wajibLoginApi, (req, res) => {
  req.session.destroy((err) => {
    if (err) {
      return res.status(500).json({
        status: 'error',
        message: 'Gagal menghapus sesi login'
      });
    }

    res.clearCookie('sesi_toko_ariesta');
    return res.status(200).json({
      status: 'success',
      message: 'Logout berhasil'
    });
  });
});

/**
 * GET /api/session
 * Endpoint bantu untuk frontend mengecek apakah sesi masih aktif.
 * Akses: publik (hanya membalas status, bukan data sensitif).
 */
router.get('/session', (req, res) => {
  const user = req.session.user || null;

  res.status(200).json({
    status: 'success',
    message: user ? 'Sesi login aktif' : 'Belum login',
    data: { login: Boolean(user), user }
  });
});

/* ==========================================================================
   PRODUK
   ========================================================================== */

/**
 * GET /api/products
 * Mengembalikan seluruh data produk dengan format response JSON
 * { status, message, data } yang konsisten. Mendukung filter opsional
 * ?kategori= dan ?search= yang diproses di server.
 * Akses: publik (pelanggan hanya melihat, tidak mengubah).
 */
router.get('/products', (req, res) => {
  const { kategori, search } = req.query;
  const data = store.ambilSemua({ kategori, search });

  res.status(200).json({
    status: 'success',
    message: 'Data produk berhasil diambil',
    data
  });
});

module.exports = router;
