const express = require('express');
const store = require('../data/store');
const users = require('../data/users');
const chatbot = require('../services/chatbot');
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

/**
 * GET /api/products/:id
 * Mengambil satu produk berdasarkan id.
 * Akses: publik.
 */
router.get('/products/:id', (req, res) => {
  const produk = store.ambilSatu(req.params.id);

  if (!produk) {
    return res.status(404).json({
      status: 'error',
      message: `Produk dengan id ${req.params.id} tidak ditemukan`
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Detail produk berhasil diambil',
    data: produk
  });
});

/**
 * POST /api/products
 * Menambah produk baru.
 * Akses: wajib login (dijaga middleware wajibLoginApi).
 */
router.post('/products', wajibLoginApi, (req, res) => {
  const pesanError = store.validasiProduk(req.body || {});

  if (pesanError.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: pesanError.join(', ')
    });
  }

  const produkBaru = store.tambah(req.body);

  // 201 Created dipakai karena ada data baru yang berhasil dibuat
  return res.status(201).json({
    status: 'success',
    message: 'Produk ditambahkan',
    data: produkBaru
  });
});

/**
 * PUT /api/products/:id
 * Memperbarui data produk (termasuk harga dan stok).
 * Akses: wajib login.
 */
router.put('/products/:id', wajibLoginApi, (req, res) => {
  const pesanError = store.validasiProduk(req.body || {}, { wajibLengkap: false });

  if (pesanError.length > 0) {
    return res.status(400).json({
      status: 'error',
      message: pesanError.join(', ')
    });
  }

  const produk = store.perbarui(req.params.id, req.body || {});

  if (!produk) {
    return res.status(404).json({
      status: 'error',
      message: `Produk dengan id ${req.params.id} tidak ditemukan`
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Produk diperbarui',
    data: produk
  });
});

/**
 * DELETE /api/products/:id
 * Menghapus produk berdasarkan id.
 * Akses: wajib login.
 */
router.delete('/products/:id', wajibLoginApi, (req, res) => {
  const terhapus = store.hapus(req.params.id);

  if (!terhapus) {
    return res.status(404).json({
      status: 'error',
      message: `Produk dengan id ${req.params.id} tidak ditemukan`
    });
  }

  return res.status(200).json({
    status: 'success',
    message: 'Produk dihapus',
    data: terhapus
  });
});

/* ==========================================================================
   TANYA AI
   ========================================================================== */

/**
 * POST /api/chat
 * Menerima pertanyaan pelanggan dan mengembalikan balasan dummy hasil
 * logika keyword matching di backend (lihat services/chatbot.js).
 * Tidak memanggil API AI pihak ketiga mana pun.
 * Akses: publik.
 */
router.post('/chat', (req, res) => {
  const { question } = req.body || {};

  if (!question || !String(question).trim()) {
    return res.status(400).json({
      status: 'error',
      message: 'Pertanyaan tidak boleh kosong'
    });
  }

  const hasil = chatbot.balas(question);

  return res.status(200).json({
    status: 'success',
    message: 'Balasan berhasil dibuat',
    data: {
      question: String(question).trim(),
      reply: hasil.reply,
      topik: hasil.topik
    }
  });
});

module.exports = router;
