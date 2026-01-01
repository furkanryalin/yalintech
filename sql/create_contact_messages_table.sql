-- contact_messages tablosunu oluşturur
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

CREATE TABLE IF NOT EXISTS contact_messages (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  email VARCHAR(255) NOT NULL,
  message TEXT NOT NULL,
  read BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_contact_messages_created_at ON contact_messages(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_messages_read ON contact_messages(read);

-- Basit policy: service_role tüm kayıtları yönetir; public okuma sınırlı olsun
ALTER TABLE contact_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Service role manage contact messages" ON contact_messages;
CREATE POLICY "Service role manage contact messages"
ON contact_messages FOR ALL
TO service_role
USING (true);

-- İsteğe bağlı: admin panelinde server-side istekler ile yönetileceği için daha fazla policy gerekmeyebilir.