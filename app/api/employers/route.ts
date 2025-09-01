import { NextRequest, NextResponse } from 'next/server'
import { createEmployerIfNotExists } from '@/lib/database'

interface CreateEmployerRequest {
  name: string
  nip: string
  url?: string
  city?: string
  description?: string
  phone1?: string
  phone2?: string
  phone3?: string
}

export async function POST(request: NextRequest) {
  try {
    const body: CreateEmployerRequest = await request.json()

    // Walidacja podstawowych danych
    if (!body.name || body.name.trim().length < 2) {
      return NextResponse.json(
        { error: 'Nazwa firmy musi mieć co najmniej 2 znaki' },
        { status: 400 }
      )
    }

    if (!body.nip || !/^\d{10}$/.test(body.nip)) {
      return NextResponse.json(
        { error: 'NIP musi składać się z 10 cyfr' },
        { status: 400 }
      )
    }

    if (body.name.trim().length > 500) {
      return NextResponse.json(
        { error: 'Nazwa firmy nie może przekraczać 500 znaków' },
        { status: 400 }
      )
    }

    if (body.description && body.description.trim().length > 1000) {
      return NextResponse.json(
        { error: 'Opis firmy nie może przekraczać 1000 znaków' },
        { status: 400 }
      )
    }

    // Walidacja URL (jeśli podany)
    if (body.url) {
      try {
        new URL(body.url)
      } catch {
        return NextResponse.json(
          { error: 'Nieprawidłowy format URL' },
          { status: 400 }
        )
      }
    }

    // Walidacja telefonów (jeśli podane)
    const phoneRegex = /^[\d\s\-\+\(\)]{7,20}$/
    if (body.phone1 && !phoneRegex.test(body.phone1)) {
      return NextResponse.json(
        { error: 'Telefon 1 ma nieprawidłowy format' },
        { status: 400 }
      )
    }
    if (body.phone2 && !phoneRegex.test(body.phone2)) {
      return NextResponse.json(
        { error: 'Telefon 2 ma nieprawidłowy format' },
        { status: 400 }
      )
    }
    if (body.phone3 && !phoneRegex.test(body.phone3)) {
      return NextResponse.json(
        { error: 'Telefon 3 ma nieprawidłowy format' },
        { status: 400 }
      )
    }

    // Utwórz pracodawcę
    const result = await createEmployerIfNotExists({
      name: body.name.trim(),
      nip: body.nip,
      url: body.url?.trim(),
      city: body.city?.trim(),
      description: body.description?.trim(),
      phone1: body.phone1?.trim(),
      phone2: body.phone2?.trim(),
      phone3: body.phone3?.trim()
    })

    if (!result.success) {
      return NextResponse.json(
        { error: result.error },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { 
        success: true, 
        employer: result.employer,
        message: 'Firma została dodana pomyślnie'
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Error in POST /api/employers:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const nip = searchParams.get('nip')

    if (nip) {
      // Wyszukiwanie po NIP
      const { getEmployerByNip } = await import('@/lib/database')
      const employer = await getEmployerByNip(nip)
      
      if (!employer) {
        return NextResponse.json(
          { error: 'Firma o podanym NIP nie została znaleziona' },
          { status: 404 }
        )
      }

      return NextResponse.json({ employer })
    }

    if (query) {
      // Wyszukiwanie tekstowe
      const { searchEmployers } = await import('@/lib/database')
      const employers = await searchEmployers(query, 20)
      
      return NextResponse.json({ employers })
    }

    // Lista pracodawców
    const { getEmployers } = await import('@/lib/database')
    const limit = parseInt(searchParams.get('limit') || '20')
    const offset = parseInt(searchParams.get('offset') || '0')
    
    const employers = await getEmployers(limit, offset)
    
    return NextResponse.json({
      employers,
      pagination: {
        limit,
        offset,
        hasMore: employers.length === limit
      }
    })

  } catch (error) {
    console.error('Error in GET /api/employers:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
