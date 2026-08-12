# Toko Sembako Ariesta — UCP 1 Pemrograman Aplikasi Web

**Nama** : Fazilatun Nisa Muslimah
**NIM** : 20250140119
**Kelas** : A
**Mata Kuliah** : Pemrograman Aplikasi Web (PPAW-TI503P)

---

## Deskripsi Project

Website dan REST API untuk **Toko Sembako Ariesta**, sebuah UMKM yang menjual beras,
minyak goreng, gula, telur, dan kebutuhan pokok rumah tangga lainnya. Selama ini
pelanggan harus bertanya harga dan stok lewat WhatsApp satu per satu, sehingga
pemilik toko kewalahan. Website ini dibuat supaya harga dan stok bisa dilihat
sendiri oleh pelanggan, dan supaya pemilik toko bisa memperbarui datanya sendiri
lewat dashboard tanpa perlu memanggil programmer.

Aplikasi dibangun **full stack** memakai **Node.js + Express.js** dengan
**EJS** sebagai view engine (server-side rendering), dilengkapi REST API,
autentikasi login berbasis sesi, dan fitur Tanya AI dengan logika balasan
buatan sendiri di backend.

### Status: Sprint 1 & Sprint 2 selesai

| Sprint 1 (In-Class / Lab) | Sprint 2 (Take-Home) |
| --- | --- |
| Server Express + view engine EJS & partials | Sistem login admin/kasir (session + bcrypt) |
| 4 halaman (Beranda, Produk, Detail Produk, Tanya AI) | Middleware autentikasi (halaman & API) |
| Route dinamis `/produk/:id` + penanganan ID tidak ditemukan | REST API CRUD penuh (POST/PUT/DELETE) |
| Filter produk lewat query string di server | Dashboard admin dengan form tambah/ubah/hapus |
| `GET /api/products` (read-only) | `POST /api/chat` (logika balasan dummy) |
| Layout responsif + navbar hamburger (vanilla JS) | Integrasi Fetch API `async/await` di frontend |
| Middleware custom request logger | Store data terpusat (`data/store.js`) |

---

## Akun Admin untuk Pengecekan

| Username | Password |
| --- | --- |
| `admin` | `admin123` |

Login lewat **http://localhost:3000/login**, lalu dashboard bisa dibuka di
`/dashboard`. Tidak ada fitur registrasi publik — akun dibuat lewat seed data
sesuai ketentuan PRD.

Password **tidak disimpan dalam bentuk teks polos**: yang tersimpan di
`data/users.js` adalah hasil hash **bcrypt**, dan pengecekan saat login memakai
`bcrypt.compare()`. Username/password awal juga bisa diganti lewat file `.env`
(lihat `.env.example`), tetapi aplikasi tetap berjalan normal tanpa `.env`
karena semua nilainya punya default di kode.

---

## Teknologi yang Dipakai

- **Node.js** + **Express.js 5** — server & routing
- **EJS** — view engine dengan partials (`head`, `navbar`, `footer`)
- **express-session** — penyimpanan sesi login di sisi server
- **bcryptjs** — hashing password akun admin
- **dotenv** — konfigurasi opsional lewat `.env`
- **Tailwind CDN** — dipakai untuk konfigurasi palet warna
- **CSS custom** (`public/css/style.css`) — layout Flexbox/Grid + media query
- **Vanilla JavaScript** — Fetch API `async/await`, manipulasi DOM, event handling
- **nodemon** — auto-restart server saat development
- Data produk & akun admin disimpan sebagai **array in-memory** (`data/store.js`)

---

## Cara Menjalankan Project Secara Lokal

1. Clone repository ini, lalu masuk ke foldernya:

   ```bash
   git clone https://github.com/fazila7002/PAWAntara-A-UCP1-20250140119.git
   cd PAWAntara-A-UCP1-20250140119
   ```

2. Install seluruh dependency:

   ```bash
   npm install
   ```

3. Jalankan server dalam mode development (auto-restart lewat nodemon):

   ```bash
   npm run dev
   ```

   Atau menjalankan server biasa tanpa nodemon:

   ```bash
   npm start
   ```

4. Buka browser ke **http://localhost:3000**

Tidak ada langkah tambahan seperti membuat database atau menyalin `.env` —
cukup `npm install` lalu `npm run dev`.

---

## Struktur Folder

