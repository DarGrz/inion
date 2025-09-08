import { NextRequest, NextResponse } from 'next/server'

const ADMIN_EMAIL = process.env.ADMIN_EMAIL!
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD!

// Sprawdź czy zmienne środowiskowe są ustawione
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) {
  throw new Error('ADMIN_EMAIL i ADMIN_PASSWORD muszą być ustawione w zmiennych środowiskowych')
}

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json()

    // Walidacja danych
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email i hasło są wymagane' },
        { status: 400 }
      )
    }

    // Sprawdź dane logowania
    if (email !== ADMIN_EMAIL || password !== ADMIN_PASSWORD) {
      return NextResponse.json(
        { error: 'Nieprawidłowy email lub hasło' },
        { status: 401 }
      )
    }

    // Utwórz sesję
    const sessionToken = generateSessionToken()
    const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24 godziny

    // Utwórz response z cookie
    const response = NextResponse.json({
      success: true,
      message: 'Zalogowano pomyślnie'
    })

    // Ustaw cookie
    response.cookies.set('admin-session', sessionToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      expires: expiresAt,
      path: '/'
    })

    return response

  } catch (error) {
    console.error('Login error:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd serwera' },
      { status: 500 }
    )
  }
}

function generateSessionToken(): string {
  return 'admin_' + Math.random().toString(36).substring(2) + Date.now().toString(36)
}
