import { supabase, Article, ArticleCategory, ArticleWithCategories } from './supabase'

/**
 * Funkcje dla artykułów
 */

// Pobieranie opublikowanych artykułów dla strony publicznej
export async function getPublishedArticles(limit = 10, offset = 0): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .order('sort_order', { ascending: true })
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching articles:', error)
    return []
  }

  return data || []
}

// Pobieranie pojedynczego artykułu po slug
export async function getArticleBySlug(slug: string): Promise<ArticleWithCategories | null> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_category_relations!inner(
        article_categories(*)
      )
    `)
    .eq('slug', slug)
    .eq('status', 'published')
    .single()

  if (error) {
    console.error('Error fetching article:', error)
    return null
  }

  // Przekształć dane do właściwego formatu
  const article: ArticleWithCategories = {
    ...data,
    categories: data.article_category_relations?.map((rel: { article_categories: ArticleCategory }) => rel.article_categories) || []
  }

  return article
}

// Pobieranie najnowszych artykułów dla strony głównej
export async function getLatestArticles(limit = 5): Promise<Partial<Article>[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('id, slug, title, excerpt, featured_image, published_at, author_name')
    .eq('status', 'published')
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error fetching latest articles:', error)
    return []
  }

  return data || []
}

// Pobieranie artykułów z kategorii
export async function getArticlesByCategory(categorySlug: string, limit = 10, offset = 0): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select(`
      *,
      article_category_relations!inner(
        article_categories!inner(slug)
      )
    `)
    .eq('status', 'published')
    .eq('article_category_relations.article_categories.slug', categorySlug)
    .order('published_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching articles by category:', error)
    return []
  }

  return data || []
}

// Pobieranie wszystkich kategorii
export async function getArticleCategories(): Promise<ArticleCategory[]> {
  const { data, error } = await supabase
    .from('article_categories')
    .select('*')
    .order('name')

  if (error) {
    console.error('Error fetching categories:', error)
    return []
  }

  return data || []
}

// Wyszukiwanie artykułów
export async function searchArticles(query: string, limit = 10): Promise<Article[]> {
  const { data, error } = await supabase
    .from('articles')
    .select('*')
    .eq('status', 'published')
    .or(`title.ilike.%${query}%, excerpt.ilike.%${query}%, content.ilike.%${query}%`)
    .order('published_at', { ascending: false })
    .limit(limit)

  if (error) {
    console.error('Error searching articles:', error)
    return []
  }

  return data || []
}

// Zwiększenie licznika wyświetleń
export async function incrementArticleViewCount(articleId: string): Promise<void> {
  const { error } = await supabase
    .rpc('increment_article_view_count', { article_id: articleId })

  if (error) {
    console.error('Error incrementing view count:', error)
  }
}

/**
 * Funkcje administracyjne dla artykułów (wymagają uprawnień admin)
 */

// Tworzenie nowego artykułu
export async function createArticle(article: Omit<Article, 'id' | 'created_at' | 'updated_at' | 'view_count'>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .insert([article])
    .select()
    .single()

  if (error) {
    console.error('Error creating article:', error)
    return null
  }

  return data
}

// Aktualizacja artykułu
export async function updateArticle(id: string, updates: Partial<Article>): Promise<Article | null> {
  const { data, error } = await supabase
    .from('articles')
    .update(updates)
    .eq('id', id)
    .select()
    .single()

  if (error) {
    console.error('Error updating article:', error)
    return null
  }

  return data
}

// Usuwanie artykułu
export async function deleteArticle(id: string): Promise<boolean> {
  const { error } = await supabase
    .from('articles')
    .delete()
    .eq('id', id)

  if (error) {
    console.error('Error deleting article:', error)
    return false
  }

  return true
}

// Pobieranie wszystkich artykułów dla admina (z możliwością filtrowania po statusie)
export async function getAllArticles(status?: string, limit = 20, offset = 0): Promise<Article[]> {
  let query = supabase
    .from('articles')
    .select('*')

  if (status) {
    query = query.eq('status', status)
  }

  const { data, error } = await query
    .order('created_at', { ascending: false })
    .range(offset, offset + limit - 1)

  if (error) {
    console.error('Error fetching all articles:', error)
    return []
  }

  return data || []
}
