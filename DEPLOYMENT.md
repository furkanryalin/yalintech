# Yalın Tech Portfolio - Ücretsiz Yayınlama Rehberi

Bu rehber, Yalın Tech portfolio sitesini **tamamen ücretsiz** bir şekilde yayınlamak için adım adım talimatlar içerir.

## 🚀 Seçenek 1: Vercel (Önerilen - En Kolay)

Vercel, Astro projeleri için en kolay ve en hızlı deployment seçeneğidir.

### Adım 1: GitHub'a Projeyi Yükle

1. **GitHub'da yeni bir repository oluştur:**
   - https://github.com/new adresine git
   - Repository adı: `yalintech-portfolio` (veya istediğin bir isim)
   - Public veya Private seç (Public ücretsiz)
   - "Initialize this repository with a README" seçeneğini işaretleme
   - "Create repository" butonuna tıkla

2. **Projeyi Git ile başlat ve GitHub'a yükle:**
   ```bash
   cd /Users/furkanyalin/Desktop/yalintechportfoy
   
   # Git'i başlat (eğer henüz başlatılmadıysa)
   git init
   
   # .gitignore dosyası oluştur (eğer yoksa)
   echo "node_modules/
   .astro/
   dist/
   .DS_Store" > .gitignore
   
   # Tüm dosyaları ekle
   git add .
   
   # İlk commit
   git commit -m "Initial commit: Yalın Tech Portfolio"
   
   # GitHub repository'yi remote olarak ekle
   git remote add origin https://github.com/KULLANICI_ADIN/yalintech-portfolio.git
   # (KULLANICI_ADIN yerine kendi GitHub kullanıcı adını yaz)
   
   # Ana branch'i main olarak ayarla
   git branch -M main
   
   # GitHub'a yükle
   git push -u origin main
   ```

### Adım 2: Vercel'e Bağla

1. **Vercel hesabı oluştur:**
   - https://vercel.com adresine git
   - "Sign Up" butonuna tıkla
   - GitHub hesabınla giriş yap (en kolay yol)

2. **Yeni proje oluştur:**
   - Vercel dashboard'da "Add New..." → "Project" seç
   - GitHub repository'ni seç (yalintech-portfolio)
   - "Import" butonuna tıkla

3. **Build ayarları (otomatik algılanır):**
   - Framework Preset: **Astro** (otomatik seçilir)
   - Build Command: `npm run build` (otomatik)
   - Output Directory: `dist` (otomatik)
   - Install Command: `npm install` (otomatik)

4. **Environment Variables (gerekirse):**
   - Şu an için gerek yok, boş bırakabilirsin

5. **Deploy:**
   - "Deploy" butonuna tıkla
   - 1-2 dakika içinde siten yayında olacak!
   - Vercel otomatik olarak bir URL verecek: `https://yalintech-portfolio.vercel.app`

### Adım 3: Custom Domain (İsteğe Bağlı)

1. Vercel dashboard'da projene git
2. "Settings" → "Domains" sekmesine git
3. Domain'ini ekle (örnek: `yalintech.com`)
4. DNS ayarlarını domain sağlayıcından yap (Vercel talimatları verir)

---

## 🌐 Seçenek 2: Netlify

### Adım 1: GitHub'a Yükle
(Yukarıdaki Adım 1'i takip et)

### Adım 2: Netlify'e Bağla

1. **Netlify hesabı oluştur:**
   - https://www.netlify.com adresine git
   - "Sign up" → GitHub ile giriş yap

2. **Yeni site oluştur:**
   - "Add new site" → "Import an existing project"
   - GitHub repository'ni seç
   - Build settings:
     - Build command: `npm run build`
     - Publish directory: `dist`
   - "Deploy site" butonuna tıkla

---

## 📦 Seçenek 3: Cloudflare Pages

### Adım 1: GitHub'a Yükle
(Yukarıdaki Adım 1'i takip et)

### Adım 2: Cloudflare Pages'e Bağla

1. **Cloudflare hesabı oluştur:**
   - https://pages.cloudflare.com adresine git
   - "Sign up" → Ücretsiz hesap oluştur

2. **Yeni proje:**
   - "Create a project" → "Connect to Git"
   - GitHub repository'ni seç
   - Build settings:
     - Framework preset: **Astro**
     - Build command: `npm run build`
     - Build output directory: `dist`
   - "Save and Deploy" butonuna tıkla

---

## 🔧 Önemli Notlar

### Build Öncesi Kontrol Listesi

1. **package.json'da build script'i olduğundan emin ol:**
   ```json
   "scripts": {
     "build": "astro build"
   }
   ```

2. **astro.config.mjs'de site URL'i kontrol et:**
   ```js
   site: 'https://efkytech.com', // Vercel/Netlify otomatik ayarlar, burayı boş bırakabilirsin
   ```

3. **Environment variables (gerekirse):**
   - Eğer API key'ler kullanıyorsan, deployment platformunda environment variables olarak ekle

### Sorun Giderme

- **Build hatası alıyorsan:**
  - Terminal'de `npm run build` komutunu çalıştır, hataları kontrol et
  - `node_modules` klasörünü sil ve `npm install` tekrar çalıştır

- **Görseller yüklenmiyorsa:**
  - Public klasöründeki dosyaların doğru yerde olduğundan emin ol
  - Build sonrası `dist` klasöründe `public` içeriğinin kopyalandığını kontrol et

---

## ✅ Hızlı Başlangıç (Vercel - Önerilen)

```bash
# 1. Git repository oluştur
cd /Users/furkanyalin/Desktop/efkyportfoy
git init
git add .
git commit -m "Initial commit"

# 2. GitHub'da repository oluştur, sonra:
git remote add origin https://github.com/KULLANICI_ADIN/efkytech-portfolio.git
git branch -M main
git push -u origin main

# 3. Vercel.com'a git, GitHub ile giriş yap
# 4. "Import Project" → Repository'ni seç → Deploy
# 5. 2 dakika içinde siten yayında! 🎉
```

---

## 📝 Sonuç

- **Vercel**: En kolay, en hızlı, Astro için optimize edilmiş ✅
- **Netlify**: İyi alternatif, kolay kurulum
- **Cloudflare Pages**: Hızlı, güvenli, ücretsiz

Hepsi tamamen ücretsiz ve sınırsız bandwidth sunuyor!

