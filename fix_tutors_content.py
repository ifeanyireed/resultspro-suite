import os
import re

hero_path = 'tutorspro/src/components/Hero.tsx'
if os.path.exists(hero_path):
    with open(hero_path, 'r') as f: hero_content = f.read()

    # Headline
    hero_content = re.sub(
        r'<motion\.h1[^>]*>[\s\S]*?</motion\.h1>',
        '''<motion.h1 variants={staggerItem} className="fw-300" style={{ 
            color: '#fff', 
            marginBottom: '1rem', 
            fontSize: 'clamp(2.75rem, 4vw, 3.75rem)', 
            lineHeight: '1.1',
            letterSpacing: '-0.02em',
            whiteSpace: 'nowrap'
          }}>
            Expert Private
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>Tutoring</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>for Guaranteed Results.</span>
          </motion.h1>''',
        hero_content
    )

    hero_content = hero_content.replace('1M+ Practice Questions', 'Verified Expert Tutors')
    hero_content = hero_content.replace('AI-Powered Explanations', 'Secure Payments')
    hero_content = hero_content.replace('Real-time Competitions', 'Flexible Scheduling')

    # Quick Access Card
    hero_content = re.sub(
        r'<div\n            id="quote"[\s\S]*?</form>\n          </div>',
        '''<div
            id="quote"
            style={{
              width: '100%',
              maxWidth: '420px',
              background: 'rgba(13,16,96,0.85)',
              border: '1px solid rgba(255,255,255,0.15)',
              borderRadius: '4px',
              padding: '1.5rem',
              backdropFilter: 'blur(16px)',
              boxShadow: '0 24px 64px rgba(0,0,0,0.4)',
              marginTop: '1.5rem'
            }}
          >
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Tutor Search</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Find your perfect match
              </h2>
            </div>

            <form aria-label="Find Tutor" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="field-label-dark">Subject</label>
                <select className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }}>
                  <option value="math">Mathematics</option>
                  <option value="science">Sciences (Phy/Chem/Bio)</option>
                  <option value="languages">Languages</option>
                  <option value="tech">Coding & Tech</option>
                </select>
              </div>

              <div>
                <label className="field-label-dark">Level</label>
                <select className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }}>
                  <option value="primary">Primary School</option>
                  <option value="secondary">Secondary / High School</option>
                  <option value="university">University / Undergraduate</option>
                  <option value="professional">Professional Certification</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/tutors" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  Search Tutors
                </Link>
              </div>
            </form>
          </div>''',
        hero_content
    )
    with open(hero_path, 'w') as f: f.write(hero_content)

page_path = 'tutorspro/src/app/page.tsx'
if os.path.exists(page_path):
    with open(page_path, 'r') as f: page_content = f.read()

    page_content = re.sub(
        r'{\[\s*{\s*title:\s*\'Correct MCQ\'.*?\]\.',
        '''{[ 
                  { title: 'Verified Experts', reward: 'Rigorous vetting process', icon: IconUserPlus },
                  { title: '1-on-1 Focus', reward: 'Personalized attention', icon: IconBrain },
                  { title: 'Progress Tracking', reward: 'Detailed session reports', icon: IconTrophy },
                  { title: 'Flexible Booking', reward: 'Learn on your schedule', icon: IconBook },
                ].''',
        page_content,
        flags=re.DOTALL
    )

    page_content = page_content.replace('{item.reward} Coins</p>', '{item.reward}</p>')
    page_content = page_content.replace('/economy', '/how-it-works')
    page_content = page_content.replace('Join 50,000+ Students Already Winning', 'Accelerate Your Learning Today')
    page_content = page_content.replace('Start your journey today. Sign up for free and get 50 bonus coins.', 'Book your first session risk-free and experience the difference of personalized tutoring.')

    with open(page_path, 'w') as f: f.write(page_content)

print("TutorsPRO specific content applied!")
