'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

interface AuthGuardProps {
  children: React.ReactNode
  fallback?: React.ReactNode
}

export default function AuthGuard({ children, fallback }: AuthGuardProps) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null)
  const router = useRouter()

  const checkAuth = async () => {
    try {
      const response = await fetch('/api/admin/auth-check')
      setIsAuthenticated(response.ok)
      
      if (!response.ok) {
        router.push('/admin/login')
      }
    } catch (error) {
      console.error('Auth check error:', error)
      setIsAuthenticated(false)
      router.push('/admin/login')
    }
  }

  useEffect(() => {
    checkAuth()
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  if (isAuthenticated === null) {
    return fallback || (
      <div className="min-h-screen bg-gray-100 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return null // Przekierowanie w toku
  }

  return <>{children}</>
}
