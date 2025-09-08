import { getPublishedArticles, getArticleCategories } from '@/lib/articles'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Artykuły - oipinion.com',
  description: 'Przeczytaj nasze artykuły o rynku pracy, prawach pracownika i firmach w Polsce.',
}

export default async function ArticlesPage() {
  const [articles, categories] = await Promise.all([
    getPublishedArticles(20),
    getArticleCategories()
  ])

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Artykuły</h1>
        
        {/* Kategorie */}
        {categories.length > 0 && (
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-4">Kategorie</h2>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Link
                  key={category.id}
                  href={`/artykuly/kategoria/${category.slug}`}
                  className="inline-block bg-blue-100 hover:bg-blue-200 text-blue-800 px-3 py-1 rounded-full text-sm transition-colors"
                >
                  {category.name}
                </Link>
              ))}
            </div>
          </div>
        )}

        {/* Lista artykułów */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {articles.map((article) => (
            <article key={article.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
              {article.featured_image && (
                <div className="aspect-video w-full overflow-hidden">
                  <Image
                    src={article.featured_image}
                    alt={article.title}
                    width={400}
                    height={225}
                    className="w-full h-full object-cover"
                  />
                </div>
              )}
              
              <div className="p-6">
                <h2 className="text-xl font-semibold mb-2 line-clamp-2">
                  <Link href={`/artykuly/${article.slug}`} className="hover:text-blue-600 transition-colors">
                    {article.title}
                  </Link>
                </h2>
                
                {article.excerpt && (
                  <p className="text-gray-600 mb-4 line-clamp-3">
                    {article.excerpt}
                  </p>
                )}
                
                <div className="flex items-center justify-between text-sm text-gray-500">
                  <span>Autor: {article.author_name}</span>
                  {article.published_at && (
                    <time dateTime={article.published_at}>
                      {new Date(article.published_at).toLocaleDateString('pl-PL')}
                    </time>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>

        {articles.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500 text-lg">Brak artykułów do wyświetlenia.</p>
          </div>
        )}
      </div>
    </div>
  )
}
