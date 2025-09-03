import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.SUPABASE_URL!
const supabaseAnonKey = process.env.SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Typy dla TypeScript
export interface Employer {
  id: string
  slug: string
  name: string
  nip: string // Wymagany
  url?: string
  logo?: string
  address?: string
  city?: string
  description?: string
  phone1?: string
  phone2?: string
  phone3?: string
  avg_rating: number
  review_count: number
  reviews_status: boolean // Określa czy dodawanie opinii jest włączone
  created_at: string
  updated_at: string
}

export interface Review {
  id: string
  employer_id: string
  author_name: string // Wymagane
  author_email?: string // Opcjonalne
  rating: number
  title?: string
  body: string
  work_life_balance?: number
  salary_rating?: number
  management_rating?: number
  career_development?: number
  status: 'pending' | 'published' | 'rejected' | 'hidden'
  published_at?: string
  created_at: string
  updated_at: string
  ip_address: string // Wymagane
  user_agent?: string
}

export interface ReviewVote {
  id: string
  review_id: string
  vote_type: 'helpful' | 'not_helpful'
  ip_address: string
  created_at: string
}

export interface ReviewReport {
  id: string
  review_id: string
  reason: 'spam' | 'fake' | 'offensive' | 'inappropriate' | 'other'
  description?: string
  reporter_email?: string
  ip_address?: string
  status: 'pending' | 'reviewed' | 'dismissed'
  created_at: string
}

// Rozszerzony typ dla opinii z danymi pracodawcy
export interface ReviewWithEmployer extends Review {
  employer: Employer
}

// Typ dla agregatów
export interface EmployerAggregate {
  avg_rating: number
  review_count: number
  rating_distribution: {
    1: number
    2: number
    3: number
    4: number
    5: number
  }
}
