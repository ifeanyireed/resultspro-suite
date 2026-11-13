import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import Footer from '@/components/Footer';
import { 
  IconChartBar, 
  IconBook2, 
  IconUsers, 
  IconPuzzle, 
  IconCheck, 
  IconSchool, 
  IconShieldCheck, 
  IconCertificate, 
  IconBolt 
} from '@tabler/icons-react';
import Link from 'next/link';

export default function Home() {
  const specialistApps = [
    {
      id: 'resultspro',
      title: 'ResultsPRO',
      badge: 'Academic Records',
      icon: IconChartBar,
      desc: 'Automated continuous assessment computation, official terminal broadsheets, and tamper-proof scratch cards.',
      features: ['Automated CA1/CA2 math & ranking', 'Encrypted scratch card PIN batches', 'Certified PDF report card export'],
      href: '/results'
    },
    {
      id: 'classroompro',
      title: 'ClassroomPRO',
      badge: 'Curriculum & LMS',
      icon: IconBook2,
      desc: 'NERDC curriculum-aligned offline lesson handouts, interactive formative quizzes, and spaced-repetition flashcards.',
      features: ['Full Nigerian secondary syllabus', 'Spaced-repetition (SRS) flashcards', 'Offline-first student mobile access'],
      href: '/classroom'
    },
    {
      id: 'tutorspro',
      title: 'TutorsPRO',
      badge: '1-on-1 Mentorship',
      icon: IconUsers,
      desc: 'Direct-to-school tutoring network connecting vetted subject-matter educators with learners for targeted remedial classes.',
      features: ['Vetted secondary & WAEC mentors', 'Interactive digital whiteboard room', 'Parent post-session progress reports'],
      href: '/tutors'
    },
    {
      id: 'puzzlepro',
      title: 'PuzzlePRO',
      badge: 'Gamified Coding',
      icon: IconPuzzle,
      desc: '636 progressive coding quests teaching HTML, CSS, JavaScript, and Python logic through algorithmic game puzzles.',
      features: ['636 progressive coding quests', 'Blockly visual code customizer', 'School rosters & live leaderboards'],
      href: '/future-skills'
    }
  ];

  const whyFeatures = [
    {
      title: 'Zero-Config Subdomains',
      desc: 'Deploy instantly under your school name (e.g. greenwood.scholars.ng) or bring your own custom domain.',
      icon: IconSchool,
    },
    {
      title: 'Unified Student Identity',
      desc: 'A single credentials set gives students, parents, and teachers synchronized access across all four applications.',
      icon: IconCertificate,
    },
    {
      title: 'Cryptographic Auditing',
      desc: 'Batch generation and cryptographic encryption of scratch cards prevents grade alteration and tampering.',
      icon: IconShieldCheck,
    },
    {
      title: 'Paystack Settlement',
      desc: 'Automated tuition, scratch card PIN, and excursion payments settled directly into the institution’s bank account.',
      icon: IconBolt,
    },
  ];

  const roleWorkspaces = [
    {
      role: 'School Owners & Principals',
      badge: 'Institutional Command',
      desc: 'Real-time telemetry on student enrollment, bursary revenue, scratch card batches, and teacher allocations.',
      bullets: [
        'Multi-campus central governance',
        'Scratch card PIN batch encryption',
        'Custom domain setup & branding',
        'Granular staff RBAC permissions'
      ]
    },
    {
      role: 'Classroom Teachers',
      badge: 'Frictionless Grading',
      desc: 'Cut administrative mark entry time by 80% with automated CA weighting, broadsheets, and lesson handouts.',
      bullets: [
        'Rapid digital mark-sheet entry',
        'Automated class position ranking',
        'Curriculum-aligned lesson handouts',
        'Form master remark generator'
      ]
    },
    {
      role: 'Parents & Guardians',
      badge: 'Academic Transparency',
      desc: 'Stay intimately connected with terminal broadsheets, subject mastery trajectories, and direct teacher messaging.',
      bullets: [
        'Instant PIN scratch card verification',
        'Term-over-term mastery analytics',
        'Direct chat with class teachers',
        'Secure school fees via Paystack'
      ]
    },
    {
      role: 'Learners & Students',
      badge: 'Personalized Study',
      desc: 'An inspiring digital campus equipped with offline lesson notes, SRS memory flashcards, and coding challenges.',
      bullets: [
        '24/7 offline lesson note library',
        'Spaced repetition flashcards (SRS)',
        '636 coding adventure quests',
        'Safe scratch card grade lookup'
      ]
    }
  ];

  const pricingTiers = [
    {
      name: 'FREE',
      price: '₦0',
      period: '/month',
      desc: 'Essential result checking for small schools and tutoring centres.',
      students: 'Up to 50 active students',
      features: [
        'Basic ResultsPRO gradebook',
        'Standard scratch card checker',
        'Subdomain (school.scholars.ng)',
        'Community email support'
      ],
      cta: 'Get Started Free',
      popular: false
    },
    {
      name: 'STARTER',
      price: '₦15,000',
      period: '/month',
      desc: 'Perfect for growing primary and junior secondary academies.',
      students: 'Up to 250 active students',
      features: [
        'ResultsPRO automated CA & broadsheets',
        'Basic ClassroomPRO curriculum notes',
        'Custom school crest & brand theme',
        'Teacher & parent SMS notifications',
        'Priority email & ticket support'
      ],
      cta: 'Deploy Starter Portal',
      popular: false
    },
    {
      name: 'PRO',
      price: '₦35,000',
      period: '/month',
      desc: 'The complete institutional powerhouse for modern secondary schools.',
      students: 'Up to 1,000 active students',
      features: [
        'All 4 Specialist Apps enabled',
        'ResultsPRO + ClassroomPRO + TutorsPRO + PuzzlePRO',
        'Custom domain support (portal.school.com)',
        'Batch PDF report card export & signatures',
        '24/7 WhatsApp and phone priority support'
      ],
      cta: 'Deploy Pro Campus',
      popular: true
    },
    {
      name: 'ENTERPRISE',
      price: '₦80,000',
      period: '/month',
      desc: 'Multi-campus institutions, diocese networks, and state councils.',
      students: 'Unlimited students & campuses',
      features: [
        'Multi-campus central governance',
        'White-label mobile application (iOS & Android)',
        'Dedicated server compute and custom SLA',
        'Full historical data migration assistance',
        'Dedicated technical account manager'
      ],
      cta: 'Contact Enterprise Team',
      popular: false
    }
  ];

  return (
    <main>
      <Navbar />
      <Hero />

      {/* ── Specialist Applications (The Engine) ── */}
      <section id="apps" className="section-py bg-light">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '700px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>The Engine</div>
            <h2 className="text-d4 fw-400">Four Independent Powerhouses. One Cohesive Workspace.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.75rem' }}>
              Unlike rigid all-in-one monoliths, ScholarsNG orchestrates four dedicated, industry-leading applications into a unified lateral experience under your school’s own domain.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {specialistApps.map((app) => {
              const Icon = app.icon;
              return (
                <div key={app.id} className="card p-8 flex flex-col justify-between">
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                      <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                      </div>
                      <span style={{ 
                        fontSize: '0.6875rem', 
                        fontWeight: 700, 
                        letterSpacing: '0.06em', 
                        textTransform: 'uppercase', 
                        padding: '0.25rem 0.6rem', 
                        borderRadius: '2px', 
                        background: 'rgba(251, 188, 4, 0.12)', 
                        color: '#0D1060' 
                      }}>
                        {app.badge}
                      </span>
                    </div>

                    <h3 className="text-xl fw-600 mb-2">{app.title}</h3>
                    <p className="text-muted text-sm mb-6 leading-relaxed">{app.desc}</p>

                    <div className="space-y-2.5 pt-4 border-t border-gray-100 mb-6">
                      {app.features.map((feat, idx) => (
                        <div key={idx} className="flex items-center gap-2 text-xs text-muted">
                          <IconCheck className="w-4 h-4 text-green-600 shrink-0" strokeWidth={2.5} />
                          <span>{feat}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <Link href={app.href} className="nav-link text-navy fw-600" style={{ color: 'var(--color-nets-navy)' }}>
                    Explore {app.title} &rarr;
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Why ScholarsNG (Institutional Governance) ── */}
      <section id="why-us" className="section-py bg-white border-y border-gray-200">
        <div className="container-nets">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div>
              <div className="overline" style={{ marginBottom: '1rem' }}>Institutional Power</div>
              <h2 className="text-d3 fw-300 mb-6">Designed for Institutional Excellence.</h2>
              <p className="text-body-lg text-muted mb-8 leading-relaxed">
                ScholarsNG provides the single command center for Nigerian schools, colleges, and academies. Unify examination processing, curriculum handouts, remedial tutoring, and student identity under zero-maintenance cloud infrastructure.
              </p>
              
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 mb-8">
                {whyFeatures.map((item, i) => {
                  const Icon = item.icon;
                  return (
                    <div key={i} className="flex gap-4">
                      <div className="w-12 h-12 rounded-sm bg-nets-light flex items-center justify-center shrink-0">
                        <Icon className="w-6 h-6 text-red" style={{ color: 'var(--color-nets-red)' }} />
                      </div>
                      <div>
                        <h4 className="fw-600 mb-1">{item.title}</h4>
                        <p className="text-sm text-muted leading-relaxed">{item.desc}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <Link href="#pricing" className="btn btn-navy">Deploy Your School Portal</Link>
            </div>
            
            <div className="relative">
              <img 
                src="/photo05.jpeg" 
                alt="Students learning in computer lab" 
                className="rounded-sm shadow-card-lg" 
                style={{ width: '100%', height: 'auto', objectFit: 'cover' }}
              />
            </div>
          </div>
        </div>
      </section>

      {/* ── Role Workspaces ── */}
      <section id="roles" className="section-py bg-light">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '700px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>Role Workspaces</div>
            <h2 className="text-d4 fw-400">Tailored Experiences for Every Stakeholder.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.75rem' }}>
              Each role experiences a focused, distraction-free horizontal subtabs interface configured specifically for their daily tasks.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {roleWorkspaces.map((rw, idx) => (
              <div key={idx} className="card p-8 flex flex-col justify-between">
                <div>
                  <span style={{ 
                    fontSize: '0.6875rem', 
                    fontWeight: 700, 
                    letterSpacing: '0.06em', 
                    textTransform: 'uppercase', 
                    padding: '0.25rem 0.6rem', 
                    borderRadius: '2px', 
                    background: 'rgba(26, 31, 168, 0.08)', 
                    color: 'var(--color-nets-navy)',
                    display: 'inline-block',
                    marginBottom: '1rem'
                  }}>
                    {rw.badge}
                  </span>

                  <h3 className="text-lg fw-600 mb-2">{rw.role}</h3>
                  <p className="text-muted text-xs mb-6 leading-relaxed">{rw.desc}</p>

                  <div className="space-y-2.5 pt-4 border-t border-gray-100">
                    {rw.bullets.map((b, bIdx) => (
                      <div key={bIdx} className="flex items-start gap-2 text-xs text-muted">
                        <IconCheck className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="leading-relaxed">{b}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-6 mt-6 border-t border-gray-100">
                  <Link href="/school/login" className="nav-link text-navy text-xs fw-600" style={{ color: 'var(--color-nets-navy)' }}>
                    Access Workspace &rarr;
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Transparent Pricing ── */}
      <section id="pricing" className="section-py bg-white border-y border-gray-200">
        <div className="container-nets">
          <div style={{ marginBottom: '4rem', maxWidth: '700px' }}>
            <div className="overline" style={{ marginBottom: '1rem' }}>Transparent Subscriptions</div>
            <h2 className="text-d4 fw-400">Predictable Investment for Your Institution.</h2>
            <p className="text-muted text-body-lg" style={{ marginTop: '0.75rem' }}>
              Transparent per-school subscription tiers powered by Paystack. Scale seamlessly as student enrollment expands.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {pricingTiers.map((tier, idx) => (
              <div 
                key={idx}
                className={`card p-8 flex flex-col justify-between relative ${
                  tier.popular ? 'border-2' : ''
                }`}
                style={tier.popular ? { borderColor: 'var(--color-nets-red)', transform: 'translateY(-4px)' } : {}}
              >
                {tier.popular && (
                  <div style={{
                    position: 'absolute',
                    top: '-12px',
                    left: '50%',
                    transform: 'translateX(-50%)',
                    background: 'var(--color-nets-red)',
                    color: '#0D1060',
                    fontSize: '0.625rem',
                    fontWeight: 800,
                    textTransform: 'uppercase',
                    letterSpacing: '0.1em',
                    padding: '0.2rem 0.75rem',
                    borderRadius: '999px',
                    boxShadow: '0 2px 8px rgba(251, 188, 4, 0.4)'
                  }}>
                    Most Popular
                  </div>
                )}

                <div>
                  <div className="overline" style={{ marginBottom: '0.5rem' }}>{tier.name}</div>
                  <div style={{ display: 'flex', alignItems: 'baseline', gap: '0.25rem', margin: '0.75rem 0' }}>
                    <span style={{ fontSize: '2.25rem', fontWeight: 800, color: 'var(--color-nets-navy-dark)', letterSpacing: '-0.03em' }}>
                      {tier.price}
                    </span>
                    <span className="text-muted text-xs">{tier.period}</span>
                  </div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--color-nets-navy)', marginBottom: '0.75rem' }}>
                    {tier.students}
                  </div>
                  <p className="text-muted text-xs mb-6 leading-relaxed">{tier.desc}</p>

                  <div className="space-y-2.5 pt-4 border-t border-gray-100 mb-6">
                    {tier.features.map((feat, fIdx) => (
                      <div key={fIdx} className="flex items-start gap-2 text-xs text-muted">
                        <IconCheck className="w-3.5 h-3.5 text-green-600 shrink-0 mt-0.5" strokeWidth={2.5} />
                        <span className="leading-relaxed">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-4 border-t border-gray-100">
                  <Link 
                    href={`/school/register?plan=${tier.name.toLowerCase()}`}
                    className={tier.popular ? 'btn btn-red w-full' : 'btn btn-navy w-full'}
                    style={{ width: '100%', justifyContent: 'center', textDecoration: 'none' }}
                  >
                    {tier.cta}
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ── */}
      <section className="section-py bg-navy text-white text-center" style={{ background: 'var(--color-nets-navy-dark)' }}>
        <div className="container-nets max-w-3xl">
          <h2 className="text-d3 fw-300 mb-6 text-white">Accelerate Your Institution Today</h2>
          <p className="text-body-lg text-muted-light mb-10 leading-relaxed">
            Deploy your school&apos;s digital campus in under 5 minutes with zero technical overhead. Connect your administrators, teachers, parents, and students on a unified platform.
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            <Link href="#pricing" className="btn btn-red btn-lg">Deploy School Portal</Link>
            <Link href="/school/login" className="btn btn-outline-white btn-lg">Sign In to Portal</Link>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
