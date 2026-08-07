/**
 * Script frontend Toko Sembako Ariesta.
 * Sprint 1: baru dipakai untuk membuka/menutup menu navigasi di layar mobile.
 */

document.addEventListener('DOMContentLoaded', function () {
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
});
