import { NextRequest, NextResponse } from 'next/server'
import { getPublishedArticles, searchArticles } from '@/lib/articles'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const query = searchParams.get('q')
    const limit = parseInt(searchParams.get('limit') || '10')
    const offset = parseInt(searchParams.get('offset') || '0')

    let articles
    
    if (query) {
      // Wyszukiwanie artykułów
      articles = await searchArticles(query, limit)
    } else {
      // Pobieranie wszystkich opublikowanych artykułów
      articles = await getPublishedArticles(limit, offset)
    }

    return NextResponse.json({
      articles,
      total: articles.length,
      limit,
      offset
    })
  } catch (error) {
    console.error('Error fetching articles:', error)
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    )
  }
}
