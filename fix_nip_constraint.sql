-- Usunięcie ograniczenia UNIQUE z pola NIP
-- Pozwoli na dodawanie wielu oddziałów tej samej firmy o tym samym NIP-ie
-- Wykonaj w Supabase SQL Editor

-- 1. Usuń constraint UNIQUE z pola NIP
ALTER TABLE employers DROP CONSTRAINT IF EXISTS employers_nip_key;

-- 2. Opcjonalnie: można dodać indeks (bez UNIQUE) dla szybszego wyszukiwania po NIP
CREATE INDEX IF NOT EXISTS idx_employers_nip ON employers(nip);

-- 3. Sprawdź czy constraint został usunięty
SELECT 
    conname as constraint_name,
    contype as constraint_type
FROM pg_constraint 
WHERE conrelid = 'employers'::regclass 
AND contype = 'u';

SELECT 'Constraint UNIQUE usunięty z pola NIP. Teraz można dodawać wiele firm z tym samym NIP-em.' as status;
