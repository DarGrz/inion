'use client'

import { useState } from 'react'
import { Employer } from '@/lib/supabase'
import { ReviewModal } from './ReviewModal'

interface ScrollToReviewFormButtonProps {
  className?: string
  children: React.ReactNode
  employer: Employer
}

export function ScrollToReviewFormButton({ 
  className, 
  children,
  employer
}: ScrollToReviewFormButtonProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const handleClick = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <button onClick={handleClick} className={className}>
        {children}
      </button>
      <ReviewModal 
        employer={employer}
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </>
  )
}
