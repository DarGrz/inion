import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { 
  getEmployerBySlug, 
  getPublishedReviews, 
  getEmployerAggregate 
} from '@/lib/database'
import { EmployerJsonLd, ReviewsJsonLd } from '@/lib/jsonld'
import { AddReviewForm } from './AddReviewForm'
import { ReviewCard } from './ReviewCard'
import { StarRating } from './StarRating'
import { RatingDistribution } from './RatingDistribution'
import { ScrollToReviewFormButton } from './ScrollToReviewFormButton'

interface PageProps {
  params: { slug: string }
  searchParams: { page?: string }
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://oipinion.com'

export async function generateMetadata({ params }: PageProps): Promise<Metadata> {
  const { slug } = await params
  const employer = await getEmployerBySlug(slug)
  
  if (!employer) {
    return {
      title: 'Pracodawca nie znaleziony - Oipinion.com',
      description: 'Pracodawca o podanym identyfikatorze nie został znaleziony.'
    }
  }

  const title = `Opinie o ${employer.name} - Oipinion.com`
  const description = employer.review_count > 0 
    ? `Sprawdź ${employer.review_count} opinii o ${employer.name}. Średnia ocena: ${employer.avg_rating.toFixed(1)}/5. Przeczytaj recenzje pracowników i podziel się swoim doświadczeniem.`
    : `Opinie o ${employer.name}. Bądź pierwszy - dodaj swoją opinię o tej firmie.`

  return {
    title,
    description,
    keywords: [
      `opinie ${employer.name}`,
      `recenzje ${employer.name}`,
      employer.nip ? `NIP ${employer.nip}` : '',
      employer.city || '',
      'opinie o firmie',
      'recenzje pracodawcy'
    ].filter(Boolean).join(', '),
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/pracodawca/${employer.slug}`,
      siteName: 'Oipinion.com',
      type: 'website',
      locale: 'pl_PL'
    },
    twitter: {
      card: 'summary',
      title,
      description
    },
    alternates: {
      canonical: `${BASE_URL}/pracodawca/${employer.slug}`
    }
  }
}

export default async function EmployerPage({ params, searchParams }: PageProps) {
  const { slug } = await params
  const { page: pageParam } = await searchParams
  
  const employer = await getEmployerBySlug(slug)
  
  if (!employer) {
    notFound()
  }

  const page = parseInt(pageParam || '1')
  const limit = 20
  const offset = (page - 1) * limit

  const [reviews, aggregate] = await Promise.all([
    getPublishedReviews(employer.id, limit, offset),
    getEmployerAggregate(employer.id)
  ])

  const hasMoreReviews = reviews.length === limit

  return (
    <>
      {/* JSON-LD dla Schema.org */}
      <EmployerJsonLd employer={employer} baseUrl={BASE_URL} />
      {reviews.length > 0 && (
        <ReviewsJsonLd 
          reviews={reviews} 
          employerSlug={employer.slug} 
          baseUrl={BASE_URL} 
        />
      )}

      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-gray-500">
              <Link href="/" className="hover:text-red-600">
                Strona główna
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">{employer.name}</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Główna treść */}
            <div className="lg:col-span-2 space-y-6">
              {/* Header firmy */}
              <div className="bg-white rounded-lg p-6 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h1 className="text-3xl font-bold text-gray-900 mb-2">
                      {employer.name}
                    </h1>
                    
                    {employer.description && (
                      <p className="text-gray-600 mb-4">{employer.description}</p>
                    )}

                    <div className="flex flex-wrap gap-4 text-sm text-gray-500">
                      {employer.city && (
                        <span className="flex items-center">
                          <i className="fas fa-map-marker-alt mr-1"></i>
                          {employer.city}
                        </span>
                      )}
                      {employer.nip && (
                        <span className="flex items-center">
                          <i className="fas fa-building mr-1"></i>
                          NIP: {employer.nip}
                        </span>
                      )}
                      {(employer.phone1 || employer.phone2 || employer.phone3) && (
                        <div className="flex flex-wrap gap-2">
                          {employer.phone1 && (
                            <a 
                              href={`tel:${employer.phone1}`}
                              className="flex items-center text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-phone mr-1"></i>
                              {employer.phone1}
                            </a>
                          )}
                          {employer.phone2 && (
                            <a 
                              href={`tel:${employer.phone2}`}
                              className="flex items-center text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-phone mr-1"></i>
                              {employer.phone2}
                            </a>
                          )}
                          {employer.phone3 && (
                            <a 
                              href={`tel:${employer.phone3}`}
                              className="flex items-center text-red-600 hover:text-red-700"
                            >
                              <i className="fas fa-phone mr-1"></i>
                              {employer.phone3}
                            </a>
                          )}
                        </div>
                      )}
                      {employer.url && (
                        <a 
                          href={employer.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center text-red-600 hover:text-red-700"
                        >
                          <i className="fas fa-external-link-alt mr-1"></i>
                          Strona firmy
                        </a>
                      )}
                    </div>
                  </div>

                  {employer.logo && (
                    <Image 
                      src={employer.logo} 
                      alt={`Logo ${employer.name}`}
                      width={64}
                      height={64}
                      className="object-contain"
                    />
                  )}
                </div>
              </div>

              {/* Statystyki opinii */}
              {employer.review_count > 0 && (
                <div className="bg-white rounded-lg p-6 shadow-sm">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h2 className="text-xl font-semibold mb-4">Ocena ogólna</h2>
                      <div className="flex items-center gap-4">
                        <div className="text-4xl font-bold text-red-600">
                          {employer.avg_rating.toFixed(1)}
                        </div>
                        <div>
                          <StarRating rating={employer.avg_rating} size="lg" />
                          <p className="text-sm text-gray-500 mt-1">
                            {employer.review_count} {employer.review_count === 1 ? 'opinia' : 'opinii'}
                          </p>
                        </div>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-3">Rozkład ocen</h3>
                      <RatingDistribution 
                        distribution={aggregate.rating_distribution}
                        totalReviews={employer.review_count}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Lista opinii */}
              <div className="bg-white rounded-lg shadow-sm">
                <div className="p-6 border-b">
                  <div className="flex items-center justify-between">
                    <h2 className="text-xl font-semibold">
                      Opinie ({employer.review_count})
                    </h2>
                    <ScrollToReviewFormButton
                      className="bg-red-600  text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                      employer={employer}
                    >
                      Dodaj opinię
                    </ScrollToReviewFormButton>
                  </div>
                </div>

                <div className="divide-y">
                  {reviews.length === 0 ? (
                    <div className="p-8 text-center">
                      <i className="fas fa-comment-slash text-4xl text-gray-300 mb-4"></i>
                      <p className="text-gray-500 mb-4">
                        Brak opinii o tej firmie
                      </p>
                      <p className="text-sm text-gray-400">
                        Bądź pierwszy - podziel się swoim doświadczeniem!
                      </p>
                    </div>
                  ) : (
                    reviews.map((review) => (
                      <ReviewCard 
                        key={review.id} 
                        review={review} 
                      />
                    ))
                  )}
                </div>

                {/* Paginacja */}
                {hasMoreReviews && (
                  <div className="p-6 border-t text-center">
                    <Link
                      href={`/pracodawca/${employer.slug}?page=${page + 1}`}
                      className="bg-gray-100 text-gray-700 px-6 py-2 rounded-md hover:bg-gray-200 transition-colors"
                    >
                      Załaduj więcej opinii
                    </Link>
                  </div>
                )}
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <div className="sticky top-4">
                <AddReviewForm 
                  employer={employer}
                  id="add-review-form"
                />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
