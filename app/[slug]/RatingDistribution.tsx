'use client'

interface RatingDistributionProps {
  distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
  totalReviews: number
}

export function RatingDistribution({ distribution, totalReviews }: RatingDistributionProps) {
  const ratings = [5, 4, 3, 2, 1] // Od najwyższej do najniższej

  return (
    <div className="space-y-2">
      {ratings.map((rating) => {
        const count = distribution[rating as keyof typeof distribution]
        const percentage = totalReviews > 0 ? (count / totalReviews) * 100 : 0

        return (
          <div key={rating} className="flex items-center gap-2 text-sm">
            <span className="w-3 text-gray-600">{rating}</span>
            <i className="fas fa-star text-yellow-400 text-xs"></i>
            
            <div className="flex-1 bg-gray-200 rounded-full h-2">
              <div
                className="bg-yellow-400 h-2 rounded-full transition-all duration-300"
                style={{ width: `${percentage}%` }}
              ></div>
            </div>
            
            <span className="w-8 text-right text-gray-500">
              {count}
            </span>
          </div>
        )
      })}
    </div>
  )
}
