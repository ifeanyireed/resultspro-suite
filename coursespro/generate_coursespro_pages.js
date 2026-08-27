const fs = require('fs');
const path = require('path');

const COURSESPRO_APP = path.join(__dirname, 'src/app');

function createPage(route, title, subtitle) {
    const dir = path.join(COURSESPRO_APP, route);
    if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
    const content = `import Navbar from '@/components/Navbar';
import Footer from '@/components/Footer';

export default function ${route.charAt(0).toUpperCase() + route.slice(1)}Page() {
  return (
    <main>
      <Navbar />
      <section className="section-py bg-navy text-white text-center" style={{ minHeight: '60vh', display: 'flex', alignItems: 'center' }}>
        <div className="container-nets max-w-3xl">
          <h1 className="text-d2 fw-300 mb-6">${title}</h1>
          <p className="text-body-lg text-muted-light mb-10">
            ${subtitle}
          </p>
        </div>
      </section>
      <Footer />
    </main>
  );
}
`;
    fs.writeFileSync(path.join(dir, 'page.tsx'), content);
    console.log(`Created /${route}`);
}

createPage('cohorts', 'Browse Cohorts', 'Explore live, interactive courses led by industry experts.');
createPage('enterprise', 'CoursesPRO for Enterprise', 'Upskill your entire workforce with dedicated corporate cohorts and tracking.');
createPage('pricing', 'Simple, transparent pricing', 'Invest in your career with flexible payment options and scholarships.');
createPage('apply', 'Become an Instructor', 'Share your expertise with a global audience and earn passive income.');

// Auth pages
const loginSource = path.join(__dirname, '../resultspro/src/app/login/page.tsx');
if (fs.existsSync(loginSource)) {
    let loginCode = fs.readFileSync(loginSource, 'utf8');
    loginCode = loginCode.replace(/ResultsPRO/g, 'CoursesPRO');
    loginCode = loginCode.replace(/admin@resultspro.ng/g, 'user@coursespro.co');
    loginCode = loginCode.replace(/Manage schools, tutors, assessments/g, 'Manage cohorts, peer reviews, and interactive learning');
    
    // Login
    const loginDir = path.join(COURSESPRO_APP, 'login');
    if (!fs.existsSync(loginDir)) fs.mkdirSync(loginDir, { recursive: true });
    fs.writeFileSync(path.join(loginDir, 'page.tsx'), loginCode);
    console.log('Created /login');

    // Signup
    const signupDir = path.join(COURSESPRO_APP, 'signup');
    if (!fs.existsSync(signupDir)) fs.mkdirSync(signupDir, { recursive: true });
    let signupCode = loginCode.replace(/Welcome Back/g, 'Create Account');
    signupCode = signupCode.replace(/Sign in to Dashboard/g, 'Create Free Account');
    fs.writeFileSync(path.join(signupDir, 'page.tsx'), signupCode);
    console.log('Created /signup');
}
