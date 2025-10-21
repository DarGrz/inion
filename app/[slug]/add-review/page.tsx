import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEmployerBySlug } from '@/lib/database'
import { AddReviewPageForm } from './AddReviewPageForm'
import Link from 'next/link'

interface AddReviewPageProps {
  params: { slug: string }
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://oipinion.pl'

export async function generateMetadata({ params }: AddReviewPageProps): Promise<Metadata> {
  const { slug } = await params
  const employer = await getEmployerBySlug(slug)
  
  if (!employer) {
    return {
      title: 'Pracodawca nie znaleziony - oipinion.pl',
      description: 'Pracodawca o podanym identyfikatorze nie został znaleziony.'
    }
  }

  const title = `Dodaj opinię o ${employer.name} - oipinion.pl`
  const description = `Podziel się swoim doświadczeniem pracy w ${employer.name}. Twoja opinia pomoże innym w podjęciu decyzji zawodowej.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${employer.slug}/add-review`,
      siteName: 'oipinion.pl',
      type: 'website'
    },
    robots: {
      index: false, // Nie indeksuj stron dodawania opinii
      follow: true
    }
  }
}

export default async function AddReviewPage({ params }: AddReviewPageProps) {
  const { slug } = await params
  const employer = await getEmployerBySlug(slug)
  
  if (!employer) {
    notFound()
  }

  // Sprawdź czy firma ma włączone przyjmowanie opinii
  // if (!employer.reviews_status) {
  //   return (
  //     <div className="min-h-screen bg-gray-50 flex items-center justify-center">
  //       <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
  //         <div className="mb-6">
  //           <i className="fas fa-lock text-4xl text-gray-400"></i>
  //         </div>
  //         <h1 className="text-xl font-semibold text-gray-900 mb-4">
  //           Opinie wyłączone
  //         </h1>
  //         <p className="text-gray-600 mb-6">
  //           Dodawanie opinii dla firmy <strong>{employer.name}</strong> jest obecnie wyłączone.
  //         </p>
  //         <div className="space-y-3">
  //           <Link
  //             href={`/${employer.slug}`}
  //             className="block w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
  //           >
  //             Wróć do strony firmy
  //           </Link>
  //           <Link
  //             href="/"
  //             className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
  //           >
  //             Strona główna
  //           </Link>
  //         </div>
  //       </div>
  //     </div>
  //   )
  // }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumbs */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <nav className="text-sm text-gray-500">
            <Link href="/" className="hover:text-gray-900 transition-colors">
              Strona główna
            </Link>
            <span className="mx-2">/</span>
            <Link href={`/${employer.slug}`} className="hover:text-gray-900 transition-colors">
              {employer.name}
            </Link>
            <span className="mx-2">/</span>
            <span className="text-gray-900">Dodaj opinię</span>
          </nav>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-3">
              Dodaj opinię o {employer.name}
            </h1>
            <p className="text-gray-600 text-lg max-w-2xl mx-auto">
              Podziel się swoją opinią i pomóż innym w podjęciu decyzji.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            {/* Formularz */}
            <div className="lg:col-span-2">
              <div className="bg-white rounded-xl p-6 md:p-8 shadow-sm border border-gray-200">
                <AddReviewPageForm employer={employer} />
              </div>
            </div>

            {/* Sidebar z informacjami o firmie */}
            <div className="lg:col-span-1">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 sticky top-8">
                <h2 className="text-lg font-semibold mb-4 text-gray-900">Informacje o firmie</h2>
                <div className="space-y-3 text-sm">
                  <div>
                    <span className="font-medium text-gray-900">Nazwa:</span>
                    <div className="text-gray-700 mt-1">{employer.name}</div>
                  </div>
                  
                  {employer.description && (
                    <div>
                      <span className="font-medium text-gray-900">Opis:</span>
                      <div className="text-gray-700 mt-1">{employer.description}</div>
                    </div>
                  )}
                  
                  {(employer.address || employer.city) && (
                    <div>
                      <span className="font-medium text-gray-900">Adres:</span>
                      <div className="text-gray-700 mt-1">
                        {[employer.address, employer.postal_code, employer.city].filter(Boolean).join(', ')}
                      </div>
                    </div>
                  )}
                  
                  {employer.nip && (
                    <div>
                      <span className="font-medium text-gray-900">NIP:</span>
                      <div className="text-gray-700 mt-1">{employer.nip}</div>
                    </div>
                  )}
                </div>

                <div className="mt-6 pt-4 border-t border-gray-100">
                  <Link
                    href={`/${employer.slug}`}
                    className="inline-flex items-center text-gray-600 hover:text-gray-900 transition-colors text-sm font-medium"
                  >
                    <i className="fas fa-arrow-left mr-2"></i>
                    Wróć do strony firmy
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
