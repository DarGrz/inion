import { supabase, Employer, Review, ReviewWithEmployer, EmployerAggregate } from './supabase'

/**
 * Funkcje dla pracodawców
 */
export async function getEmployerBySlug(slug: string): Promise<Employer | null> {
  const { data, error } = await supabase
    .from('employers')
    .select('*')
    .eq('slug', slug)
    .single()

  if (error) {
    console.error('Error fetching employer:', error)
    return null
  }

  return data
}

export async function getEmployers(limit = 20, offset = 0): Promise<Employer[]> {
  const { data, error } = await supabase
    .from('employers')
    .select('*')
    .order('review_count', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching employers:', error)
    return []
  }

  return data || []
}

export async function searchEmployers(query: string, limit = 20): Promise<Employer[]> {
  const { data, error } = await supabase
    .from('employers')
    .select('*')
    .or(`name.ilike.%${query}%, nip.ilike.%${query}%`)
    .order('review_count', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching employers:', error)
    return []
  }

  return data || []
}

/**
 * Funkcje dla opinii
 */
export async function getPublishedReviews(
  employerId: string, 
  limit = 20, 
  offset = 0
): Promise<Review[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select('*')
    .eq('employer_id', employerId)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching reviews:', error)
    return []
  }

  return data || []
}

export async function getRecentReviews(limit = 10): Promise<ReviewWithEmployer[]> {
  const { data, error } = await supabase
    .from('reviews')
    .select(`
      *,
      employer:employers(*)
    `)
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching recent reviews:', error)
    return []
  }

  return data || []
}

export async function createReview(reviewData: {
  employerId: string
  authorName: string // Wymagane
  authorEmail?: string // Opcjonalne
  rating: number
  title?: string
  body: string
  ipAddress: string // Wymagane
  userAgent?: string
}): Promise<{ success: boolean; reviewId?: string; error?: string }> {
  try {
    // Walidacja danych
    if (reviewData.rating < 1 || reviewData.rating > 5) {
      return { success: false, error: 'Ocena musi być między 1 a 5' }
    }

    if (!reviewData.body || reviewData.body.trim().length < 10) {
      return { success: false, error: 'Treść opinii musi mieć co najmniej 10 znaków' }
    }

    if (!reviewData.authorName || reviewData.authorName.trim().length < 2) {
      return { success: false, error: 'Nazwa użytkownika musi mieć co najmniej 2 znaki' }
    }

    if (!reviewData.ipAddress) {
      return { success: false, error: 'Brak adresu IP' }
    }

    // Sprawdź czy pracodawca istnieje
    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('id', reviewData.employerId)
      .single()

    if (!employer) {
      return { success: false, error: 'Pracodawca nie istnieje' }
    }

    // Sprawdź czy już istnieje opinia z tego IP dla tego pracodawcy
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id')
      .eq('employer_id', reviewData.employerId)
      .eq('ip_address', reviewData.ipAddress)
      .single()

    if (existingReview) {
      return { success: false, error: 'Z tego adresu IP już dodano opinię o tej firmie' }
    }

    // Utwórz opinię
    const { data, error } = await supabase
      .from('reviews')
      .insert({
        employer_id: reviewData.employerId,
        author_name: reviewData.authorName.trim(),
        author_email: reviewData.authorEmail?.trim() || null,
        rating: reviewData.rating,
        title: reviewData.title?.trim() || null,
        body: reviewData.body.trim(),
        status: 'published', // Na początek publikujemy od razu
        published_at: new Date().toISOString(),
        ip_address: reviewData.ipAddress,
        user_agent: reviewData.userAgent
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      if (error.code === '23505') { // unique_violation
        return { success: false, error: 'Już dodałeś opinię o tej firmie' }
      }
      return { success: false, error: 'Błąd podczas zapisywania opinii' }
    }

    return { success: true, reviewId: data.id }
  } catch (error) {
    console.error('Error creating review:', error)
    return { success: false, error: 'Nieoczekiwany błąd' }
  }
}

/**
 * Funkcje dla agregatów i statystyk
 */
export async function getEmployerAggregate(employerId: string): Promise<EmployerAggregate> {
  // Pobierz podstawowe dane
  const { data: employer } = await supabase
    .from('employers')
    .select('avg_rating, review_count')
    .eq('id', employerId)
    .single()

  // Pobierz rozkład ocen
  const { data: ratings } = await supabase
    .from('reviews')
    .select('rating')
    .eq('employer_id', employerId)
    .eq('status', 'published')

  const ratingDistribution = { 1: 0, 2: 0, 3: 0, 4: 0, 5: 0 }
  
  if (ratings) {
    ratings.forEach(r => {
      ratingDistribution[r.rating as keyof typeof ratingDistribution]++
    })
  }

  return {
    avg_rating: employer?.avg_rating || 0,
    review_count: employer?.review_count || 0,
    rating_distribution: ratingDistribution
  }
}

export async function getGlobalStats(): Promise<{
  totalEmployers: number
  totalReviews: number
  avgRating: number
}> {
  // Liczba pracodawców
  const { count: employersCount } = await supabase
    .from('employers')
    .select('*', { count: 'exact', head: true })

  // Liczba opinii
  const { count: reviewsCount } = await supabase
    .from('reviews')
    .select('*', { count: 'exact', head: true })
    .eq('status', 'published')

  // Średnia ocena globalna
  const { data: avgData } = await supabase
    .from('reviews')
    .select('rating')
    .eq('status', 'published')

  let avgRating = 0
  if (avgData && avgData.length > 0) {
    const sum = avgData.reduce((acc, r) => acc + r.rating, 0)
    avgRating = sum / avgData.length
  }

  return {
    totalEmployers: employersCount || 0,
    totalReviews: reviewsCount || 0,
    avgRating
  }
}

/**
 * Funkcje pomocnicze
 */
export function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Usuń znaki specjalne
    .replace(/\s+/g, '-') // Zamień spacje na myślniki
    .replace(/-+/g, '-') // Usuń wielokrotne myślniki
    .trim()
}

