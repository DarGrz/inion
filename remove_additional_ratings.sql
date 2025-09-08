-- Usunięcie dodatkowych ocen z tabeli reviews
-- Zostanie tylko główna ocena (rating)

ALTER TABLE reviews 
  DROP COLUMN IF EXISTS work_life_balance,
  DROP COLUMN IF EXISTS salary_rating,
  DROP COLUMN IF EXISTS management_rating,
  DROP COLUMN IF EXISTS career_development;

-- Sprawdź czy kolumny zostały usunięte
SELECT column_name 
FROM information_schema.columns 
WHERE table_name = 'reviews' 
  AND table_schema = 'public'
ORDER BY ordinal_position;
