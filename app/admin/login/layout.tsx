import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Logowanie - Panel Administracyjny',
  description: 'Logowanie do panelu administracyjnego',
  robots: {
    index: false,
    follow: false
  }
}

interface LoginLayoutProps {
  children: React.ReactNode
}

export default function LoginLayout({ children }: LoginLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100 flex items-center justify-center">
      {children}
    </div>
  )
}
