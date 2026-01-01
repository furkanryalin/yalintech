-- comments tablosunu oluşturur
-- Eğer gen_random_uuid() yoksa önce pgcrypto eklentisini aktif et
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Yorumlar tablosu
CREATE TABLE IF NOT EXISTS comments (
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
CREATE INDEX IF NOT EXISTS idx_comments_approved ON comments(approved);
CREATE INDEX IF NOT EXISTS idx_comments_created_at ON comments(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_comments_user_id ON comments(user_id);

-- RLS (Row Level Security) Policies
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- Herkes onaylanmış yorumları okuyabilir
DROP POLICY IF EXISTS "Anyone can view approved comments" ON comments;
CREATE POLICY "Anyone can view approved comments"
ON comments FOR SELECT
TO anon, authenticated
USING (approved = true);

-- Authenticated kullanıcılar yorum ekleyebilir
DROP POLICY IF EXISTS "Authenticated users can insert comments" ON comments;
CREATE POLICY "Authenticated users can insert comments"
ON comments FOR INSERT
TO authenticated
WITH CHECK (true);

-- Kullanıcılar kendi yorumlarını güncelleyebilir (opsiyonel)
DROP POLICY IF EXISTS "Users can update own comments" ON comments;
CREATE POLICY "Users can update own comments"
ON comments FOR UPDATE
TO authenticated
USING (auth.uid() = user_id)
WITH CHECK (auth.uid() = user_id);

-- Service role tüm yorumları yönetebilir (admin paneli için)
-- (Service role key ile istek yapılırken bu yetki otomatik olur)