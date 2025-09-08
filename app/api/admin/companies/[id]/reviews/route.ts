import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'

// GET - Pobierz wszystkie opinie dla firmy (w tym niepublikowane)
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id } = await params
    
    const { data: reviews, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('employer_id', id)
      .order('created_at', { ascending: false })

    if (error) {
      console.error('Error fetching reviews:', error)
      return NextResponse.json(
        { error: 'Błąd podczas pobierania opinii' },
        { status: 500 }
      )
    }

    return NextResponse.json({ reviews: reviews || [] })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error in GET /api/admin/companies/[id]/reviews:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

// POST - Dodaj nową opinię
export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id } = await params
    
    const body = await request.json()

    // Walidacja danych
    if (!body.author_name || body.author_name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Imię i nazwisko musi mieć co najmniej 2 znaki' },
        { status: 400 }
      )
    }

    if (!body.body || body.body.trim().length < 10) {
      return NextResponse.json(
        { error: 'Treść opinii musi mieć co najmniej 10 znaków' },
        { status: 400 }
      )
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Ocena musi być między 1 a 5' },
        { status: 400 }
      )
    }

    // Sprawdź czy firma istnieje
    const { data: employer } = await supabase
      .from('employers')
      .select('id')
      .eq('id', id)
      .single()

    if (!employer) {
      return NextResponse.json(
        { error: 'Firma nie została znaleziona' },
        { status: 404 }
      )
    }

    // Utwórz opinię
    const { data: review, error } = await supabase
      .from('reviews')
      .insert({
        employer_id: id,
        author_name: body.author_name.trim(),
        author_email: body.author_email?.trim() || null,
        rating: body.rating,
        title: body.title?.trim() || null,
        body: body.body.trim(),
        work_life_balance: body.work_life_balance || null,
        salary_rating: body.salary_rating || null,
        management_rating: body.management_rating || null,
        career_development: body.career_development || null,
        status: body.status || 'published',
        published_at: body.status === 'published' ? new Date().toISOString() : null,
        ip_address: '127.0.0.1', // Admin IP
        user_agent: 'Admin Panel'
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating review:', error)
      return NextResponse.json(
        { error: 'Błąd podczas tworzenia opinii' },
        { status: 500 }
      )
    }

    // Aktualizuj statystyki firmy
    await updateEmployerStats(id)

    return NextResponse.json({
      success: true,
      review,
      message: 'Opinia została dodana pomyślnie'
    })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error in POST /api/admin/companies/[id]/reviews:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

// Funkcja pomocnicza do aktualizacji statystyk firmy
async function updateEmployerStats(employerId: string) {
  try {
    // Pobierz wszystkie opublikowane opinie
    const { data: publishedReviews } = await supabase
      .from('reviews')
      .select('rating')
      .eq('employer_id', employerId)
      .eq('status', 'published')

    if (!publishedReviews || publishedReviews.length === 0) {
      // Brak opublikowanych opinii
      await supabase
        .from('employers')
        .update({
          avg_rating: 0,
          review_count: 0,
          updated_at: new Date().toISOString()
        })
        .eq('id', employerId)
      return
    }

    // Oblicz średnią ocenę
    const totalRating = publishedReviews.reduce((sum, review) => sum + review.rating, 0)
    const avgRating = totalRating / publishedReviews.length

    // Aktualizuj statystyki
    await supabase
      .from('employers')
      .update({
        avg_rating: avgRating,
        review_count: publishedReviews.length,
        updated_at: new Date().toISOString()
      })
      .eq('id', employerId)

  } catch (error) {
    console.error('Error updating employer stats:', error)
  }
}
