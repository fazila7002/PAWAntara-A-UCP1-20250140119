/**
 * Logika balasan "Tanya AI" Toko Sembako Ariesta.
 *
 * PENTING: tidak ada API AI pihak ketiga (OpenAI/Gemini/dsb) yang dipanggil
 * di sini - itu dilarang oleh PRD. Balasan dihasilkan sepenuhnya oleh logika
 * buatan sendiri di backend Express, berupa pencocokan kata kunci
 * (keyword matching) yang diproses di server, bukan di browser.
 *
 * Beberapa jawaban mengambil data langsung dari store produk, jadi kalau
 * Ibu Aries mengubah harga/stok lewat dashboard, jawaban chat ikut berubah.
 */

const store = require('./../data/store');

const INFO_TOKO = {
  jamBuka: '07.00 - 20.00 WIB',
  hariBuka: 'setiap hari, termasuk Sabtu dan Minggu',
  alamat: 'Jl. Brawijaya No. 12, Bantul, DIY',
  whatsapp: '0812-3456-7890',
  areaGratisOngkir: 'Bantul kota',
  ongkirLuarArea: 'Rp 5.000 - Rp 15.000 tergantung jarak',
  minimalAntar: 'Rp 50.000'
};

/** Mengubah pertanyaan jadi bentuk yang mudah dicocokkan. */
function normalkan(teks) {
  return String(teks || '')
    .toLowerCase()
    .replace(/[^\w\s]/g, ' ') // tanda baca dibuang supaya "beras?" tetap terbaca
    .replace(/\s+/g, ' ')
    .trim();
}

/** Mengecek apakah salah satu kata kunci muncul di pertanyaan. */
function mengandung(pertanyaan, daftarKata) {
  return daftarKata.some((kata) => pertanyaan.includes(kata));
}

function formatRupiah(angka) {
  return 'Rp ' + Number(angka).toLocaleString('id-ID');
}

/**
 * Mencari produk yang disebut di dalam pertanyaan.
 * Dicocokkan lewat nama kategori maupun kata penting pada nama produk.
 */
function cariProdukDisebut(pertanyaan) {
  const semuaProduk = store.ambilSemua();
  const cocok = [];

  semuaProduk.forEach((produk) => {
    const kategori = produk.category.toLowerCase();

    // kata pendek seperti "5", "kg", "2 L" diabaikan supaya tidak asal cocok
    const kataNama = produk.name
      .toLowerCase()
      .split(/\s+/)
      .filter((kata) => kata.length >= 4);

    const kenaKategori = pertanyaan.includes(kategori);
    const kenaNama = kataNama.some((kata) => pertanyaan.includes(kata));

    if (kenaKategori || kenaNama) cocok.push(produk);
  });

  return cocok;
}

/** Menyusun kalimat stok & harga dari data produk yang sedang berlaku. */
function jawabanProduk(daftarCocok) {
  if (daftarCocok.length === 1) {
    const produk = daftarCocok[0];

    if (produk.stock === 0) {
      return `${produk.name} sedang habis, Kak. Biasanya restok 1-2 hari lagi. Harga terakhirnya ${formatRupiah(produk.price)} per ${produk.unit}.`;
    }

    return `${produk.name} masih tersedia, stoknya ${produk.stock} ${produk.unit} dengan harga ${formatRupiah(produk.price)} per ${produk.unit}.`;
  }

  const rincian = daftarCocok
    .slice(0, 4)
    .map((produk) => {
      const status =
        produk.stock === 0
          ? 'stok habis'
          : `sisa ${produk.stock} ${produk.unit}`;
      return `- ${produk.name}: ${formatRupiah(produk.price)} (${status})`;
    })
    .join('\n');

  const tambahan =
    daftarCocok.length > 4 ? `\n...dan ${daftarCocok.length - 4} produk lain.` : '';

  return `Ada beberapa pilihan yang cocok:\n${rincian}${tambahan}`;
}

/**
 * Daftar aturan balasan. Diperiksa berurutan dari atas, yang pertama cocok
 * dipakai. Aturan yang lebih spesifik sengaja ditaruh lebih dulu.
 */
