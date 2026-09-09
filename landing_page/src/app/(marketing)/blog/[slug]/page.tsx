import BlogPostContent from '@/components/BlogPostContent';
import { notFound } from 'next/navigation';

export const metadata = {
  title: 'Article | ResultsPRO Suite',
};

// Dummy data matcher
const DUMMY_POSTS = {
  "how-digital-campuses-transform-schools": {
    id: 1,
    title: "How Digital Campuses Are Transforming African Schools",
    excerpt: "Discover the tangible impact of mobile-first educational infrastructure on student performance and parent engagement.",
    author: "ResultsPRO Team",
    created_at: "2026-09-08T10:00:00Z",
    slug: "how-digital-campuses-transform-schools",
    content: "<p>The integration of digital campuses in African schools has rapidly changed the educational landscape...</p><p>By unifying admissions, payments, curriculum, and results into a single mobile-first platform, parents are no longer sidelined. They get real-time actionable intelligence on their children's performance.</p><h3>The Offline-First Advantage</h3><p>We built ClassroomPRO and ResultsPRO with the realities of the African internet infrastructure in mind.</p>",
    comments: []
  },
  "gamifying-waec-preparation": {
    id: 2,
    title: "Gamifying WAEC Preparation: The ExamsPRO Approach",
    excerpt: "Why traditional study methods are failing modern students, and how gamified CBT engines build extreme readiness.",
    author: "ResultsPRO Team",
    created_at: "2026-09-02T10:00:00Z",
    slug: "gamifying-waec-preparation",
    content: "<p>Students today are native to gamified environments. When we try to force them into traditional rote-learning silos for WAEC preparation, we lose their attention.</p><h3>Enter ExamsPRO</h3><p>By simulating the exact WAEC CBT environment but introducing Coins, Streaks, and Live Multiplayer Battles, we turn examination prep into an addictive, positive loop.</p>",
    comments: []
  },
  "introducing-classroompro-offline-first": {
    id: 3,
    title: "Introducing ClassroomPRO: Offline-First Learning",
    excerpt: "Internet access shouldn't limit education. Learn how our offline-first architecture is keeping students connected to their curriculum.",
    author: "Product Team",
    created_at: "2026-08-25T10:00:00Z",
    slug: "introducing-classroompro-offline-first",
    content: "<p>Today, we're thrilled to introduce ClassroomPRO. A comprehensive LMS designed specifically for schools that experience intermittent connectivity.</p><p>Our edge-sync technology allows students to download entire curriculum modules while on the school's local network, complete interactive assessments offline at home, and sync the results automatically once they reconnect.</p>",
    comments: []
  }
};

export default function BlogPostPage({ params }: { params: { slug: string } }) {
  const post = DUMMY_POSTS[params.slug as keyof typeof DUMMY_POSTS];
  
  if (!post) {
    notFound();
  }

  return <BlogPostContent post={post} />;
}
