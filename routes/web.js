const express = require('express');
const store = require('../data/store');

const router = express.Router();

// GET / -> beranda
router.get('/', (req, res) => {
  res.render('beranda', {
    produkUnggulan: store.ambilSemua().slice(0, 3)
  });
});

// GET /produk -> daftar produk, mendukung filter ?kategori= dan ?search=
router.get('/produk', (req, res) => {
  const { kategori, search } = req.query;

  // filter tetap diproses di server lewat req.query (bukan di browser)
  const hasil = store.ambilSemua({ kategori, search });

  res.render('produk', {
    produk: hasil,
    daftarKategori: store.daftarKategori(),
    kategoriAktif: kategori || '',
    kataPencarian: search || ''
  });
});

// GET /produk/:id -> detail satu produk (route dinamis)
router.get('/produk/:id', (req, res) => {
  const produk = store.ambilSatu(req.params.id);

  // id bukan angka atau produk tidak ada -> tampilkan halaman pesan, bukan crash
  if (!produk) {
    return res.status(404).render('produk-tidak-ditemukan', {
      idDicari: req.params.id
    });
  }

  const produkLain = store
    .ambilSemua({ kategori: produk.category })
    .filter((item) => item.id !== produk.id)
    .slice(0, 3);

  res.render('detail', { produk, produkLain });
});

// GET /tanya-ai -> halaman chat, balasan diambil dari POST /api/chat
router.get('/tanya-ai', (req, res) => {
  res.render('tanya-ai');
});

module.exports = router;
