import React from 'react'
import Link from 'next/link'
import { redirect } from 'next/navigation'
import { checkAdminAuth } from '@/lib/auth'
import AdminLogout from './AdminLogout'

interface AuthorizedAdminLayoutProps {
  children: React.ReactNode
}

export default async function AuthorizedAdminLayout({ children }: AuthorizedAdminLayoutProps) {
  // Sprawdź autoryzację
  const isAuthenticated = await checkAdminAuth()
  
  if (!isAuthenticated) {
    redirect('/admin/login')
  }

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <Link href="/admin" className="text-xl font-bold text-gray-900">
                Admin Panel
              </Link>
            </div>
            <nav className="flex space-x-4 items-center">
              <Link 
                href="/admin" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Dashboard
              </Link>
              <Link 
                href="/admin/companies" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Firmy
              </Link>
              <Link 
                href="/admin/articles" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Artykuły
              </Link>
              <Link 
                href="/" 
                className="text-gray-600 hover:text-gray-900 px-3 py-2 rounded-md text-sm font-medium"
              >
                Powrót do strony
              </Link>
              <AdminLogout />
            </nav>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
    </div>
  )
}
