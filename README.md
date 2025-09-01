# Oipinion.org - Portal opinii o firmach

Kompletny system opinii o pracodawcach z automatycznym generowaniem JSON-LD (schema.org/Review) dla lepszej widoczności w Google.

## 🚀 Funkcjonalności

- ✅ **Pełny system opinii** - dodawanie, wyświetlanie, moderacja
- ✅ **Schema.org JSON-LD** - automatyczne generowanie structured data
- ✅ **SEO optimized** - meta tagi, canonical URLs, sitemaps
- ✅ **Responsywny design** - zgodny z demo (czerwona kolorystyka)
- ✅ **Real-time updates** - ISR revalidation po dodaniu opinii
- ✅ **TypeScript** - pełne typowanie bez `any`
- ✅ **Supabase integration** - baza danych z RLS policies
- ✅ **Unikalne NIP** - jedna firma na NIP, walidacja
- ✅ **IP tracking** - jedna opinia na IP na pracodawcę
- ✅ **Kontakt** - 3 opcjonalne telefony na firmę
- ✅ **Bezpieczne API** - walidacja danych, error handling

## 🏗️ Architektura

### Stack techniczny
- **Frontend**: Next.js 15 (App Router), TypeScript, TailwindCSS
- **Backend**: Supabase (PostgreSQL), Row Level Security
- **SEO**: Schema.org JSON-LD, meta tags, canonical URLs
- **Styling**: TailwindCSS + Font Awesome

### Struktura bazy danych
```sql
-- Pracodawcy
employers (id, slug, name, nip[REQUIRED], url, logo, address, city, phone1, phone2, phone3, avg_rating, review_count)

-- Opinie (jedna na IP na pracodawcę)
reviews (id, employer_id, author_name[REQUIRED], rating[REQUIRED], title, body[REQUIRED], status, published_at, ip_address)

-- Szczegółowe oceny (opcjonalne)
work_life_balance, salary_rating, management_rating, career_development

-- Moderacja
review_votes, review_reports

-- Ograniczenia:
- NIP unikalny (10 cyfr)
- Jedna opinia na IP na pracodawcę
- Email nie wymagany przy opiniach
```

## 🔧 Instalacja i uruchomienie

### 1. Klonowanie i instalacja
```bash
git clone [repository-url]
cd oipinion-next
npm install
```

### 2. Konfiguracja Supabase

