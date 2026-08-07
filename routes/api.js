const express = require('express');
const products = require('../data/products');

const router = express.Router();

/**
 * GET /api/products
 * Endpoint read-only Sprint 1. Mengembalikan seluruh data produk dummy
 * dengan format response JSON { status, message, data } yang konsisten.
 * Endpoint mutasi (POST/PUT/DELETE) baru ditambahkan pada Sprint 2.
 */
router.get('/products', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'Data produk berhasil diambil',
    data: products
  });
});

module.exports = router;
