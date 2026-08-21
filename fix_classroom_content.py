import os

hero_path = 'classroompro/src/components/Hero.tsx'
with open(hero_path, 'r') as f:
    hero_content = f.read()

# Replace Headline block completely
import re
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
            Premium Learning
            <br />
            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>Management</em>
            <br />
            <span style={{ color: 'rgba(255,255,255,0.6)' }}>for Every School.</span>
          </motion.h1>''',
    hero_content
)

# Replace Trust Badges
hero_content = hero_content.replace('1M+ Practice Questions', '100+ Partner Schools')
hero_content = hero_content.replace('AI-Powered Explanations', 'Offline Sync Ready')
hero_content = hero_content.replace('Real-time Competitions', 'Smart Analytics')

# Replace Quick Access Card
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
            {/* Card header */}
            <div style={{ marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '1.25rem' }}>
              <div className="overline-dark" style={{ marginBottom: '0.5rem' }}>School Portal</div>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600, color: '#fff', letterSpacing: '-0.01em' }}>
                Access your dashboard
              </h2>
            </div>

            <form aria-label="Portal Access" style={{ display: 'flex', flexDirection: 'column', gap: '0.875rem' }}>
              <div>
                <label className="field-label-dark">Select Your Role</label>
                <select className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }}>
                  <option value="student">Student</option>
                  <option value="teacher">Teacher</option>
                  <option value="parent">Parent</option>
                  <option value="admin">School Administrator</option>
                </select>
              </div>

              <div>
                <label className="field-label-dark">School ID</label>
                <input type="text" placeholder="e.g. SCH-001" className="input-dark" style={{ padding: '0.625rem 1rem', width: '100%' }} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.75rem', marginTop: '1rem' }}>
                <Link href="/login" className="btn btn-outline-white" style={{ width: '100%', justifyContent: 'center' }}>
                  Log In
                </Link>
                <Link href="/schools" className="btn btn-red" style={{ width: '100%', justifyContent: 'center', border: 'none' }}>
                  Register School
                </Link>
              </div>
            </form>
          </div>''',
    hero_content
)

with open(hero_path, 'w') as f:
    f.write(hero_content)


page_path = 'classroompro/src/app/page.tsx'
with open(page_path, 'r') as f:
    page_content = f.read()

# Replace the array of why choose us
import re
page_content = re.sub(
    r'{\[\s*{\s*title:\s*\'Correct MCQ\'.*?\]\.',
    '''{[ 
                  { title: 'Role Dashboards', reward: 'Custom views for all', icon: IconUserPlus },
                  { title: 'Offline Access', reward: 'Learn without internet', icon: IconBrain },
                  { title: 'Automated Grading', reward: 'Save teachers time', icon: IconTrophy },
                  { title: 'Parental Reports', reward: 'Weekly SMS updates', icon: IconBook },
                ].''',
    page_content,
    flags=re.DOTALL
)

page_content = page_content.replace('{item.reward} Coins</p>', '{item.reward}</p>')
page_content = page_content.replace('/economy', '/features')

# Replace CTA Banner
page_content = page_content.replace('Join 50,000+ Students Already Winning', 'Digitize Your School Infrastructure Today')
page_content = page_content.replace('Start your journey today. Sign up for free and get 50 bonus coins.', 'Join hundreds of forward-thinking schools managing their curriculum, students, and staff on ClassroomPRO.')

with open(page_path, 'w') as f:
    f.write(page_content)

print("ClassroomPRO specific content applied!")
