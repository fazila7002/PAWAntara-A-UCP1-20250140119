/**
 * Dashboard admin Toko Sembako Ariesta.
 *
 * Seluruh operasi CRUD di halaman ini memakai Fetch API (async/await) ke
 * endpoint /api/products, lalu memperbarui DOM sendiri - halaman tidak
 * pernah reload penuh. Kalau sesi login habis, server membalas 401 dan
 * pengguna diarahkan kembali ke halaman login.
 */

document.addEventListener('DOMContentLoaded', function () {
  const formProduk = document.getElementById('formProduk');
  if (!formProduk) return;

  const inputId = document.getElementById('produkId');
  const inputNama = document.getElementById('nama');
  const inputKategori = document.getElementById('kategori');
  const inputSatuan = document.getElementById('satuan');
  const inputHarga = document.getElementById('harga');
  const inputStok = document.getElementById('stok');
  const inputIkon = document.getElementById('ikon');
  const inputDeskripsi = document.getElementById('deskripsi');

  const judulForm = document.getElementById('judul-form');
  const catatanForm = document.getElementById('catatanForm');
  const tombolSimpan = document.getElementById('tombolSimpan');
  const tombolBatal = document.getElementById('tombolBatal');

  const isiTabel = document.getElementById('isiTabelProduk');
  const kotakPesan = document.getElementById('pesanDashboard');

  const statJumlah = document.getElementById('statJumlah');
  const statStok = document.getElementById('statStok');
  const statHabis = document.getElementById('statHabis');
  const statNilai = document.getElementById('statNilai');

  let daftarProduk = [];

  /* ---------------------------------------------------------------- utils */

  function rupiah(angka) {
    return 'Rp ' + Number(angka).toLocaleString('id-ID');
  }

  function tampilkanPesan(teks, jenis) {
    kotakPesan.textContent = teks;
    kotakPesan.className = 'auth-pesan auth-pesan-' + jenis;
    kotakPesan.hidden = false;

    // pesan sukses dihilangkan sendiri supaya tidak menumpuk di layar
    if (jenis === 'sukses') {
      window.setTimeout(function () {
        kotakPesan.hidden = true;
      }, 3500);
    }
  }

  /** Mencegah teks dari data dieksekusi sebagai HTML saat dimasukkan ke DOM. */
  function amankan(teks) {
    const kotak = document.createElement('div');
    kotak.textContent = teks === undefined || teks === null ? '' : String(teks);
    return kotak.innerHTML;
  }

  /** Sesi habis -> kembalikan ke halaman login. */
  function tanganiSesiHabis() {
    tampilkanPesan('Sesi login sudah berakhir. Mengarahkan ke halaman login...', 'gagal');
    window.setTimeout(function () {
      window.location.href = '/login?alasan=wajib-login';
    }, 1500);
  }

  /* ------------------------------------------------------------ tampilkan */

  function perbaruiStatistik() {
    const totalStok = daftarProduk.reduce((jml, p) => jml + p.stock, 0);
    const totalNilai = daftarProduk.reduce((jml, p) => jml + p.price * p.stock, 0);
    const jumlahHabis = daftarProduk.filter((p) => p.stock === 0).length;

    statJumlah.textContent = daftarProduk.length;
    statStok.textContent = totalStok.toLocaleString('id-ID');
    statHabis.textContent = jumlahHabis;
    statNilai.textContent = rupiah(totalNilai);
  }

  function gambarTabel() {
    if (daftarProduk.length === 0) {
      isiTabel.innerHTML =
        '<tr><td colspan="5" class="tabel-kosong">Belum ada produk. Tambahkan lewat form di samping.</td></tr>';
      return;
    }

    isiTabel.innerHTML = daftarProduk
      .map(function (produk) {
        const statusStok =
          produk.stock === 0
            ? '<span class="badge badge-habis">habis</span>'
            : '<span class="badge badge-ada">' + produk.stock + ' ' + amankan(produk.unit) + '</span>';

        return `
          <tr>
            <td>
              <span class="tabel-ikon" aria-hidden="true">${amankan(produk.icon)}</span>
              <span class="tabel-nama">${amankan(produk.name)}</span>
              <small class="tabel-id">id: ${produk.id}</small>
            </td>
            <td>${amankan(produk.category)}</td>
            <td>${rupiah(produk.price)}</td>
            <td>${statusStok}</td>
            <td>
              <div class="tabel-aksi">
                <button type="button" class="tombol-aksi tombol-ubah" data-id="${produk.id}">Ubah</button>
                <button type="button" class="tombol-aksi tombol-hapus" data-id="${produk.id}">Hapus</button>
              </div>
            </td>
          </tr>
        `;
      })
      .join('');
  }

  /* ------------------------------------------------------------ ambil data */

  async function muatProduk() {
    try {
      const response = await fetch('/api/products');
      const hasil = await response.json();

      if (hasil.status !== 'success') {
        tampilkanPesan(hasil.message || 'Gagal memuat data produk.', 'gagal');
        return;
      }

      daftarProduk = hasil.data;
      gambarTabel();
      perbaruiStatistik();
    } catch (error) {
      isiTabel.innerHTML =
        '<tr><td colspan="5" class="tabel-kosong">Gagal memuat data. Pastikan server berjalan.</td></tr>';
    }
  }

  /* ------------------------------------------------------------ mode form */

  function modeTambah() {
    formProduk.reset();
    inputId.value = '';
    judulForm.textContent = 'Tambah Produk';
    catatanForm.textContent = 'Isi data produk baru. Id dibuat otomatis oleh server.';
    tombolSimpan.textContent = 'Simpan Produk';
    tombolBatal.hidden = true;
  }

  function modeEdit(produk) {
    inputId.value = produk.id;
    inputNama.value = produk.name;
    inputKategori.value = produk.category;
    inputSatuan.value = produk.unit;
    inputHarga.value = produk.price;
    inputStok.value = produk.stock;
    inputIkon.value = produk.icon;
    inputDeskripsi.value = produk.description;

    judulForm.textContent = 'Ubah Produk #' + produk.id;
    catatanForm.textContent = 'Ubah harga atau stok, lalu simpan. Perubahan langsung terlihat di halaman publik.';
    tombolSimpan.textContent = 'Simpan Perubahan';
    tombolBatal.hidden = false;

    inputNama.focus();
    formProduk.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }

  /* -------------------------------------------------------- simpan produk */

  formProduk.addEventListener('submit', async function (event) {
    event.preventDefault();

    const nama = inputNama.value.trim();
    const kategori = inputKategori.value.trim();
    const harga = inputHarga.value;
    const stok = inputStok.value;

    // validasi dasar di frontend sebelum request dikirim
    if (!nama || !kategori || harga === '' || stok === '') {
      tampilkanPesan('Nama, kategori, harga, dan stok wajib diisi.', 'gagal');
      return;
    }

    if (Number(harga) < 0 || Number(stok) < 0) {
      tampilkanPesan('Harga dan stok tidak boleh bernilai negatif.', 'gagal');
      return;
    }

    const muatan = {
      name: nama,
      category: kategori,
      price: Number(harga),
      stock: Number(stok),
      unit: inputSatuan.value.trim() || 'pcs',
      icon: inputIkon.value.trim() || '\u{1F6D2}',
      description: inputDeskripsi.value.trim()
    };

    // ada id -> perbarui (PUT), tidak ada id -> produk baru (POST)
    const sedangEdit = Boolean(inputId.value);
    const url = sedangEdit ? '/api/products/' + inputId.value : '/api/products';
    const method = sedangEdit ? 'PUT' : 'POST';

    tombolSimpan.disabled = true;
    tombolSimpan.textContent = 'Menyimpan...';

    try {
      const response = await fetch(url, {
        method: method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(muatan)
      });

      if (response.status === 401) return tanganiSesiHabis();

      const hasil = await response.json();

      if (hasil.status !== 'success') {
        tampilkanPesan(hasil.message || 'Produk gagal disimpan.', 'gagal');
        return;
      }

      tampilkanPesan(hasil.message, 'sukses');
      modeTambah();
      await muatProduk();
    } catch (error) {
      tampilkanPesan('Tidak bisa menghubungi server.', 'gagal');
    } finally {
      tombolSimpan.disabled = false;
      tombolSimpan.textContent = inputId.value ? 'Simpan Perubahan' : 'Simpan Produk';
    }
  });

  tombolBatal.addEventListener('click', modeTambah);

  /* ------------------------------------------------- tombol ubah & hapus */

  // satu listener di elemen induk, jadi tombol baru hasil render ikut tertangani
  isiTabel.addEventListener('click', async function (event) {
    const tombol = event.target.closest('button');
    if (!tombol) return;

    const id = Number(tombol.dataset.id);
    const produk = daftarProduk.find((item) => item.id === id);
    if (!produk) return;

    if (tombol.classList.contains('tombol-ubah')) {
      modeEdit(produk);
      return;
    }

    if (tombol.classList.contains('tombol-hapus')) {
      const yakin = window.confirm(`Hapus produk "${produk.name}" dari daftar?`);
      if (!yakin) return;

      tombol.disabled = true;

      try {
        const response = await fetch('/api/products/' + id, { method: 'DELETE' });

        if (response.status === 401) return tanganiSesiHabis();

        const hasil = await response.json();

        if (hasil.status !== 'success') {
          tampilkanPesan(hasil.message || 'Produk gagal dihapus.', 'gagal');
          tombol.disabled = false;
          return;
        }

        tampilkanPesan(hasil.message, 'sukses');

        // kalau produk yang dihapus sedang dibuka di form, kembalikan ke mode tambah
        if (inputId.value === String(id)) modeTambah();

        await muatProduk();
      } catch (error) {
        tampilkanPesan('Tidak bisa menghubungi server.', 'gagal');
        tombol.disabled = false;
      }
    }
  });

  // muat data pertama kali saat halaman dibuka
  muatProduk();
});