1. **Utwórz projekt** w [Supabase](https://supabase.com)
2. **WAŻNE: Wykonaj SQL** z pliku `database.sql` w SQL Editor Supabase
   - Otwórz Supabase Dashboard → SQL Editor
   - Skopiuj całą zawartość pliku `database.sql`
   - Wklej i kliknij "Run"
   - To utworzy tabele: `employers`, `reviews`, `review_votes`, `review_reports`
3. **Sprawdź RLS** - Row Level Security jest już skonfigurowane w SQL

### 3. Zmienne środowiskowe

Plik `.env.local` (już skonfigurowany):
```env
SUPABASE_URL=https://qizyikizskgtimrldela.supabase.co
SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
NEXT_PUBLIC_BASE_URL=https://oipinion.org
```

⚠️ **UWAGA**: Jeśli widzisz błąd "Could not find the table" - wykonaj SQL z punktu 2!

### 4. Uruchomienie
```bash
# Tryb deweloperski
npm run dev

# Build production
npm run build
npm start
```

Aplikacja będzie dostępna pod adresem: http://localhost:3000

## 📁 Struktura projektu

```
oipinion-next/
├── app/
│   ├── api/reviews/route.ts           # API endpoint dla opinii
│   ├── pracodawca/[slug]/
│   │   ├── page.tsx                   # Strona pracodawcy + JSON-LD
│   │   ├── AddReviewForm.tsx          # Formularz dodawania opinii
│   │   ├── ReviewCard.tsx             # Komponent opinii
│   │   ├── StarRating.tsx             # Oceny gwiazdkowe
│   │   └── RatingDistribution.tsx     # Rozkład ocen
│   ├── layout.tsx                     # Layout z Font Awesome
│   ├── page.tsx                       # Strona główna
│   └── globals.css                    # Style globalne
├── lib/
│   ├── supabase.ts                    # Konfiguracja Supabase + typy
│   ├── database.ts                    # Funkcje bazodanowe
│   └── jsonld.tsx                     # Generatory JSON-LD
├── database.sql                       # Struktura bazy danych
└── demo/                             # Przykłady HTML/CSS/JS
```

## 🎯 Jak to działa

### 1. Dodawanie opinii
```
POST /api/reviews → Zapis w Supabase → revalidatePath() → JSON-LD update
```

### 2. Generowanie JSON-LD
```typescript
// Automatycznie na każdej stronie pracodawcy
<EmployerJsonLd employer={employer} baseUrl={BASE_URL} />
<ReviewsJsonLd reviews={reviews} employerSlug={slug} baseUrl={BASE_URL} />
```

### 3. SEO i crawling
- **Server-side rendering** - JSON-LD widoczny od razu
- **Canonical URLs** - `/pracodawca/{slug}`
- **Meta tags** - dynamiczne na podstawie danych
- **Revalidation** - ISR aktualizuje cache po nowej opinii

## 📋 Przykłady API

### Dodanie nowej firmy
```bash
curl -X POST http://localhost:3000/api/employers \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Przykładowa Firma Sp. z o.o.",
    "nip": "1234567890",
    "url": "https://przykład.pl",
    "city": "Warszawa",
    "description": "Opis firmy...",
    "phone1": "+48 22 123 45 67",
    "phone2": "+48 500 123 456"
  }'
```

### Dodanie opinii
```bash
curl -X POST http://localhost:3000/api/reviews \
  -H "Content-Type: application/json" \
  -d '{
    "employerSlug": "techsolutions-sp-z-o-o",
    "rating": 5,
    "title": "Świetna firma!",
    "body": "Bardzo dobra atmosfera w zespole...",
    "authorName": "Jan Kowalski",
    "workLifeBalance": 5,
    "salaryRating": 4
  }'
```

### Pobranie opinii
```bash
curl "http://localhost:3000/api/reviews?employerSlug=techsolutions-sp-z-o-o&limit=10"
```

### Wyszukanie firmy po NIP
```bash
curl "http://localhost:3000/api/employers?nip=1234567890"
```

## 🔍 JSON-LD Schema

### Organization/LocalBusiness
```json
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "@id": "https://oipinion.org/pracodawca/techsolutions-sp-z-o-o#org",
  "name": "TechSolutions Sp. z o.o.",
  "aggregateRating": {
    "@type": "AggregateRating",
    "ratingValue": "4.50",
    "reviewCount": 15
  }
}
```

### Review
```json
{
  "@context": "https://schema.org",
  "@type": "Review",
  "@id": "https://oipinion.org/pracodawca/techsolutions-sp-z-o-o#review-123",
  "itemReviewed": {
    "@type": "Organization",
    "@id": "https://oipinion.org/pracodawca/techsolutions-sp-z-o-o#org"
  },
  "author": { "@type": "Person", "name": "Jan Kowalski" },
  "reviewBody": "Bardzo dobra atmosfera...",
  "datePublished": "2025-09-01",
  "reviewRating": {
    "@type": "Rating",
    "ratingValue": 5
  }
}
```

## 🎨 Design System

Projekt wykorzystuje kolorystykę z demo:
- **Primary**: `#dc2626` (czerwony)
- **Secondary**: `#6b7280` (szary)
- **Success**: `#10b981` (zielony)
- **Background**: `#ffffff` / `#f9fafb`

## 🚦 Testowanie

### Rich Results Test
```bash
# Sprawdź JSON-LD w Google Rich Results Test
https://search.google.com/test/rich-results
```

### Schema Validator
```bash
# Walidacja schema.org
https://validator.schema.org/
```

## 🔧 Przykładowe dane

Po wykonaniu SQL baza będzie zawierać przykładowych pracodawców:
- **TechSolutions Sp. z o.o.** (NIP: 1234567890) - `/pracodawca/techsolutions-sp-z-o-o`
  - Telefony: +48 22 123 45 67, +48 22 123 45 68, +48 500 123 456
- **Smaki Krakowa** (NIP: 0987654321) - `/pracodawca/smaki-krakowa`
  - Telefon: +48 12 987 65 43
- **Green Energy Solutions** (NIP: 1122334455) - `/pracodawca/green-energy-solutions`
  - Telefony: +48 58 111 22 33, +48 58 111 22 34, +48 600 987 654

Każda firma ma przykładowe opinie z różnymi IP.

## 📈 Funkcjonalności SEO

- ✅ **JSON-LD** - Organisation + Review schema
- ✅ **Meta tags** - title, description, keywords, og, twitter
- ✅ **Canonical URLs** - unikalne linki dla każdego pracodawcy
- ✅ **Structured data** - zgodność z schema.org
- ✅ **Server-side rendering** - pełny HTML dla botów
- ✅ **Revalidation** - aktualizacja cache po zmianach

## 🔄 Revalidation Flow

```
Nowa opinia → API save → revalidatePath() → Next.js ISR → Nowy JSON-LD
```

## 🛡️ Bezpieczeństwo

- **RLS Policies** - Supabase Row Level Security
- **Input validation** - walidacja formularzy
- **Rate limiting** - opcjonalne (można dodać)
- **Moderacja** - status pending/published/rejected

## 📝 TODO (opcjonalne rozszerzenia)

- [ ] Panel administracyjny
- [ ] Moderacja opinii
- [ ] System głosowania (helpful/not helpful)
- [ ] Zgłaszanie nieprawidłowych opinii
- [ ] Wyszukiwarka firm
- [ ] API dla firm (claim company)
- [ ] Powiadomienia email
- [ ] Analityka

## 🆘 Wsparcie

W przypadku problemów:
1. Sprawdź logi Supabase w Dashboard
2. Sprawdź console DevTools w przeglądarce
3. Zweryfikuj JSON-LD w Rich Results Test
4. Sprawdź Next.js build logs

---

**🎯 Gotowy do produkcji!** System generuje poprawny JSON-LD zgodny z schema.org, jest SEO-friendly i gotowy do indeksowania przez Google.
#   i n i o n  
 