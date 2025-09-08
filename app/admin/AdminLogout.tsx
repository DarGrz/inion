'use client'

import { useRouter } from 'next/navigation'
import { useState } from 'react'

export default function AdminLogout() {
  const router = useRouter()
  const [loading, setLoading] = useState(false)

  const handleLogout = async () => {
    if (loading) return
    
    setLoading(true)
    
    try {
      const response = await fetch('/api/admin/logout', {
        method: 'POST'
      })

      if (response.ok) {
        router.push('/admin/login')
        router.refresh()
      } else {
        console.error('Logout failed')
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <button
      onClick={handleLogout}
      disabled={loading}
      className="bg-red-600 hover:bg-red-700 text-white px-3 py-2 rounded-md text-sm font-medium disabled:opacity-50"
    >
      {loading ? 'Wylogowywanie...' : 'Wyloguj'}
    </button>
  )
}
