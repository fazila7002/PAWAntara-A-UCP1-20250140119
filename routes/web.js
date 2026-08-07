const express = require('express');
const products = require('../data/products');

const router = express.Router();

// daftar kategori unik, dipakai untuk tombol filter di halaman produk
const daftarKategori = [...new Set(products.map((p) => p.category))];

// GET / -> beranda
router.get('/', (req, res) => {
  res.render('beranda', {
    produkUnggulan: products.slice(0, 3)
  });
});

// GET /produk -> daftar produk, mendukung filter ?kategori= dan ?search=
router.get('/produk', (req, res) => {
  const { kategori, search } = req.query;
  let hasil = products;

  if (kategori) {
    hasil = hasil.filter(
      (p) => p.category.toLowerCase() === kategori.toLowerCase()
    );
  }

  if (search) {
    const kataKunci = search.toLowerCase().trim();
    hasil = hasil.filter(
      (p) =>
        p.name.toLowerCase().includes(kataKunci) ||
        p.category.toLowerCase().includes(kataKunci)
    );
  }

  res.render('produk', {
    produk: hasil,
    daftarKategori,
    kategoriAktif: kategori || '',
    kataPencarian: search || ''
  });
});

// GET /produk/:id -> detail satu produk (route dinamis)
router.get('/produk/:id', (req, res) => {
  const id = Number(req.params.id);
  const produk = products.find((p) => p.id === id);

  // id bukan angka atau produk tidak ada -> tampilkan halaman pesan, bukan crash
  if (!produk) {
    return res.status(404).render('produk-tidak-ditemukan', {
      idDicari: req.params.id
    });
  }

  const produkLain = products
    .filter((p) => p.category === produk.category && p.id !== produk.id)
    .slice(0, 3);

  res.render('detail', { produk, produkLain });
});

module.exports = router;
