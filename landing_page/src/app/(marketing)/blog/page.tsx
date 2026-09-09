import Link from 'next/link';
import { IconArrowRight } from '@tabler/icons-react';

export const metadata = {
  title: 'Blog | ResultsPRO Suite',
  description: 'Latest insights, updates, and stories from the ResultsPRO team.',
};

const DUMMY_POSTS = [
  {
    id: 1,
    title: "How Digital Campuses Are Transforming African Schools",
    excerpt: "Discover the tangible impact of mobile-first educational infrastructure on student performance and parent engagement.",
    author: "ResultsPRO Team",
    date: "Sep 8, 2026",
    slug: "how-digital-campuses-transform-schools",
    category: "Education",
    image: "/photo13.jpeg"
  },
  {
    id: 2,
    title: "Gamifying WAEC Preparation: The ExamsPRO Approach",
    excerpt: "Why traditional study methods are failing modern students, and how gamified CBT engines build extreme readiness.",
    author: "ResultsPRO Team",
    date: "Sep 2, 2026",
    slug: "gamifying-waec-preparation",
    category: "Exams",
    image: "/photo03.jpeg"
  },
  {
    id: 3,
    title: "Introducing ClassroomPRO: Offline-First Learning",
    excerpt: "Internet access shouldn't limit education. Learn how our offline-first architecture is keeping students connected to their curriculum.",
    author: "Product Team",
    date: "Aug 25, 2026",
    slug: "introducing-classroompro-offline-first",
    category: "Product",
    image: "/photo04.jpeg"
  }
];

export default function BlogPage() {
  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      {/* Blog Hero */}
      <section className="bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="container-nets">
          <div className="max-w-3xl">
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Our Blog</div>
            <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Insights, Updates <br/>& <span style={{ fontWeight: 700 }}>Transformations.</span>
            </h1>
            <p className="text-body-lg text-white/70">
              Read the latest news from the ResultsPRO suite, deep-dives into educational technology, and success stories from our partner schools.
            </p>
          </div>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="section-py">
        <div className="container-nets">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {DUMMY_POSTS.map((post) => (
              <article key={post.id} className="bg-white rounded-sm shadow-sm hover:shadow-card-lg transition-shadow overflow-hidden flex flex-col border border-nets-border">
                <div className="relative h-48 overflow-hidden bg-nets-light">
                  <img 
                    src={post.image} 
                    alt={post.title} 
                    className="w-full h-full object-cover transition-transform duration-500 hover:scale-105"
                  />
                  <div className="absolute top-4 left-4">
                    <span className="bg-white/90 backdrop-blur-sm text-navy text-xs fw-600 px-3 py-1 rounded-sm">
                      {post.category}
                    </span>
                  </div>
                </div>
                
                <div className="p-6 flex flex-col flex-1">
                  <div className="flex items-center justify-between text-xs text-muted mb-3">
                    <span>{post.date}</span>
                    <span>{post.author}</span>
                  </div>
                  <h2 className="text-xl fw-600 mb-3 text-navy leading-tight line-clamp-2">
                    {post.title}
                  </h2>
                  <p className="text-sm text-muted mb-6 flex-1 line-clamp-3">
                    {post.excerpt}
                  </p>
                  
                  <div className="mt-auto pt-4 border-t border-nets-border">
                    {/* Link to slug once detail page is built, for now just # */}
                    <Link href={`/blog/${post.slug}`} className="flex items-center gap-2 text-sm fw-600 text-red hover:opacity-80 transition-opacity" style={{ color: 'var(--color-nets-red)' }}>
                      Read Article <IconArrowRight size={16} />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>

          <div className="mt-16 text-center">
            <button className="btn btn-outline-navy">
              Load More Articles
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}
