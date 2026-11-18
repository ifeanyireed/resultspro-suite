export default function Loading() {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        zIndex: 9999,
        background: 'var(--color-nets-navy-dark, #0D1060)',
        overflow: 'hidden',
        display: 'flex',
        flexDirection: 'column',
      }}
    >
      {/* ── Top Navigation Skeleton Bar ── */}
      <header
        style={{
          height: '72px',
          borderBottom: '1px solid rgba(255, 255, 255, 0.08)',
          display: 'flex',
          alignItems: 'center',
          padding: '0 2rem',
          justifyContent: 'space-between',
          flexShrink: 0,
        }}
      >
        {/* Logo Shape */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          <div className="skeleton-box" style={{ width: '40px', height: '40px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ width: '120px', height: '24px', borderRadius: '4px' }} />
        </div>

        {/* Nav Links Shapes */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }} className="hidden lg:flex">
          <div className="skeleton-box" style={{ width: '64px', height: '16px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ width: '80px', height: '16px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ width: '72px', height: '16px', borderRadius: '4px' }} />
          <div className="skeleton-box" style={{ width: '130px', height: '36px', borderRadius: '4px' }} />
        </div>
      </header>

      {/* ── Hero Layout Skeleton ── */}
      <div
        className="container-nets max-w-7xl mx-auto px-4"
        style={{
          flex: 1,
          display: 'grid',
          gridTemplateColumns: 'repeat(12, 1fr)',
          gap: '2.5rem',
          alignItems: 'center',
          paddingTop: '3rem',
          paddingBottom: '3rem',
          width: '100%',
        }}
      >
        {/* Left Editorial Column */}
        <div style={{ gridColumn: 'span 12' }} className="lg:col-span-7 space-y-5">
          {/* Overline pill shape */}
          <div className="skeleton-box" style={{ width: '240px', height: '22px', borderRadius: '12px' }} />

          {/* Headline 3-line split shapes */}
          <div className="space-y-3" style={{ maxWidth: '580px' }}>
            <div className="skeleton-box" style={{ width: '75%', height: '44px', borderRadius: '4px' }} />
            <div className="skeleton-box" style={{ width: '92%', height: '44px', borderRadius: '4px' }} />
            <div className="skeleton-box" style={{ width: '60%', height: '44px', borderRadius: '4px' }} />
          </div>

          {/* Subtitle paragraph shapes */}
          <div className="space-y-2 pt-2" style={{ maxWidth: '500px' }}>
            <div className="skeleton-box" style={{ width: '100%', height: '14px', borderRadius: '3px' }} />
            <div className="skeleton-box" style={{ width: '90%', height: '14px', borderRadius: '3px' }} />
            <div className="skeleton-box" style={{ width: '65%', height: '14px', borderRadius: '3px' }} />
          </div>

          {/* Meta Chips shapes */}
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', paddingTop: '0.5rem' }}>
            <div className="skeleton-box" style={{ width: '150px', height: '32px', borderRadius: '4px' }} />
            <div className="skeleton-box" style={{ width: '140px', height: '32px', borderRadius: '4px' }} />
            <div className="skeleton-box" style={{ width: '130px', height: '32px', borderRadius: '4px' }} />
          </div>

          {/* Countdown Timer Box shape */}
          <div
            style={{
              maxWidth: '440px',
              padding: '1rem',
              borderRadius: '4px',
              border: '1px solid rgba(255, 255, 255, 0.08)',
              background: 'rgba(255, 255, 255, 0.03)',
            }}
          >
            <div className="skeleton-box" style={{ width: '140px', height: '12px', marginBottom: '0.75rem' }} />
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '0.5rem' }}>
              <div className="skeleton-box" style={{ height: '54px', borderRadius: '2px' }} />
              <div className="skeleton-box" style={{ height: '54px', borderRadius: '2px' }} />
              <div className="skeleton-box" style={{ height: '54px', borderRadius: '2px' }} />
              <div className="skeleton-box" style={{ height: '54px', borderRadius: '2px' }} />
            </div>
          </div>
        </div>

        {/* Right Glassmorphic Form Card Skeleton */}
        <div style={{ gridColumn: 'span 12' }} className="lg:col-span-5 flex justify-center lg:justify-end">
          <div
            style={{
              width: '100%',
              maxWidth: '460px',
              height: '480px',
              borderRadius: '4px',
              padding: '1.75rem',
              border: '1px solid rgba(255, 255, 255, 0.12)',
              background: 'rgba(255, 255, 255, 0.05)',
              display: 'flex',
              flexDirection: 'column',
              gap: '1.25rem',
            }}
          >
            <div className="skeleton-box" style={{ width: '120px', height: '16px', borderRadius: '3px' }} />
            <div className="skeleton-box" style={{ width: '200px', height: '24px', borderRadius: '4px' }} />
            <div className="skeleton-box" style={{ width: '100%', height: '38px', borderRadius: '4px' }} />
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem' }}>
              <div className="skeleton-box" style={{ height: '38px', borderRadius: '4px' }} />
              <div className="skeleton-box" style={{ height: '38px', borderRadius: '4px' }} />
            </div>
            <div className="skeleton-box" style={{ width: '100%', height: '38px', borderRadius: '4px' }} />
            <div className="skeleton-box" style={{ width: '100%', height: '38px', borderRadius: '4px' }} />
            <div className="skeleton-box" style={{ width: '100%', height: '46px', borderRadius: '4px', marginTop: 'auto' }} />
          </div>
        </div>
      </div>

      {/* ── Translucent Shimmer & Slow Flashing Keyframes ── */}
      <style>{`
        .skeleton-box {
          background: linear-gradient(
            90deg,
            rgba(255, 255, 255, 0.05) 0%,
            rgba(255, 255, 255, 0.16) 50%,
            rgba(255, 255, 255, 0.05) 100%
          );
          background-size: 200% 100%;
          animation: skeletonShimmer 2.2s ease-in-out infinite, skeletonPulse 2.2s ease-in-out infinite;
        }

        @keyframes skeletonShimmer {
          0% {
            background-position: 200% 0;
          }
          100% {
            background-position: -200% 0;
          }
        }

        @keyframes skeletonPulse {
          0%, 100% {
            opacity: 0.65;
          }
          50% {
            opacity: 1;
          }
        }
      `}</style>
    </div>
  );
}
