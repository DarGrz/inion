'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Employer } from '@/lib/supabase'

interface AddReviewPageFormProps {
  employer: Employer
}

export function AddReviewPageForm({ employer }: AddReviewPageFormProps) {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [message, setMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null)
  const router = useRouter()

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
        
        // Przekieruj do strony firmy po chwili
        setTimeout(() => {
          router.push(`/${employer.slug}`)
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
      <label className="block text-sm font-medium text-gray-900 mb-3">
        {label} <span className="text-red-500">*</span>
      </label>
      <div className="flex items-center gap-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className="text-2xl hover:scale-110 transition-transform focus:outline-none"
          >
            <i 
              className={`${
                star <= value ? 'fas fa-star text-yellow-400' : 'far fa-star text-gray-300'
              }`}
            ></i>
          </button>
        ))}
        {value > 0 && (
          <span className="ml-3 text-sm text-gray-600 font-medium">{value}/5</span>
        )}
      </div>
    </div>
  )

  return (
    <div className="max-w-2xl mx-auto">
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
        {/* Ocena ogólna */}
        <div className="bg-gray-50 p-6 rounded-xl border border-gray-200">
          <StarSelector
            value={formData.rating}
            onChange={(rating) => setFormData(prev => ({ ...prev, rating }))}
            label="Ocena ogólna"
          />
        </div>

        {/* Tytuł opinii */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Tytuł opinii
          </label>
          <input
            type="text"
            value={formData.title}
            onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            placeholder="Krótkie podsumowanie Twojej opinii..."
            maxLength={255}
          />
        </div>

        {/* Treść opinii */}
        <div>
          <label className="block text-sm font-medium text-gray-900 mb-3">
            Treść opinii <span className="text-red-500">*</span>
          </label>
          <textarea
            value={formData.body}
            onChange={(e) => setFormData(prev => ({ ...prev, body: e.target.value }))}
            className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all resize-none"
            rows={6}
            placeholder="Opisz swoje doświadczenia z tą firmą. Co Ci się podobało? Co można poprawić?"
            maxLength={2000}
            required
          />
          <div className="flex justify-between items-center mt-2">
            <div className="text-xs text-gray-500">Minimum 10 znaków</div>
            <div className={`text-xs ${formData.body.length > 1800 ? 'text-red-500' : 'text-gray-500'}`}>
              {formData.body.length}/2000
            </div>
          </div>
        </div>

        {/* Dane autora */}
        <div className="space-y-4">
          <h3 className="font-medium text-gray-900 text-lg">Twoje dane</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Imię lub pseudonim <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.authorName}
              onChange={(e) => setFormData(prev => ({ ...prev, authorName: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Jak chcesz być wyświetlany?"
              maxLength={255}
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-900 mb-3">
              Email (opcjonalnie)
            </label>
            <input
              type="email"
              value={formData.authorEmail}
              onChange={(e) => setFormData(prev => ({ ...prev, authorEmail: e.target.value }))}
              className="w-full px-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="Nie będzie publikowany"
              maxLength={255}
            />
            <p className="text-xs text-gray-500 mt-2">
              Email nie będzie wyświetlany publicznie
            </p>
          </div>
        </div>

        {/* Przyciski */}
        <div className="pt-6 border-t border-gray-200">
          <button
            type="submit"
            disabled={isSubmitting || formData.rating === 0 || formData.body.trim().length < 10 || formData.authorName.trim().length < 2}
            className="w-full bg-gray-900 text-white py-4 px-6 rounded-xl hover:bg-gray-800 disabled:bg-gray-300 disabled:cursor-not-allowed transition-colors font-medium text-lg"
          >
            {isSubmitting ? (
              <span className="flex items-center justify-center">
                <i className="fas fa-spinner fa-spin mr-2"></i>
                Dodawanie opinii...
              </span>
            ) : (
              'Dodaj opinię'
            )}
          </button>
          
          <p className="text-xs text-gray-500 text-center mt-4">
            Dodając opinię akceptujesz nasze zasady użytkowania. Opinie są moderowane.
          </p>
        </div>
      </form>
    </div>
  )
}
