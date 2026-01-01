# Supabase Kurulum Rehberi

## 1. Supabase Projesi Oluşturma

1. https://supabase.com adresine git
2. "Start your project" butonuna tıkla
3. GitHub hesabınla giriş yap (ücretsiz)
4. "New Project" butonuna tıkla
5. Proje bilgilerini doldur:
   - **Name**: `efkytech-portfolio`
   - **Database Password**: Güçlü bir şifre oluştur (kaydet!)
   - **Region**: En yakın bölgeyi seç
6. "Create new project" butonuna tıkla
7. Proje oluşturulmasını bekle (2-3 dakika)

## 2. Veritabanı Tablosu Oluşturma

1. Supabase dashboard'da sol menüden **"SQL Editor"** seç
2. Aşağıdaki SQL kodunu yapıştır ve **"Run"** butonuna tıkla:

```sql
-- İletişim mesajları tablosu
CREATE TABLE contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  read BOOLEAN DEFAULT FALSE
);

-- Admin kullanıcıları tablosu (basit auth için)
CREATE TABLE admin_users (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username VARCHAR(100) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler (performans için)
CREATE INDEX idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX idx_contact_messages_read ON contact_messages(read);
```

3. Tablolar oluşturulduğunu kontrol et (sol menüden "Table Editor")

## 3. API Keys Alma

1. Sol menüden **"Settings"** → **"API"** seç
2. Şu bilgileri kopyala:
   - **Project URL**: `https://xxxxx.supabase.co`
   - **anon public key**: `eyJhbGc...` (uzun bir key)

## 4. Environment Variables Ekleme

Proje root'unda `.env` dosyası oluştur (eğer yoksa):

```env
PUBLIC_SUPABASE_URL=https://xxxxx.supabase.co
PUBLIC_SUPABASE_ANON_KEY=eyJhbGc...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGc... (opsiyonel, admin işlemleri için)
ADMIN_PASSWORD=your_secure_password_here
```

**ÖNEMLİ**: 
- `.env` dosyasını `.gitignore`'a ekle
- Bu bilgileri kimseyle paylaşma
- Production'da environment variables kullan

## 5. Admin Kullanıcı Oluşturma

SQL Editor'de şu kodu çalıştır (şifreyi değiştir):

```sql
-- Basit şifre hash'i (production'da daha güvenli yöntem kullan)
-- Şifre: admin123 (değiştir!)
INSERT INTO admin_users (username, password_hash) 
VALUES ('admin', 'admin123');
```

**NOT**: Production'da daha güvenli bir hash yöntemi kullanılmalı (bcrypt, argon2, etc.)

## 6. Row Level Security (RLS) Ayarları

SQL Editor'de:

```sql
-- Contact messages için RLS
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

-- Herkes mesaj ekleyebilir
CREATE POLICY "Anyone can insert messages"
ON contact_messages FOR INSERT
TO anon
WITH CHECK (true);

-- Admin kullanıcılar okuyabilir (service role key ile)
-- Bu kısım API routes'da kontrol edilecek
```

## Sonraki Adımlar

1. `.env` dosyasını oluştur ve API keys'leri ekle
2. `src/lib/supabase.ts` dosyası otomatik oluşturulacak
3. API routes hazır olacak
4. Admin paneli çalışacak

