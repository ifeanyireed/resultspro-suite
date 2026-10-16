import { BlogList } from '@/components/BlogList';

export const dynamic = 'force-dynamic';

export const metadata = {
  title: 'Blog | ResultsPRO Suite',
  description: 'Latest insights, updates, and stories from the ResultsPRO team.',
};

async function fetchWithRetry(url: string, options: RequestInit = {}, retries = 2, delay = 1000): Promise<Response> {
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetch(url, options);
      if (res.ok || (res.status < 500 && res.status !== 408)) {
        return res;
      }
      if (i < retries) {
        await new Promise((r) => setTimeout(r, delay * (i + 1)));
      }
    } catch (err) {
      if (i === retries) throw err;
      await new Promise((r) => setTimeout(r, delay * (i + 1)));
    }
  }
  return fetch(url, options);
}

async function getBlogPosts() {
  try {
    const rawApi = process.env.NEXT_PUBLIC_USERS_API || 'https://resultspro-service-users.onrender.com';
    const USERS_API = rawApi.trim().replace(/^["']|["']$/g, '');
    if (!USERS_API || !USERS_API.startsWith('http')) return [];
    
    const [postsRes, catRes] = await Promise.all([
      fetchWithRetry(`${USERS_API}/api/v1/cms/blog/posts`, { cache: 'no-store' }),
      fetchWithRetry(`${USERS_API}/api/v1/cms/blog/categories`, { cache: 'no-store' })
    ]);
    
    let posts = [];
    if (postsRes.ok) posts = await postsRes.json();
    if (!posts || !Array.isArray(posts)) return [];
    
    const published = posts.filter((p: any) => p.status === 'PUBLISHED');
    
    if (catRes.ok) {
      const categories = await catRes.json();
      published.forEach((p: any) => {
        const cat = categories.find((c: any) => c.id === p.category_id);
        if (cat) p.category = cat.name;
      });
    }
    
    return published;
  } catch (error) {
    console.error('Failed to fetch blog posts', error);
    return [];
  }
}

export default async function BlogPage() {
  const posts = await getBlogPosts();

  return (
    <main className="min-h-screen bg-light" style={{ background: 'var(--color-nets-light)' }}>
      <section className="bg-navy text-white" style={{ background: 'var(--color-nets-navy-dark)', paddingTop: '12rem', paddingBottom: '6rem' }}>
        <div className="container-nets">
          <div className="max-w-3xl">
            <div className="overline-dark" style={{ marginBottom: '1.5rem' }}>Our Blog</div>
            <h1 className="fw-300" style={{ fontSize: 'clamp(2.5rem, 4vw, 3.5rem)', lineHeight: 1.1, marginBottom: '1.5rem' }}>
              Insights, Updates <br />&amp; <span style={{ fontWeight: 700 }}>Transformations.</span>
            </h1>
            <p className="text-body-lg text-white/70">
              Read the latest news from the ResultsPRO suite, deep-dives into educational technology, and success stories from our partner schools.
            </p>
          </div>
        </div>
      </section>

      <section className="section-py">
        <div className="container-nets">
          <BlogList initialPosts={posts} />

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
