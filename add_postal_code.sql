-- Dodanie pola postal_code do tabeli employers
-- Wykonaj w Supabase SQL Editor

-- Dodaj kolumnę postal_code
ALTER TABLE employers 
ADD COLUMN postal_code VARCHAR(10);

-- Dodaj constraint dla polskiego kodu pocztowego (XX-XXX)
ALTER TABLE employers 
ADD CONSTRAINT employers_postal_code_check 
CHECK (postal_code IS NULL OR postal_code ~ '^[0-9]{2}-[0-9]{3}$');

-- Dodaj indeks dla szybszego wyszukiwania po kodzie pocztowym
CREATE INDEX IF NOT EXISTS idx_employers_postal_code ON employers(postal_code);

-- Dodaj komentarz
COMMENT ON COLUMN employers.postal_code IS 'Kod pocztowy w formacie XX-XXX';

SELECT 'Dodano pole postal_code do tabeli employers' as status;
