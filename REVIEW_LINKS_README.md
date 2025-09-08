# System linkowania do opinii

Ten system pozwala na generowanie linków, które po kliknięciu automatycznie otwierają modal do dodawania opinii dla konkretnej firmy.

## Jak to działa

1. **URL z parametrem**: Gdy użytkownik odwiedzi stronę firmy z parametrem `?add-review=true`, automatycznie otworzy się modal do dodawania opinii
2. **Obsługa URL**: Komponent `EmployerPageClient` obsługuje parametry URL i zarządza stanem modalu
3. **Czyszczenie URL**: Po zamknięciu modalu parametr jest usuwany z URL bez przeładowania strony

## Przykłady użycia

### 1. Bezpośredni link
```
https://oipinion.com/nazwa-firmy?add-review=true
```

### 2. Komponent AddReviewButton (na stronie firmy)
```tsx
import { AddReviewButton } from './AddReviewButton'

<AddReviewButton
  employer={employer}
  variant="primary"
  className="custom-class"
>
  Dodaj opinię
</AddReviewButton>
```

### 3. QuickAddReviewButton (uniwersalny)
```tsx
import { QuickAddReviewButton } from '@/app/components/QuickAddReviewButton'

<QuickAddReviewButton
  employerSlug="nazwa-firmy"
  employerName="Nazwa Firmy Sp. z o.o."
  variant="outline"
  size="sm"
>
  Oceń firmę
</QuickAddReviewButton>
```

### 4. Prosty link
```tsx
import { QuickAddReviewLink } from '@/app/components/QuickAddReviewButton'

<QuickAddReviewLink
  employerSlug="nazwa-firmy"
  employerName="Nazwa Firmy"
  className="text-blue-600 hover:underline"
>
  Kliknij aby dodać opinię
</QuickAddReviewLink>
```

## Właściwości komponentów

### AddReviewButton
- `employer` - obiekt pracodawcy (typ: Employer)
- `className` - dodatkowe klasy CSS
- `children` - zawartość przycisku
- `variant` - 'primary' | 'secondary' | 'outline'

### QuickAddReviewButton
- `employerSlug` - slug firmy (string)
- `employerName` - nazwa firmy (string)
- `className` - dodatkowe klasy CSS
- `children` - zawartość przycisku
- `variant` - 'primary' | 'secondary' | 'outline' | 'minimal'
- `size` - 'sm' | 'md' | 'lg'

### QuickAddReviewLink
- `employerSlug` - slug firmy (string)
- `employerName` - nazwa firmy (string)
- `className` - dodatkowe klasy CSS
- `children` - zawartość linku

## Implementacja

### Pliki kluczowe:
1. `app/[slug]/EmployerPageClient.tsx` - obsługuje parametry URL i modal
2. `app/[slug]/AddReviewButton.tsx` - komponenty dla strony firmy
3. `app/components/QuickAddReviewButton.tsx` - uniwersalne komponenty
4. `app/[slug]/ReviewModal.tsx` - modal do dodawania opinii

### Funkcjonalności:
- ✅ Automatyczne otwieranie modalu na podstawie URL
- ✅ Czyszczenie URL po zamknięciu modalu
- ✅ Obsługa scroll: false dla płynnego UX
- ✅ Dostępne warianty stylowania
- ✅ Responsywne rozmiary
- ✅ Ikony Font Awesome

## Przykłady zastosowań

1. **Lista wyników wyszukiwania** - każda firma może mieć przycisk "Dodaj opinię"
2. **Strona główna** - polecane firmy z szybkim dostępem do opinii
3. **Newsletter/Email** - linki które kierują od razu do formularza opinii
4. **Media społecznościowe** - udostępnianie linków z gotowym formularzem
5. **Porównywarka firm** - szybkie dodawanie opinii podczas porównywania

Wszystkie linki są SEO-friendly i działają również z wyłączonym JavaScript (przekierują na stronę firmy).