```
PAWAntara-A-UCP1-20250140119/
├── app.js                       # entry point: setup express, session, middleware, routing
├── package.json                 # script start & dev (nodemon)
├── .env.example                 # contoh konfigurasi (.env asli tidak di-commit)
├── data/
│   ├── products.js              # data awal (seed) produk
│   ├── store.js                 # store produk in-memory + fungsi CRUD & validasi
│   └── users.js                 # akun admin (password di-hash bcrypt)
├── middleware/
│   ├── logger.js                # middleware custom: pencatat request
│   └── auth.js                  # middleware autentikasi (halaman & API)
├── services/
│   └── chatbot.js               # logika balasan Tanya AI (keyword matching)
├── routes/
│   ├── web.js                   # route halaman website (render EJS)
│   └── api.js                   # route REST API
├── views/
│   ├── partials/
│   │   ├── head.ejs             # <head>, tailwind config & link CSS
│   │   ├── navbar.ejs           # navbar + tombol hamburger + status login
│   │   └── footer.ejs           # footer + script JS
│   ├── beranda.ejs
│   ├── produk.ejs
│   ├── detail.ejs
│   ├── tanya-ai.ejs
│   ├── login.ejs
│   ├── dashboard.ejs
│   ├── produk-tidak-ditemukan.ejs
│   └── 404.ejs
└── public/                      # static file, disajikan lewat express.static
    ├── css/style.css
    └── js/
        ├── main.js              # menu hamburger + tombol logout
        ├── login.js             # submit login lewat Fetch API
        ├── dashboard.js         # CRUD produk lewat Fetch API
        ├── chat.js              # kirim pertanyaan ke POST /api/chat
        └── produk.js            # ambil daftar produk dari GET /api/products
```

---

## Daftar Route Halaman

| Method | Route | Deskripsi | Akses |
| --- | --- | --- | --- |
| GET | `/` | Beranda — hero section, kategori belanja, dan preview 3 produk | Publik |
| GET | `/produk` | Daftar seluruh produk dalam bentuk card | Publik |
| GET | `/produk?kategori=Beras` | Daftar produk yang difilter per kategori (diproses di server) | Publik |
| GET | `/produk?search=minyak` | Daftar produk hasil pencarian nama/kategori (diproses di server) | Publik |
| GET | `/produk/:id` | Detail satu produk berdasarkan ID pada URL | Publik |
| GET | `/tanya-ai` | Halaman chat dengan asisten toko | Publik |
| GET | `/login` | Form login admin/kasir | Publik |
| GET | `/dashboard` | Panel admin untuk mengelola produk | **Wajib login** |

Jika ID pada `/produk/:id` tidak ditemukan, server membalas **HTTP 404** dan
menampilkan halaman "Produk tidak ditemukan" — bukan error crash atau
`undefined` di layar. Alamat lain yang tidak terdaftar diarahkan ke halaman 404.

Membuka `/dashboard` tanpa sesi login akan **diarahkan otomatis** ke
`/login?alasan=wajib-login`. Sebaliknya, membuka `/login` saat sudah login akan
diarahkan ke `/dashboard`.

---

## Daftar Endpoint API

| Method | Endpoint | Deskripsi | Akses |
| --- | --- | --- | --- |
| POST | `/api/login` | Login admin/kasir dengan username & password | Publik |
| POST | `/api/logout` | Logout, menghapus sesi login | **Login** |
| GET | `/api/session` | Mengecek apakah sesi login masih aktif | Publik |
| GET | `/api/products` | Mengambil seluruh data produk (mendukung `?kategori=` & `?search=`) | Publik |
| GET | `/api/products/:id` | Mengambil satu produk berdasarkan ID | Publik |
| POST | `/api/products` | Menambah produk baru | **Login** |
| PUT | `/api/products/:id` | Memperbarui produk (harga/stok/data lain) | **Login** |
| DELETE | `/api/products/:id` | Menghapus produk berdasarkan ID | **Login** |
| POST | `/api/chat` | Mengirim pertanyaan, menerima balasan dummy dari backend | Publik |

Seluruh response API memakai format konsisten `{ status, message, data }`.

### Contoh response

`GET /api/products`

```json
{
  "status": "success",
  "message": "Data produk berhasil diambil",
  "data": [
    {
      "id": 1,
      "name": "Beras Setra Ramos 5 kg",
      "category": "Beras",
      "price": 68000,
      "stock": 24,
      "unit": "karung",
      "icon": "🍚",
      "description": "Beras premium pulen, butiran bersih dan wangi. Cocok untuk kebutuhan harian keluarga."
    }
  ]
}
```

`POST /api/login`

```json
{
  "status": "success",
  "message": "Login berhasil",
  "data": { "id": 1, "username": "admin", "nama": "Ibu Aries", "peran": "admin" }
}
```

`POST /api/products` — HTTP 201

```json
{
  "status": "success",
  "message": "Produk ditambahkan",
  "data": { "id": 11, "name": "Mie Instan Goreng", "price": 3500, "stock": 60 }
}
```

`POST /api/chat`

```json
{
  "status": "success",
  "message": "Balasan berhasil dibuat",
  "data": {
    "question": "toko buka jam berapa?",
    "reply": "Toko kami buka setiap hari, termasuk Sabtu dan Minggu, jam 07.00 - 20.00 WIB. Hari besar biasanya tetap buka, tapi tutup lebih awal.",
    "topik": "jam buka"
  }
}
```

