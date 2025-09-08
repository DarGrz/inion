import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabase'
import { requireAdminAuth } from '@/lib/auth'

// GET - Pobierz firmę po ID
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id } = await params
    
    const { data: employer, error } = await supabase
      .from('employers')
      .select('*')
      .eq('id', id)
      .single()

    if (error || !employer) {
      return NextResponse.json(
        { error: 'Firma nie została znaleziona' },
        { status: 404 }
      )
    }

    return NextResponse.json({ employer })
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error fetching employer:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

// PUT - Aktualizuj firmę
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id } = await params
    
    const body = await request.json()

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

    // Sprawdź czy firma istnieje
    const { data: existingEmployer } = await supabase
      .from('employers')
      .select('id')
      .eq('id', id)
      .single()

    if (!existingEmployer) {
      return NextResponse.json(
        { error: 'Firma nie została znaleziona' },
        { status: 404 }
      )
    }

    // Usunieto sprawdzanie unikalności NIP - teraz można mieć wiele firm z tym samym NIP (oddziały)

    // Walidacja URL (jeśli podany)
    if (body.url && body.url.trim()) {
      try {
        new URL(body.url)
      } catch {
        return NextResponse.json(
          { error: 'Nieprawidłowy format URL' },
          { status: 400 }
        )
      }
    }

    // Walidacja kodu pocztowego (jeśli podany)
    if (body.postal_code && body.postal_code.trim() && !/^\d{2}-\d{3}$/.test(body.postal_code.trim())) {
      return NextResponse.json(
        { error: 'Kod pocztowy musi być w formacie XX-XXX' },
        { status: 400 }
      )
    }

    // Aktualizuj firmę
    const { data: employer, error } = await supabase
      .from('employers')
      .update({
        name: body.name.trim(),
        nip: body.nip,
        url: body.url?.trim() || null,
        address: body.address?.trim() || null,
        postal_code: body.postal_code?.trim() || null,
        city: body.city?.trim() || null,
        description: body.description?.trim() || null,
        phone1: body.phone1?.trim() || null,
        phone2: body.phone2?.trim() || null,
        phone3: body.phone3?.trim() || null,
        updated_at: new Date().toISOString()
      })
      .eq('id', id)
      .select()
      .single()

    if (error) {
      console.error('Error updating employer:', error)
      return NextResponse.json(
        { error: 'Błąd podczas aktualizacji firmy' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      employer,
      message: 'Firma została zaktualizowana pomyślnie'
    })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error in PUT /api/admin/companies/[id]:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

// DELETE - Usuń firmę
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    // Await params before using
    const { id } = await params
    
    // Sprawdź czy firma istnieje
    const { data: employer } = await supabase
      .from('employers')
      .select('id, name, review_count')
      .eq('id', id)
      .single()

    if (!employer) {
      return NextResponse.json(
        { error: 'Firma nie została znaleziona' },
        { status: 404 }
      )
    }

    // Sprawdź czy firma ma opinie
    if (employer.review_count > 0) {
      return NextResponse.json(
        { error: 'Nie można usunąć firmy, która ma opinie. Najpierw usuń wszystkie opinie.' },
        { status: 400 }
      )
    }

    // Usuń firmę
    const { error } = await supabase
      .from('employers')
      .delete()
      .eq('id', id)

    if (error) {
      console.error('Error deleting employer:', error)
      return NextResponse.json(
        { error: 'Błąd podczas usuwania firmy' },
        { status: 500 }
      )
    }

    return NextResponse.json({
      success: true,
      message: 'Firma została usunięta pomyślnie'
    })

  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error in DELETE /api/admin/companies/[id]:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}
