-- Dodanie kolumny reviews_status do tabeli employers
-- Ta kolumna kontroluje czy dodawanie opinii jest włączone dla danego pracodawcy

ALTER TABLE employers 
ADD COLUMN reviews_status BOOLEAN DEFAULT true;

-- Komentarz dla kolumny
COMMENT ON COLUMN employers.reviews_status IS 'Określa czy dodawanie opinii jest włączone dla tego pracodawcy (true = włączone, false = wyłączone)';

-- Indeks dla szybszego wyszukiwania
CREATE INDEX IF NOT EXISTS idx_employers_reviews_status ON employers(reviews_status);
