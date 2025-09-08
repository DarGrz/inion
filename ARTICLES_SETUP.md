# Instrukcje wdrożenia systemu artykułów

## 1. Wykonanie migracji bazy danych

1. Zaloguj się do Supabase Dashboard
2. Przejdź do zakładki "SQL Editor"
3. Wykonaj zawartość pliku `articles_schema.sql`:
   ```sql
   -- Skopiuj i wykonaj całą zawartość pliku articles_schema.sql
   ```

## 2. Konfiguracja RLS (Row Level Security)

Po wykonaniu migracji, skonfiguruj dodatkowe polityki RLS dla adminów:

```sql
-- Polityki dla adminów (dodaj po utworzeniu tabeli admin_users lub podobnej)
CREATE POLICY "Admins can manage articles" ON articles
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM admin_users WHERE active = true
    ));

CREATE POLICY "Admins can manage categories" ON article_categories
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM admin_users WHERE active = true
    ));

CREATE POLICY "Admins can manage category relations" ON article_category_relations
    FOR ALL USING (auth.uid() IN (
        SELECT user_id FROM admin_users WHERE active = true
    ));
```

## 3. Konfiguracja obrazów

Jeśli chcesz używać obrazów w artykułach:

1. W Supabase utwórz bucket do przechowywania obrazów:
   ```sql
   INSERT INTO storage.buckets (id, name, public) VALUES ('articles', 'articles', true);
   ```

2. Skonfiguruj polityki dostępu:
   ```sql
   CREATE POLICY "Public can view article images" ON storage.objects
   FOR SELECT USING (bucket_id = 'articles');

   CREATE POLICY "Admins can upload article images" ON storage.objects
   FOR INSERT WITH CHECK (bucket_id = 'articles' AND auth.uid() IN (
       SELECT user_id FROM admin_users WHERE active = true
   ));
   ```

## 4. Przykładowe dane testowe

Po skonfigurowaniu bazy, możesz dodać przykładowe artykuły:

```sql
-- Dodanie przykładowych kategorii
INSERT INTO article_categories (name, slug, description) VALUES
('Rynek pracy', 'rynek-pracy', 'Artykuły o trendach na rynku pracy'),
('Prawo pracy', 'prawo-pracy', 'Informacje o prawach pracowniczych'),
('Rozwój kariery', 'rozwoj-kariery', 'Porady dotyczące rozwoju zawodowego');

-- Dodanie przykładowego artykułu
INSERT INTO articles (
    slug, 
    title, 
    excerpt, 
    content, 
    author_name, 
    status, 
    published_at
) VALUES (
    'jak-szukac-pracy-w-2024',
    'Jak skutecznie szukać pracy w 2024 roku',
    'Poznaj najefektywniejsze metody poszukiwania pracy w dzisiejszych czasach.',
    '<h2>Wprowadzenie</h2><p>Rynek pracy nieustannie się zmienia...</p>',
    'Redakcja oipinion.com',
    'published',
    NOW()
);
```

## 5. Funkcje do rozwijania

### Edytor artykułów
- Dodaj edytor WYSIWYG (np. TinyMCE, Quill)
- Możliwość dodawania obrazów przez drag & drop
- Podgląd artykułu przed publikacją

### SEO i Analytics
- Automatyczne generowanie meta tagów
- Sitemap dla artykułów
- Analytics - tracking wyświetleń

### Komentarze i interakcje
- System komentarzy pod artykułami
- Możliwość oceniania artykułów
- Udostępnianie w social media

## 6. Przykładowe wykorzystanie w kodzie

```typescript
// Pobieranie artykułów w komponencie
import { getPublishedArticles } from '@/lib/articles'

const articles = await getPublishedArticles(10, 0)

// Wyszukiwanie artykułów
import { searchArticles } from '@/lib/articles'

const results = await searchArticles('rynek pracy', 5)

// Pobieranie pojedynczego artykułu
import { getArticleBySlug } from '@/lib/articles'

const article = await getArticleBySlug('jak-szukac-pracy-w-2024')
```

## 7. Dostępne endpointy API

- `GET /api/articles` - lista artykułów (z możliwością wyszukiwania)
- `GET /api/articles?q=query` - wyszukiwanie artykułów
- `GET /api/articles?limit=10&offset=0` - paginacja

## 8. Struktura URL

- `/artykuly` - lista wszystkich artykułów
- `/artykuly/[slug]` - pojedynczy artykuł
- `/artykuly/kategoria/[slug]` - artykuły z kategorii (do zaimplementowania)
- `/admin/articles` - zarządzanie artykułami (admin)

## 9. Klasy CSS do dodania

Jeśli używasz Tailwind CSS, dodaj te klasy do pliku CSS:

```css
/* Klasy dla treści artykułów */
.prose {
  /* Style dla treści artykułów w formacie HTML */
}

.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.line-clamp-3 {
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
```
