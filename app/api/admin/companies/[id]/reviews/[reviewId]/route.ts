import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'

// GET - Pobierz opinię po ID
export async function GET(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id, reviewId } = await params
    
    const { data: review, error } = await supabase
      .from('reviews')
      .select('*')
      .eq('id', reviewId)
      .eq('employer_id', id)
      .single()

    if (error || !review) {
      return NextResponse.json(
        { error: 'Opinia nie została znaleziona' },
        { status: 404 }
      )
    }

    return NextResponse.json({ review })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error fetching review:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

// PUT - Aktualizuj opinię
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id, reviewId } = await params
    
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

    // Sprawdź czy opinia istnieje
    const { data: existingReview } = await supabase
      .from('reviews')
      .select('id, status')
      .eq('id', reviewId)
      .eq('employer_id', id)
      .single()

    if (!existingReview) {
      return NextResponse.json(
        { error: 'Opinia nie została znaleziona' },
        { status: 404 }
      )
    }

    // Przygotuj dane do aktualizacji
    const updateData: {
      author_name: string
      author_email: string | null
      rating: number
      title: string | null
      body: string
      work_life_balance: number | null
      salary_rating: number | null
      management_rating: number | null
      career_development: number | null
      status: string
      updated_at: string
      published_at?: string | null
    } = {
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
      updated_at: new Date().toISOString()
    }

    // Jeśli status zmienia się na published, ustaw published_at
    if (body.status === 'published' && existingReview.status !== 'published') {
      updateData.published_at = new Date().toISOString()
    }

    // Jeśli status zmienia się z published na inny, usuń published_at
    if (body.status !== 'published' && existingReview.status === 'published') {
      updateData.published_at = null
    }

    // Aktualizuj opinię
    const { data: review, error } = await supabase
      .from('reviews')
      .update(updateData)
      .eq('id', reviewId)
      .eq('employer_id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating review:', error)
      return NextResponse.json(
        { error: 'Błąd podczas aktualizacji opinii' },
        { status: 500 }
      )
    }

    // Aktualizuj statystyki firmy
    await updateEmployerStats(id)

    return NextResponse.json({
      success: true,
      review,
      message: 'Opinia została zaktualizowana pomyślnie'
    })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error in PUT /api/admin/companies/[id]/reviews/[reviewId]:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

// DELETE - Usuń opinię
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string; reviewId: string } }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id, reviewId } = await params
    
    // Sprawdź czy opinia istnieje
    const { data: review } = await supabase
      .from('reviews')
      .select('id, author_name')
      .eq('id', reviewId)
      .eq('employer_id', id)
      .single()

    if (!review) {
      return NextResponse.json(
        { error: 'Opinia nie została znaleziona' },
        { status: 404 }
      )
    }

    // Usuń opinię
    const { error } = await supabase
      .from('reviews')
      .delete()
      .eq('id', reviewId)
      .eq('employer_id', id)

    if (error) {
      console.error('Error deleting review:', error)
      return NextResponse.json(
        { error: 'Błąd podczas usuwania opinii' },
        { status: 500 }
      )
    }

    // Aktualizuj statystyki firmy
    await updateEmployerStats(id)

    return NextResponse.json({
      success: true,
      message: 'Opinia została usunięta pomyślnie'
    })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error in DELETE /api/admin/companies/[id]/reviews/[reviewId]:', error)
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
