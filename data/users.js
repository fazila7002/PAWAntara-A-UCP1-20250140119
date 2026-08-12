/**
 * Akun admin/kasir Toko Sembako Ariesta.
 *
 * PRD mengizinkan akun dibuat lewat seed data (tidak ada fitur registrasi
 * publik). Yang disimpan di sini bukan password teks polos, melainkan hasil
 * hash bcrypt - jadi walaupun file ini terbaca, passwordnya tidak langsung
 * kelihatan dan pengecekannya tetap lewat bcrypt.compare().
 *
 * Username dan password awal bisa diganti lewat file .env. Kalau .env tidak
 * ada, dipakai nilai bawaan yang juga ditulis di README supaya asisten dosen
 * bisa langsung mencoba login.
 */

const bcrypt = require('bcryptjs');

const USERNAME_AWAL = process.env.ADMIN_USERNAME || 'admin';
const PASSWORD_AWAL = process.env.ADMIN_PASSWORD || 'admin123';

// hash dibuat sekali saat server dinyalakan, cost factor 10
const users = [
  {
    id: 1,
    username: USERNAME_AWAL,
    nama: 'Ibu Aries',
    peran: 'admin',
    passwordHash: bcrypt.hashSync(PASSWORD_AWAL, 10)
  }
];

/** Mencari akun berdasarkan username (tidak peduli huruf besar/kecil). */
function cariUsername(username) {
  if (!username) return null;
  const dicari = String(username).trim().toLowerCase();
  return users.find((user) => user.username.toLowerCase() === dicari) || null;
}

/** Membandingkan password yang diketik dengan hash yang tersimpan. */
function cocokkanPassword(password, user) {
  if (!user || !password) return false;
  return bcrypt.compareSync(String(password), user.passwordHash);
}

/** Data user yang aman disimpan di sesi (tanpa hash password). */
function untukSesi(user) {
  return {
    id: user.id,
    username: user.username,
    nama: user.nama,
    peran: user.peran
  };
}

module.exports = { cariUsername, cocokkanPassword, untukSesi };
