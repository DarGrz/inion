import { getArticleBySlug, incrementArticleViewCount, getLatestArticles } from '@/lib/articles'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Metadata } from 'next'

interface ArticlePageProps {
  params: {
    slug: string
  }
}

export async function generateMetadata({ params }: ArticlePageProps): Promise<Metadata> {
  const article = await getArticleBySlug(params.slug)
  
  if (!article) {
    return {
      title: 'Artykuł nie znaleziony - oipinion.com'
    }
  }

  return {
    title: article.meta_title || `${article.title} - oipinion.com`,
    description: article.meta_description || article.excerpt || `Przeczytaj artykuł: ${article.title}`,
    openGraph: {
      title: article.title,
      description: article.excerpt || `Przeczytaj artykuł: ${article.title}`,
      type: 'article',
      publishedTime: article.published_at || undefined,
      authors: [article.author_name],
      images: article.featured_image ? [
        {
          url: article.featured_image,
          width: 1200,
          height: 630,
          alt: article.title,
        }
      ] : undefined,
    },
    twitter: {
      card: 'summary_large_image',
      title: article.title,
      description: article.excerpt || `Przeczytaj artykuł: ${article.title}`,
      images: article.featured_image ? [article.featured_image] : undefined,
    }
  }
}

export default async function ArticlePage({ params }: ArticlePageProps) {
  const [article, relatedArticles] = await Promise.all([
    getArticleBySlug(params.slug),
    getLatestArticles(4)
  ])

  if (!article) {
    notFound()
  }

  // Zwiększ licznik wyświetleń (fire and forget)
  incrementArticleViewCount(article.id).catch(console.error)

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-4xl mx-auto">
        {/* Breadcrumb */}
        <nav className="mb-6">
          <ol className="flex items-center space-x-2 text-sm text-gray-600">
            <li><Link href="/" className="hover:text-blue-600">Strona główna</Link></li>
            <li className="before:content-['/'] before:mx-2">
              <Link href="/artykuly" className="hover:text-blue-600">Artykuły</Link>
            </li>
            <li className="before:content-['/'] before:mx-2 text-gray-900">{article.title}</li>
          </ol>
        </nav>

        {/* Artykuł */}
        <article className="bg-white rounded-lg shadow-sm overflow-hidden">
          {article.featured_image && (
            <div className="aspect-video w-full overflow-hidden">
              <Image
                src={article.featured_image}
                alt={article.title}
                width={800}
                height={450}
                className="w-full h-full object-cover"
                priority
              />
            </div>
          )}
          
          <div className="p-8">
            {/* Kategorie */}
            {article.categories && article.categories.length > 0 && (
              <div className="mb-4">
                <div className="flex flex-wrap gap-2">
                  {article.categories.map((category) => (
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

            {/* Tytuł */}
            <h1 className="text-3xl md:text-4xl font-bold mb-4 text-gray-900">
              {article.title}
            </h1>
            
            {/* Meta informacje */}
            <div className="flex items-center justify-between mb-6 text-gray-600 border-b pb-4">
              <div className="flex items-center space-x-4">
                <span>Autor: <strong>{article.author_name}</strong></span>
                {article.published_at && (
                  <time dateTime={article.published_at}>
                    {new Date(article.published_at).toLocaleDateString('pl-PL', {
                      year: 'numeric',
                      month: 'long',
                      day: 'numeric'
                    })}
                  </time>
                )}
              </div>
              <span className="text-sm">Wyświetlenia: {article.view_count}</span>
            </div>

            {/* Excerpt */}
            {article.excerpt && (
              <div className="text-xl text-gray-700 mb-8 font-medium leading-relaxed">
                {article.excerpt}
              </div>
            )}

            {/* Treść artykułu */}
            <div 
              className="prose prose-lg max-w-none prose-headings:text-gray-900 prose-p:text-gray-700 prose-a:text-blue-600 hover:prose-a:text-blue-800"
              dangerouslySetInnerHTML={{ __html: article.content }}
            />
          </div>
        </article>

        {/* Powiązane artykuły */}
        {relatedArticles.length > 0 && (
          <section className="mt-12">
            <h2 className="text-2xl font-bold mb-6">Inne artykuły</h2>
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
              {relatedArticles
                .filter(related => related.id !== article.id)
                .slice(0, 3)
                .map((related) => (
                <article key={related.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow">
                  {related.featured_image && (
                    <div className="aspect-video w-full overflow-hidden">
                      <Image
                        src={related.featured_image}
                        alt={related.title || 'Artykuł'}
                        width={300}
                        height={169}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                  
                  <div className="p-4">
                    <h3 className="font-semibold mb-2 line-clamp-2">
                      <Link href={`/artykuly/${related.slug}`} className="hover:text-blue-600 transition-colors">
                        {related.title}
                      </Link>
                    </h3>
                    
                    {related.excerpt && (
                      <p className="text-gray-600 text-sm line-clamp-2">
                        {related.excerpt}
                      </p>
                    )}
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </div>
    </div>
  )
}
