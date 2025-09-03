import { NextRequest, NextResponse } from 'next/server'
import { revalidatePath } from 'next/cache'
import { createReview, getEmployerBySlug } from '@/lib/database'

interface CreateReviewRequest {
  employerSlug: string
  authorName: string // Wymagane
  authorEmail?: string // Opcjonalne
  rating: number
  title?: string
  body: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateReviewRequest = await request.json()

    // Walidacja podstawowych danych
    if (!body.employerSlug) {
      return NextResponse.json(
        { error: 'Brak identyfikatora pracodawcy' },
        { status: 400 }
      )
    }

    if (!body.authorName || body.authorName.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nazwa użytkownika musi mieć co najmniej 2 znaki' },
        { status: 400 }
      )
    }

    if (!body.rating || body.rating < 1 || body.rating > 5) {
      return NextResponse.json(
        { error: 'Ocena musi być liczbą od 1 do 5' },
        { status: 400 }
      )
    }

    if (!body.body || body.body.trim().length < 10) {
      return NextResponse.json(
        { error: 'Treść opinii musi mieć co najmniej 10 znaków' },
        { status: 400 }
      )
    }

    if (body.body.trim().length > 2000) {
      return NextResponse.json(
        { error: 'Treść opinii nie może przekraczać 2000 znaków' },
        { status: 400 }
      )
    }

    // Sprawdź czy pracodawca istnieje
    const employer = await getEmployerBySlug(body.employerSlug)
    if (!employer) {
      return NextResponse.json(
        { error: 'Pracodawca nie został znaleziony' },
        { status: 404 }
      )
    }

    // Pobierz informacje o kliencie
    const ipAddress = request.headers.get('x-forwarded-for')?.split(',')[0] ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const userAgent = request.headers.get('user-agent') || 'unknown'

    // Utwórz opinię
    const result = await createReview({
      employerId: employer.id,
      authorName: body.authorName,
      authorEmail: body.authorEmail,
      rating: body.rating,
      title: body.title,
      body: body.body,
      ipAddress,
      userAgent
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    // Rewalidacja strony pracodawcy - JSON-LD będzie od razu aktualny
    revalidatePath(`/${body.employerSlug}`)
    revalidatePath('/') // Także strona główna z najnowszymi opiniami

    return NextResponse.json(
      { 
        success: true, 
        reviewId: result.reviewId,
        message: 'Opinia została dodana pomyślnie'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error in POST /api/reviews:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const employerSlug = searchParams.get('employerSlug')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')

    if (!employerSlug) {
      return NextResponse.json(
        { error: 'Brak parametru employerSlug' },
        { status: 400 }
      )
    }

    const employer = await getEmployerBySlug(employerSlug)
    if (!employer) {
      return NextResponse.json(
        { error: 'Pracodawca nie został znaleziony' },
        { status: 404 }
      )
    }

    const { getPublishedReviews } = await import('@/lib/database')
    const reviews = await getPublishedReviews(employer.id, limit, offset)

    return NextResponse.json({
      reviews,
      employer,
      pagination: {
        limit,
        offset,
        hasMore: reviews.length === limit
      }
    })

  } catch (error) {
    console.error('Error in GET /api/reviews:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
