# Setup Frontend di Hostinger - GitHub Deployment

## ⚠️ Masalah Umum: Environment Variables Tidak Terbaca

Ketika deploy via GitHub ke Hostinger, file `.env.production` di repo **TIDAK otomatis terbaca** saat build. Environment variables harus diset di Hostinger panel.

---

## ✅ Solusi: Set Environment Variables di Hostinger

### Yang Sudah Benar (dari screenshot):
```
Key: VITE_API_URL
Value: https://api.bogorjuniorfs.com
```

### Yang Perlu Ditambahkan:

Di **Variabel Environment** Hostinger, pastikan ada:

| Key | Value |
|-----|-------|
| `VITE_API_URL` | `https://api.bogorjuniorfs.com` |
| `VITE_APP_NAME` | `Bogor Junior FS` |
| `NODE_ENV` | `production` |

**PENTING:** Nama variable harus PERSIS dengan prefix `VITE_` (uppercase)

---

## 🔧 Build Settings di Hostinger

### 1. Build Command
Pastikan menggunakan:
```bash
npm run build
```

Atau bisa lebih spesifik:
```bash
npm ci && npm run build
```

### 2. Root Directory
```
/
```
(jika repo root adalah project root)

### 3. Output Directory
```
dist
```

### 4. Install Command (Optional)
```bash
npm install
```

---

## 🚀 Cara Deploy Ulang dengan Environment Variables

### Step 1: Verifikasi Environment Variables
Di Hostinger panel → **Variabel Environment**:
- ✅ `VITE_API_URL` = `https://api.bogorjuniorfs.com`
- ✅ `VITE_APP_NAME` = `Bogor Junior FS`
- ✅ `NODE_ENV` = `production`

### Step 2: Klik "Simpan dan deploy ulang"
Hostinger akan:
1. Pull latest code dari GitHub
2. Install dependencies
3. **Inject environment variables**
4. Run build command
5. Deploy hasil build

### Step 3: Verifikasi
Setelah deploy selesai:

1. **Buka DevTools** di browser (F12)
2. **Console** tab → ketik:
   ```javascript
   console.log(import.meta.env.VITE_API_URL)
   ```
   Expected: `https://api.bogorjuniorfs.com`

3. **Network** tab → coba login/API call
   - Request URL harus ke: `https://api.bogorjuniorfs.com/api/...`
   - Bukan: `https://dev.bogorjuniorfs.com/api/...`

---

## 🐛 Troubleshooting

### Issue: API masih mengarah ke dev.bogorjuniorfs.com

**Kemungkinan Penyebab:**

#### 1. Environment Variable Tidak Terbaca
**Check:**
```javascript
// Di browser console
console.log(import.meta.env)
```

**Fix:**
- Pastikan nama variable PERSIS: `VITE_API_URL` (uppercase)
- Deploy ulang setelah set environment variables

#### 2. Build Cache
**Fix:**
- Clear build cache di Hostinger
- Delete `node_modules` di server (jika bisa akses)
- Deploy ulang

#### 3. Browser Cache
**Fix:**
- Hard reload: `Ctrl + F5` (Windows) atau `Cmd + Shift + R` (Mac)
- Atau buka incognito/private window

#### 4. Fallback ke Default Value
**Check di kode:**
File `src/services/api.js`:
```javascript
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:3000',
  // ...
});
```

Jika `VITE_API_URL` tidak terbaca, akan fallback ke `localhost:3000`

---

## 📝 Alternative: Commit .env.production ke Git

**⚠️ Tidak Recommended** (security risk), tapi bisa untuk testing:

### Option 1: Commit .env.production
```bash
# Di local
git add .env.production
git commit -m "Add production env"
git push origin main
```

Hostinger akan baca file ini saat build.

**Risk:** API URL terbuka di public repo.

### Option 2: Build Local, Upload Hasil
```bash
# Build di local
npm run build

# Upload folder dist/ via FTP
```

Ini paling aman karena environment variables sudah di-compile ke dalam build.

---

## ✅ Recommended Setup

### 1. Di Hostinger Panel:
```
Variabel Environment:
- VITE_API_URL = https://api.bogorjuniorfs.com
- VITE_APP_NAME = Bogor Junior FS
- NODE_ENV = production

Build Command:
npm ci && npm run build

Output Directory:
dist
```

### 2. Deploy Ulang
Klik **"Simpan dan deploy ulang"**

### 3. Verifikasi
```javascript
// Browser console
console.log(import.meta.env.VITE_API_URL)
// Should output: "https://api.bogorjuniorfs.com"
```

---

## 🔍 Debug Checklist

Jika masih error, cek satu per satu:

- [ ] Environment variable `VITE_API_URL` ada di Hostinger panel
- [ ] Nama variable UPPERCASE: `VITE_API_URL` (bukan `vite_api_url`)
- [ ] Value correct: `https://api.bogorjuniorfs.com` (tanpa trailing slash)
- [ ] Sudah klik "Simpan dan deploy ulang"
- [ ] Build berhasil tanpa error (cek logs)
- [ ] Browser cache sudah di-clear (Ctrl+F5)
- [ ] Test di incognito window
- [ ] Check console untuk nilai actual `import.meta.env.VITE_API_URL`

---

## 📞 Need Help?

Jika masih tidak work setelah semua langkah:

1. **Check Build Logs** di Hostinger
   - Apakah ada error saat build?
   - Apakah environment variables terlihat di logs?

2. **Verify Runtime Environment**
   ```javascript
   // Add this temporarily to src/App.jsx
   console.log('ENV CHECK:', import.meta.env.VITE_API_URL)
   ```
   Deploy dan check browser console.

3. **Try Manual Build**
   ```bash
   # Local
   VITE_API_URL=https://api.bogorjuniorfs.com npm run build
   # Upload dist/ via FTP
   ```

---

**Summary:**
Hostinger **TIDAK otomatis baca .env.production**. Harus set environment variables di panel → Deploy ulang → Verify di browser console.
