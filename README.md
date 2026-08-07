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
sendiri oleh pelanggan.

Aplikasi dibangun **full stack** memakai **Node.js + Express.js** dengan
**EJS** sebagai view engine (server-side rendering).

### Status: Sprint 1 (In-Class / Lab)

Repository ini baru berisi hasil **Sprint 1**, yaitu fondasi website:
struktur halaman semantic, styling responsif, dan server Express dasar
dengan routing dinamis serta satu endpoint API read-only.

| Sudah dikerjakan di Sprint 1 | Dikerjakan di Sprint 2 |
| --- | --- |
| Server Express + view engine EJS & partials | Sistem login admin/kasir |
| 4 halaman (Beranda, Produk, Detail Produk, Tanya AI) | Middleware autentikasi |
| Route dinamis `/produk/:id` + penanganan ID tidak ditemukan | REST API CRUD penuh (POST/PUT/DELETE) |
| Filter produk lewat query string di server | Dashboard admin |
| `GET /api/products` (read-only) | `POST /api/chat` (logika balasan dummy) |
| Layout responsif + navbar hamburger (vanilla JS) | Integrasi Fetch API di frontend |
| Middleware custom request logger | Penyimpanan data persisten (SQLite/PostgreSQL) |

---

## Teknologi yang Dipakai

- **Node.js** + **Express.js 5** — server & routing
- **EJS** — view engine dengan partials (`navbar`, `footer`, `head`)
- **Tailwind CDN** — dipakai untuk konfigurasi palet warna
- **CSS custom** (`public/css/style.css`) — layout Flexbox/Grid + media query
- **Vanilla JavaScript** (`public/js/main.js`) — toggle menu hamburger
- **nodemon** — auto-restart server saat development
- Data produk masih berupa **array of object** di `data/products.js` (belum database)

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

---

## Struktur Folder

```
PAWAntara-A-UCP1-20250140119/
├── app.js                       # entry point: setup express, middleware, routing
├── package.json                 # script start & dev (nodemon)
├── data/
│   └── products.js              # data produk dummy (array of object)
├── routes/
│   ├── web.js                   # route halaman website (render EJS)
│   └── api.js                   # route REST API
├── views/
│   ├── partials/
│   │   ├── head.ejs             # <head>, tailwind config & link CSS
│   │   ├── navbar.ejs           # navbar + tombol hamburger
│   │   └── footer.ejs           # footer + script JS
│   ├── beranda.ejs
│   ├── produk.ejs
│   ├── detail.ejs
│   ├── tanya-ai.ejs
│   ├── produk-tidak-ditemukan.ejs
│   └── 404.ejs
└── public/                      # static file, disajikan lewat express.static
    ├── css/style.css
    └── js/main.js
```

---

## Daftar Route Halaman

| Method | Route | Deskripsi |
| --- | --- | --- |
| GET | `/` | Beranda — hero section, kategori belanja, dan preview 3 produk |
| GET | `/produk` | Daftar seluruh produk dalam bentuk card |
| GET | `/produk?kategori=Beras` | Daftar produk yang difilter per kategori (diproses di server) |
| GET | `/produk?search=minyak` | Daftar produk hasil pencarian nama/kategori (diproses di server) |
| GET | `/produk/:id` | Detail satu produk berdasarkan ID pada URL |

Jika ID pada `/produk/:id` tidak ditemukan, server membalas **HTTP 404** dan
menampilkan halaman "Produk tidak ditemukan" — bukan error crash atau
`undefined` di layar. Alamat lain yang tidak terdaftar diarahkan ke halaman 404.

---

## Daftar Endpoint API

| Method | Endpoint | Deskripsi | Akses |
| --- | --- | --- | --- |
| GET | `/api/products` | Mengambil seluruh data produk sembako dalam format JSON | Publik |

Contoh response `GET /api/products`:

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

Seluruh response API memakai format konsisten `{ status, message, data }`.
Endpoint ini bisa diuji langsung lewat browser di
`http://localhost:3000/api/products` maupun lewat Postman/Thunder Client.

