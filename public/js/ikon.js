/**
 * Pemanggil ikon SVG untuk kartu yang digambar di sisi browser.
 *
 * Ikonnya sendiri sudah ada di halaman sebagai <symbol> (lihat
 * views/partials/ikon-sprite.ejs), file ini hanya menyusun tag <use> yang
 * menunjuk ke symbol tersebut. Pemetaan kategori dibuat sama persis dengan
 * yang ada di views/partials/ikon.ejs supaya kartu hasil render server dan
 * hasil render JavaScript tampil identik.
 */

const PETA_IKON_KATEGORI = {
  beras: 'beras',
  minyak: 'minyak',
  gula: 'gula',
  telur: 'telur',
  tepung: 'tepung'
};

/** Mengembalikan potongan HTML <svg> untuk sebuah kategori produk. */
function ikonKategori(kategori, kelas) {
  const kunci = String(kategori || '').toLowerCase();
  const id = PETA_IKON_KATEGORI[kunci] || 'kotak';
  return ikonNama(id, kelas);
}

/** Mengembalikan potongan HTML <svg> untuk ikon antarmuka biasa. */
function ikonNama(nama, kelas) {
  const kelasTambahan = kelas ? ' ' + kelas : '';
  return (
    '<svg class="ikon' + kelasTambahan + '" aria-hidden="true" focusable="false">' +
    '<use href="#ikon-' + nama + '"></use></svg>'
  );
}
