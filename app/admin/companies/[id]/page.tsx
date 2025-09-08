'use client'

import { useState, useEffect, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { Employer, Review } from '@/lib/supabase'

interface ReviewFormData {
  author_name: string
  author_email: string
  rating: number
  title: string
  body: string
  work_life_balance: number
  salary_rating: number
  management_rating: number
  career_development: number
  status: 'pending' | 'published' | 'rejected' | 'hidden'
}

export default function CompanyReviewsAdmin({ params }: { params: Promise<{ id: string }> }) {
  const { id } = use(params)
  const router = useRouter()
  const [company, setCompany] = useState<Employer | null>(null)
  const [reviews, setReviews] = useState<Review[]>([])
  const [loading, setLoading] = useState(true)
  const [showAddForm, setShowAddForm] = useState(false)
  const [editingReview, setEditingReview] = useState<Review | null>(null)
  const [submitting, setSubmitting] = useState(false)
  
  const [formData, setFormData] = useState<ReviewFormData>({
    author_name: '',
    author_email: '',
    rating: 5,
    title: '',
    body: '',
    work_life_balance: 5,
    salary_rating: 5,
    management_rating: 5,
    career_development: 5,
    status: 'published'
  })

  const fetchCompanyData = useCallback(async () => {
    try {
      const response = await fetch(`/api/admin/companies/${id}`)
      const data = await response.json()
      
      if (response.ok) {
        setCompany(data.employer)
      } else {
        alert('Firma nie została znaleziona')
        router.push('/admin/companies')
      }
    } catch (error) {
      console.error('Error fetching company:', error)
      alert('Błąd podczas pobierania danych firmy')
      router.push('/admin/companies')
    }
  }, [id, router])

  const fetchReviews = useCallback(async () => {
    try {
      setLoading(true)
      const response = await fetch(`/api/admin/companies/${id}/reviews`)
      const data = await response.json()
      
      if (response.ok) {
        setReviews(data.reviews || [])
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }, [id])

  useEffect(() => {
    fetchCompanyData()
    fetchReviews()
  }, [fetchCompanyData, fetchReviews])

  const resetForm = () => {
    setFormData({
      author_name: '',
      author_email: '',
      rating: 5,
      title: '',
      body: '',
      work_life_balance: 5,
      salary_rating: 5,
      management_rating: 5,
      career_development: 5,
      status: 'published'
    })
    setEditingReview(null)
    setShowAddForm(false)
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setSubmitting(true)

    try {
      const method = editingReview ? 'PUT' : 'POST'
      const url = editingReview 
        ? `/api/admin/companies/${id}/reviews/${editingReview.id}`
        : `/api/admin/companies/${id}/reviews`
      
      const response = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      const data = await response.json()

      if (response.ok) {
        alert(editingReview ? 'Opinia została zaktualizowana!' : 'Opinia została dodana!')
        resetForm()
        fetchReviews()
        fetchCompanyData() // Odśwież dane firmy (statystyki)
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

  const handleEdit = (review: Review) => {
    setEditingReview(review)
    setFormData({
      author_name: review.author_name,
      author_email: review.author_email || '',
      rating: review.rating,
      title: review.title || '',
      body: review.body,
      work_life_balance: review.work_life_balance || 5,
      salary_rating: review.salary_rating || 5,
      management_rating: review.management_rating || 5,
      career_development: review.career_development || 5,
      status: review.status
    })
    setShowAddForm(true)
  }

  const handleDelete = async (review: Review) => {
    if (!confirm(`Czy na pewno chcesz usunąć opinię od "${review.author_name}"? Ta akcja jest nieodwracalna.`)) {
      return
    }

    try {
      const response = await fetch(`/api/admin/companies/${id}/reviews/${review.id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        alert('Opinia została usunięta!')
        fetchReviews()
        fetchCompanyData() // Odśwież dane firmy (statystyki)
      } else {
        const data = await response.json()
        alert(data.error || 'Wystąpił błąd podczas usuwania')
      }
    } catch (error) {
      console.error('Error deleting review:', error)
      alert('Wystąpił błąd podczas usuwania')
    }
  }

  const handleStatusChange = async (review: Review, newStatus: Review['status']) => {
    try {
      const response = await fetch(`/api/admin/companies/${id}/reviews/${review.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...review,
          status: newStatus
        }),
      })

      if (response.ok) {
        fetchReviews()
        fetchCompanyData()
      } else {
        const data = await response.json()
        alert(data.error || 'Wystąpił błąd')
      }
    } catch (error) {
      console.error('Error updating review status:', error)
      alert('Wystąpił błąd podczas aktualizacji')
    }
  }

  const getStatusColor = (status: Review['status']) => {
    switch (status) {
      case 'published': return 'bg-green-100 text-green-800'
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'rejected': return 'bg-red-100 text-red-800'
      case 'hidden': return 'bg-gray-100 text-gray-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  const getStatusLabel = (status: Review['status']) => {
    switch (status) {
      case 'published': return 'Opublikowane'
      case 'pending': return 'Oczekujące'
      case 'rejected': return 'Odrzucone'
      case 'hidden': return 'Ukryte'
      default: return status
    }
  }

  if (!company) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="animate-pulse">
          <div className="h-8 bg-gray-200 rounded w-1/3 mb-4"></div>
          <div className="h-4 bg-gray-200 rounded w-1/2"></div>
        </div>
      </div>
    )
  }

  if (showAddForm) {
    return (
      <div className="px-4 py-6 sm:px-0">
        <div className="mb-6">
          <button
            onClick={() => resetForm()}
            className="flex items-center text-blue-600 hover:text-blue-800"
          >
            <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            Powrót do opinii
          </button>
        </div>

        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-6">
              {editingReview ? 'Edytuj opinię' : 'Dodaj nową opinię'} - {company.name}
            </h2>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
                <div>
                  <label htmlFor="author_name" className="block text-sm font-medium text-gray-700">
                    Imię i nazwisko *
                  </label>
                  <input
                    type="text"
                    id="author_name"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.author_name}
                    onChange={(e) => setFormData({ ...formData, author_name: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="author_email" className="block text-sm font-medium text-gray-700">
                    Email
                  </label>
                  <input
                    type="email"
                    id="author_email"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.author_email}
                    onChange={(e) => setFormData({ ...formData, author_email: e.target.value })}
                  />
                </div>

                <div>
                  <label htmlFor="rating" className="block text-sm font-medium text-gray-700">
                    Ocena ogólna *
                  </label>
                  <select
                    id="rating"
                    required
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.rating}
                    onChange={(e) => setFormData({ ...formData, rating: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} ⭐</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                    Status
                  </label>
                  <select
                    id="status"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value as Review['status'] })}
                  >
                    <option value="published">Opublikowane</option>
                    <option value="pending">Oczekujące</option>
                    <option value="rejected">Odrzucone</option>
                    <option value="hidden">Ukryte</option>
                  </select>
                </div>
              </div>

              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                  Tytuł opinii
                </label>
                <input
                  type="text"
                  id="title"
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                />
              </div>

              <div>
                <label htmlFor="body" className="block text-sm font-medium text-gray-700">
                  Treść opinii *
                </label>
                <textarea
                  id="body"
                  required
                  rows={4}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                  value={formData.body}
                  onChange={(e) => setFormData({ ...formData, body: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 gap-6 sm:grid-cols-4">
                <div>
                  <label htmlFor="work_life_balance" className="block text-sm font-medium text-gray-700">
                    Work-life balance
                  </label>
                  <select
                    id="work_life_balance"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.work_life_balance}
                    onChange={(e) => setFormData({ ...formData, work_life_balance: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} ⭐</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="salary_rating" className="block text-sm font-medium text-gray-700">
                    Wynagrodzenie
                  </label>
                  <select
                    id="salary_rating"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.salary_rating}
                    onChange={(e) => setFormData({ ...formData, salary_rating: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} ⭐</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="management_rating" className="block text-sm font-medium text-gray-700">
                    Zarządzanie
                  </label>
                  <select
                    id="management_rating"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.management_rating}
                    onChange={(e) => setFormData({ ...formData, management_rating: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} ⭐</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label htmlFor="career_development" className="block text-sm font-medium text-gray-700">
                    Rozwój kariery
                  </label>
                  <select
                    id="career_development"
                    className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
                    value={formData.career_development}
                    onChange={(e) => setFormData({ ...formData, career_development: parseInt(e.target.value) })}
                  >
                    {[1, 2, 3, 4, 5].map(rating => (
                      <option key={rating} value={rating}>{rating} ⭐</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => resetForm()}
                  className="px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
                >
                  Anuluj
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-4 py-2 bg-blue-600 border border-transparent rounded-md shadow-sm text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50"
                >
                  {submitting ? 'Zapisywanie...' : (editingReview ? 'Zaktualizuj' : 'Dodaj opinię')}
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
      <div className="mb-6">
        <Link
          href="/admin/companies"
          className="flex items-center text-blue-600 hover:text-blue-800 mb-4"
        >
          <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
          Powrót do listy firm
        </Link>
        
        <div className="flex justify-between items-start">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{company.name}</h1>
            <p className="mt-2 text-gray-600">NIP: {company.nip}</p>
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
          <button
            onClick={() => setShowAddForm(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md font-medium"
          >
            Dodaj opinię
          </button>
        </div>
      </div>

      {/* Lista opinii */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h2 className="text-lg font-medium text-gray-900 mb-4">
            Opinie ({reviews.length})
          </h2>

          {loading ? (
            <div className="animate-pulse space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="border border-gray-200 rounded-lg p-4">
                  <div className="h-4 bg-gray-200 rounded w-1/3 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-full mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">Brak opinii</p>
            </div>
          ) : (
            <div className="space-y-4">
              {reviews.map((review) => (
                <div key={review.id} className="border border-gray-200 rounded-lg p-4">
                  <div className="flex justify-between items-start mb-3">
                    <div>
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className="font-semibold text-gray-900">{review.author_name}</h3>
                        <span className="text-yellow-500">
                          {'⭐'.repeat(review.rating)}
                        </span>
                      </div>
                      {review.title && (
                        <p className="font-medium text-gray-800 mb-1">{review.title}</p>
                      )}
                      <p className="text-sm text-gray-600">
                        {new Date(review.created_at).toLocaleDateString('pl-PL')}
                        {review.author_email && ` • ${review.author_email}`}
                      </p>
                    </div>
                    <div className="flex items-center space-x-2">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(review.status)}`}>
                        {getStatusLabel(review.status)}
                      </span>
                    </div>
                  </div>
                  
                  <p className="text-gray-700 mb-3">{review.body}</p>
                  
                  {(review.work_life_balance || review.salary_rating || review.management_rating || review.career_development) && (
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-3 text-sm">
                      {review.work_life_balance && (
                        <div>
                          <span className="text-gray-500">Work-life balance:</span>
                          <span className="ml-1 text-yellow-500">{'⭐'.repeat(review.work_life_balance)}</span>
                        </div>
                      )}
                      {review.salary_rating && (
                        <div>
                          <span className="text-gray-500">Wynagrodzenie:</span>
                          <span className="ml-1 text-yellow-500">{'⭐'.repeat(review.salary_rating)}</span>
                        </div>
                      )}
                      {review.management_rating && (
                        <div>
                          <span className="text-gray-500">Zarządzanie:</span>
                          <span className="ml-1 text-yellow-500">{'⭐'.repeat(review.management_rating)}</span>
                        </div>
                      )}
                      {review.career_development && (
                        <div>
                          <span className="text-gray-500">Rozwój kariery:</span>
                          <span className="ml-1 text-yellow-500">{'⭐'.repeat(review.career_development)}</span>
                        </div>
                      )}
                    </div>
                  )}

                  <div className="flex justify-between items-center">
                    <div className="flex space-x-2">
                      {review.status !== 'published' && (
                        <button
                          onClick={() => handleStatusChange(review, 'published')}
                          className="bg-green-100 text-green-700 hover:bg-green-200 px-3 py-1 rounded text-sm font-medium"
                        >
                          Opublikuj
                        </button>
                      )}
                      {review.status !== 'hidden' && (
                        <button
                          onClick={() => handleStatusChange(review, 'hidden')}
                          className="bg-gray-100 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded text-sm font-medium"
                        >
                          Ukryj
                        </button>
                      )}
                      {review.status !== 'rejected' && (
                        <button
                          onClick={() => handleStatusChange(review, 'rejected')}
                          className="bg-red-100 text-red-700 hover:bg-red-200 px-3 py-1 rounded text-sm font-medium"
                        >
                          Odrzuć
                        </button>
                      )}
                    </div>
                    <div className="flex space-x-2">
                      <button
                        onClick={() => handleEdit(review)}
                        className="bg-blue-100 text-blue-700 hover:bg-blue-200 px-3 py-1 rounded text-sm font-medium"
                      >
                        Edytuj
                      </button>
                      <button
                        onClick={() => handleDelete(review)}
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
