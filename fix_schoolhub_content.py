import os
import re

hero_path = 'schoolhub/web_app/src/components/Hero.tsx'
if os.path.exists(hero_path):
    with open(hero_path, 'r') as f: hero_content = f.read()

    hero_content = hero_content.replace('1M+ Practice Questions', 'Certified Teachers')
    hero_content = hero_content.replace('AI-Powered Explanations', 'Modern Facilities')
    hero_content = hero_content.replace('Real-time Competitions', 'Holistic Curriculum')

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
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Parent Portal</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Sign in to your account
              </h2>
            </div>

            <form aria-label="Portal Login" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="field-label-dark">Email or Phone</label>
                <input type="text" placeholder="Enter your credentials" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>
              
              <div>
                <label className="field-label-dark">Password</label>
                <input type="password" placeholder="••••••••" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/school/login" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  Secure Login
                </Link>
              </div>
            </form>
          </div>''',
        hero_content
    )
    with open(hero_path, 'w') as f: f.write(hero_content)

page_path = 'schoolhub/web_app/src/app/page.tsx'
if os.path.exists(page_path):
    with open(page_path, 'r') as f: page_content = f.read()

    page_content = re.sub(
        r'{\[\s*{\s*title:\s*\'Correct MCQ\'.*?\]\.',
        '''{[ 
                  { title: 'Academic Excellence', reward: 'Top tier WAEC results', icon: IconUserPlus },
                  { title: 'Sports & Arts', reward: 'Nurturing all talents', icon: IconBrain },
                  { title: 'Safe Environment', reward: '24/7 campus security', icon: IconTrophy },
                  { title: 'Tech Integration', reward: 'Smart classrooms', icon: IconBook },
                ].''',
        page_content,
        flags=re.DOTALL
    )

    page_content = page_content.replace('{item.reward} Coins</p>', '{item.reward}</p>')
    page_content = page_content.replace('/economy', '/admissions')
    page_content = page_content.replace('Join 50,000+ Students Already Winning', 'Enroll your child today for a brighter future')
    page_content = page_content.replace('Start your journey today. Sign up for free and get 50 bonus coins.', 'We provide a nurturing environment focused on academic excellence, character building, and technological fluency.')

    with open(page_path, 'w') as f: f.write(page_content)

print("SchoolHub specific content applied!")
