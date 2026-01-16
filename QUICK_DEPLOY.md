# Quick Deploy - Frontend ke Hostinger

## 🎯 Setup Cepat (5 Menit)

### Domain Configuration:
- **Frontend**: `dev.bogorjuniorfs.com`
- **Backend API**: `api.bogorjuniorfs.com`

---

## 📦 Build & Deploy

### 1. Build Production
```bash
cd bogorjunior-frontend
npm run build
```

Output: folder `dist/` (siap upload)

### 2. Upload ke Hostinger

**Via File Manager hPanel:**
1. Login → **Files** → **File Manager**
2. Navigate ke domain `dev.bogorjuniorfs.com` → `public_html/`
3. **Delete** semua file lama (jika ada)
4. **Upload** semua isi folder `dist/`:
   ```
   dist/
   ├── index.html          ← upload ini
   ├── assets/             ← upload folder ini
   └── ...semua file lain  ← upload semua
   ```
5. **Upload** juga file `.htaccess` (untuk routing SPA)

---

## ⚙️ Environment Variables

File [.env.production](.env.production) sudah dikonfigurasi:

```bash
VITE_API_URL=https://api.bogorjuniorfs.com
VITE_APP_NAME=Bogor Junior FS
```

✅ Otomatis digunakan saat `npm run build`  
✅ Tidak perlu setting manual di hPanel (beda dengan backend)

---

## ✅ Verification

### Test Build Local:
```bash
npm run build
npm run preview
```
Buka: `http://localhost:4173`

### Test Production:
Buka: `https://dev.bogorjuniorfs.com`

Check:
- ✅ Website loading
- ✅ Bisa login
- ✅ API calls ke `api.bogorjuniorfs.com`

### Check Console:
1. F12 → **Console** → no errors
2. **Network** tab → API calls sukses

---

## 🔧 Fix CORS Error

Jika error:
```
Access to fetch blocked by CORS policy
```

**Update Backend** `.env.production`:
```bash
CORS_ORIGIN=https://dev.bogorjuniorfs.com
```

Restart backend di hPanel.

---

## 📁 File Structure di Server

```
/home/u702886622/domains/dev.bogorjuniorfs.com/
└── public_html/
    ├── .htaccess         ← PENTING untuk SPA routing
    ├── index.html
    └── assets/
        ├── index-[hash].js
        └── index-[hash].css
```

---

## 🐛 Common Issues

### 404 saat refresh page?
→ Upload file `.htaccess` ke `public_html/`

### API call ke localhost?
→ Rebuild dengan `npm run build` (pastikan `.env.production` ada)

### Assets not found?
→ Pastikan struktur folder tetap sama saat upload

---

## 🔄 Update Deployment

```bash
# 1. Edit code
# 2. Build ulang
npm run build

# 3. Upload dist/ overwrite file lama
# 4. Clear cache browser (Ctrl+F5)
```

---

## 📋 Deployment Checklist

**Pre-Deploy:**
- [ ] Backend sudah running di `api.bogorjuniorfs.com`
- [ ] Database sudah di-import
- [ ] Backend CORS set ke `dev.bogorjuniorfs.com`

**Deploy:**
- [ ] `npm run build` sukses
- [ ] Upload `dist/` ke `public_html/`
- [ ] Upload `.htaccess`

**Post-Deploy:**
- [ ] Test buka `dev.bogorjuniorfs.com`
- [ ] Test login
- [ ] Check console no errors
- [ ] Test dari mobile

---

## 📞 Need Help?

- **Full Guide**: [DEPLOYMENT.md](DEPLOYMENT.md)
- **Backend Setup**: `../bogorjunior-backend/QUICK_DEPLOY.md`
- **Hostinger Support**: Live Chat 24/7

---

**🚀 Ready to Deploy!**

File `.env.production` sudah siap, tinggal build dan upload!
