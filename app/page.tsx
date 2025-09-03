import Link from 'next/link'
import Image from 'next/image'
// import { getRecentReviews } from '@/lib/database'
import { SearchBox } from './components/SearchBox'
import { FakeReviews } from './components/FakeReviews'

export default async function HomePage() {
  // const recentReviews = await getRecentReviews(10) // 10 najnowszych opinii

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link href="/" className="text-2xl font-bold">
              O<span className="text-red-600">i</span>pinion.com
            </Link>
            
            <nav className="hidden md:flex items-center space-x-6">
              <Link href="#" className="text-gray-600 hover:text-red-600 transition-colors">
                Strona główna
              </Link>
              <Link href="#companies" className="text-gray-600 hidden hover:text-red-600 transition-colors">
                Firmy
              </Link>
              <Link href="#search" className="text-gray-600 hover:text-red-600 transition-colors">
                Szukaj
              </Link>
            </nav>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="bg-white py-12">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-6">
            Znajdź opinie o firmach
          </h1>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Podziel się swoim doświadczeniem i pomóż innym w podjęciu decyzji.
          </p>
          
          {/* Search Bar */}
          <div className="container mx-auto ">
            <div className="max-w-2xl mx-auto">
              <SearchBox />
            </div>
          </div>
        </div>
      </section>

      {/* AI Verification Banner */}
      <section className="py-8 bg-white border-b">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-6 border border-blue-100">
              <div className="flex items-center gap-4">
                <div className="flex-shrink-0">
                  <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center">
                    <i className="fas fa-brain text-white text-xl"></i>
                  </div>
                </div>
                <div className="flex-1 text-center md:text-left">
                  <h3 className="text-lg font-semibold text-gray-800 mb-2">
                    Weryfikacja opinii wspierana przez AI
                  </h3>
                  <p className="text-sm text-gray-600 leading-relaxed">
                    Nasze nowoczesne rozwiązania sztucznej inteligencji analizują autentyczność opinii, 
                    filtrują spam i zapewniają wiarygodność recenzji.
                  </p>
                </div>
                <div className="flex-shrink-0 hidden md:block">
                  <div className="text-blue-600">
                    <i className="fas fa-shield-check text-2xl"></i>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-12 bg-gray-100">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">
                243 276
              </div>
              <div className="text-gray-600">Firm w bazie</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">
                1 216 380
              </div>
              <div className="text-gray-600">Opinii</div>
            </div>
            
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="text-3xl font-bold text-red-600 mb-2">
                4.2
              </div>
              <div className="text-gray-600">Średnia ocena</div>
            </div>
          </div>
        </div>
      </section>

      {/* Recent Reviews */}
      {/* <section className="py-16 hidden" id="reviews">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Najnowsze opinie
            </h2>
            <p className="text-gray-600">
              Zobacz co inni mówią o swoich pracodawcach
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {recentReviews.map((review) => (
              <div key={review.id} className="bg-white rounded-lg shadow-sm p-6">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <Link 
                      href={`/${review.employer.slug}`}
                      className="text-lg font-semibold text-gray-900 hover:text-red-600 transition-colors"
                    >
                      {review.employer.name}
                    </Link>
                    {review.employer.city && (
                      <p className="text-sm text-gray-500">{review.employer.city}</p>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i 
                        key={star}
                        className={`fas fa-star text-sm ${
                          star <= review.rating ? 'text-yellow-400' : 'text-gray-300'
                        }`}
                      ></i>
                    ))}
                    <span className="ml-1 text-sm font-medium">{review.rating}/5</span>
                  </div>
                </div>

                {review.title && (
                  <h3 className="font-medium text-gray-900 mb-2">
                    {review.title}
                  </h3>
                )}

                <p className="text-gray-700 mb-4 line-clamp-3">
                  {review.body}
                </p>

                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    {review.author_name}
                  </span>
                  <span className="text-gray-400">
                    {new Date(review.published_at || review.created_at).toLocaleDateString('pl-PL')}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {recentReviews.length === 0 && (
            <div className="text-center py-12">
              <i className="fas fa-comment-slash text-4xl text-gray-300 mb-4"></i>
              <p className="text-gray-500">Brak opinii</p>
            </div>
          )}
        </div>
      </section> */}

      {/* Fake Reviews Section */}
      <FakeReviews />

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-12">
        <div className="container mx-auto px-4 text-center">
          
          
         
            <p>&copy; 2024 Oipinion.com</p>
          
        </div>
      </footer>
    </div>
  )
}