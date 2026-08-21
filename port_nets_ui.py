import os
import shutil

apps = [
    {
        'name': 'classroompro',
        'title': 'ClassroomPRO',
        'subtitle': "Nigeria's Premier LMS",
        'hero_headline': "Premium Learning<br/><em style=\"font-style: normal; font-weight: 700; color: #fff;\">Management</em><br/><span style=\"color: rgba(255,255,255,0.6);\">for Every School.</span>",
        'hero_sub': "Professional, structured learning environments for modern Nigerian schools.",
        'nav': "[{ label: 'Features', href: '#features' }, { label: 'Schools', href: '/schools' }, { label: 'For Teachers', href: '/teachers' }, { label: 'Pricing', href: '/pricing' }]",
        'features': "[{ title: 'Class Notes', exams: 'Structured by Term & Topic' }, { title: 'Quizzes', exams: 'CBT-style Assessments' }, { title: 'Flashcards', exams: 'Active Recall & Spaced Repetition' }, { title: 'Analytics', exams: 'Class-wide performance tracking' }]",
        'cta_btn': "Start Free Trial",
        'cta_link': "/signup",
        'img': "Students2.jpeg"
    },
    {
        'name': 'tutorspro',
        'title': 'TutorsPRO',
        'subtitle': "Nigeria's Elite Tutoring Network",
        'hero_headline': "Expert Private<br/><em style=\"font-style: normal; font-weight: 700; color: #fff;\">Tutoring</em><br/><span style=\"color: rgba(255,255,255,0.6);\">for Guaranteed Results.</span>",
        'hero_sub': "Connect with verified, top-tier tutors for personalized learning and exam prep.",
        'nav': "[{ label: 'Find a Tutor', href: '/tutors' }, { label: 'Become a Tutor', href: '/become-tutor' }, { label: 'How it Works', href: '/how-it-works' }]",
        'features': "[{ title: '1-on-1 Sessions', exams: 'Personalized attention' }, { title: 'Group Classes', exams: 'Affordable group learning' }, { title: 'Exam Prep', exams: 'WAEC, JAMB, SAT specialists' }, { title: 'Skill Building', exams: 'Coding, Languages, Music' }]",
        'cta_btn': "Find a Tutor",
        'cta_link': "/tutors",
        'img': "Students3.jpeg"
    },
    {
        'name': 'coursespro',
        'title': 'CoursesPRO',
        'subtitle': "Cohort-Based Skills Training",
        'hero_headline': "Master New<br/><em style=\"font-style: normal; font-weight: 700; color: #fff;\">Skills</em><br/><span style=\"color: rgba(255,255,255,0.6);\">with Expert Cohorts.</span>",
        'hero_sub': "Join live, interactive cohorts and learn high-income skills from industry professionals.",
        'nav': "[{ label: 'Browse Courses', href: '/courses' }, { label: 'Cohorts', href: '/cohorts' }, { label: 'Pricing', href: '/pricing' }]",
        'features': "[{ title: 'Tech Skills', exams: 'Coding, Data, Design' }, { title: 'Business', exams: 'Marketing, Finance, Ops' }, { title: 'Creative', exams: 'Writing, Video, Audio' }, { title: 'Productivity', exams: 'Tools, Automation, AI' }]",
        'cta_btn': "Browse Cohorts",
        'cta_link': "/cohorts",
        'img': "Students1.jpeg"
    }
]

# Source files
src_nav = 'examspro/src/components/Navbar.tsx'
src_hero = 'examspro/src/components/Hero.tsx'
src_footer = 'examspro/src/components/Footer.tsx'
src_page = 'examspro/src/app/page.tsx'

for app in apps:
    app_dir = f"{app['name']}/src"
    
    # Ensure components dir exists
    os.makedirs(f"{app_dir}/components", exist_ok=True)
    
    # 1. Copy Navbar
    dest_nav = f"{app_dir}/components/Navbar.tsx"
    shutil.copy(src_nav, dest_nav)
    with open(dest_nav, 'r') as f: nav_data = f.read()
    
    # Replace nav items and title
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
    hero_data = hero_data.replace("Enter Battle Mode", "Learn More")
    hero_data = hero_data.replace("/battle-mode", "/about")
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
    page_data = page_data.replace("Comprehensive exam coverage.", "Everything you need to succeed.")
    
    # Replace features array
    old_features = "[\n              { title: 'West African', exams: 'WAEC, NECO, GCE' },\n              { title: 'University Entry', exams: 'JAMB/UTME, Post-UTME' },\n              { title: 'International', exams: 'SAT, ACT, GRE, GMAT' },\n              { title: 'Professional', exams: 'ICAN, ACCA, CFA' },\n            ]"
    page_data = page_data.replace(old_features, app['features'])
    
    page_data = page_data.replace("The Coin Economy", "Why Choose Us")
    page_data = page_data.replace("Earn as you learn.", "Designed for Results.")
    page_data = page_data.replace("Spend coins on AI deep-dives, unlocking past questions, or entering high-stakes battles.\n                No subscription required.", "Our platform is built to optimize your learning experience with powerful tools and analytics.")
    page_data = page_data.replace("Students2.jpeg", app['img'])
    
    with open(dest_page, 'w') as f: f.write(page_data)
        
print("All public pages have been synced to the NETS design system!")
