import { NextResponse } from 'next/server'
import { getGlobalStats } from '@/lib/database'
import { requireAdminAuth } from '@/lib/auth'

export async function GET() {
  try {
    // Sprawdź autoryzację
    await requireAdminAuth()
    
    const stats = await getGlobalStats()
    return NextResponse.json(stats)
  } catch (error: unknown) {
    if (error instanceof Error && error.message === 'Unauthorized') {
      return NextResponse.json(
        { error: 'Dostęp zabroniony' },
        { status: 401 }
      )
    }
    
    console.error('Error fetching admin stats:', error)
    return NextResponse.json(
      { error: 'Wystąpił błąd podczas pobierania statystyk' },
      { status: 500 }
    )
  }
}
