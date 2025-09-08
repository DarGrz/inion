'use client'

import { useEffect, useState } from 'react'
import { useSearchParams, useRouter } from 'next/navigation'
import { Employer } from '@/lib/supabase'
import { ReviewModal } from './ReviewModal'

interface EmployerPageClientProps {
  employer: Employer
  children: React.ReactNode
  openModalInitially?: boolean
}

export function EmployerPageClient({ employer, children, openModalInitially = false }: EmployerPageClientProps) {
  const [isModalOpen, setIsModalOpen] = useState(openModalInitially)
  const searchParams = useSearchParams()
  const router = useRouter()

  useEffect(() => {
    // Sprawdź czy jest parametr add-review (dla kompatybilności wstecznej)
    const addReviewParam = searchParams.get('add-review')
    if (addReviewParam === 'true') {
      setIsModalOpen(true)
      // Usuń parametr z URL
      const newUrl = new URL(window.location.href)
      newUrl.searchParams.delete('add-review')
      router.replace(newUrl.pathname + newUrl.search, { scroll: false })
    }
  }, [searchParams, router])

  const handleCloseModal = () => {
    setIsModalOpen(false)
  }

  return (
    <>
      {children}
      <ReviewModal 
        employer={employer}
        isOpen={isModalOpen}
        onClose={handleCloseModal}
      />
    </>
  )
}
