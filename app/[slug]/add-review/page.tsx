import { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { getEmployerBySlug } from '@/lib/database'
import { EmployerPageClient } from '../EmployerPageClient'
import Link from 'next/link'

interface AddReviewPageProps {
  params: { slug: string }
}

const BASE_URL = process.env.NEXT_PUBLIC_BASE_URL || 'https://oipinion.com'

export async function generateMetadata({ params }: AddReviewPageProps): Promise<Metadata> {
  const { slug } = await params
  const employer = await getEmployerBySlug(slug)
  
  if (!employer) {
    return {
      title: 'Pracodawca nie znaleziony - Oipinion.com',
      description: 'Pracodawca o podanym identyfikatorze nie został znaleziony.'
    }
  }

  const title = `Dodaj opinię o ${employer.name} - Oipinion.com`
  const description = `Podziel się swoim doświadczeniem pracy w ${employer.name}. Twoja opinia pomoże innym w podjęciu decyzji zawodowej.`

  return {
    title,
    description,
    openGraph: {
      title,
      description,
      url: `${BASE_URL}/${employer.slug}/add-review`,
      siteName: 'Oipinion.com',
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
  if (!employer.reviews_status) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="max-w-md mx-auto bg-white rounded-lg shadow-lg p-8 text-center">
          <div className="mb-6">
            <i className="fas fa-lock text-4xl text-gray-400"></i>
          </div>
          <h1 className="text-xl font-semibold text-gray-900 mb-4">
            Opinie wyłączone
          </h1>
          <p className="text-gray-600 mb-6">
            Dodawanie opinii dla firmy <strong>{employer.name}</strong> jest obecnie wyłączone.
          </p>
          <div className="space-y-3">
            <Link
              href={`/${employer.slug}`}
              className="block w-full bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
            >
              Wróć do strony firmy
            </Link>
            <Link
              href="/"
              className="block w-full bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 transition-colors"
            >
              Strona główna
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <EmployerPageClient employer={employer} openModalInitially={true}>
      <div className="min-h-screen bg-gray-50">
        {/* Breadcrumbs */}
        <div className="bg-white border-b">
          <div className="container mx-auto px-4 py-3">
            <nav className="text-sm text-gray-500">
              <Link href="/" className="hover:text-red-600">
                Strona główna
              </Link>
              <span className="mx-2">/</span>
              <Link href={`/${employer.slug}`} className="hover:text-red-600">
                {employer.name}
              </Link>
              <span className="mx-2">/</span>
              <span className="text-gray-900">Dodaj opinię</span>
            </nav>
          </div>
        </div>

        <div className="container mx-auto px-4 py-8">
          <div className="max-w-2xl mx-auto">
            {/* Header */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <div className="text-center">
                <h1 className="text-2xl font-bold text-gray-900 mb-2">
                  Dodaj opinię o {employer.name}
                </h1>
                <p className="text-gray-600">
                  Podziel się swoim doświadczeniem pracy w tej firmie. 
                  Twoja opinia pomoże innym w podjęciu decyzji zawodowej.
                </p>
              </div>
            </div>

            {/* Info o firmie */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <h2 className="text-lg font-semibold mb-4">Informacje o firmie</h2>
              <div className="space-y-2 text-sm text-gray-600">
                <div><strong>Nazwa:</strong> {employer.name}</div>
                {employer.description && (
                  <div><strong>Opis:</strong> {employer.description}</div>
                )}
                {(employer.address || employer.city) && (
                  <div>
                    <strong>Adres:</strong> {[employer.address, employer.postal_code, employer.city].filter(Boolean).join(', ')}
                  </div>
                )}
                {employer.nip && (
                  <div><strong>NIP:</strong> {employer.nip}</div>
                )}
              </div>
            </div>

            {/* Powrót do strony firmy */}
            <div className="text-center">
              <Link
                href={`/${employer.slug}`}
                className="inline-flex items-center text-red-600 hover:text-red-700"
              >
                <i className="fas fa-arrow-left mr-2"></i>
                Wróć do strony firmy
              </Link>
            </div>
          </div>
        </div>
      </div>
    </EmployerPageClient>
  )
}
