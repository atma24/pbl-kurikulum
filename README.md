
# 🎓 Sistem Pemetaan Matriks Kurikulum (CPL to IEA)

Sistem informasi berbasis web untuk memetakan Capaian Pembelajaran Lulusan (CPL) dengan indikator International Engineering Alliance (IEA) dan Program Performance Measure (PPM) secara dinamis. Dibangun menggunakan arsitektur modern Single Page Application (SPA) monolith.

## ✨ Fitur Utama
* **Matriks Dinamis:** Tabel pemetaan CPL ke IEA yang men-*generate* baris dan kolom secara otomatis berdasarkan data master.
* **Real-time Sync:** Menyimpan perubahan (centang/un-centang) secara instan ke *database* tanpa perlu me-*refresh* halaman (*seamless experience*).
* **Modern UI/UX:** Antarmuka yang bersih, responsif, dan profesional menggunakan Tailwind CSS.
* **Arsitektur Monolith SPA:** Menggabungkan kekuatan *backend* Laravel dan kecepatan *frontend* React dalam satu ruang kerja menggunakan Inertia.js.

## 🛠️ Teknologi yang Digunakan
* **Backend:** Laravel 11 (PHP)
* **Frontend:** React.js dengan TypeScript
* **State/Routing Bridge:** Inertia.js
* **Styling:** Tailwind CSS
* **Database:** MySQL
* **Build Tool:** Vite

## 🗄️ Struktur Database Utama
Aplikasi ini menggunakan sistem Relational Database dengan tabel Master dan Pivot:
* `cpls`, `ieas`, `ppms`, `mata_kuliahs` (Tabel Master)
* `cpl_iea`, `cpl_ppm`, `mk_cpl`, `ppm_iea` (Tabel Relasi/Pivot Many-to-Many)

## 🚀 Cara Instalasi & Menjalankan Project

Ikuti langkah-langkah berikut untuk menjalankan aplikasi ini di komputer lokal Anda:

### Prasyarat
Pastikan Anda sudah menginstal:
* PHP (>= 8.2) & Composer
* Node.js & NPM
* MySQL Database

### Langkah Instalasi
1. **Clone repository ini:**
   ```bash
   git clone [https://github.com/username-anda/nama-repo-anda.git](https://github.com/username-anda/nama-repo-anda.git)
   cd nama-repo-anda
   ```

2. **Install dependency PHP (Laravel):**
   ```bash
   composer install
   ```

3. **Install dependency JavaScript (React/Vite):**
   ```bash
   npm install
   ```

4. **Konfigurasi Environment:**
   Duplikat file `.env.example` menjadi `.env`, lalu generate *application key*.
   ```bash
   cp .env.example .env
   php artisan key:generate
   ```
   *Jangan lupa atur koneksi database Anda di file `.env` (DB_DATABASE, DB_USERNAME, DB_PASSWORD).*

5. **Jalankan Migrasi Database:**
   ```bash
   php artisan migrate
   ```

6. **Jalankan Server Lokal:**
   Anda perlu membuka dua terminal terpisah untuk menjalankan *backend* dan *frontend*.
   
   *Terminal 1 (Laravel Server):*
   ```bash
   php artisan serve
   ```
   *Terminal 2 (Vite Hot-Reload):*
   ```bash
   npm run dev
   ```

7. **Akses Aplikasi:**
   Buka browser Anda dan kunjungi: `http://localhost:8000/matrix`

## 👤 Author
* **Rauf Fansuri** - *Backend Developer*
* **Achmad Brilyan Syach** - *Frontend Developer*

---
*Dibuat dengan ❤️ untuk kemudahan manajemen kurikulum akademik.*
```

***

**Tips Tambahan untuk GitHub Anda:**
1. Ganti `https://github.com/username-anda/nama-repo-anda.git` dengan *link repository* asli Anda nanti.
2. Kalau Anda sudah sempat melakukan *screenshot* layar saat webnya berjalan tadi, sangat disarankan untuk menambahkan gambar *screenshot* tersebut di bagian bawah judul agar orang lain bisa langsung melihat seperti apa bentuk aplikasinya!