Endpoint bertanda **Login** akan menolak request yang tidak punya sesi login
dengan **HTTP 401**, termasuk kalau dipanggil langsung lewat Postman:

```json
{ "status": "error", "message": "Unauthorized, silakan login terlebih dahulu" }
```

Payload yang tidak masuk akal (nama kosong, harga negatif, stok pecahan)
ditolak dengan **HTTP 400**, dan ID yang tidak ada dibalas **HTTP 404**.

---

## Cara Kerja Aplikasi

### Satu sumber data

Halaman publik dan REST API membaca store yang sama (`data/store.js`). Artinya
ketika admin mengubah harga lewat dashboard, perubahan itu **langsung terlihat**
di halaman Produk, halaman Detail, `GET /api/products`, bahkan pada jawaban
fitur Tanya AI — tanpa perlu restart server.

Data disimpan sebagai array in-memory, jadi akan kembali ke kondisi awal setiap
kali server dijalankan ulang. Ini salah satu pilihan yang diizinkan PRD.

### Autentikasi

Login membuat sesi di sisi server (`express-session`); browser hanya menyimpan
cookie berisi id sesi yang bersifat `httpOnly`. Proteksi endpoint dilakukan di
server lewat `middleware/auth.js`, **bukan** dengan menyembunyikan tombol di
frontend. Logout menghapus sesi lewat `POST /api/logout`.

### Fitur Tanya AI

Balasan dihasilkan sepenuhnya oleh logika buatan sendiri di
`services/chatbot.js` berupa pencocokan kata kunci — **tidak ada** pemanggilan
API AI pihak ketiga. Topik yang dikenali: sapaan, jam buka, ongkir &
pengantaran, cara pembayaran, alamat toko, kontak, daftar produk, serta stok &
harga produk. Untuk pertanyaan soal produk, jawabannya dibaca langsung dari
store, jadi kalau stok tepung sedang nol maka chat akan menjawab bahwa
produknya habis.

### Middleware custom

`middleware/logger.js` mencatat setiap request yang masuk ke terminal beserta
method, endpoint, status code, dan lama prosesnya:

```
[14:32:07] POST /api/login -> 200 (67 ms)
[14:32:09] GET /dashboard -> 200 (7 ms)
[14:32:15] DELETE /api/products/11 -> 401 (2 ms)
```

---

## Penjelasan Tampilan (UI)

### Palet Warna

Website memakai palet **earthy** dari coklat tanah ke hijau olive, dipilih supaya
terasa hangat, natural, dan dekat dengan citra toko sembako/bahan pokok.

| Warna | Hex | Dipakai untuk |
| --- | --- | --- |
| Kopi | `#582f0e` | Judul utama (heading) |
| Coklat | `#7f4f24` | Harga produk, sub-judul |
| Karamel | `#936639` | Tombol garis, teks pendukung |
| Pasir | `#a68a64` | Border input, teks sekunder |
| Gandum | `#b6ad90` | Border kartu |
| Sage | `#c2c5aa` | Latar gambar produk, bubble chat AI |
| Zaitun | `#a4ac86` | Label kategori |
| Olive | `#656d4a` | Tombol utama, menu aktif |
| Lumut | `#414833` | Header chat, hover navbar |
| Hutan | `#333d29` | Navbar, footer, warna teks |
| Krem | `#f7f4ec` | Latar belakang halaman |

### Struktur Semantic HTML5

Setiap halaman disusun memakai elemen semantic sesuai konteksnya:
`<header>` untuk navbar, `<nav>` untuk navigasi dan breadcrumb, `<main>` untuk
konten utama, `<section>` untuk pengelompokan konten, `<article>` untuk tiap
kartu produk, panel chat, dan panel dashboard, `<aside>` untuk konten pendukung
(kartu keunggulan toko dan daftar contoh pertanyaan), serta `<footer>` untuk
bagian bawah halaman.

### Halaman

- **Beranda** — hero section berisi ajakan utama dan kartu keunggulan toko,
  lalu grid kategori belanja (Beras, Minyak, Gula, Telur) yang langsung
  mengarah ke halaman produk dengan filter aktif, dan preview tiga produk.
- **Produk** — form filter (input pencarian + dropdown kategori) yang hasilnya
  diambil dari `GET /api/products` lewat Fetch API dan digambar ulang di DOM
  tanpa reload; alamat di address bar tetap ikut berubah sehingga bisa disalin
  dan tombol back browser tetap berfungsi. Penyaringannya sendiri tetap
  dikerjakan di server lewat query string. Halaman ini juga tetap dirender
  server-side, jadi isinya tetap tampil walaupun JavaScript dimatikan.
