import Link from 'next/link'
import { Employer } from '@/lib/supabase'

interface AddReviewLinkProps {
  employer: Employer
  className?: string
  children: React.ReactNode
}

export function AddReviewLink({ employer, className, children }: AddReviewLinkProps) {
  const reviewLink = `/${employer.slug}/add-review`
  
  return (
    <Link 
      href={reviewLink}
      className={className}
    >
      {children}
    </Link>
  )
}

// Wersja z buttonem dla łatwiejszego użycia
interface AddReviewButtonProps {
  employer: Employer
  className?: string
  children?: React.ReactNode
  variant?: 'primary' | 'secondary' | 'outline'
}

export function AddReviewButton({ 
  employer, 
  className, 
  children = 'Dodaj opinię',
  variant = 'primary'
}: AddReviewButtonProps) {
  const baseClasses = 'inline-flex items-center px-4 py-2 rounded-md font-medium transition-colors'
  
  const variantClasses = {
    primary: 'bg-red-600 text-white hover:bg-red-700',
    secondary: 'bg-gray-600 text-white hover:bg-gray-700',
    outline: 'border border-red-600 text-red-600 hover:bg-red-50'
  }
  
  const finalClassName = `${baseClasses} ${variantClasses[variant]} ${className || ''}`
  
  return (
    <AddReviewLink employer={employer} className={finalClassName}>
      <i className="fas fa-star mr-2"></i>
      {children}
    </AddReviewLink>
  )
}
