import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import './globals.css'
import { Footer } from './components/Footer'

const inter = Inter({ subsets: ['latin'] })

export const metadata: Metadata = {
  title: 'oipinion.com - Portal opinii o firmach',
  description: 'Portal z opiniami o firmach - sprawdź recenzje i podziel się swoimi doświadczeniami. Znajdź rzetelne informacje o firmach na podstawie opinii innych użytkowników.',
  keywords: 'opinie o firmach, recenzje firm, portal opinii, NIP firmy, opinie NIP, pracodawcy',
  authors: [{ name: 'oipinion.com' }],
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: '32x32', type: 'image/x-icon' },
      { url: '/favicon.svg', type: 'image/svg+xml' }
    ],
    shortcut: '/favicon.ico',
    apple: '/favicon.ico'
  },
  openGraph: {
    title: 'oipinion.com - Portal opinii o firmach',
    description: 'Portal z opiniami o firmach - sprawdź recenzje i podziel się swoimi doświadczeniami',
    url: 'https://oipinion.com',
    siteName: 'oipinion.com',
    type: 'website',
    locale: 'pl_PL'
  },
  twitter: {
    card: 'summary_large_image',
    title: 'oipinion.com - Portal opinii o firmach',
    description: 'Portal z opiniami o firmach - sprawdź recenzje i podziel się swoimi doświadczeniami'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: process.env.GOOGLE_VERIFICATION_TOKEN,
  }
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="pl">
      <head>
        {/* Font Awesome */}
        <link 
          rel="stylesheet" 
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.4.0/css/all.min.css"
          integrity="sha512-iecdLmaskl7CVkqkXNQ/ZH/XLlvWZOJyj7Yy7tcenmpD1ypASozpmT/E0iPtmFIB46ZmdtAc9eNBvH0H/ZpiBw=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />
        
        {/* Preload key resources */}
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="" />
        
        {/* Canonical URL will be set by individual pages */}
      </head>
      <body className={`${inter.className} antialiased`}>
        {children}
        <Footer />
      </body>
    </html>
  )
}
