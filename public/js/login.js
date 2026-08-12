/**
 * Halaman login admin.
 * Form tidak dikirim lewat action HTML biasa, melainkan lewat Fetch API
 * (async/await) ke POST /api/login supaya halaman tidak perlu reload penuh.
 */

document.addEventListener('DOMContentLoaded', function () {
  const formLogin = document.getElementById('formLogin');
  if (!formLogin) return;

  const inputUsername = document.getElementById('username');
  const inputPassword = document.getElementById('password');
  const kotakPesan = document.getElementById('pesanLogin');
  const tombolLogin = document.getElementById('tombolLogin');

  /** Mencegah teks dari server dieksekusi sebagai HTML saat dimasukkan ke DOM. */
  function amankan(teks) {
    const kotak = document.createElement('div');
    kotak.textContent = teks === undefined || teks === null ? '' : String(teks);
    return kotak.innerHTML;
  }

  function tampilkanPesan(teks, jenis) {
    const ikon = jenis === 'sukses' ? 'cek' : 'peringatan';
    kotakPesan.innerHTML = ikonNama(ikon, 'ikon-kecil') + '<span>' + amankan(teks) + '</span>';
    kotakPesan.className = 'auth-pesan auth-pesan-' + jenis;
    kotakPesan.hidden = false;
  }

  formLogin.addEventListener('submit', async function (event) {
    // cegah perilaku bawaan form (reload halaman)
    event.preventDefault();

    const username = inputUsername.value.trim();
    const password = inputPassword.value;

    // validasi dasar di frontend sebelum request dikirim ke server
    if (!username || !password) {
      tampilkanPesan('Username dan password tidak boleh kosong.', 'gagal');
      (username ? inputPassword : inputUsername).focus();
      return;
    }

    tombolLogin.disabled = true;
    tombolLogin.textContent = 'Memproses...';

    try {
      const response = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });

      const hasil = await response.json();

      if (!response.ok || hasil.status !== 'success') {
        tampilkanPesan(hasil.message || 'Login gagal, coba lagi.', 'gagal');
        inputPassword.value = '';
        inputPassword.focus();
        return;
      }

      tampilkanPesan('Login berhasil, membuka dashboard...', 'sukses');
      window.location.href = '/dashboard';
    } catch (error) {
      tampilkanPesan('Tidak bisa menghubungi server. Pastikan server berjalan.', 'gagal');
    } finally {
      // tombol hanya dinormalkan kembali kalau masih berada di halaman ini
      if (document.body.contains(tombolLogin)) {
        tombolLogin.disabled = false;
        tombolLogin.textContent = 'Masuk';
      }
    }
  });
});
