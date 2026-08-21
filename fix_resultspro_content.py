import os
import re

hero_path = 'resultspro/src/components/Hero.tsx'
if os.path.exists(hero_path):
    with open(hero_path, 'r') as f: hero_content = f.read()

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
            Digitize Your
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>Results</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>Seamlessly.</span>
          </motion.h1>''',
        hero_content
    )

    hero_content = hero_content.replace('1M+ Practice Questions', 'Instant Processing')
    hero_content = hero_content.replace('AI-Powered Explanations', 'Anti-Fraud Checks')
    hero_content = hero_content.replace('Real-time Competitions', 'Secure Backups')

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
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Result Portal</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Check Your Results
              </h2>
            </div>

            <form aria-label="Check Result" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="field-label-dark">Scratch Card PIN</label>
                <input type="text" placeholder="Enter 12-digit PIN" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>
              
              <div>
                <label className="field-label-dark">Student ID / Registration No.</label>
                <input type="text" placeholder="e.g. REG-00123" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/check" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  View Result
                </Link>
              </div>
            </form>
          </div>''',
        hero_content
    )
    with open(hero_path, 'w') as f: f.write(hero_content)

page_path = 'resultspro/src/app/page.tsx'
if os.path.exists(page_path):
    with open(page_path, 'r') as f: page_content = f.read()

    page_content = re.sub(
        r'{\[\s*{\s*title:\s*\'Correct MCQ\'.*?\]\.',
        '''{[ 
                  { title: 'Fast Access', reward: 'Instant PDF generation', icon: IconUserPlus },
                  { title: 'Detailed Reports', reward: 'Granular analytics', icon: IconBrain },
                  { title: 'Broadsheets', reward: 'Exportable spreadsheets', icon: IconTrophy },
                  { title: 'API Integration', reward: 'Connect with existing tools', icon: IconBook },
                ].''',
        page_content,
        flags=re.DOTALL
    )

    page_content = page_content.replace('{item.reward} Coins</p>', '{item.reward}</p>')
    page_content = page_content.replace('/economy', '/features')
    page_content = page_content.replace('Join 50,000+ Students Already Winning', 'Digitize your examination records')
    page_content = page_content.replace('Start your journey today. Sign up for free and get 50 bonus coins.', 'Say goodbye to manual calculations and errors. Generate thousands of results instantly and accurately.')

    with open(page_path, 'w') as f: f.write(page_content)

print("ResultsPRO specific content applied!")