const aturan = [
  {
    nama: 'sapaan',
    kataKunci: ['halo', 'hai', 'hallo', 'assalam', 'permisi', 'pagi', 'siang', 'sore', 'malam'],
    balas: () =>
      'Halo juga, Kak! Saya asisten Toko Sembako Ariesta. Silakan tanya soal harga, stok, jam buka, ongkir, atau cara pembayaran.'
  },
  {
    nama: 'terima kasih',
    kataKunci: ['makasih', 'terima kasih', 'thanks', 'trims', 'sip'],
    balas: () =>
      'Sama-sama, Kak. Kalau butuh sesuatu lagi tinggal tanya di sini ya, toko buka ' +
      INFO_TOKO.jamBuka + '.'
  },
  {
    nama: 'jam buka',
    kataKunci: ['jam', 'buka', 'tutup', 'operasional', 'libur', 'minggu', 'hari apa'],
    balas: () =>
      `Toko kami buka ${INFO_TOKO.hariBuka}, jam ${INFO_TOKO.jamBuka}. Hari besar biasanya tetap buka, tapi tutup lebih awal.`
  },
  {
    nama: 'ongkir & pengantaran',
    kataKunci: ['ongkir', 'antar', 'anter', 'kirim', 'delivery', 'gojek', 'grab'],
    balas: () =>
      `Gratis ongkir untuk area ${INFO_TOKO.areaGratisOngkir} dengan minimal belanja ${INFO_TOKO.minimalAntar}. Di luar area itu ongkirnya ${INFO_TOKO.ongkirLuarArea}. Pesanan sebelum jam 16.00 biasanya sampai di hari yang sama.`
  },
  {
    nama: 'pembayaran',
    kataKunci: ['bayar', 'pembayaran', 'transfer', 'qris', 'tunai', 'cash', 'debit', 'ovo', 'gopay', 'dana'],
    balas: () =>
      'Pembayaran bisa tunai saat barang diterima, transfer bank, atau scan QRIS. Untuk pesanan antar, boleh bayar di tempat (COD).'
  },
  {
    nama: 'lokasi toko',
    kataKunci: ['alamat', 'lokasi', 'dimana', 'di mana', 'maps', 'tempat'],
    balas: () =>
      `Toko kami ada di ${INFO_TOKO.alamat}. Patokannya seberang masjid, ada plang hijau bertuliskan Toko Sembako Ariesta.`
  },
  {
    nama: 'kontak',
    kataKunci: ['whatsapp', 'wa', 'telepon', 'telpon', 'kontak', 'nomor', 'hubungi'],
    balas: () =>
      `Bisa hubungi WhatsApp ${INFO_TOKO.whatsapp} pada jam operasional toko (${INFO_TOKO.jamBuka}).`
  },
  {
    nama: 'daftar produk',
    kataKunci: ['jual apa', 'produk apa', 'barang apa', 'katalog', 'daftar produk', 'ada apa aja', 'apa saja'],
    balas: () => {
      const kategori = store.daftarKategori().join(', ');
      const jumlah = store.ambilSemua().length;
      return `Saat ini ada ${jumlah} jenis produk dengan kategori: ${kategori}. Daftar lengkap beserta harganya bisa dilihat di halaman Produk.`;
    }
  }
];

/**
 * Fungsi utama: menerima pertanyaan, mengembalikan balasan beserta
 * label aturan yang dipakai (label ini memudahkan saat demo/pengecekan).
 */
function balas(pertanyaanMentah) {
  const pertanyaan = normalkan(pertanyaanMentah);

  if (!pertanyaan) {
    return {
      reply: 'Pertanyaannya belum terisi, Kak. Coba tulis dulu ya.',
      topik: 'kosong'
    };
  }

  // produk diperiksa lebih dulu supaya "beras 5 kg masih ada?" dijawab
  // dengan stok asli, bukan dengan jawaban umum soal jam buka
  const produkDisebut = cariProdukDisebut(pertanyaan);
  if (produkDisebut.length > 0) {
    return { reply: jawabanProduk(produkDisebut), topik: 'stok & harga produk' };
  }

  const aturanCocok = aturan.find((item) => mengandung(pertanyaan, item.kataKunci));
  if (aturanCocok) {
    return { reply: aturanCocok.balas(), topik: aturanCocok.nama };
  }

  // tidak ada yang cocok -> arahkan ke pertanyaan yang bisa dijawab
  return {
    reply:
      'Maaf, saya belum paham pertanyaan itu. Saya bisa bantu soal harga dan stok produk, jam buka, ongkir, cara pembayaran, serta alamat toko. Untuk hal lain silakan hubungi WhatsApp ' +
      INFO_TOKO.whatsapp +
      '.',
    topik: 'tidak dikenali'
  };
}

module.exports = { balas, INFO_TOKO };
