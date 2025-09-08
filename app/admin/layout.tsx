import React from 'react'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Panel Administracyjny - Oipinion',
  description: 'Panel zarządzania firmami i opiniami',
  robots: {
    index: false,
    follow: false
  }
}

interface AdminLayoutProps {
  children: React.ReactNode
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <div className="min-h-screen bg-gray-100">
      {children}
    </div>
  )
}
