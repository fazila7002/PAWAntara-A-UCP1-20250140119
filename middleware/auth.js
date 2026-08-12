/**
 * Middleware autentikasi.
 *
 * Pengecekan dilakukan di SERVER berdasarkan isi sesi, bukan sekadar
 * menyembunyikan tombol di frontend. Kalau endpoint mutasi dipanggil langsung
 * lewat Postman tanpa cookie sesi, request tetap ditolak dengan 401.
 *
 * Dipisah menjadi dua versi karena bentuk penolakannya berbeda:
 * - halaman web  -> diarahkan (redirect) ke halaman login
 * - endpoint API -> dibalas JSON dengan HTTP status 401
 */

/** Penjaga halaman web (contoh: /dashboard). */
function wajibLoginHalaman(req, res, next) {
  if (req.session && req.session.user) return next();

  return res.redirect('/login?alasan=wajib-login');
}

/** Penjaga endpoint API (contoh: POST/PUT/DELETE /api/products). */
function wajibLoginApi(req, res, next) {
  if (req.session && req.session.user) return next();

  return res.status(401).json({
    status: 'error',
    message: 'Unauthorized, silakan login terlebih dahulu'
  });
}

/** Kalau sudah login, tidak perlu melihat halaman login lagi. */
function alihkanKalauSudahLogin(req, res, next) {
  if (req.session && req.session.user) return res.redirect('/dashboard');

  return next();
}

module.exports = { wajibLoginHalaman, wajibLoginApi, alihkanKalauSudahLogin };