- **Detail Produk** — layout dua kolom berisi gambar besar dan informasi
  lengkap produk (harga, deskripsi, daftar spesifikasi), ditambah daftar produk
  lain dari kategori yang sama.
- **Tanya AI** — antarmuka chat dengan bubble percakapan (bubble pelanggan di
  kanan berwarna coklat, bubble asisten di kiri berwarna sage). Pertanyaan
  dikirim ke `POST /api/chat` lewat Fetch API, dengan indikator titik-titik
  "sedang mengetik" selama menunggu balasan. Panel samping berisi tombol contoh
  pertanyaan yang bisa langsung diklik.
- **Login Admin** — kartu login di tengah halaman dengan pesan error yang muncul
  di tempat (tanpa reload), misalnya saat kolom kosong atau password salah.
- **Dashboard** — empat kartu ringkasan (jenis produk, total stok, produk habis,
  nilai persediaan), form tambah/ubah produk di kiri, dan tabel daftar produk
  dengan tombol Ubah & Hapus di kanan. Menekan "Ubah" mengisi form dengan data
  produk tersebut dan mengubah judul panel menjadi mode edit. Setiap operasi
  memunculkan notifikasi hasil dan menyegarkan tabel serta ringkasan angkanya.

### Responsivitas

Layout memakai kombinasi **Flexbox** (navbar, hero, form filter, isi kartu) dan
**CSS Grid** (grid kategori, grid produk, detail produk, dashboard, footer),
dengan **dua breakpoint media query**:

- **`max-width: 900px` (tablet)** — hero berubah jadi satu kolom, grid produk
  dan kategori menjadi 2 kolom, detail produk menumpuk vertikal, dashboard
  berubah jadi satu kolom.
- **`max-width: 640px` (mobile)** — seluruh grid menjadi 1 kolom, form filter
  menumpuk vertikal, dan navbar berubah menjadi **menu hamburger**.

Menu hamburger digerakkan oleh vanilla JavaScript (`addEventListener` + toggle
class `menu-terbuka`), bukan sekadar disembunyikan lewat CSS. Tombolnya juga
memperbarui atribut `aria-expanded` dan `aria-label`, dan garis hamburgernya
berubah menjadi tanda silang saat menu terbuka.

### Validasi Input

Validasi dilakukan di **dua lapis**. Di frontend, form login, form produk, dan
form chat dicegah terkirim kalau kolom wajibnya kosong (harga/stok juga ditolak
kalau negatif). Di backend, endpoint tetap memeriksa ulang payload-nya, sehingga
request yang dikirim langsung lewat Postman pun tidak bisa menembus validasi.

### Aksesibilitas

- Setiap `input`, `select`, dan `textarea` punya `label` yang terhubung lewat
  `for`/`id`. Pada form chat, label disembunyikan secara visual
  (`.label-visually-hidden`) tetapi tetap terbaca oleh screen reader.
- Elemen dekoratif (ikon emoji) diberi `aria-hidden="true"`.
- Tombol hamburger memakai `aria-label`, `aria-expanded`, dan `aria-controls`.
- Setiap `section` diberi `aria-labelledby` yang mengacu ke judulnya.
- Kotak pesan hasil operasi memakai `role="alert"` dan `aria-live="polite"`,
  begitu juga daftar bubble chat, sehingga perubahannya ikut dibacakan.
- Animasi dimatikan otomatis kalau sistem pengguna mengaktifkan
  `prefers-reduced-motion`.

---

## Format Commit

Seluruh commit diawali label sprintnya sesuai ketentuan Bagian 8 PRD.

**Sprint 1**

```
Sprint1-init express project & nodemon setup
Sprint1-add semantic HTML for beranda page with EJS partials
Sprint1-add produk page & dynamic detail route with query filter
Sprint1-add responsive layout with flexbox/grid & hamburger menu
Sprint1-add products REST API endpoint & tanya AI page
```

**Sprint 2**

```
Sprint2-setup express-session & shared product data store
Sprint2-add login page & session auth with bcrypt
Sprint2-add product mutation endpoints protected by auth guard
Sprint2-add admin dashboard with fetch-based product CRUD
Sprint2-add dummy chatbot endpoint & dynamic chat UI
Sprint2-fetch produk list from API & refresh README
```

---

## Catatan

- Folder `node_modules/` dan file `.env` sudah diabaikan lewat `.gitignore`.
- **Tidak ada** pemanggilan API AI eksternal (OpenAI/Anthropic/Gemini) di project
  ini, sesuai larangan pada PRD. Balasan fitur Tanya AI 100% dihasilkan oleh
  logika di `services/chatbot.js`.
- Aplikasi ini full stack dengan backend Node.js, sehingga tidak bisa
  di-deploy ke GitHub Pages. Yang dikumpulkan adalah link repository.
