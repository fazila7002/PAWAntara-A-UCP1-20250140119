/**
 * Store data produk (array in-memory).
 *
 * Sprint 1 membaca array `data/products.js` secara langsung di beberapa tempat.
 * Pada Sprint 2 seluruh akses data dialihkan ke modul ini supaya halaman web
 * dan REST API membaca serta menulis ke SATU sumber data yang sama - kalau
 * dashboard mengubah harga, halaman produk publik ikut berubah tanpa restart.
 *
 * Data disimpan di memori proses, jadi akan kembali ke kondisi awal setiap
 * kali server dijalankan ulang. Ini pilihan yang diizinkan PRD (array
 * in-memory / SQLite / PostgreSQL - pilih salah satu).
 */

const seedProducts = require('./products');

// salinan data awal, supaya array seed aslinya tidak ikut termutasi
let products = seedProducts.map((item) => ({ ...item }));

// id berikutnya dihitung dari id terbesar yang ada, bukan dari panjang array
// (kalau pakai length, id bisa bentrok setelah ada produk yang dihapus)
let idBerikutnya = products.reduce((max, item) => Math.max(max, item.id), 0) + 1;

/**
 * Mengambil daftar produk, dengan filter opsional kategori dan kata kunci.
 * Filter sengaja dikerjakan di sini (sisi server), bukan di browser.
 */
function ambilSemua({ kategori, search } = {}) {
  let hasil = products;

  if (kategori) {
    hasil = hasil.filter(
      (item) => item.category.toLowerCase() === String(kategori).toLowerCase()
    );
  }

  if (search) {
    const kataKunci = String(search).toLowerCase().trim();
    hasil = hasil.filter(
      (item) =>
        item.name.toLowerCase().includes(kataKunci) ||
        item.category.toLowerCase().includes(kataKunci)
    );
  }

  return hasil.map((item) => ({ ...item }));
}

/** Mencari satu produk berdasarkan id. Mengembalikan null kalau tidak ada. */
function ambilSatu(id) {
  const produk = products.find((item) => item.id === Number(id));
  return produk ? { ...produk } : null;
}

/** Menambah produk baru, id dibuat otomatis oleh server. */
function tambah(data) {
  const produkBaru = {
    id: idBerikutnya++,
    name: data.name.trim(),
    category: data.category.trim(),
    price: Number(data.price),
    stock: Number(data.stock),
    unit: (data.unit || 'pcs').trim(),
    icon: (data.icon || '\u{1F6D2}').trim(),
    description: (data.description || '').trim()
  };

  products.push(produkBaru);
  return { ...produkBaru };
}

/** Memperbarui sebagian field produk. Mengembalikan null kalau id tidak ada. */
function perbarui(id, data) {
  const index = products.findIndex((item) => item.id === Number(id));
  if (index === -1) return null;

  const lama = products[index];
  products[index] = {
    ...lama,
    name: data.name !== undefined ? data.name.trim() : lama.name,
    category: data.category !== undefined ? data.category.trim() : lama.category,
    price: data.price !== undefined ? Number(data.price) : lama.price,
    stock: data.stock !== undefined ? Number(data.stock) : lama.stock,
    unit: data.unit !== undefined ? data.unit.trim() : lama.unit,
    icon: data.icon !== undefined ? data.icon.trim() : lama.icon,
    description:
      data.description !== undefined ? data.description.trim() : lama.description
  };

  return { ...products[index] };
}

/** Menghapus produk. Mengembalikan produk yang dihapus, atau null. */
function hapus(id) {
  const index = products.findIndex((item) => item.id === Number(id));
  if (index === -1) return null;

  const [terhapus] = products.splice(index, 1);
  return { ...terhapus };
}

/** Daftar kategori unik, dipakai untuk mengisi dropdown filter. */
function daftarKategori() {
  return [...new Set(products.map((item) => item.category))].sort();
}

/**
 * Validasi payload produk sebelum disimpan.
 * Dipakai endpoint POST dan PUT supaya data yang masuk tetap masuk akal
 * walaupun request dikirim langsung lewat Postman (bukan lewat form).
 */
function validasiProduk(data, { wajibLengkap = true } = {}) {
  const pesanError = [];

  if (wajibLengkap || data.name !== undefined) {
    if (!data.name || !String(data.name).trim()) {
      pesanError.push('Nama produk wajib diisi');
    }
  }

  if (wajibLengkap || data.category !== undefined) {
    if (!data.category || !String(data.category).trim()) {
      pesanError.push('Kategori wajib diisi');
    }
  }

  if (wajibLengkap || data.price !== undefined) {
    const harga = Number(data.price);
    if (!Number.isFinite(harga) || harga < 0) {
      pesanError.push('Harga harus berupa angka dan tidak boleh negatif');
    }
  }

  if (wajibLengkap || data.stock !== undefined) {
    const stok = Number(data.stock);
    if (!Number.isInteger(stok) || stok < 0) {
      pesanError.push('Stok harus berupa bilangan bulat dan tidak boleh negatif');
    }
  }

  return pesanError;
}

module.exports = {
  ambilSemua,
  ambilSatu,
  tambah,
  perbarui,
  hapus,
  daftarKategori,
  validasiProduk
};
