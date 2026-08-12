/**
 * Script frontend Toko Sembako Ariesta yang dipakai di semua halaman.
 * Sprint 1: membuka/menutup menu navigasi di layar mobile.
 * Sprint 2: tombol logout yang memanggil POST /api/logout lewat Fetch API.
 */

/* Menu hamburger di layar mobile. */
function siapkanMenuHamburger() {
  const tombolHamburger = document.getElementById('tombolHamburger');
  const menuUtama = document.getElementById('menuUtama');

  if (!tombolHamburger || !menuUtama) return;

  tombolHamburger.addEventListener('click', function () {
    const sedangTerbuka = menuUtama.classList.toggle('menu-terbuka');

    // sinkronkan status tombol untuk pembaca layar
    tombolHamburger.setAttribute('aria-expanded', sedangTerbuka ? 'true' : 'false');
    tombolHamburger.setAttribute(
      'aria-label',
      sedangTerbuka ? 'Tutup menu navigasi' : 'Buka menu navigasi'
    );
    tombolHamburger.classList.toggle('hamburger-aktif', sedangTerbuka);
  });

  // menu ikut tertutup setelah salah satu tautan diklik
  menuUtama.querySelectorAll('a').forEach(function (tautan) {
    tautan.addEventListener('click', function () {
      menuUtama.classList.remove('menu-terbuka');
      tombolHamburger.classList.remove('hamburger-aktif');
      tombolHamburger.setAttribute('aria-expanded', 'false');
      tombolHamburger.setAttribute('aria-label', 'Buka menu navigasi');
    });
  });
}

/* Tombol logout di navbar (hanya muncul saat sudah login). */
function siapkanTombolLogout() {
  const tombolLogout = document.getElementById('tombolLogout');
  if (!tombolLogout) return;

  tombolLogout.addEventListener('click', async function () {
    tombolLogout.disabled = true;
    tombolLogout.textContent = 'Keluar...';

    try {
      const response = await fetch('/api/logout', { method: 'POST' });
      const hasil = await response.json();

      if (hasil.status === 'success') {
        // setelah sesi dihapus, kembali ke beranda sebagai pengunjung biasa
        window.location.href = '/';
        return;
      }

      window.alert(hasil.message || 'Logout gagal, coba lagi.');
    } catch (error) {
      window.alert('Tidak bisa menghubungi server.');
    }

    tombolLogout.disabled = false;
    tombolLogout.textContent = 'Logout';
  });
}

document.addEventListener('DOMContentLoaded', function () {
  siapkanMenuHamburger();
  siapkanTombolLogout();
});
