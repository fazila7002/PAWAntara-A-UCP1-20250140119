const express = require('express');
const store = require('../data/store');

const router = express.Router();

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
