-- Struktura bazy danych dla systemu opinii o pracodawcach
-- Wykonaj w Supabase SQL Editor

-- Tabela pracodawców
CREATE TABLE IF NOT EXISTS employers (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    name VARCHAR(500) NOT NULL,
    nip VARCHAR(20) UNIQUE NOT NULL, -- NIP wymagany i unikalny
    url TEXT,
    logo TEXT,
    address TEXT,
    city VARCHAR(255),
    description TEXT,
    
    -- Telefony (opcjonalne)
    phone1 VARCHAR(20),
    phone2 VARCHAR(20), 
    phone3 VARCHAR(20),
    
    -- Agregaty (denormalizacja dla szybkości)
    avg_rating DECIMAL(3,2) DEFAULT 0,
    review_count INTEGER DEFAULT 0,
    
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Constraints
    CONSTRAINT employers_slug_check CHECK (slug ~ '^[a-z0-9-]+$'),
    CONSTRAINT employers_rating_check CHECK (avg_rating >= 0 AND avg_rating <= 5),
    CONSTRAINT employers_nip_check CHECK (nip ~ '^[0-9]{10}$') -- NIP to 10 cyfr
);

-- Tabela opinii
CREATE TABLE IF NOT EXISTS reviews (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    employer_id UUID NOT NULL REFERENCES employers(id) ON DELETE CASCADE,
    
    -- Autor (wymagane: author_name, opcjonalne: email)
    author_name VARCHAR(255) NOT NULL, -- Wymagane
    author_email VARCHAR(255), -- Opcjonalne
    
    -- Treść opinii
    rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
    title VARCHAR(255),
    body TEXT NOT NULL,
    
    -- Szczegółowe oceny (opcjonalne)
    work_life_balance INTEGER CHECK (work_life_balance >= 1 AND work_life_balance <= 5),
    salary_rating INTEGER CHECK (salary_rating >= 1 AND salary_rating <= 5),
    management_rating INTEGER CHECK (management_rating >= 1 AND management_rating <= 5),
    career_development INTEGER CHECK (career_development >= 1 AND career_development <= 5),
    
    -- Status i metadane
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'rejected', 'hidden')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Anty-spam i ograniczenia
    ip_address INET NOT NULL, -- Wymagane dla kontroli
    user_agent TEXT,
    
    -- Constraint: jedna opinia na IP na pracodawcę
    UNIQUE(employer_id, ip_address)
);

-- Indeksy dla tabeli reviews (tworzone osobno w PostgreSQL)
CREATE INDEX IF NOT EXISTS idx_reviews_employer_id ON reviews(employer_id);
CREATE INDEX IF NOT EXISTS idx_reviews_status ON reviews(status);
CREATE INDEX IF NOT EXISTS idx_reviews_published_at ON reviews(published_at);
CREATE INDEX IF NOT EXISTS idx_reviews_rating ON reviews(rating);
CREATE INDEX IF NOT EXISTS idx_reviews_ip_employer ON reviews(ip_address, employer_id);

-- Tabela głosów na opinie (pomocne/niepomocne)
CREATE TABLE IF NOT EXISTS review_votes (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    vote_type VARCHAR(10) NOT NULL CHECK (vote_type IN ('helpful', 'not_helpful')),
    ip_address INET NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- Jeden głos na IP na opinię
    UNIQUE(review_id, ip_address)
);

