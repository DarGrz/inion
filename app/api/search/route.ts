import { NextRequest, NextResponse } from 'next/server'
import { searchEmployers } from '@/lib/database'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '20')

    if (!query || query.trim().length < 2) {
      return NextResponse.json(
        { error: 'Zapytanie musi mieć co najmniej 2 znaki' },
        { status: 400 }
      )
    }

    const employers = await searchEmployers(query.trim(), limit)

    return NextResponse.json({
      success: true,
      employers,
      count: employers.length
    })

  } catch (error) {
    console.error('Search API error:', error)
    return NextResponse.json(
      { error: 'Błąd podczas wyszukiwania' },
      { status: 500 }
    )
  }
}
