/**
 * Halaman Produk (sisi publik).
 *
 * Daftar produk diambil dari GET /api/products lewat Fetch API, bukan dari
 * data yang ditulis tetap di HTML. Karena endpoint itu membaca store yang
 * sama dengan yang diubah dashboard admin, perubahan harga/stok langsung
 * terlihat di sini begitu halaman disegarkan - tanpa restart server.
 *
 * Filter kategori & pencarian tetap dikerjakan di SERVER: parameternya
 * dikirim sebagai query string (?kategori= / ?search=) dan endpoint yang
 * menyaringnya. Frontend hanya menampilkan hasilnya.
 *
 * Halaman ini juga tetap dirender server-side lewat EJS, jadi isinya sudah
 * tampil walaupun JavaScript dimatikan.
 */

document.addEventListener('DOMContentLoaded', function () {
  const formFilter = document.getElementById('formFilter');
  if (!formFilter) return;

  const inputSearch = document.getElementById('search');
  const selectKategori = document.getElementById('kategori');
  const tautanReset = document.getElementById('tautanReset');
  const infoHasil = document.getElementById('infoHasil');
  const hasilProduk = document.getElementById('hasilProduk');

  function rupiah(angka) {
    return 'Rp ' + Number(angka).toLocaleString('id-ID');
  }

  /** Mencegah isi data dieksekusi sebagai HTML saat dimasukkan ke DOM. */
  function amankan(teks) {
    const kotak = document.createElement('div');
    kotak.textContent = teks === undefined || teks === null ? '' : String(teks);
    return kotak.innerHTML;
  }

  function kartuProduk(item) {
    const stok =
      item.stock > 0
        ? `<p class="stok stok-ada">Stok tersedia: ${item.stock} ${amankan(item.unit)}</p>`
        : '<p class="stok stok-habis">Stok habis</p>';

    // ikon diambil dari kategori lewat helper di /js/ikon.js, supaya kartu
    // hasil render JavaScript tampil sama persis dengan hasil render EJS
    return `
      <article class="kartu-produk">
        <div class="produk-gambar">${ikonKategori(item.category, 'ikon-besar')}</div>
        <div class="produk-isi">
          <span class="label-kategori">${amankan(item.category)}</span>
          <h2 class="produk-nama">${amankan(item.name)}</h2>
          <p class="produk-harga">
            ${rupiah(item.price)}
            <span class="produk-satuan">/ ${amankan(item.unit)}</span>
          </p>
          ${stok}
          <a href="/produk/${item.id}" class="tombol tombol-garis tombol-kecil">Lihat Detail</a>
        </div>
      </article>
    `;
  }

  function gambarHasil(daftar, kategori, search) {
    if (daftar.length === 0) {
      hasilProduk.innerHTML = `
        <div class="kotak-kosong">
          <span class="kosong-ikon">${ikonNama('cari', 'ikon-sedang')}</span>
          <h2>Produk tidak ditemukan</h2>
          <p>Coba ganti kata kunci atau pilih kategori lain.</p>
          <div class="hero-tombol">
            <a href="/produk" class="tombol tombol-garis">Tampilkan semua produk</a>
          </div>
        </div>
      `;
    } else {
      hasilProduk.innerHTML =
        '<div class="grid-produk">' + daftar.map(kartuProduk).join('') + '</div>';
    }

    let keterangan = `Menampilkan <strong>${daftar.length}</strong> produk`;
    if (kategori) keterangan += ` pada kategori "<strong>${amankan(kategori)}</strong>"`;
    if (search) keterangan += ` dengan kata kunci "<strong>${amankan(search)}</strong>"`;
    infoHasil.innerHTML = keterangan + '.';
  }

  /**
   * Mengambil data dari API sesuai filter yang aktif.
   * perbaruiUrl = false dipakai saat halaman pertama kali dimuat, supaya
   * tidak menambah entri baru ke riwayat browser.
   */
  async function muatProduk(kategori, search, perbaruiUrl) {
    const parameter = new URLSearchParams();
    if (kategori) parameter.set('kategori', kategori);
    if (search) parameter.set('search', search);

    const queryString = parameter.toString();

    try {
      const response = await fetch('/api/products' + (queryString ? '?' + queryString : ''));
      const hasil = await response.json();

      if (hasil.status !== 'success') {
        infoHasil.textContent = hasil.message || 'Gagal memuat data produk.';
        return;
      }

      gambarHasil(hasil.data, kategori, search);

      if (perbaruiUrl) {
        // alamat di address bar ikut berubah supaya bisa disalin/di-bookmark
        // dan tombol back browser tetap berfungsi
        const urlBaru = '/produk' + (queryString ? '?' + queryString : '');
        window.history.pushState({ kategori, search }, '', urlBaru);
      }
    } catch (error) {
      infoHasil.textContent = 'Gagal memuat data. Pastikan server sedang berjalan.';
    }
  }

  formFilter.addEventListener('submit', function (event) {
    // cegah reload halaman, ambil datanya lewat fetch saja
    event.preventDefault();
    muatProduk(selectKategori.value, inputSearch.value.trim(), true);
  });

  tautanReset.addEventListener('click', function (event) {
    event.preventDefault();
    selectKategori.value = '';
    inputSearch.value = '';
    muatProduk('', '', true);
  });

  // tombol back/forward browser ikut menyesuaikan tampilan
  window.addEventListener('popstate', function () {
    const parameter = new URLSearchParams(window.location.search);
    const kategori = parameter.get('kategori') || '';
    const search = parameter.get('search') || '';

    selectKategori.value = kategori;
    inputSearch.value = search;
    muatProduk(kategori, search, false);
  });

  // segarkan sekali saat halaman dibuka, supaya perubahan terbaru dari
  // dashboard admin langsung terlihat
  const parameterAwal = new URLSearchParams(window.location.search);
  muatProduk(
    parameterAwal.get('kategori') || '',
    parameterAwal.get('search') || '',
    false
  );
});