-- Tabela zgłoszeń opinii
CREATE TABLE IF NOT EXISTS review_reports (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    review_id UUID NOT NULL REFERENCES reviews(id) ON DELETE CASCADE,
    reason VARCHAR(50) NOT NULL CHECK (reason IN ('spam', 'fake', 'offensive', 'inappropriate', 'other')),
    description TEXT,
    reporter_email VARCHAR(255),
    ip_address INET,
    status VARCHAR(20) DEFAULT 'pending' CHECK (status IN ('pending', 'reviewed', 'dismissed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Funkcja do aktualizacji agregatów pracodawcy
CREATE OR REPLACE FUNCTION update_employer_aggregates()
RETURNS TRIGGER AS $$
BEGIN
    -- Aktualizuj agregaty dla pracodawcy
    UPDATE employers 
    SET 
        avg_rating = (
            SELECT COALESCE(AVG(rating::DECIMAL), 0)
            FROM reviews 
            WHERE employer_id = COALESCE(NEW.employer_id, OLD.employer_id) 
            AND status = 'published'
        ),
        review_count = (
            SELECT COUNT(*)
            FROM reviews 
            WHERE employer_id = COALESCE(NEW.employer_id, OLD.employer_id) 
            AND status = 'published'
        ),
        updated_at = NOW()
    WHERE id = COALESCE(NEW.employer_id, OLD.employer_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$ LANGUAGE plpgsql;

-- Triggery do automatycznej aktualizacji agregatów
CREATE OR REPLACE TRIGGER update_employer_aggregates_trigger
    AFTER INSERT OR UPDATE OR DELETE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_employer_aggregates();

-- Funkcja do automatycznej aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Triggery updated_at
CREATE OR REPLACE TRIGGER update_employers_updated_at
    BEFORE UPDATE ON employers
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

CREATE OR REPLACE TRIGGER update_reviews_updated_at
    BEFORE UPDATE ON reviews
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- RLS (Row Level Security) policies
ALTER TABLE employers ENABLE ROW LEVEL SECURITY;
ALTER TABLE reviews ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_votes ENABLE ROW LEVEL SECURITY;
ALTER TABLE review_reports ENABLE ROW LEVEL SECURITY;

-- Polityki odczytu (wszyscy mogą czytać opublikowane dane)
CREATE POLICY "Public read access for employers" ON employers
    FOR SELECT USING (true);

CREATE POLICY "Public read access for published reviews" ON reviews
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public read access for review votes" ON review_votes
    FOR SELECT USING (true);

-- Polityki zapisu (możliwość dodawania opinii)
CREATE POLICY "Allow insert reviews" ON reviews
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert review votes" ON review_votes
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow insert review reports" ON review_reports
    FOR INSERT WITH CHECK (true);

-- Przykładowe dane testowe
INSERT INTO employers (slug, name, nip, url, description, city, phone1, phone2, phone3) VALUES
('techsolutions-sp-z-o-o', 'TechSolutions Sp. z o.o.', '1234567890', 'https://techsolutions.pl', 'Firma IT specjalizująca się w tworzeniu oprogramowania', 'Warszawa', '+48 22 123 45 67', '+48 22 123 45 68', '+48 500 123 456'),
('smaki-krakowa', 'Smaki Krakowa', '0987654321', 'https://smaki-krakowa.pl', 'Restauracja serwująca tradycyjne polskie potrawy', 'Kraków', '+48 12 987 65 43', NULL, NULL),
('green-energy-solutions', 'Green Energy Solutions', '1122334455', 'https://green-energy.pl', 'Firma zajmująca się odnawialnymi źródłami energii', 'Gdańsk', '+48 58 111 22 33', '+48 58 111 22 34', '+48 600 987 654');

-- Przykładowe opinie (z wymaganymi polami)
INSERT INTO reviews (employer_id, author_name, rating, title, body, status, published_at, work_life_balance, salary_rating, management_rating, career_development, ip_address) VALUES
(
    (SELECT id FROM employers WHERE slug = 'techsolutions-sp-z-o-o'),
    'Jan Kowalski',
    4,
    'Dobra firma z perspektywami rozwoju',
    'Pracuję tu od 2 lat. Bardzo dobra atmosfera w zespole, ciekawe projekty. Zarząd wspiera rozwój pracowników. Jedynym minusem są czasem napięte terminy.',
    'published',
    NOW() - INTERVAL '2 days',
    4, 4, 4, 5,
    '192.168.1.100'::inet
),
(
    (SELECT id FROM employers WHERE slug = 'techsolutions-sp-z-o-o'),
    'Anna Nowak',
    5,
    'Świetne miejsce do pracy!',
    'Najlepsza firma w której pracowałam. Elastyczne godziny pracy, możliwość pracy zdalnej, bardzo dobre wynagrodzenie. Polecam każdemu!',
    'published',
    NOW() - INTERVAL '1 day',
    5, 5, 5, 4,
    '192.168.1.101'::inet
),
(
    (SELECT id FROM employers WHERE slug = 'smaki-krakowa'),
    'Piotr Wiśniewski',
    3,
    'Okej, ale można lepiej',
    'Praca w gastronomii nie jest łatwa. Tu atmosfera jest w porządku, ale wynagrodzenie mogłoby być lepsze. Dobre miejsce na początek kariery.',
    'published',
    NOW() - INTERVAL '3 days',
    3, 2, 3, 3,
    '192.168.1.102'::inet
),
(
    (SELECT id FROM employers WHERE slug = 'green-energy-solutions'),
    'Maria Kowalczyk',
    5,
    'Praca z przyszłością!',
    'Firma zajmująca się odnawialnymi źródłami energii to przyszłość. Świetny zespół, innowacyjne projekty i misja, która ma sens. Bardzo polecam!',
    'published',
    NOW() - INTERVAL '4 days',
    4, 4, 5, 5,
    '192.168.1.103'::inet
);
