-- Dodanie polityki RLS pozwalającej na dodawanie firm do tabeli employers
-- Wykonaj to w Supabase SQL Editor

-- Dodaj politykę INSERT dla tabeli employers
CREATE POLICY "Allow insert employers" ON employers
    FOR INSERT WITH CHECK (true);

-- Opcjonalnie można też dodać polityki UPDATE i DELETE gdybyś chciał zarządzać firmami z poziomu panelu admina:
CREATE POLICY "Allow update employers" ON employers
    FOR UPDATE USING (true);

CREATE POLICY "Allow delete employers" ON employers
    FOR DELETE USING (true);
