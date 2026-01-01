# Environment Variables Kurulumu

## Supabase Key'lerini Alma

1. Supabase Dashboard'a git: https://app.supabase.com
2. Projeni seç
3. Sol menüden **Settings** → **API** seç
4. Şu bilgileri kopyala:

### Project URL
- **Project URL**: `https://xxxxx.supabase.co` formatında
- Bu URL'yi kopyala

### API Keys
- **anon public** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` formatında (uzun JWT token)
- **service_role** key: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...` formatında (uzun JWT token)

**ÖNEMLİ**: 
- `anon public` key → `PUBLIC_SUPABASE_ANON_KEY`
- `service_role` key → `SUPABASE_SERVICE_ROLE_KEY` (gizli tutulmalı!)

## .env Dosyası Oluşturma

Proje root'unda (package.json'un yanında) `.env` dosyası oluştur:

```env
# Supabase Configuration
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Admin Panel Password
ADMIN_PASSWORD=9N2pdNAW5I'H18@;
```

## Notlar

- `.env` dosyası `.gitignore`'da olmalı (zaten var)
- Production'da environment variables kullan
- `service_role` key'i asla client-side'da kullanma
- Admin şifresini güçlü yap

## Test

1. `.env` dosyasını oluşturduktan sonra
2. Development server'ı yeniden başlat: `npm run dev`
3. Contact form'dan test mesajı gönder
4. `/admin` sayfasına git ve mesajları kontrol et

