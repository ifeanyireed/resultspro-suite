import os
import re

hero_path = 'coursespro/src/components/Hero.tsx'
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
            Master New
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>Skills</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>with Expert Cohorts.</span>
          </motion.h1>''',
        hero_content
    )

    hero_content = hero_content.replace('1M+ Practice Questions', 'Industry Experts')
    hero_content = hero_content.replace('AI-Powered Explanations', 'Live Cohorts')
    hero_content = hero_content.replace('Real-time Competitions', 'Project-based Learning')

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
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>Course Directory</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Explore open cohorts
              </h2>
            </div>

            <form aria-label="Find Course" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="field-label-dark">Category</label>
                <select className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }}>
                  <option value="tech">Software Engineering</option>
                  <option value="design">Product Design (UI/UX)</option>
                  <option value="data">Data Science</option>
                  <option value="marketing">Digital Marketing</option>
                </select>
              </div>

              <div>
                <label className="field-label-dark">Skill Level</label>
                <select className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }}>
                  <option value="beginner">Beginner Friendly</option>
                  <option value="intermediate">Intermediate</option>
                  <option value="advanced">Advanced</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/cohorts" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  Browse Cohorts
                </Link>
              </div>
            </form>
          </div>''',
        hero_content
    )
    with open(hero_path, 'w') as f: f.write(hero_content)

page_path = 'coursespro/src/app/page.tsx'
if os.path.exists(page_path):
    with open(page_path, 'r') as f: page_content = f.read()

    page_content = re.sub(
        r'{\[\s*{\s*title:\s*\'Correct MCQ\'.*?\]\.',
        '''{[ 
                  { title: 'Live Sessions', reward: 'Interactive learning', icon: IconUserPlus },
                  { title: 'Community', reward: 'Peer-to-peer support', icon: IconBrain },
                  { title: 'Real Projects', reward: 'Build your portfolio', icon: IconTrophy },
                  { title: 'Career Guidance', reward: 'Mentorship & prep', icon: IconBook },
                ].''',
        page_content,
        flags=re.DOTALL
    )

    page_content = page_content.replace('{item.reward} Coins</p>', '{item.reward}</p>')
    page_content = page_content.replace('/economy', '/about')
    page_content = page_content.replace('Join 50,000+ Students Already Winning', 'Join a global community of learners')
    page_content = page_content.replace('Start your journey today. Sign up for free and get 50 bonus coins.', 'Upskill yourself and accelerate your career with highly curated, cohort-based courses.')

    with open(page_path, 'w') as f: f.write(page_content)

print("CoursesPRO specific content applied!")
