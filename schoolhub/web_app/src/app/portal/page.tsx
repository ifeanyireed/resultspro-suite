import ScrollReveal from '@/components/ScrollReveal/ScrollReveal';
import Image from 'next/image';

export default function PortalPage() {
  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      <ScrollReveal animation="zoom-in">
        <div style={{ 
          background: 'rgba(255, 255, 255, 0.9)', 
          backdropFilter: 'blur(20px)', 
          padding: '4rem', 
          width: '100%', 
          maxWidth: '500px',
          textAlign: 'center',
          boxShadow: '0 40px 100px rgba(0,0,0,0.1)'
        }}>
          <Image src="/logo.png" alt="Loral Logo" width={100} height={100} style={{ width: 'auto', height: '80px', marginBottom: '2rem' }} />
          <h2 style={{ color: 'var(--color-sky-blue)', marginBottom: '1rem', textShadow: 'none' }}>SchoolHub Portal</h2>
          <p style={{ color: 'var(--color-text-on-white)', marginBottom: '2rem' }}>Please enter your credentials to access your dashboard.</p>
          
          <form style={{ display: 'grid', gap: '1rem' }}>
            <input type="text" placeholder="Student ID or Email" style={{ padding: '1rem', border: '1px solid var(--color-border)', background: 'white' }} />
            <input type="password" placeholder="Password" style={{ padding: '1rem', border: '1px solid var(--color-border)', background: 'white' }} />
            <button className="btn btn-primary" style={{ marginTop: '1rem', width: '100%' }}>Login</button>
          </form>
          
          <div style={{ marginTop: '2rem' }}>
            <a href="#" style={{ fontSize: '0.85rem', color: 'var(--color-sky-blue)', textDecoration: 'none' }}>Forgot password?</a>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}
