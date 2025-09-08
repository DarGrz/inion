-- Tabela artykułów dla systemu opinii
-- Dodać do Supabase SQL Editor

CREATE TABLE IF NOT EXISTS articles (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    slug VARCHAR(255) UNIQUE NOT NULL,
    title VARCHAR(500) NOT NULL,
    excerpt TEXT, -- Krótki opis dla list i SEO
    content TEXT NOT NULL, -- Treść w markdown lub HTML
    
    -- Meta
    meta_title VARCHAR(255), -- SEO title
    meta_description TEXT, -- SEO description
    featured_image TEXT, -- URL do głównego obrazu
    
    -- Autor i daty
    author_name VARCHAR(255) NOT NULL,
    author_email VARCHAR(255),
    
    -- Status i publikacja
    status VARCHAR(20) DEFAULT 'draft' CHECK (status IN ('draft', 'published', 'archived')),
    published_at TIMESTAMP WITH TIME ZONE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    -- SEO i sortowanie
    view_count INTEGER DEFAULT 0,
    sort_order INTEGER DEFAULT 0,
    
    -- Constraints
    CONSTRAINT articles_slug_check CHECK (slug ~ '^[a-z0-9-]+$')
);

-- Indeksy
CREATE INDEX IF NOT EXISTS idx_articles_slug ON articles(slug);
CREATE INDEX IF NOT EXISTS idx_articles_status ON articles(status);
CREATE INDEX IF NOT EXISTS idx_articles_published_at ON articles(published_at DESC);
CREATE INDEX IF NOT EXISTS idx_articles_sort_order ON articles(sort_order, published_at DESC);

-- Tabela kategorii artykułów (opcjonalna)
CREATE TABLE IF NOT EXISTS article_categories (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Tabela łącząca artykuły z kategoriami (many-to-many)
CREATE TABLE IF NOT EXISTS article_category_relations (
    id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
    article_id UUID NOT NULL REFERENCES articles(id) ON DELETE CASCADE,
    category_id UUID NOT NULL REFERENCES article_categories(id) ON DELETE CASCADE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    
    UNIQUE(article_id, category_id)
);

-- RLS (Row Level Security) - tylko admini mogą edytować
ALTER TABLE articles ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE article_category_relations ENABLE ROW LEVEL SECURITY;

-- Polityki RLS - publiczny dostęp do czytania opublikowanych artykułów
CREATE POLICY "Public can read published articles" ON articles
    FOR SELECT USING (status = 'published');

CREATE POLICY "Public can read categories" ON article_categories
    FOR SELECT USING (true);

CREATE POLICY "Public can read category relations" ON article_category_relations
    FOR SELECT USING (true);

-- Funkcja do aktualizacji updated_at
CREATE OR REPLACE FUNCTION update_articles_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger do automatycznej aktualizacji updated_at
CREATE TRIGGER trigger_articles_updated_at
    BEFORE UPDATE ON articles
    FOR EACH ROW
    EXECUTE FUNCTION update_articles_updated_at();

-- Funkcja do zwiększania licznika wyświetleń artykułu
CREATE OR REPLACE FUNCTION increment_article_view_count(article_id UUID)
RETURNS void AS $$
BEGIN
    UPDATE articles 
    SET view_count = view_count + 1 
    WHERE id = article_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
