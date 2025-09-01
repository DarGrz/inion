'use client'

import { Review } from '@/lib/supabase'
import { StarRating } from './StarRating'

export function ReviewCard({ review }: { review: Review }) {
  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('pl-PL', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  const publishedDate = review.published_at || review.created_at

  return (
    <article 
      id={`review-${review.id}`}
      className="p-6 hover:bg-gray-50 transition-colors"
    >
      {/* Header opinii */}
      <div className="flex items-start justify-between mb-4">
        <div>
          <div className="flex items-center gap-3 mb-2">
            <h3 className="font-semibold text-gray-900">
              {review.author_name}
            </h3>
            <span className="text-sm text-gray-500">
              {formatDate(publishedDate)}
            </span>
          </div>
          
          <div className="flex items-center gap-2">
            <StarRating rating={review.rating} size="sm" />
            <span className="text-sm font-medium text-gray-900">
              {review.rating}/5
            </span>
          </div>
        </div>
      </div>

      {/* Tytuł opinii */}
      {review.title && (
        <h4 className="text-lg font-medium text-gray-900 mb-3">
          {review.title}
        </h4>
      )}

      {/* Treść opinii */}
      <div className="prose prose-sm max-w-none mb-4">
        <p className="text-gray-700 leading-relaxed whitespace-pre-wrap">
          {review.body}
        </p>
      </div>

      {/* Akcje */}
      <div className="flex items-center justify-between pt-4 border-t border-gray-100 mt-4">
        <div className="flex items-center gap-4">
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-green-600 transition-colors">
            <i className="far fa-thumbs-up"></i>
            <span>Pomocne</span>
          </button>
          
          <button className="flex items-center gap-1 text-sm text-gray-500 hover:text-red-600 transition-colors">
            <i className="far fa-flag"></i>
            <span>Zgłoś</span>
          </button>
        </div>
        
        <a
          href={`#review-${review.id}`}
          className="text-sm text-gray-400 hover:text-gray-600 transition-colors"
        >
          <i className="fas fa-link"></i>
        </a>
      </div>
    </article>
  )
}
