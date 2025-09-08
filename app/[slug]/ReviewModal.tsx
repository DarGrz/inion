'use client'

import { useState } from 'react'
import { Employer } from '@/lib/supabase'

interface ReviewModalProps {
  employer: Employer
  isOpen: boolean
  onClose: () => void
}

export function ReviewModal({ employer, isOpen, onClose }: ReviewModalProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)

  const [formData, setFormData] = useState({
    authorName: '',
    authorEmail: '',
    rating: 0,
    title: '',
    body: ''
  })

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)
    setMessage(null)

    try {
      // Walidacja
      if (formData.rating === 0) {
        setMessage({ type: 'error', text: 'Wybierz ocenę ogólną' })
        setIsSubmitting(false)
        return
      }

      if (!formData.authorName || formData.authorName.trim().length < 2) {
        setMessage({ type: 'error', text: 'Nazwa użytkownika musi mieć co najmniej 2 znaki' })
        setIsSubmitting(false)
        return
      }

      if (formData.body.trim().length < 10) {
        setMessage({ type: 'error', text: 'Treść opinii musi mieć co najmniej 10 znaków' })
        setIsSubmitting(false)
        return
      }

      const response = await fetch('/api/reviews', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          employerSlug: employer.slug,
          authorName: formData.authorName.trim(),
          authorEmail: formData.authorEmail.trim() || undefined,
          rating: formData.rating,
          title: formData.title.trim() || undefined,
          body: formData.body.trim()
        })
      })

      const result = await response.json()

      if (response.ok) {
        setMessage({ type: 'success', text: 'Opinia została dodana pomyślnie!' })
        setFormData({
          authorName: '',
          authorEmail: '',
          rating: 0,
          title: '',
          body: ''
        })
        
        // Odśwież stronę po chwili
        setTimeout(() => {
          window.location.reload()
        }, 2000)
      } else {
        setMessage({ type: 'error', text: result.error || 'Wystąpił błąd' })
      }
    } catch {
      setMessage({ type: 'error', text: 'Wystąpił błąd podczas wysyłania opinii' })
    } finally {
      setIsSubmitting(false)
    }
  }

  const StarSelector = ({ 
    value, 
    onChange, 
    label 
  }: { 
    value: number
    onChange: (rating: number) => void
    label: string 
  }) => (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-lg hover:scale-110 transition-transform"
          >
            <i 
              className={`${
                star <= value ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'
              }`}
            ></i>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-2 text-sm text-gray-600">{value}/5</span>
        )}
      </div>
    </div>
  )

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/40 flex items-end sm:items-center justify-center p-0 sm:p-4 z-50 animate-in fade-in duration-200">
      <div className="bg-white rounded-t-2xl sm:rounded-xl shadow-xl w-full sm:max-w-lg sm:w-full max-h-[95vh] sm:max-h-[85vh] overflow-y-auto border-t sm:border border-gray-200 animate-in slide-in-from-bottom-4 duration-200">
        {/* Header minimalistyczny */}
        <div className="sticky top-0 bg-white border-b border-gray-100 p-4 sm:p-5">
          <div className="flex items-center justify-between">
            <div className="min-w-0 flex-1">
              <h3 className="text-lg sm:text-xl font-semibold text-gray-900 mb-1 truncate">Dodaj opinię</h3>
              <p className="text-gray-600 text-sm truncate">{employer.name}</p>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-full p-2 ml-3 flex-shrink-0"
            >
              <i className="fas fa-times text-lg"></i>
            </button>
          </div>
        </div>
        
        <div className="p-6">
          
          {message && (
            <div className={`p-4 rounded-lg mb-6 border ${
              message.type === 'success' 
                ? 'bg-green-50 text-green-800 border-green-200' 
                : 'bg-red-50 text-red-800 border-red-200'
            }`}>
              <div className="flex items-center">
                <i className={`${message.type === 'success' ? 'fas fa-check-circle text-green-600' : 'fas fa-exclamation-triangle text-red-600'} mr-3`}></i>
                {message.text}
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Ocena ogólna - wymagana */}
            <div className="bg-gray-50 p-4 rounded-lg border border-gray-200">
              <StarSelector
                value={formData.rating}
                onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
                label="Ocena ogólna"
              />
              <p className="text-xs text-gray-500 mt-2">* Pole wymagane</p>
            </div>

            {/* Tytuł opinii */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Tytuł opinii
              </label>
              <input
                type="text"
                value={formData.title}
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200"
                placeholder="Krótkie podsumowanie Twojej opinii..."
                maxLength={255}
              />
            </div>

            {/* Treść opinii */}
            <div className="space-y-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Treść opinii <span className="text-red-500">*</span>
              </label>
              <textarea
                value={formData.body}
                onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 resize-none"
                rows={5}
                placeholder="Opisz swoje doświadczenia z tą firmą. Co Ci się podobało? Co można poprawić?"
                maxLength={2000}
                required
              />
              <div className="flex justify-between items-center">
                <div className="text-xs text-gray-500">Minimum 10 znaków</div>
                <div className={`text-xs ${formData.body.length > 1800 ? 'text-red-500' : 'text-gray-500'}`}>
                  {formData.body.length}/2000
                </div>
              </div>
            </div>

            {/* Dane autora */}
            <div className="space-y-4">
              <h4 className="font-medium text-gray-900">Twoje dane</h4>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Imię lub pseudonim *
                </label>
                <input
                  type="text"
                  value={formData.authorName}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Jak chcesz być wyświetlany?"
                  maxLength={255}
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.authorEmail}
                  onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                  placeholder="Nie będzie publikowany"
                  maxLength={255}
                />
                <p className="text-xs text-gray-500 mt-1">
                  Email nie będzie wyświetlany publicznie
                </p>
              </div>
            </div>

            {/* Przyciski */}
            <div className="flex gap-3 pt-4 border-t border-gray-100">
              <button
                type="submit"
                disabled={isSubmitting || formData.rating === 0 || formData.body.trim().length < 10 || formData.authorName.trim().length < 2}
                className="flex-1 bg-gray-900 text-white py-3 px-4 rounded-lg hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium"
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center">
                    <i className="fas fa-spinner fa-spin mr-2"></i>
                    Dodawanie...
                  </span>
                ) : (
                  'Dodaj opinię'
                )}
              </button>
              
              <button
                type="button"
                onClick={onClose}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors font-medium"
              >
                Anuluj
              </button>
            </div>

            <p className="text-xs text-gray-500 text-center">
              Dodając opinię akceptujesz nasze zasady użytkowania. Opinie są moderowane.
            </p>
          </form>
        </div>
      </div>
    </div>
  )
}
