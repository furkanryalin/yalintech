# Yorum Sistemi Kurulum Rehberi

## 1. Veritabanı Tablosu Oluşturma

Supabase Dashboard'da **SQL Editor**'a git ve şu SQL kodunu çalıştır:

```sql
-- Yorumlar tablosu
CREATE TABLE comments (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  comment TEXT NOT NULL,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  approved BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Index'ler (performans için)
CREATE INDEX idx_comments_approved ON comments(approved);
CREATE INDEX idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX idx_comments_user_id ON comments(user_id);

-- RLS (Row Level Security) Policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Herkes onaylanmış yorumları okuyabilir
CREATE POLICY "Anyone can view approved comments"
ON comments FOR SELECT
TO anon, authenticated
USING (approved = true);

-- Authenticated kullanıcılar yorum ekleyebilir
CREATE POLICY "Authenticated users can insert comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Kullanıcılar kendi yorumlarını güncelleyebilir (opsiyonel)
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role tüm yorumları yönetebilir (admin paneli için)
-- Bu policy API routes'da service role key ile otomatik olur
```

## 2. Supabase Auth Ayarları

1. Supabase Dashboard → **Authentication** → **Providers**
2. **Email** provider'ı aktif et (zaten aktif olmalı)
3. **Settings** → Email templates'i özelleştirebilirsin (opsiyonel)

## 3. Email Doğrulama (Opsiyonel)

Eğer email doğrulaması istiyorsan:
1. **Authentication** → **Settings**
2. **Enable email confirmations** seçeneğini aç/kapat

Önerilen: Development için kapalı, production için açık.

## 4. Test

1. Yorum formunu kullanarak test yap
2. Admin panelinde yorumları kontrol et
3. Yorumları onayla/görüntüle

## Notlar

- `user_id` authenticated kullanıcılar için, guest yorumlar için NULL olabilir
- `approved` false olan yorumlar sadece admin panelinde görünür
- RLS policies sayesinde güvenlik sağlanır