Endpoint `POST`, `PUT`, `DELETE`, serta `POST /api/chat` **belum tersedia** karena
merupakan bagian dari Sprint 2.

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
kartu produk dan panel chat, `<aside>` untuk konten pendukung (kartu keunggulan
toko dan daftar contoh pertanyaan), serta `<footer>` untuk bagian bawah halaman.

### Halaman

- **Beranda** — hero section berisi ajakan utama dan kartu keunggulan toko,
  lalu grid kategori belanja (Beras, Minyak, Gula, Telur) yang langsung
  mengarah ke halaman produk dengan filter aktif, dan preview tiga produk.
- **Produk** — form filter (input pencarian + dropdown kategori) yang dikirim
  lewat query string dan diproses di server, disusul grid kartu produk berisi
  ikon, label kategori, nama, harga, dan status stok. Produk yang stoknya nol
  ditandai "Stok habis" dengan warna berbeda. Jika hasil filter kosong,
  ditampilkan kotak pesan beserta tombol untuk reset filter.
- **Detail Produk** — layout dua kolom berisi gambar besar dan informasi
  lengkap produk (harga, deskripsi, daftar spesifikasi), ditambah daftar produk
  lain dari kategori yang sama.
- **Tanya AI** — antarmuka chat dengan bubble percakapan (bubble pelanggan di
  kanan berwarna coklat, bubble asisten di kiri berwarna sage) dan form
  pertanyaan. Sesuai ketentuan Sprint 1, halaman ini baru menampilkan tampilan
  chat; logika balasan dari server dikerjakan pada Sprint 2.

### Responsivitas

Layout memakai kombinasi **Flexbox** (navbar, hero, form filter, isi kartu) dan
**CSS Grid** (grid kategori, grid produk, detail produk, footer), dengan
**dua breakpoint media query**:

- **`max-width: 900px` (tablet)** — hero berubah jadi satu kolom, grid produk
  dan kategori menjadi 2 kolom, detail produk menumpuk vertikal.
- **`max-width: 640px` (mobile)** — seluruh grid menjadi 1 kolom, form filter
  menumpuk vertikal, dan navbar berubah menjadi **menu hamburger**.

Menu hamburger digerakkan oleh vanilla JavaScript (`addEventListener` + toggle
class `menu-terbuka`), bukan sekadar disembunyikan lewat CSS. Tombolnya juga
memperbarui atribut `aria-expanded` dan `aria-label`, dan garis hamburgernya
berubah menjadi tanda silang saat menu terbuka.

### Aksesibilitas

- Setiap `input` dan `select` punya `label` yang terhubung lewat `for`/`id`.
  Pada form chat, label disembunyikan secara visual (`.label-visually-hidden`)
  tetapi tetap terbaca oleh screen reader.
- Elemen dekoratif (ikon emoji) diberi `aria-hidden="true"`.
- Tombol hamburger memakai `aria-label`, `aria-expanded`, dan `aria-controls`.
- Setiap `section` diberi `aria-labelledby` yang mengacu ke judulnya.
- Input pada form filter memakai `:focus` outline agar navigasi keyboard jelas.

---

## Format Commit

Seluruh commit pada sprint ini diawali label `Sprint1-` sesuai ketentuan:

```
Sprint1-init express project & nodemon setup
Sprint1-add semantic HTML for beranda page with EJS partials
Sprint1-add produk page & dynamic detail route with query filter
Sprint1-add responsive layout with flexbox/grid & hamburger menu
Sprint1-add products REST API endpoint & tanya AI page
```

---

## Catatan

- Folder `node_modules/` sudah diabaikan lewat `.gitignore`.
- **Tidak ada** pemanggilan API AI eksternal (OpenAI/Anthropic/Gemini) di project
  ini, sesuai larangan pada PRD.
- Aplikasi ini full stack dengan backend Node.js, sehingga tidak bisa
  di-deploy ke GitHub Pages. Yang dikumpulkan adalah link repository.
