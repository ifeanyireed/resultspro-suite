const fs = require('fs');
const path = require('path');

const coursesproFooter = path.join(__dirname, 'coursespro/src/components/Footer.tsx');
let content = fs.readFileSync(coursesproFooter, 'utf8');

// Replace footerSections
content = content.replace(
/const footerSections = \[[\s\S]*?\];/,
`const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Browse Cohorts',            href: '/cohorts' },
      { label: 'Enterprise Training',       href: '/enterprise' },
      { label: 'Pricing & Plans',           href: '/pricing' },
      { label: 'Student Workspace',         href: '/dashboard' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About CoursesPRO',          href: '/about' },
      { label: 'Become an Instructor',      href: '/apply' },
      { label: 'Our Blog',                  href: '/blog' },
      { label: 'Careers',                   href: '/careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center',               href: '/support' },
      { label: 'Terms of Service',          href: '/terms' },
      { label: 'Privacy Policy',            href: '/privacy' },
    ],
  },
];`
);

// Replace paragraph text
content = content.replace(
/Nigeria's ultimate CBT practice platform\. Supercharge your prep with AI tutoring, live multiplayer games, and battle modes\./,
`The ultimate cohort-based learning operating system. Upskill with live classes, peer-to-peer collaboration, and industry-leading mentors.`
);

fs.writeFileSync(coursesproFooter, content);

// Now do tutorspro
const tutorsproFooter = path.join(__dirname, 'tutorspro/src/components/Footer.tsx');
let content2 = fs.readFileSync(tutorsproFooter, 'utf8');

content2 = content2.replace(
/const footerSections = \[[\s\S]*?\];/,
`const footerSections = [
  {
    title: 'Platform',
    links: [
      { label: 'Find a Tutor',              href: '/search' },
      { label: 'Become a Tutor',            href: '/apply' },
      { label: 'For Parents',               href: '/parents' },
      { label: 'Pricing & Plans',           href: '/pricing' },
    ],
  },
  {
    title: 'Company',
    links: [
      { label: 'About TutorsPRO',           href: '/about' },
      { label: 'Success Stories',           href: '/success' },
      { label: 'Our Blog',                  href: '/blog' },
      { label: 'Careers',                   href: '/careers' },
    ],
  },
  {
    title: 'Support',
    links: [
      { label: 'Help Center',               href: '/support' },
      { label: 'Terms of Service',          href: '/terms' },
      { label: 'Privacy Policy',            href: '/privacy' },
    ],
  },
];`
);

content2 = content2.replace(
/Nigeria's ultimate CBT practice platform\. Supercharge your prep with AI tutoring, live multiplayer games, and battle modes\./,
`The global tutoring marketplace. Connect with expert tutors, manage your schedule, and accelerate your learning journey with personalized guidance.`
);

// Change CoursesPRO Logo text inside TutorsPRO footer
content2 = content2.replace(
/alt="CoursesPRO Logo"/g,
`alt="TutorsPRO Logo"`
);

content2 = content2.replace(
/CoursesPRO\.ng/g,
`TutorsPRO`
);

fs.writeFileSync(tutorsproFooter, content2);
