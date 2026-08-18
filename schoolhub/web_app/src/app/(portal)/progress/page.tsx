import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';

export default function ProgressPage() {
  return (
    <div style={{ maxWidth: '1200px' }}>
      <ScrollReveal animation="fade-up">
        <header style={{ marginBottom: '3rem' }}>
          <h1 style={{ fontSize: '2.5rem', marginBottom: '0.5rem', color: '#1a202c', textShadow: 'none' }}>Academic Progress</h1>
          <p style={{ color: '#718096', textShadow: 'none' }}>Track your grades, attendance, and performance analytics.</p>
        </header>
      </ScrollReveal>
      <div style={{ padding: '4rem', background: 'white', borderRadius: '1.5rem', border: '1px solid #f0f4f8', textAlign: 'center' }}>
        <h2 style={{ color: 'var(--color-sky-blue)', marginBottom: '1rem' }}>ResultsPRO</h2>
        <p>Analytics engine initializing...</p>
      </div>
    </div>
  );
}
