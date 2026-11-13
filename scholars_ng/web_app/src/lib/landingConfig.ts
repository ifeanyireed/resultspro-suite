'use client';

import { useState, useEffect, useCallback } from 'react';

export interface NoticeItem {
  id: string;
  category: 'admissions' | 'academic' | 'events';
  pinned: boolean;
  date: string;
  title: string;
  summary: string;
  tag: string;
}

export interface FacilityItem {
  title: string;
  category: string;
  image: string;
  desc: string;
  specs: string[];
}

export interface NewsEventItem {
  type: string;
  date: string;
  image: string;
  title: string;
  excerpt: string;
  location: string;
}

export interface TeamMemberItem {
  name: string;
  role: string;
  qualification: string;
  image: string;
  bio: string;
}

export interface AdmissionStepItem {
  step: string;
  title: string;
  desc: string;
}

export interface SchoolLandingConfig {
  schoolName: string;
  academicSession: string;
  heroOverline: string;
  heroTitleTop: string;
  heroTitleHighlight: string;
  heroTitleBottom: string;
  heroDescription: string;
  heroImage: string;
  aboutOverline: string;
  aboutTitle: string;
  aboutDescription: string;
  aboutImage: string;
  contactEmail: string;
  campusLocation: string;
  notices: NoticeItem[];
  facilities: FacilityItem[];
  newsAndEvents: NewsEventItem[];
  leadershipTeam: TeamMemberItem[];
  admissionSteps: AdmissionStepItem[];
}

