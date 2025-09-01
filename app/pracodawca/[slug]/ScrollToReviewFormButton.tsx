'use client'

interface ScrollToReviewFormButtonProps {
  className?: string
  children: React.ReactNode
}

export function ScrollToReviewFormButton({ 
  className, 
  children 
}: ScrollToReviewFormButtonProps) {
  const handleClick = () => {
    document.getElementById('add-review-form')?.scrollIntoView({ 
      behavior: 'smooth' 
    })
  }

  return (
    <button onClick={handleClick} className={className}>
      {children}
    </button>
  )
}
