# Panduan Menjalankan Aplikasi di localhost (Laptop Lain)

Dokumen ini menjelaskan cara menjalankan Sistem Pemetaan Matriks Kurikulum (CPL to IEA) di komputer lain melalui localhost.

## 📋 Prasyarat

Sebelum memulai, pastikan laptop Anda telah menginstall:

- **PHP** (versi 8.2 atau lebih tinggi)
- **Composer** (dependency manager untuk PHP)
- **Node.js** (versi 16 atau lebih tinggi) dan **npm**
- **MySQL Database** (versi 5.7 atau lebih tinggi)
- **Git** (untuk clone repository)

## 🔧 Langkah-langkah Instalasi

### 1. Clone Repository

Buka terminal/command prompt dan jalankan:

```bash
git clone [URL-REPOSITORY-ANDA]
cd pbl-kurikulum
```

### 2. Install Dependency PHP (Laravel)

```bash
composer install
```

### 3. Install Dependency JavaScript (React/Vite)

```bash
npm install
```

### 4. Konfigurasi Environment

Duplikat file `.env.example` menjadi `.env` lalu generate application key:

```bash
cp kurikulum-laravel/.env.example kurikulum-laravel/.env
php artisan key:generate
```

Edit file `.env` untuk mengatur koneksi database:

```env
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_PORT=3306
DB_DATABASE=kurikulum_landlord  # Sesuaikan dengan nama database Anda
DB_USERNAME=root               # Sesuaikan dengan username MySQL Anda
DB_PASSWORD=your_password      # Sesuaikan dengan password MySQL Anda
```

### 5. Buat Database MySQL

Buka MySQL client (misalnya MySQL Workbench, phpMyAdmin, atau command line) dan buat database baru:

```sql
CREATE DATABASE kurikulum_landlord;
```

### 6. Jalankan Migrasi Database

```bash
php artisan migrate
```

### 7. Jalankan Seed Data (Opsional)

Jika ada data awal yang perlu diisi:

```bash
php artisan db:seed
```

### 8. Storage Linking (jika diperlukan)

```bash
php artisan storage:link
```

## ▶️ Menjalankan Aplikasi

Anda perlu membuka **dua terminal terpisah** untuk menjalankan backend dan frontend:

### Terminal 1 (Laravel Backend Server)

```bash
php artisan serve
```

Ini akan menjalankan server Laravel di `http://localhost:8000`

### Terminal 2 (Vite Frontend Development Server)

```bash
npm run dev
```

Ini akan menjalankan Vite development server dengan hot-reload.

## 🌐 Akses Aplikasi

Buka browser Anda dan kunjungi:
```
http://localhost:8000/matrix
```

## 🔐 Akses Admin/KPS

Untuk mengakses fitur administrasi:

1. Buka `http://localhost:8000/login`
2. Gunakan kredensial admin yang telah dibuat melalui seeder atau daftar akun manual melalui interface
3. Untuk akun dosen/KPS, ikuti panduan di `USER_MANUAL_KPS.md`

## 🛠️ Troubleshooting

### Masalah Umum dan Solusinya:

1. **"Database connection failed"**
   - Periksa kembali konfigurasi database di file `.env`
   - Pastikan MySQL service sedang berjalan
   - Verifikasi username/password database

2. **"Port already in use"**
   - Jika port 8000 sudah digunakan, ubah port dalam perintah:
     ```bash
     php artisan serve --port=8080
     ```
   - Atau matikan proses yang menggunakan port tersebut

3. **"Module not found" atau error JavaScript**
   - Hapus folder `node_modules` dan file `package-lock.json`
   - Jalankan `npm install` lagi
   - Pastikan Anda menggunakan versi Node.js yang kompatibel

4. **"Class not found" setelah migrasi**
   - Jalankan `composer dump-autoload`
   - Pastikan tidak ada error saat menjalankan migrasi

5. **CORS issues**
   - Pastikan Anda mengakses aplikasi melalui `http://localhost:8000` bukan langsung file HTML
   - Backend dan frontend harus menjalankan dari same origin (localhost dengan port yang sama atau sesuai konfigurasi Inertia.js)

## 🔄 Perbarui Kode

Jika Anda ingin memperbarui kode dari repository:

```bash
git pull origin main
composer install   # Jika ada dependency PHP baru
npm install        # Jika ada dependency JS baru
php artisan migrate # Jika ada perubahan database
```

## 📝 Catatan Penting

1. Pastikan kedua terminal (Laravel dan Vite) tetap terbuka saat menggunakan aplikasi
2. Perubahan pada file PHP akan otomatis terdeteksi oleh Laravel
3. Perubahan pada file JavaScript/React akan otomatis ter reload oleh Vite
4. Untuk production, gunakan proses build yang berbeda (lihat dokumentasi Laravel dan Vite untuk deployment)

## 👥 Kontak Pengembang

Jika Anda mengalami kesulitan yang tidak tercakup dalam panduan ini:

- **Rauf Fansuri** - Backend Developer
- **Achmad Brilyan Syach** - Frontend Developer

---

*Dokumentasi ini terakhir diperbarui untuk memastikan kompatibilitas dengan versi terbaru aplikasi.*