export const DEFAULT_LANDING_CONFIG: SchoolLandingConfig = {
  schoolName: 'Greenwood High Academy',
  academicSession: '2026/2027',
  heroOverline: 'Admissions Open 2026/2027',
  heroTitleTop: 'Nurturing Future',
  heroTitleHighlight: 'Scholars & Leaders',
  heroTitleBottom: 'for Global Excellence.',
  heroDescription:
    'Explore our modern STEM facilities, official campus notice board, upcoming events, and role-based digital portals for students, parents, and faculty.',
  heroImage: '/photo07.jpeg',
  aboutOverline: 'Why Choose Us',
  aboutTitle: 'Academic Rigor Meets Character & Innovation.',
  aboutDescription:
    'For over two decades, our academy has combined the Nigerian NERDC and British IGCSE curricula with hands-on coding, robotics, and moral mentorship—preparing well-rounded scholars for top global universities.',
  aboutImage: '/photo05.jpeg',
  contactEmail: 'admissions@school.scholars.ng',
  campusLocation: 'Lagos, Nigeria',
  notices: [
    {
      id: 'NOT-2026-01',
      category: 'admissions',
      pinned: true,
      date: 'Nov 15, 2026',
      title: '2026/2027 Entrance Examination — Batch A CBT Schedule',
      summary:
        'All registered JSS 1 and SSS 1 transfer applicants are scheduled for the Computer-Based Entrance Assessment this Saturday at 9:00 AM in the ICT Complex.',
      tag: 'Urgent · Admissions'
    },
    {
      id: 'NOT-2026-02',
      category: 'academic',
      pinned: true,
      date: 'Nov 18, 2026',
      title: 'First Term Continuous Assessment (CA2) & Broadsheet Publication',
      summary:
        'Second Continuous Assessment marks have been uploaded to ResultsPRO. Parents can review real-time subject trajectories via the Parent Portal.',
      tag: 'Academic Records'
    },
    {
      id: 'NOT-2026-03',
      category: 'events',
      pinned: false,
      date: 'Nov 24, 2026',
      title: 'General PTA Congress & Open Day Exhibition',
      summary:
        'Parents and guardians are cordially invited to the First Term Open Day to inspect student notebooks, coding projects, and meet class teachers.',
      tag: 'PTA & Community'
    },
    {
      id: 'NOT-2026-04',
      category: 'academic',
      pinned: false,
      date: 'Dec 02, 2026',
      title: 'WAEC & NECO Biometric Registration Deadline for SSS 3 Scholars',
      summary:
        'Final biometric capture and subject verification for senior secondary examination candidates closes on Friday, December 4th at the Registrar’s Office.',
      tag: 'Examinations'
    }
  ],
  facilities: [
    {
      title: 'STEM & Robotics Laboratories',
      category: 'Science & Innovation',
      image: '/photo01.jpeg',
      desc: 'Fully equipped Physics, Chemistry, Biology, and AI Robotics labs designed for hands-on discovery and practical WAEC/IGCSE experiments.',
      specs: ['Digital microscopes & sensors', 'Arduino & Python robotics kits', '40-student lab capacity']
    },
    {
      title: 'ICT & CBT Examination Center',
      category: 'Digital Campus',
      image: '/photo02.jpeg',
      desc: 'High-speed fiber-connected computer complex hosting 150 workstations for coding quests, JAMB CBT simulations, and digital research.',
      specs: ['150 gigabit workstations', 'Solar & inverter backup power', 'PuzzlePRO coding studio']
    },
    {
      title: 'Modern E-Library & Research Hub',
      category: 'Academic Resource',
      image: '/photo03.jpeg',
      desc: 'Over 18,000 physical volumes paired with 24/7 ClassroomPRO digital handouts, past questions archive, and quiet study pods.',
      specs: ['18,000+ curated textbooks', 'Digital NERDC syllabus archive', 'Individual & group study pods']
    },
    {
      title: 'Sports Complex & Athletics Arena',
      category: 'Physical Education',
      image: '/photo04.jpeg',
      desc: 'All-weather football pitch, basketball and tennis courts, indoor games hall, and track & field lanes nurturing teamwork and fitness.',
      specs: ['FIFA-standard turf pitch', 'Floodlit basketball courts', 'Certified athletics coaches']
    },
    {
      title: 'Executive Boarding Hostels',
      category: 'Student Residence',
      image: '/photo06.jpeg',
      desc: 'Safe, air-conditioned boys’ and girls’ hostels with 24/7 CCTV surveillance, dedicated house parents, prep halls, and nutritious dining.',
      specs: ['Biometric hostel access', 'Supervised evening prep halls', 'Dietitian-planned meals']
    },
    {
      title: 'Campus Medical Center & Wellness',
      category: 'Health & Safety',
      image: '/photo08.jpeg',
      desc: 'Round-the-clock infirmary staffed by registered nurses and visiting physicians, with partner hospital ambulance response.',
      specs: ['24/7 licensed nursing staff', 'Electronic student health records', 'Counseling & wellness unit']
    }
  ],
  newsAndEvents: [
    {
      type: 'Featured News',
      date: 'Nov 10, 2026',
      image: '/photo09.jpeg',
      title: 'Scholars Clinch 1st Place at National STEM & Coding Olympiad',
      excerpt:
        'Our JSS 3 and SSS 2 coding team outperformed 85 competing secondary schools across Nigeria with an AI-powered smart irrigation prototype.',
      location: 'Abuja International Conference Centre'
    },
    {
      type: 'Upcoming Event',
      date: 'Nov 28, 2026 · 10:00 AM',
      image: '/photo10.jpeg',
      title: '24th Annual Inter-House Sports & Athletics Championship',
      excerpt:
        'Four houses compete in track relays, high jump, tug-of-war, and march-past ceremonies at the Main Campus Stadium.',
      location: 'Main Campus Sports Arena'
    },
    {
      type: 'Campus News',
      date: 'Dec 11, 2026 · 11:00 AM',
      image: '/photo11.jpeg',
      title: 'End-of-Year Cultural Festival, Carol Service & Prize-Giving Day',
      excerpt:
        'Celebrating Nigeria’s rich cultural heritage, musical performances, and honoring termly academic excellence awardees.',
      location: 'School Multipurpose Auditorium'
    }
  ],
  leadershipTeam: [
    {
      name: 'Dr. (Mrs.) Folake Adeyemi',
      role: 'Principal & Head of School',
      qualification: 'Ph.D. Educational Leadership (Ibadan)',
      image: '/avatars/character1.jpg',
      bio: '22+ years leading top-tier Nigerian and British-curriculum secondary institutions.'
    },
    {
      name: 'Engr. Chukwudi Okafor',
      role: 'Vice Principal (Academics)',
      qualification: 'M.Sc. Applied Mathematics & STEM',
      image: '/avatars/character2.jpg',
      bio: 'Oversees NERDC & IGCSE curriculum execution, continuous assessment quality, and WAEC readiness.'
    },
    {
      name: 'Mrs. Amina Bello-Yusuf',
      role: 'Vice Principal (Administration & Pastoral)',
      qualification: 'M.Ed. Guidance & Counseling',
      image: '/avatars/character3.jpg',
      bio: 'Directs student welfare, boarding house standards, discipline, and parent communications.'
    },
    {
      name: 'Mr. Tunde Ogunleye',
      role: 'Head of STEM, ICT & Future Skills',
      qualification: 'B.Sc. Computer Science · Certified Educator',
      image: '/avatars/character4.jpg',
      bio: 'Leads the coding academy, robotics club, and CBT examination infrastructure.'
    }
  ],
  admissionSteps: [
    {
      step: '01',
      title: 'Submit Online Inquiry',
      desc: 'Complete the digital admission form below or obtain the prospectus packet from the Admissions Office.'
    },
    {
      step: '02',
      title: 'CBT Entrance Assessment',
      desc: 'Candidates sit for our adaptive Computer-Based Test in Mathematics, English, and General Reasoning.'
    },
    {
      step: '03',
      title: 'Family Interview & Campus Tour',
      desc: 'Meet the Principal and tour our laboratories, classrooms, and boarding facilities with our admissions team.'
    },
    {
      step: '04',
      title: 'Admission Offer & Portal Activation',
      desc: 'Successful scholars receive their provisional admission letter and instant Parent & Student Portal credentials.'
    }
  ]
};

const STORAGE_KEY = 'scholars_ng_landing_cms_v1';

export function useLandingConfig() {
  const [config, setConfig] = useState<SchoolLandingConfig>(DEFAULT_LANDING_CONFIG);
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(STORAGE_KEY);
      if (raw) {
        const parsed = JSON.parse(raw);
        setConfig({ ...DEFAULT_LANDING_CONFIG, ...parsed });
      }
    } catch {
      // ignore storage errors
    }
    setLoaded(true);

    const handleStorage = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY && e.newValue) {
        try {
          setConfig({ ...DEFAULT_LANDING_CONFIG, ...JSON.parse(e.newValue) });
        } catch {
          // ignore
        }
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const saveConfig = useCallback((nextConfig: SchoolLandingConfig) => {
    setConfig(nextConfig);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(nextConfig));
    } catch {
      // ignore
    }
  }, []);

  const resetConfig = useCallback(() => {
    setConfig(DEFAULT_LANDING_CONFIG);
    try {
      localStorage.removeItem(STORAGE_KEY);
    } catch {
      // ignore
    }
  }, []);

  return { config, setConfig, saveConfig, resetConfig, loaded };
}
