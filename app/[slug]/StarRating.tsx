'use client'

interface StarRatingProps {
  rating: number
  size?: 'sm' | 'md' | 'lg'
  className?: string
  showValue?: boolean
}

export function StarRating({ 
  rating, 
  size = 'md', 
  className = '', 
  showValue = false 
}: StarRatingProps) {
  const sizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg'
  }

  const stars = []
  const fullStars = Math.floor(rating)
  const hasHalfStar = rating % 1 >= 0.5

  // Pełne gwiazdki
  for (let i = 0; i < fullStars; i++) {
    stars.push(
      <i key={i} className="fas fa-star text-yellow-400"></i>
    )
  }

  // Półgwiazdka
  if (hasHalfStar) {
    stars.push(
      <i key="half" className="fas fa-star-half-alt text-yellow-400"></i>
    )
  }

  // Puste gwiazdki
  const emptyStars = 5 - Math.ceil(rating)
  for (let i = 0; i < emptyStars; i++) {
    stars.push(
      <i key={`empty-${i}`} className="far fa-star text-gray-300"></i>
    )
  }

  return (
    <div className={`flex items-center gap-1 ${sizeClasses[size]} ${className}`}>
      {stars}
      {showValue && (
        <span className="ml-2 text-gray-600">
          {rating.toFixed(1)}
        </span>
      )}
    </div>
  )
}
