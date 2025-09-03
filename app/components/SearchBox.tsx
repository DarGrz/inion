'use client'

import { useState, useRef, useEffect } from 'react'
import Link from 'next/link'
import { Employer } from '@/lib/supabase'

export function SearchBox() {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState<Employer[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [showResults, setShowResults] = useState(false)
  const searchRef = useRef<HTMLDivElement>(null)

  // Zamknij wyniki gdy kliknięto poza komponentem
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(event.target as Node)) {
        setShowResults(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = async (searchQuery: string) => {
    if (searchQuery.trim().length < 2) {
      setResults([])
      setShowResults(false)
      return
    }

    setIsLoading(true)
    try {
      const response = await fetch(`/api/search?q=${encodeURIComponent(searchQuery.trim())}&limit=10`)
      const data = await response.json()

      if (data.success) {
        setResults(data.employers)
        setShowResults(true)
      } else {
        setResults([])
        setShowResults(false)
      }
    } catch (error) {
      console.error('Search error:', error)
      setResults([])
      setShowResults(false)
    } finally {
      setIsLoading(false)
    }
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value
    setQuery(value)
    
    // Debounce search
    const timeoutId = setTimeout(() => {
      handleSearch(value)
    }, 300)

    return () => clearTimeout(timeoutId)
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (results.length > 0) {
      // Przekieruj do pierwszego wyniku
      window.location.href = `/${results[0].slug}`
    }
  }

  return (
    <div className="w-full relative" ref={searchRef}>
      <form onSubmit={handleSubmit}>
        <div className="flex w-full border-2 border-gray-300 rounded-lg focus-within:border-red-600 transition-colors">
          <input
            type="text"
            value={query}
            onChange={handleInputChange}
            placeholder="Wyszukaj firmę po nazwie lub NIP..."
            className="flex-1 px-4 py-3 sm:py-4 text-sm sm:text-base bg-transparent border-none outline-none placeholder-gray-500"
          />
          <button 
            type="submit"
            className="bg-red-600 text-white px-4 sm:px-8 py-3 sm:py-4 hover:bg-red-700 transition-colors disabled:bg-gray-400 flex-shrink-0 rounded-r-md"
            disabled={isLoading || results.length === 0}
          >
            {isLoading ? (
              <i className="fas fa-spinner fa-spin"></i>
            ) : (
              <i className="fas fa-search"></i>
            )}
          </button>
        </div>
      </form>

      {/* Wyniki wyszukiwania */}
      {showResults && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-60 sm:max-h-96 overflow-y-auto mx-0">
          {results.length === 0 ? (
            <div className="p-3 sm:p-4 text-gray-500 text-center text-sm sm:text-base">
              Nie znaleziono firm pasujących do zapytania
            </div>
          ) : (
            <div className="divide-y">
              {results.map((employer) => (
                <Link
                  key={employer.id}
                  href={`/${employer.slug}`}
                  className="block p-3 sm:p-4 hover:bg-gray-50 transition-colors"
                  onClick={() => setShowResults(false)}
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex-1 min-w-0">
                      <h3 className="font-semibold text-gray-900 text-sm sm:text-base truncate">
                        {employer.name}
                      </h3>
                      <div className="flex flex-col sm:flex-row sm:items-center gap-1 sm:gap-4 text-xs sm:text-sm text-gray-500 mt-1">
                        {employer.city && (
                          <span className="flex items-center">
                            <i className="fas fa-map-marker-alt mr-1"></i>
                            {employer.city}
                          </span>
                        )}
                        {employer.nip && (
                          <span className="flex items-center">
                            <i className="fas fa-building mr-1"></i>
                            NIP: {employer.nip}
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="text-right flex-shrink-0">
                      {employer.review_count > 0 && (
                        <div className="text-xs sm:text-sm">
                          <div className="text-red-600 font-semibold">
                            {employer.avg_rating.toFixed(1)}/5
                          </div>
                          <div className="text-gray-500">
                            {employer.review_count} opinii
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      )}
    </div>
  )
}