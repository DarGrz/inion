'use client'

import { useState, useEffect, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { Employer } from '@/lib/supabase'

interface CompanyFormData {
  name: string
  nip: string
  url: string
  address: string
  postal_code: string
  city: string
  description: string
  phone1: string
  phone2: string
  phone3: string
}

export default function CompaniesAdmin() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const action = searchParams.get('action')
  
  const [companies, setCompanies] = useState<Employer[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [searchType, setSearchType] = useState<'name' | 'nip'>('name')
  const [showAddForm, setShowAddForm] = useState(action === 'add')
  const [editingCompany, setEditingCompany] = useState<Employer | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<CompanyFormData>({
    name: '',
    nip: '',
    url: '',
    address: '',
    postal_code: '',
    city: '',
    description: '',
    phone1: '',
    phone2: '',
    phone3: ''
  })

  const fetchCompanies = useCallback(async (search?: string) => {
    try {
      setLoading(true)
      let url = '/api/employers?limit=50'
      
      if (search) {
        if (searchType === 'nip') {
          url += `&nip=${encodeURIComponent(search)}`
        } else {
          url += `&q=${encodeURIComponent(search)}`
        }
      }
      
      const response = await fetch(url)
      const data = await response.json()
      
      if (data.employer) {
        // Pojedynczy wynik wyszukiwania po NIP
        setCompanies([data.employer])
      } else if (data.employers) {
        setCompanies(data.employers)
      }
    } catch (error) {
      console.error('Error fetching companies:', error)
    } finally {
      setLoading(false)
    }
  }, [searchType])

  useEffect(() => {
    fetchCompanies()
  }, [fetchCompanies])

  useEffect(() => {
    if (action === 'add') {
      setShowAddForm(true)
    }
  }, [action])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchTerm.trim()) {
      fetchCompanies(searchTerm.trim())
    } else {
      fetchCompanies()
    }
  }

  const resetForm = () => {
    setFormData({
      name: '',
      nip: '',
      url: '',
      address: '',
      postal_code: '',
      city: '',
      description: '',
      phone1: '',
      phone2: '',
      phone3: ''
    })
    setEditingCompany(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const method = editingCompany ? 'PUT' : 'POST'
      const url = editingCompany ? `/api/admin/companies/${editingCompany.id}` : '/api/employers'
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(editingCompany ? 'Firma została zaktualizowana!' : 'Firma została dodana!')
        resetForm()
        fetchCompanies()
        router.push('/admin/companies')
      } else {
        alert(data.error || 'Wystąpił błąd')
      }
    } catch (error) {
      console.error('Error submitting form:', error)
      alert('Wystąpił błąd podczas zapisywania')
    } finally {
      setSubmitting(false)
    }
  }

  const handleEdit = (company: Employer) => {
    setEditingCompany(company)
    setFormData({
      name: company.name,
      nip: company.nip,
      url: company.url || '',
      address: company.address || '',
      postal_code: company.postal_code || '',
      city: company.city || '',
      description: company.description || '',
      phone1: company.phone1 || '',
      phone2: company.phone2 || '',
      phone3: company.phone3 || ''
    })
    setShowAddForm(true)
  }

  const handleDelete = async (company: Employer) => {
    if (!confirm(`Czy na pewno chcesz usunąć firmę "${company.name}"? Ta akcja jest nieodwracalna.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/companies/${company.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Firma została usunięta!')
        fetchCompanies()
      } else {
        const data = await response.json()
        alert(data.error || 'Wystąpił błąd podczas usuwania')
      }
    } catch (error) {
      console.error('Error deleting company:', error)
      alert('Wystąpił błąd podczas usuwania')
    }
  }

  if (showAddForm) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <button
            onClick={() => {
              resetForm()
              router.push('/admin/companies')
            }}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Powrót do listy firm
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingCompany ? 'Edytuj firmę' : 'Dodaj nową firmę'}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                    Nazwa firmy * <span className="text-xs text-gray-500">(dla oddziałów dodaj lokalizację, np. &quot;McDonald&apos;s Warszawa Centrum&quot;)</span>
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="nip" className="block text-sm font-medium text-gray-700">
                    NIP * <span className="text-xs text-gray-500">(można dodać wiele oddziałów z tym samym NIP)</span>
                  </label>
                  <input
                    type="text"
                    id="nip"
                    required
                    pattern="[0-9]{10}"
                    placeholder="1234567890"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value.replace(/\D/g, '').slice(0, 10) })}
                  />
                </div>

                <div>
                  <label htmlFor="address" className="block text-sm font-medium text-gray-700">
                    Ulica
                  </label>
                  <input
                    type="text"
                    id="address"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.address}
                    onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="postal_code" className="block text-sm font-medium text-gray-700">
                    Kod pocztowy
                  </label>
                  <input
                    type="text"
                    id="postal_code"
                    placeholder="XX-XXX"
                    pattern="[0-9]{2}-[0-9]{3}"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.postal_code}
                    onChange={(e) => {
                      // Formatowanie kodu pocztowego
                      let value = e.target.value.replace(/\D/g, '').slice(0, 5)
                      if (value.length > 2) {
                        value = value.slice(0, 2) + '-' + value.slice(2)
                      }
                      setFormData({ ...formData, postal_code: value })
                    }}
                  />
                </div>

                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700">
                    Miasto
                  </label>
                  <input
                    type="text"
                    id="city"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="url" className="block text-sm font-medium text-gray-700">
                    Strona internetowa
                  </label>
                  <input
                    type="url"
                    id="url"
                    placeholder="https://example.com"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.url}
                    onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="phone1" className="block text-sm font-medium text-gray-700">
                    Telefon 1
                  </label>
                  <input
                    type="tel"
                    id="phone1"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.phone1}
                    onChange={(e) => setFormData({ ...formData, phone1: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="phone2" className="block text-sm font-medium text-gray-700">
                    Telefon 2
                  </label>
                  <input
                    type="tel"
                    id="phone2"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.phone2}
                    onChange={(e) => setFormData({ ...formData, phone2: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Opis firmy
                </label>
                <textarea
                  id="description"
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                />
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    resetForm()
                    router.push('/admin/companies')
                  }}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Zapisywanie...' : (editingCompany ? 'Zaktualizuj' : 'Dodaj firmę')}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="px-4 py-6 sm:px-0">
      <div className="mb-8">
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Zarządzanie firmami</h1>
            <p className="mt-2 text-gray-600">Wyszukuj, edytuj i dodawaj nowe firmy</p>
          </div>
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Dodaj firmę
          </button>
        </div>
      </div>

      {/* Wyszukiwanie */}
      <div className="bg-white p-6 rounded-lg shadow mb-6">
        <form onSubmit={handleSearch} className="flex gap-4 items-end">
          <div className="flex-1">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-1">
              Wyszukaj firmę
            </label>
            <input
              type="text"
              id="search"
              placeholder={searchType === 'nip' ? 'Wprowadź NIP (10 cyfr)' : 'Nazwa firmy...'}
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="w-40">
            <label htmlFor="searchType" className="block text-sm font-medium text-gray-700 mb-1">
              Typ wyszukiwania
            </label>
            <select
              id="searchType"
              className="block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              value={searchType}
              onChange={(e) => setSearchType(e.target.value as 'name' | 'nip')}
            >
              <option value="name">Nazwa</option>
              <option value="nip">NIP</option>
            </select>
          </div>
          <button
            type="submit"
            className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-md font-medium"
          >
            Szukaj
          </button>
          <button
            type="button"
            onClick={() => {
              setSearchTerm('')
              fetchCompanies()
            }}
            className="bg-gray-500 hover:bg-gray-600 text-white px-4 py-2 rounded-md font-medium"
          >
            Wyczyść
          </button>
        </form>
      </div>

      {/* Lista firm */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Lista firm ({companies.length})
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          ) : companies.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Nie znaleziono firm</p>
            </div>
          ) : (
            <div className="space-y-4">
              {companies.map((company) => (
                <div key={company.id} className="border border-gray-200 rounded-lg p-4 hover:border-gray-300 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <h3 className="text-lg font-semibold text-gray-900">{company.name}</h3>
                      <p className="text-sm text-gray-600">NIP: {company.nip}</p>
                      {company.address && (
                        <p className="text-sm text-gray-600">Adres: {company.address}</p>
                      )}
                      {company.city && (
                        <p className="text-sm text-gray-600">Miasto: {company.city}</p>
                      )}
                      <div className="flex items-center mt-2 space-x-4">
                        <span className="text-sm text-gray-500">
                          Ocena: {company.avg_rating.toFixed(1)} ⭐ ({company.review_count} opinii)
                        </span>
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${
                          company.reviews_status 
                            ? 'bg-green-100 text-green-800' 
                            : 'bg-red-100 text-red-800'
                        }`}>
                          {company.reviews_status ? 'Aktywne' : 'Wyłączone'}
                        </span>
                      </div>
                    </div>
                    <div className="flex space-x-2 ml-4">
                      <Link
                        href={`/admin/companies/${company.id}`}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium"
                      >
                        Opinie
                      </Link>
                      <button
                        onClick={() => handleEdit(company)}
                        className="bg-yellow-100 text-yellow-700 hover:bg-yellow-200 px-3 py-1 rounded text-sm font-medium"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(company)}
                        className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium"
                      >
                        Usuń
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
