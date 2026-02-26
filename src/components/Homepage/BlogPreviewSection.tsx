import Link from 'next/link'

interface BlogPost {
  title: string
  slug: string
  publishedAt?: string | null
}

export function BlogPreviewSection({ posts }: { posts: BlogPost[] }) {
  return (
    <section className="container py-16">
      <div className="mb-8 flex items-center justify-between">
        <h2 className="text-xs font-semibold uppercase tracking-widest text-[var(--brand-muted)]">
          RECENT WRITING
        </h2>
        <Link
          href="/posts"
          className="text-xs text-[var(--brand-muted)] hover:text-[var(--brand-clay)] transition-colors"
        >
          View All &rarr;
        </Link>
      </div>

      <div className="divide-y divide-[var(--brand-border)]">
        {posts.map((post) => (
          <Link
            key={post.slug}
            href={`/posts/${post.slug}`}
            className="group flex items-center justify-between py-4 transition-colors"
          >
            <span className="text-[var(--brand-platinum)] group-hover:text-[var(--brand-clay)] transition-colors">
              {post.title}
            </span>
            {post.publishedAt && (
              <time
                className="text-xs text-[var(--brand-muted)] shrink-0 ml-4"
                dateTime={post.publishedAt}
              >
                {new Date(post.publishedAt).toLocaleDateString('en-US', {
                  month: 'short',
                  day: 'numeric',
                  year: 'numeric',
                })}
              </time>
            )}
          </Link>
        ))}
      </div>
    </section>
  )
}