export async function createEmployerIfNotExists(data: {
  name: string
  nip: string // Wymagane
  url?: string
  city?: string
  description?: string
  phone1?: string
  phone2?: string
  phone3?: string
}): Promise<{ success: boolean; employer?: Employer; error?: string }> {
  try {
    // Walidacja NIP
    if (!data.nip || !/^\d{10}$/.test(data.nip)) {
      return { success: false, error: 'NIP musi składać się z 10 cyfr' }
    }

    // Sprawdź czy NIP już istnieje
    const { data: existingByNip } = await supabase
      .from('employers')
      .select('*')
      .eq('nip', data.nip)
      .single()

    if (existingByNip) {
      return { success: true, employer: existingByNip }
    }

    const slug = generateSlug(data.name)

    // Sprawdź czy slug już istnieje (dla bezpieczeństwa)
    let finalSlug = slug
    let counter = 1
    while (true) {
      const { data: existingBySlug } = await supabase
        .from('employers')
        .select('id')
        .eq('slug', finalSlug)
        .single()

      if (!existingBySlug) break
      finalSlug = `${slug}-${counter}`
      counter++
    }

    // Utwórz nowego pracodawcę
    const { data: employer, error } = await supabase
      .from('employers')
      .insert({
        slug: finalSlug,
        name: data.name,
        nip: data.nip,
        url: data.url,
        city: data.city,
        description: data.description,
        phone1: data.phone1,
        phone2: data.phone2,
        phone3: data.phone3
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating employer:', error)
      if (error.code === '23505') { // unique_violation
        if (error.message.includes('nip')) {
          return { success: false, error: 'Firma z tym NIP już istnieje' }
        }
      }
      return { success: false, error: 'Błąd podczas tworzenia pracodawcy' }
    }

    return { success: true, employer }
  } catch (error) {
    console.error('Error creating employer:', error)
    return { success: false, error: 'Nieoczekiwany błąd' }
  }
}

// Funkcja do wyszukiwania pracodawcy po NIP
export async function getEmployerByNip(nip: string): Promise<Employer | null> {
  const { data, error } = await supabase
    .from('employers')
    .select('*')
    .eq('nip', nip)
    .single()

  if (error) {
    console.error('Error fetching employer by NIP:', error)
    return null
  }

  return data
}
