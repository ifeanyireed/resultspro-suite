import os
import shutil

app = {
    'name': 'resultspro',
    'title': 'ResultsPRO',
    'subtitle': "Africa's Smart Result Management",
    'hero_headline': "Digitize Your<br/><em style=\"font-style: normal; font-weight: 700; color: #fff;\">Results</em><br/><span style=\"color: rgba(255,255,255,0.6);\">Seamlessly.</span>",
    'hero_sub': "The ultimate result computation and checking platform for schools, parents, and examination bodies.",
    'nav': "[{ label: 'Check Result', href: '/check' }, { label: 'Schools', href: '/schools' }, { label: 'Pricing', href: '/pricing' }]",
    'features': "[{ title: 'Result Checking', exams: 'Instant access via scratch cards' }, { title: 'Broadsheets', exams: 'Automated termly reports' }, { title: 'Analytics', exams: 'Deep dive into student performance' }, { title: 'Security', exams: 'Anti-fraud and encryption' }]",
    'cta_btn': "Check Result",
    'cta_link': "/check",
    'img': "Students1.jpeg"
}

# Source files
src_nav = 'examspro/src/components/Navbar.tsx'
src_hero = 'examspro/src/components/Hero.tsx'
src_footer = 'examspro/src/components/Footer.tsx'
src_page = 'examspro/src/app/page.tsx'

app_dir = f"{app['name']}/src"
os.makedirs(f"{app_dir}/components", exist_ok=True)
os.makedirs(f"{app_dir}/app", exist_ok=True)

# Generate Layout
with open(f"{app_dir}/app/layout.tsx", 'w') as f:
    f.write('''import './globals.css';\n\nexport default function RootLayout({ children }: { children: React.ReactNode }) {\n  return (\n    <html lang="en">\n      <body>{children}</body>\n    </html>\n  );\n}''')

# Generate globals.css
with open(f"{app_dir}/app/globals.css", 'w') as f:
    f.write('@import "tailwindcss";\n@import "./nets.css";\n\n@theme {\n  --color-navy: #0D1B2A;\n}')

# Copy nets.css
shutil.copy('examspro/src/app/nets.css', f"{app_dir}/app/nets.css")

# 1. Copy Navbar
dest_nav = f"{app_dir}/components/Navbar.tsx"
shutil.copy(src_nav, dest_nav)
with open(dest_nav, 'r') as f: nav_data = f.read()
nav_data = nav_data.replace("const navItems = [\n    { label: 'Practice', href: '/practice' },\n    { label: 'Battle Mode', href: '/battle-mode' },\n    { label: 'Leaderboard', href: '/leaderboard' },\n    { label: 'Shop', href: '/shop' },\n  ];", f"const navItems = {app['nav']};")
nav_data = nav_data.replace("ExamsPRO Logo", f"{app['title']} Logo")
nav_data = nav_data.replace(">ExamsPRO<", f">{app['title']}<")
with open(dest_nav, 'w') as f: f.write(nav_data)
    
# 2. Copy Hero
dest_hero = f"{app_dir}/components/Hero.tsx"
shutil.copy(src_hero, dest_hero)
with open(dest_hero, 'r') as f: hero_data = f.read()
hero_data = hero_data.replace("ExamsPRO", app['title'])
hero_data = hero_data.replace("Nigeria's Premier Prep Platform", app['subtitle'])
hero_data = hero_data.replace("Premium Exam<br />\n            <em style={{ fontStyle: 'normal', fontWeight: 700, color: '#fff' }}>Preparation</em><br />\n            <span style={{ color: 'rgba(255,255,255,0.6)' }}>for Every Student.</span>", app['hero_headline'])
hero_data = hero_data.replace("Professional, gamified CBT practice solutions for WAEC, JAMB, NECO, and international examinations.", app['hero_sub'])
hero_data = hero_data.replace("Start Practicing", app['cta_btn'])
hero_data = hero_data.replace("/practice", app['cta_link'])
hero_data = hero_data.replace("Enter Battle Mode", "For Schools")
hero_data = hero_data.replace("/battle-mode", "/schools")
hero_data = hero_data.replace("Students1.jpeg", app['img'])
with open(dest_hero, 'w') as f: f.write(hero_data)
    
# 3. Copy Footer
dest_footer = f"{app_dir}/components/Footer.tsx"
shutil.copy(src_footer, dest_footer)
with open(dest_footer, 'r') as f: footer_data = f.read()
footer_data = footer_data.replace("ExamsPRO", app['title'])
with open(dest_footer, 'w') as f: f.write(footer_data)
    
# 4. Copy Page
dest_page = f"{app_dir}/app/page.tsx"
shutil.copy(src_page, dest_page)
with open(dest_page, 'r') as f: page_data = f.read()

page_data = page_data.replace("ExamsPRO", app['title'])
page_data = page_data.replace("Our Programmes", "Features")
page_data = page_data.replace("Comprehensive exam coverage.", "End-to-End Result Management.")

old_features = "[\n              { title: 'West African', exams: 'WAEC, NECO, GCE' },\n              { title: 'University Entry', exams: 'JAMB/UTME, Post-UTME' },\n              { title: 'International', exams: 'SAT, ACT, GRE, GMAT' },\n              { title: 'Professional', exams: 'ICAN, ACCA, CFA' },\n            ]"
page_data = page_data.replace(old_features, app['features'])

page_data = page_data.replace("The Coin Economy", "Why Choose Us")
page_data = page_data.replace("Earn as you learn.", "Speed, Accuracy, Security.")
page_data = page_data.replace("Spend coins on AI deep-dives, unlocking past questions, or entering high-stakes battles.\n                No subscription required.", "Say goodbye to manual calculations and errors. Generate thousands of results instantly and accurately.")
page_data = page_data.replace("Students2.jpeg", app['img'])

with open(dest_page, 'w') as f: f.write(page_data)
    
print("ResultsPRO Next.js landing page created!")
