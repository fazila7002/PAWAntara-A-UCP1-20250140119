/**
 * Halaman Tanya AI.
 *
 * Pertanyaan dikirim ke POST /api/chat lewat Fetch API (async/await),
 * lalu bubble percakapan ditambahkan langsung ke DOM tanpa reload halaman.
 * Isi balasannya sendiri dihitung di server, bukan di file ini.
 */

document.addEventListener('DOMContentLoaded', function () {
  const formChat = document.getElementById('formChat');
  if (!formChat) return;

  const inputPertanyaan = document.getElementById('pertanyaan');
  const tombolKirim = document.getElementById('tombolKirim');
  const daftarPesan = document.getElementById('daftarPesan');

  /** Menambah satu bubble percakapan ke dalam kotak chat. */
  function tambahBubble(teks, pengirim) {
    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-' + pengirim;

    const paragraf = document.createElement('p');
    // textContent dipakai (bukan innerHTML) supaya isi pesan tidak pernah
    // dieksekusi sebagai HTML
    paragraf.textContent = teks;

    bubble.appendChild(paragraf);
    daftarPesan.appendChild(bubble);
    daftarPesan.scrollTop = daftarPesan.scrollHeight;

    return bubble;
  }

  /** Bubble sementara "sedang mengetik" selama menunggu balasan server. */
  function tampilkanMengetik() {
    const bubble = document.createElement('div');
    bubble.className = 'bubble bubble-ai bubble-mengetik';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    daftarPesan.appendChild(bubble);
    daftarPesan.scrollTop = daftarPesan.scrollHeight;
    return bubble;
  }

  async function kirimPertanyaan(pertanyaan) {
    tambahBubble(pertanyaan, 'user');
    inputPertanyaan.value = '';

    const bubbleMengetik = tampilkanMengetik();
    tombolKirim.disabled = true;

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ question: pertanyaan })
      });

      const hasil = await response.json();
      bubbleMengetik.remove();

      if (hasil.status !== 'success') {
        tambahBubble(hasil.message || 'Maaf, terjadi kesalahan di server.', 'ai');
        return;
      }

      tambahBubble(hasil.data.reply, 'ai');
    } catch (error) {
      bubbleMengetik.remove();
      tambahBubble(
        'Maaf, saya tidak bisa menghubungi server. Pastikan server sedang berjalan.',
        'ai'
      );
    } finally {
      tombolKirim.disabled = false;
      inputPertanyaan.focus();
    }
  }

  formChat.addEventListener('submit', function (event) {
    // cegah reload halaman bawaan form
    event.preventDefault();

    const pertanyaan = inputPertanyaan.value.trim();

    // validasi dasar: jangan kirim pertanyaan kosong ke server
    if (!pertanyaan) {
      inputPertanyaan.focus();
      inputPertanyaan.classList.add('input-goyang');
      window.setTimeout(function () {
        inputPertanyaan.classList.remove('input-goyang');
      }, 400);
      return;
    }

    kirimPertanyaan(pertanyaan);
  });

  // tombol contoh pertanyaan di panel samping
  document.querySelectorAll('.contoh-tanya').forEach(function (tombol) {
    tombol.addEventListener('click', function () {
      if (tombolKirim.disabled) return;
      kirimPertanyaan(tombol.textContent.trim());
    });
  });
});
