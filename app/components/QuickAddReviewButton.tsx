import Link from 'next/link'

interface QuickAddReviewLinkProps {
  employerSlug: string
  employerName: string
  className?: string
  children?: React.ReactNode
}

export function QuickAddReviewLink({ 
  employerSlug, 
  employerName, 
  className,
  children
}: QuickAddReviewLinkProps) {
  const reviewLink = `/${employerSlug}/add-review`
  
  return (
    <Link 
      href={reviewLink}
      className={className}
      title={`Dodaj opinię o ${employerName}`}
    >
      {children || (
        <>
          <i className="fas fa-star mr-1"></i>
          Dodaj opinię
        </>
      )}
    </Link>
  )
}

// Wersja z buttonem dla łatwiejszego użycia
interface QuickAddReviewButtonProps {
  employerSlug: string
  employerName: string
  className?: string
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'minimal'
  size?: 'sm' | 'md' | 'lg'
}

export function QuickAddReviewButton({ 
  employerSlug,
  employerName,
  className, 
  children,
  variant = 'primary',
  size = 'md'
}: QuickAddReviewButtonProps) {
  const baseClasses = 'inline-flex items-center font-medium transition-colors'
  
  const sizeClasses = {
    sm: 'px-2 py-1 text-xs rounded',
    md: 'px-4 py-2 text-sm rounded-md',
    lg: 'px-6 py-3 text-base rounded-lg'
  }
  
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50',
    minimal: 'text-red-600 hover:text-red-700 hover:bg-red-50'
  }
  
  const finalClassName = `${baseClasses} ${sizeClasses[size]} ${variantClasses[variant]} ${className || ''}`
  
  return (
    <QuickAddReviewLink 
      employerSlug={employerSlug} 
      employerName={employerName}
      className={finalClassName}
    >
      {children || (
        <>
          <i className="fas fa-star mr-2"></i>
          Dodaj opinię
        </>
      )}
    </QuickAddReviewLink>
  )
}
