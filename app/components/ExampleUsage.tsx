import { QuickAddReviewButton } from '@/app/components/QuickAddReviewButton'

// Przykład użycia w liście firm
interface ExampleEmployerListProps {
  employers: Array<{
    id: string
    name: string
    slug: string
    avg_rating: number
    review_count: number
  }>
}

export function ExampleEmployerList({ employers }: ExampleEmployerListProps) {
  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold mb-4">Lista pracodawców</h2>
      
      {employers.map((employer) => (
        <div key={employer.id} className="bg-white rounded-lg p-4 shadow-sm border">
          <div className="flex items-center justify-between">
            <div className="flex-1">
              <h3 className="font-semibold text-lg text-gray-900">
                {employer.name}
              </h3>
              <div className="flex items-center gap-4 mt-2 text-sm text-gray-600">
                <span>
                  Ocena: {employer.avg_rating.toFixed(1)}/5
                </span>
                <span>
                  Opinii: {employer.review_count}
                </span>
              </div>
            </div>
            
            <div className="flex items-center gap-3">
              {/* Link do strony firmy */}
              <a 
                href={`/${employer.slug}`}
                className="px-4 py-2 text-sm bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 transition-colors"
              >
                Zobacz opinii
              </a>
              
              {/* Przycisk do szybkiego dodania opinii */}
              <QuickAddReviewButton
                employerSlug={employer.slug}
                employerName={employer.name}
                size="sm"
                variant="outline"
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

// Przykład użycia w wynikach wyszukiwania
interface SearchResultItemProps {
  employer: {
    name: string
    slug: string
    description?: string
    avg_rating: number
    review_count: number
  }
}

export function SearchResultItem({ employer }: SearchResultItemProps) {
  return (
    <div className="bg-white rounded-lg p-6 shadow-sm border hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">
            <a 
              href={`/${employer.slug}`}
              className="hover:text-red-600 transition-colors"
            >
              {employer.name}
            </a>
          </h3>
          
          {employer.description && (
            <p className="text-gray-600 mb-3 line-clamp-2">
              {employer.description}
            </p>
          )}
          
          <div className="flex items-center gap-4 text-sm text-gray-500">
            <span className="flex items-center">
              <i className="fas fa-star text-yellow-400 mr-1"></i>
              {employer.avg_rating.toFixed(1)}/5
            </span>
            <span>
              {employer.review_count} {employer.review_count === 1 ? 'opinia' : 'opinii'}
            </span>
          </div>
        </div>
        
        <div className="flex flex-col gap-2 ml-4">
          {/* Przycisk główny do dodania opinii */}
          <QuickAddReviewButton
            employerSlug={employer.slug}
            employerName={employer.name}
            variant="primary"
            size="sm"
          >
            <i className="fas fa-plus mr-2"></i>
            Dodaj opinię
          </QuickAddReviewButton>
          
          {/* Link do pełnej strony */}
          <a 
            href={`/${employer.slug}`}
            className="px-3 py-1 text-xs text-center bg-gray-100 text-gray-700 rounded hover:bg-gray-200 transition-colors"
          >
            Zobacz wszystkie
          </a>
        </div>
      </div>
    </div>
  )
}
