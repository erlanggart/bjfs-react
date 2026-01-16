# Frontend Deployment Guide - Hostinger

## 🌐 Domain Setup

- **Frontend**: `dev.bogorjuniorfs.com`
- **Backend API**: `api.bogorjuniorfs.com`

## 🚀 Quick Deployment

### 1. Build Production
```bash
cd bogorjunior-frontend
npm run build
```

File `.env.production` akan otomatis digunakan saat build, dengan konfigurasi:
- `VITE_API_URL=https://api.bogorjuniorfs.com`

### 2. Upload ke Hostinger

**Via File Manager:**
1. Login ke hPanel
2. **Files** → **File Manager**
3. Navigate ke `/public_html` untuk `dev.bogorjuniorfs.com`
4. Upload semua isi folder `dist/`:
   - `index.html`
   - `assets/`
   - Semua file lainnya
5. Pastikan struktur file tetap sama

**Via FTP:**
1. hPanel → **Files** → **FTP Accounts**
2. Buat/gunakan FTP account
3. Connect dengan FileZilla/FTP client
4. Upload folder `dist/` ke `/public_html/`

---

## 📁 Structure di Server

```
/home/u702886622/domains/dev.bogorjuniorfs.com/
└── public_html/
    ├── index.html
    ├── assets/
    │   ├── index-[hash].js
    │   ├── index-[hash].css
    │   └── ...
    ├── uploads/
    └── ...
```

---

## ⚙️ Environment Variables

### Local Development (`.env`):
```bash
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=Bogor Junior FS
```

### Production (`.env.production`):
```bash
VITE_API_URL=https://api.bogorjuniorfs.com
VITE_APP_NAME=Bogor Junior FS
```

**Note:** Vite otomatis pilih `.env.production` saat `npm run build`

---

## ✅ Verification

### 1. Test Build Locally
```bash
npm run build
npm run preview
```
Buka `http://localhost:4173` dan test:
- ✅ Login berhasil
- ✅ API calls ke backend local
- ✅ No console errors

### 2. Test Production
Setelah upload, buka `https://dev.bogorjuniorfs.com`:
- ✅ Website loading
- ✅ Login berhasil
- ✅ API calls ke `api.bogorjuniorfs.com`
- ✅ Check console untuk CORS errors

### 3. Check API Connection
Buka Developer Tools → Network tab:
- Request URL harus: `https://api.bogorjuniorfs.com/api/...`
- Response harus sukses (200, 201, etc.)
- Jika CORS error, cek backend `CORS_ORIGIN` setting

---

## 🔄 Update Deployment

### Quick Update:
```bash
# 1. Edit code
# 2. Build
npm run build

# 3. Upload dist/ ke Hostinger
# (overwrite existing files)

# 4. Clear browser cache & refresh
```

### With Version Control:
```bash
git add .
git commit -m "Update feature XYZ"
git push origin main

# Then build & upload
npm run build
# Upload dist/
```

---

## 🐛 Troubleshooting

### CORS Error
```
Access to fetch at 'https://api.bogorjuniorfs.com' from origin 'https://dev.bogorjuniorfs.com' 
has been blocked by CORS policy
```

**Fix Backend:**
```bash
# Di backend .env.production, set:
CORS_ORIGIN=https://dev.bogorjuniorfs.com
```
Restart backend Node.js app di hPanel.

### 404 on Page Refresh
Frontend adalah SPA (Single Page App), perlu rewrite rules.

**Create `.htaccess` di public_html:**
```apache
<IfModule mod_rewrite.c>
  RewriteEngine On
  RewriteBase /
  RewriteRule ^index\.html$ - [L]
  RewriteCond %{REQUEST_FILENAME} !-f
  RewriteCond %{REQUEST_FILENAME} !-d
  RewriteRule . /index.html [L]
</IfModule>
```

Upload `.htaccess` ke root folder `public_html/`

### API Call ke localhost
Check file `.env.production` ada dan benar.
```bash
cat .env.production
# Harus: VITE_API_URL=https://api.bogorjuniorfs.com
```

Rebuild:
```bash
npm run build
```

### Assets Not Loading
Check path di `vite.config.js`:
```javascript
export default defineConfig({
  base: '/', // untuk root domain
  // atau
  base: '/subdirectory/' // jika deploy di subfolder
})
```

---

## 📦 Build Optimization

### Reduce Bundle Size:
```bash
# Analyze bundle
npm run build -- --report

# Check bundle size
du -sh dist/
```

### Enable Compression on Hostinger:
1. hPanel → **Advanced** → **Optimize Website**
2. Enable **Gzip Compression**
3. Save

---

## 🔒 Security Checklist

- [ ] Environment variables tidak ter-commit (`.env.local` in `.gitignore`)
- [ ] API URL menggunakan HTTPS (bukan HTTP)
- [ ] CORS di backend hanya allow domain frontend
- [ ] No sensitive data di frontend code
- [ ] Assets di-minify (npm run build sudah otomatis)

---

## 📊 Performance Tips

### 1. Enable Caching
Create/update `.htaccess`:
```apache
# Cache static assets
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType image/jpg "access plus 1 year"
  ExpiresByType image/jpeg "access plus 1 year"
  ExpiresByType image/png "access plus 1 year"
  ExpiresByType text/css "access plus 1 month"
  ExpiresByType application/javascript "access plus 1 month"
</IfModule>
```

### 2. Enable Compression
Already in `.htaccess`:
```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript
</IfModule>
```

### 3. Optimize Images
Before upload:
- Use WebP format when possible
- Compress images (TinyPNG, ImageOptim)
- Use appropriate sizes

---

## 📱 Mobile Testing

Test pada berbagai device:
- [ ] Desktop (Chrome, Firefox, Safari)
- [ ] Mobile (Android, iOS)
- [ ] Tablet
- [ ] Landscape & portrait orientation

---

## 🔄 CI/CD (Optional)

### Auto-deploy dengan GitHub Actions:
```yaml
# .github/workflows/deploy.yml
name: Deploy Frontend
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v2
      - uses: actions/setup-node@v2
      - run: npm install
      - run: npm run build
      - name: Deploy to Hostinger
        uses: SamKirkland/FTP-Deploy-Action@4.3.0
        with:
          server: ftp.bogorjuniorfs.com
          username: ${{ secrets.FTP_USERNAME }}
          password: ${{ secrets.FTP_PASSWORD }}
          local-dir: ./dist/
```

---

## 📞 Support

- **Hostinger**: Live Chat 24/7 di hPanel
- **Frontend Issues**: Check browser console
- **Backend Issues**: Check backend logs di Node.js App

---

## 📝 Deployment Checklist

- [ ] Backend sudah deployed dan running
- [ ] Database sudah di-import
- [ ] Backend CORS sudah diset ke `dev.bogorjuniorfs.com`
- [ ] `.env.production` frontend sudah benar
- [ ] `npm run build` berhasil tanpa error
- [ ] Folder `dist/` sudah diupload ke hPanel
- [ ] `.htaccess` sudah diupload (untuk SPA routing)
- [ ] Test login dari production URL
- [ ] Test semua fitur utama
- [ ] Test dari mobile device
- [ ] No console errors
- [ ] Performance check (loading speed)
