import { Employer, Review } from './supabase'

export interface JsonLdOrganization {
  '@context': 'https://schema.org'
  '@type': 'Organization' | 'LocalBusiness'
  '@id': string
  name: string
  url?: string
  logo?: string
  address?: {
    '@type': 'PostalAddress'
    streetAddress?: string
    addressLocality?: string
    addressCountry: string
  }
  taxID?: string
  aggregateRating?: {
    '@type': 'AggregateRating'
    ratingValue: string
    reviewCount: number
    bestRating: number
    worstRating: number
  }
}

export interface JsonLdReview {
  '@context': 'https://schema.org'
  '@type': 'Review'
  '@id': string
  itemReviewed: {
    '@type': 'Organization'
    '@id': string
  }
  author: {
    '@type': 'Person'
    name: string
  }
  reviewBody: string
  name?: string
  datePublished: string
  reviewRating: {
    '@type': 'Rating'
    ratingValue: number
    bestRating: number
    worstRating: number
  }
}

/**
 * Generuje JSON-LD dla organizacji/pracodawcy
 */
export function generateEmployerJsonLd(params: {
  employer: Employer
  baseUrl: string
}): JsonLdOrganization {
  const { employer, baseUrl } = params
  const employerUrl = `${baseUrl}/pracodawca/${employer.slug}`

  const jsonLd: JsonLdOrganization = {
    '@context': 'https://schema.org',
    '@type': employer.city ? 'LocalBusiness' : 'Organization',
    '@id': `${employerUrl}#org`,
    name: employer.name,
  }

  // URL firmy (własna strona lub nasza strona pracodawcy)
  if (employer.url) {
    jsonLd.url = employer.url
  }

  // Logo
  if (employer.logo) {
    jsonLd.logo = employer.logo
  }

  // Adres
  if (employer.address || employer.city) {
    jsonLd.address = {
      '@type': 'PostalAddress',
      addressCountry: 'PL'
    }
    
    if (employer.address) {
      jsonLd.address.streetAddress = employer.address
    }
    
    if (employer.city) {
      jsonLd.address.addressLocality = employer.city
    }
  }

  // NIP jako taxID
  if (employer.nip) {
    jsonLd.taxID = employer.nip
  }

  // Agregowana ocena
  if (employer.review_count > 0) {
    jsonLd.aggregateRating = {
      '@type': 'AggregateRating',
      ratingValue: employer.avg_rating.toFixed(2),
      reviewCount: employer.review_count,
      bestRating: 5,
      worstRating: 1
    }
  }

  return jsonLd
}

/**
 * Generuje JSON-LD dla pojedynczej opinii
 */
export function generateReviewJsonLd(params: {
  review: Review
  employerSlug: string
  baseUrl: string
}): JsonLdReview {
  const { review, employerSlug, baseUrl } = params
  const employerUrl = `${baseUrl}/pracodawca/${employerSlug}`

  return {
    '@context': 'https://schema.org',
    '@type': 'Review',
    '@id': `${employerUrl}#review-${review.id}`,
    itemReviewed: {
      '@type': 'Organization',
      '@id': `${employerUrl}#org`
    },
    author: {
      '@type': 'Person',
      name: review.author_name
    },
    reviewBody: review.body,
    ...(review.title ? { name: review.title } : {}),
    datePublished: review.published_at || review.created_at,
    reviewRating: {
      '@type': 'Rating',
      ratingValue: review.rating,
      bestRating: 5,
      worstRating: 1
    }
  }
}

/**
 * Generuje JSON-LD dla listy opinii
 */
export function generateReviewsJsonLd(params: {
  reviews: Review[]
  employerSlug: string
  baseUrl: string
}): JsonLdReview[] {
  const { reviews, employerSlug, baseUrl } = params
  
  return reviews.map(review => 
    generateReviewJsonLd({ review, employerSlug, baseUrl })
  )
}

/**
 * Komponenty React dla JSON-LD
 */
export function JsonLdScript({ data }: { data: unknown }) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{
        __html: JSON.stringify(data)
      }}
    />
  )
}

export function EmployerJsonLd({ employer, baseUrl }: { 
  employer: Employer
  baseUrl: string 
}) {
  const jsonLd = generateEmployerJsonLd({ employer, baseUrl })
  return <JsonLdScript data={jsonLd} />
}

export function ReviewsJsonLd({ 
  reviews, 
  employerSlug, 
  baseUrl 
}: { 
  reviews: Review[]
  employerSlug: string
  baseUrl: string 
}) {
  const jsonLd = generateReviewsJsonLd({ reviews, employerSlug, baseUrl })
  
  // Jeśli jest tylko jedna opinia, wstaw jako pojedynczy obiekt
  // Jeśli więcej, wstaw jako tablicę
  const data = jsonLd.length === 1 ? jsonLd[0] : jsonLd
  
  return <JsonLdScript data={data} />
}
