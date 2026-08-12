/**
 * Middleware custom: pencatat request.
 *
 * Sprint 1 versinya masih ditulis langsung di app.js. Pada Sprint 2 dipindah
 * ke modul sendiri dan ditambah status code + lama proses, supaya kelihatan
 * di terminal endpoint mana yang berhasil (200/201) dan mana yang ditolak
 * karena belum login (401).
 */

function pencatatRequest(req, res, next) {
  const mulai = Date.now();

  // 'finish' menyala setelah response selesai dikirim, jadi status code-nya
  // sudah pasti - kalau dicatat di awal, statusnya masih 200 bawaan.
  res.on('finish', () => {
    const durasi = Date.now() - mulai;
    const waktu = new Date().toLocaleTimeString('id-ID');
    console.log(
      `[${waktu}] ${req.method} ${req.originalUrl} -> ${res.statusCode} (${durasi} ms)`
    );
  });

  next();
}

module.exports = pencatatRequest;
