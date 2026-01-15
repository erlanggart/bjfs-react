# 🚀 Panduan Cepat - Docker Development

## Instalasi Docker

### Windows
1. Download [Docker Desktop for Windows](https://www.docker.com/products/docker-desktop)
2. Install dan restart komputer
3. Buka Docker Desktop dan pastikan running

### macOS
1. Download [Docker Desktop for Mac](https://www.docker.com/products/docker-desktop)
2. Install dan jalankan Docker Desktop

### Linux (Ubuntu/Debian)
```bash
curl -fsSL https://get.docker.com -o get-docker.sh
sudo sh get-docker.sh
sudo usermod -aG docker $USER
```
Logout dan login kembali.

## 🎯 Cara Menjalankan Project

### Metode 1: Menggunakan Script Helper (Recommended)

```bash
# Setup pertama kali
./docker-dev.sh setup

# Selesai! Aplikasi siap digunakan
```

### Metode 2: Manual

```bash
# 1. Backup konfigurasi lama
cp bogor_junior_api/config/core_init_db_connect.php bogor_junior_api/config/core_init_db_connect.local.php

# 2. Gunakan konfigurasi Docker
cp bogor_junior_api/config/core_init_db_connect.docker.php bogor_junior_api/config/core_init_db_connect.php

# 3. Build container
docker-compose build

# 4. Jalankan
docker-compose up -d

# 5. Tunggu ~30 detik, lalu buka browser
```

## 📱 Akses Aplikasi

Setelah container berjalan, buka:

- **Frontend (React)**: http://localhost:5173
- **Backend (PHP API)**: http://localhost:8080
- **phpMyAdmin**: http://localhost:8081
  - Username: `bogorjunior`
  - Password: `bogorjunior123`

## 🗄️ Import Database

Jika punya file SQL database:

```bash
# Menggunakan script helper
./docker-dev.sh db-import namafile.sql

# Atau manual
docker exec -i bogorjunior-db mysql -u bogorjunior -pbogorjunior123 bogorjunior < namafile.sql
```

## 🎮 Perintah Sehari-hari

```bash
# Menjalankan aplikasi
./docker-dev.sh start

# Menghentikan aplikasi
./docker-dev.sh stop

# Melihat log
./docker-dev.sh logs

# Melihat log backend saja
./docker-dev.sh logs backend

# Restart semua
./docker-dev.sh restart

# Cek status container
./docker-dev.sh status
```

## 🔧 Development

### Frontend (React)
- Edit file di folder `bogorjunior/`
- Perubahan otomatis reload di browser (Hot Reload)
- Tidak perlu restart container

### Backend (PHP)
- Edit file di folder `bogor_junior_api/`
- Perubahan langsung aktif
- Tidak perlu restart container

### Database
- Gunakan phpMyAdmin: http://localhost:8081
- Atau masuk ke MySQL: `./docker-dev.sh shell db`

## 🐛 Troubleshooting

### Port sudah digunakan?
Edit file `docker-compose.yml`, ubah bagian ports:
```yaml
ports:
  - "5174:5173"  # Ubah 5173 menjadi 5174 (atau port lain)
```

### Container tidak jalan?
```bash
# Lihat error
./docker-dev.sh logs

# Atau lihat status
./docker-dev.sh status

# Coba restart
./docker-dev.sh restart
```

### Mulai dari awal (reset semua)
```bash
# Hati-hati: ini akan hapus database!
./docker-dev.sh clean

# Lalu setup lagi
./docker-dev.sh setup
```

### Frontend tidak reload otomatis?

Edit file `bogorjunior/vite.config.js`, tambahkan:
```js
export default defineConfig({
  server: {
    watch: {
      usePolling: true,
    },
  },
})
```

Lalu restart frontend:
```bash
docker-compose restart frontend
```

## 📝 Tips

1. **Jangan edit file di dalam container** - Edit di folder lokal saja
2. **Gunakan phpMyAdmin** untuk manage database dengan mudah
3. **Lihat logs** jika ada error: `./docker-dev.sh logs`
4. **Backup database** secara berkala: `./docker-dev.sh db-export`

## ⚠️ Penting

Setup ini **HANYA untuk development lokal**, bukan untuk production!

## 📞 Butuh Bantuan?

1. Lihat dokumentasi lengkap: `DOCKER_SETUP.md`
2. Cek logs: `./docker-dev.sh logs`
3. Restart: `./docker-dev.sh restart`

---

**Happy Coding! ⚽🎉**
