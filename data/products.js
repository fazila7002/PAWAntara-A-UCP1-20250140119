/**
 * Data produk dummy Toko Sembako Ariesta.
 *
 * Sejak Sprint 2 file ini berperan sebagai data awal (seed) saja. Yang dipakai
 * server saat berjalan adalah salinannya di `data/store.js`, supaya perubahan
 * lewat dashboard tidak menimpa data awal di file ini.
 */

const products = [
  {
    id: 1,
    name: 'Beras Setra Ramos 5 kg',
    category: 'Beras',
    price: 68000,
    stock: 24,
    unit: 'karung',
    icon: '\u{1F35A}',
    description:
      'Beras premium pulen, butiran bersih dan wangi. Cocok untuk kebutuhan harian keluarga.'
  },
  {
    id: 2,
    name: 'Beras Medium IR 64 5 kg',
    category: 'Beras',
    price: 59000,
    stock: 30,
    unit: 'karung',
    icon: '\u{1F35A}',
    description:
      'Beras medium harga ekonomis, tekstur sedikit pera. Banyak dipakai warung makan.'
  },
  {
    id: 3,
    name: 'Minyak Goreng Kemasan 2 L',
    category: 'Minyak',
    price: 34000,
    stock: 15,
    unit: 'pouch',
    icon: '\u{1F9C8}',
    description:
      'Minyak goreng sawit kemasan pouch 2 liter, jernih dan tidak mudah tengik.'
  },
  {
    id: 4,
    name: 'Minyak Goreng Curah 1 L',
    category: 'Minyak',
    price: 16500,
    stock: 40,
    unit: 'liter',
    icon: '\u{1F9C8}',
    description:
      'Minyak goreng curah takaran 1 liter, dibungkus plastik. Pilihan hemat untuk usaha gorengan.'
  },
  {
    id: 5,
    name: 'Gula Pasir 1 kg',
    category: 'Gula',
    price: 17000,
    stock: 28,
    unit: 'kg',
    icon: '\u{1F9C2}',
    description:
      'Gula pasir putih kristal, manis standar dan mudah larut untuk minuman maupun kue.'
  },
  {
    id: 6,
    name: 'Gula Merah Cetak 500 g',
    category: 'Gula',
    price: 14000,
    stock: 12,
    unit: 'bungkus',
    icon: '\u{1F36F}',
    description:
      'Gula merah kelapa asli cetakan bulat, aroma legit. Cocok untuk kolak dan jamu.'
  },
  {
    id: 7,
    name: 'Telur Ayam Negeri 1 kg',
    category: 'Telur',
    price: 29000,
    stock: 18,
    unit: 'kg',
    icon: '\u{1F95A}',
    description:
      'Telur ayam negeri segar, isi kurang lebih 16 butir per kilogram.'
  },
  {
    id: 8,
    name: 'Tepung Terigu Serbaguna 1 kg',
    category: 'Tepung',
    price: 13500,
    stock: 0,
    unit: 'kg',
    icon: '\u{1F35E}',
    description:
      'Tepung terigu protein sedang, serbaguna untuk gorengan, kue, maupun mi.'
  },
  {
    id: 9,
    name: 'Garam Beryodium 250 g',
    category: 'Lainnya',
    price: 4000,
    stock: 50,
    unit: 'bungkus',
    icon: '\u{1F9C2}',
    description:
      'Garam halus beryodium, kemasan kecil praktis untuk dapur rumah tangga.'
  },
  {
    id: 10,
    name: 'Kecap Manis Botol 520 ml',
    category: 'Lainnya',
    price: 24500,
    stock: 9,
    unit: 'botol',
    icon: '\u{1F376}',
    description:
      'Kecap manis kental dari kedelai hitam pilihan, rasa gurih manis seimbang.'
  }
];

module.exports = products;
