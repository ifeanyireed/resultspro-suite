import { JourneyStage, Project, Peer, PresenceUser, LeaderboardUser, PortfolioItem } from './types';

export const mockJourneyStages: JourneyStage[] = [
  {
    id: 1,
    number: '01',
    title: 'Foundational Knowledge',
    subtitle: 'Core principles, architecture, mental models, and environment setup',
    status: 'COMPLETED',
    modules: [
      {
        id: 'mod-1',
        stageId: 1,
        title: 'Modern Architecture & System Mental Models',
        duration: '45 mins',
        description: 'Understand how microservices, event loops, and distributed systems coordinate under load.',
        readingsCount: 3,
        hasQuiz: true,
        hasChallenge: true,
        completed: true,
        content: `### System Architecture Principles
In modern software engineering, separating control planes from data planes allows independent scaling.
Every service should operate with bounded contexts, communicating via well-typed JSON RPC or REST interfaces.`,
        aiSummary: 'Covers decoupled service topology, zero-PII security standards, and resilient connection pooling.',
        reflectionQuestions: [
          'Why is state separation essential in high-concurrency education platforms?',
          'How does JWT token rotation protect against token replay attacks?',
        ],
      },
      {
        id: 'mod-2',
        stageId: 1,
        title: 'Database Schemas, Normalization & Query Indexes',
        duration: '60 mins',
        description: 'Design robust schemas with composite indexes, foreign key cascades, and utf8mb4 collation.',
        readingsCount: 2,
        hasQuiz: true,
        hasChallenge: false,
        completed: true,
        content: `### Indexing for High Concurrency
When millions of students check gradebooks simultaneously, composite indexing prevents full table scans.`,
        aiSummary: 'Deep dive into B-Tree indexes, multi-tenant isolation, and connection pooling.',
        reflectionQuestions: ['When should you prefer composite indexes over single-column indexes?'],
      },
    ],
  },
  {
    id: 2,
    number: '02',
    title: 'Practical Application',
    subtitle: 'Build interactive prototypes, wireframes, and live API controllers',
    status: 'IN_PROGRESS',
    modules: [
      {
        id: 'mod-3',
        stageId: 2,
        title: 'High-Performance API Design with Go & GORM',
        duration: '90 mins',
        description: 'Implement blazing-fast HTTP endpoints, middleware chains, and connection pooling.',
        readingsCount: 4,
        hasQuiz: true,
        hasChallenge: true,
        completed: true,
        content: `### Building High-Performance REST APIs
Go routines provide ultra-lightweight concurrency, allowing tens of thousands of simultaneous connections with minimal memory overhead.`,
        aiSummary: 'Detailed guide on crafting clean REST routes, GORM auto-migrations, and sub-app authorization headers.',
        reflectionQuestions: ['How do Go goroutines differ from OS threads in memory footprint?'],
      },
      {
        id: 'mod-4',
        stageId: 2,
        title: 'State Management & Fluid Micro-Interactions in React',
        duration: '75 mins',
        description: 'Craft responsive dashboards with real-time presence indicators and animated metrics.',
        readingsCount: 3,
        hasQuiz: true,
        hasChallenge: true,
        completed: false,
        content: `### React 19 & Tailwind Fluid Architecture
Modern web applications must feel instant and alive. Use optimistic updates and micro-animations to enhance user engagement.`,
        aiSummary: 'Techniques for building alive interfaces with WebSocket presence and optimistic UI feedback.',
        reflectionQuestions: ['What is the best pattern for handling optimistic updates during network latency?'],
      },
    ],
  },
  {
    id: 3,
    number: '03',
    title: 'Projects & Implementations',
    subtitle: 'Ship production-grade features evaluated against real-world industry rubrics',
    status: 'IN_PROGRESS',
    modules: [
      {
        id: 'mod-5',
        stageId: 3,
        title: 'Building a Fullstack Multi-Tenant LMS Module',
        duration: '120 mins',
        description: 'Assemble quiz runners, lesson video players, and Spaced Repetition flashcards.',
        readingsCount: 5,
        hasQuiz: true,
        hasChallenge: true,
        completed: false,
        content: `### Assembling the Complete LMS Engine
Integrate student tracking, flashcard spaced repetition queues, and interactive quiz timers into a unified learning flow.`,
        aiSummary: 'End-to-end blueprint for building educational software with real-time progress syncing.',
        reflectionQuestions: ['How does the Leitner SRS algorithm optimize long-term memory retention?'],
      },
    ],
  },
  {
    id: 4,
    number: '04',
    title: 'Peer Review & Feedback',
    subtitle: 'Collaborative code reviews, rubric benchmarking, and mentor critique',
    status: 'LOCKED',
    modules: [],
  },
  {
    id: 5,
    number: '05',
    title: 'Iteration & Polish',
    subtitle: 'Refactoring, performance optimizations, accessibility audits, and edge-case handling',
    status: 'LOCKED',
    modules: [],
  },
  {
    id: 6,
    number: '06',
    title: 'Demo Day & Live Defense',
    subtitle: 'Present your completed system live to mentors, alumni, and tech hiring partners',
    status: 'LOCKED',
    modules: [],
  },
  {
    id: 7,
    number: '07',
    title: 'Public Employer Portfolio',
    subtitle: 'Publish your interactive case studies with verified mentor endorsements',
    status: 'LOCKED',
    modules: [],
  },
];

export const mockProjects: Project[] = [
  {
    id: 'proj-1',
    title: 'Design & Build an AI-Powered Assessment Engine',
    stageNumber: '03',
    description: 'Build an automated grading and result analysis engine capable of processing 10,000+ student scores with instant gradebook generation.',
    deliverables: [
      'Interactive Next.js Teacher Score Sheet with live calculations',
      'Go Backend Microservice with GORM MySQL connection',
      'Instant Gradebook PDF Generator with QR verification',
      'Comprehensive Unit & Integration Test Suite',
    ],
    acceptanceCriteria: [
      'Submissions must calculate total scores, GPA, and class rankings automatically',
      'Score entry must support optimistic offline-first caching',
      'Zero-PII compliant token authentication',
    ],
    rubric: [
      { criterion: 'Architecture & Code Cleanliness', weight: '30%', description: 'Modularity, clean types, and zero compiler warnings.' },
      { criterion: 'UI Polish & User Experience', weight: '30%', description: 'Responsive design, typography, and micro-interactions.' },
      { criterion: 'Performance & Security', weight: '40%', description: 'Fast load times, SQL indexing, and token protection.' },
    ],
    status: 'MENTOR_REVIEW',
    submittedUrl: 'https://github.com/ifeanyireed/resultspro_suite',
    mentorFeedback: {
      mentorName: 'Dr. Adeyemi Alabi',
      avatar: '/avatars/character9.jpg',
      rating: 4.9,
      comment: 'Exceptional architectural separation between the identity service and the result engine. The GORM integration is clean and well-typed.',
      timestamp: 'Yesterday at 4:30 PM',
    },
  },
  {
    id: 'proj-2',
    title: 'Real-Time Multiplayer CBT Battle Arena',
    stageNumber: '03',
    description: 'Implement WebSocket rooms for 1v1 and tournament academic challenges with live buzzer speed scoring and ELO updates.',
    deliverables: [
      'WebSocket connection manager in Go',
      'Interactive battle UI with buzzer animation and live health bars',
      'ELO calculation and leaderboard streak database',
    ],
    acceptanceCriteria: [
      'Sub-50ms message latency across concurrent battle rooms',
      'Graceful reconnection handling on network dropouts',
    ],
    rubric: [
      { criterion: 'Realtime Latency & Concurrency', weight: '40%', description: 'WebSocket heartbeat and message handling.' },
      { criterion: 'Gamification Mechanics', weight: '30%', description: 'Smooth animations and responsive sound cues.' },
      { criterion: 'Edge-Case Recovery', weight: '30%', description: 'Handling disconnects, forfeits, and timeouts.' },
    ],
    status: 'IN_PROGRESS',
  },
];

export const mockPeers: Peer[] = [
  {
    id: 'peer-1',
    name: 'Tunde Bakare',
    avatar: '/avatars/character5.jpg',
    role: 'Fullstack Builder',
    skills: ['Go', 'React', 'GORM', 'MySQL'],
    currentStage: 'Stage 03: Projects',
    timezone: 'WAT (UTC+1)',
    isPair: true,
    status: 'coding',
  },
  {
    id: 'peer-2',
    name: 'Amara Nwosu',
    avatar: '/avatars/character5.jpg',
    role: 'Product Designer',
    skills: ['Figma', 'Design Systems', 'Tailwind'],
    currentStage: 'Stage 03: Projects',
    timezone: 'WAT (UTC+1)',
    isPair: false,
    status: 'designing',
  },
  {
    id: 'peer-3',
    name: 'Kofi Mensah',
    avatar: '/avatars/character2.jpg',
    role: 'Backend Engineer',
    skills: ['Go', 'Docker', 'AWS SES', 'PostgreSQL'],
    currentStage: 'Stage 02: Applications',
    timezone: 'GMT (UTC+0)',
    isPair: false,
    status: 'studying',
  },
  {
    id: 'peer-4',
    name: 'Fatima Ibrahim',
    avatar: '/avatars/character5.jpg',
    role: 'AI & Fullstack Dev',
    skills: ['Python', 'Next.js', 'LLMs', 'Prompt Engineering'],
    currentStage: 'Stage 03: Projects',
    timezone: 'WAT (UTC+1)',
    isPair: false,
    status: 'online',
  },
];

export const mockPresence: PresenceUser[] = [
  { id: '1', name: 'Tunde Bakare', avatar: '/avatars/character18.jpg', activity: 'Coding', room: 'Sprint Room Alpha', timeActive: '42m' },
  { id: '2', name: 'Amara Nwosu', avatar: '/avatars/character19.jpg', activity: 'Designing', room: 'Figma Lab', timeActive: '1h 15m' },
  { id: '3', name: 'Kofi Mensah', avatar: '/avatars/character5.jpg', activity: 'Studying', room: 'Quiet Study Hall', timeActive: '25m' },
  { id: '4', name: 'Dr. Adeyemi', avatar: '/avatars/character14.jpg', activity: 'In Mentor 1:1', room: 'Office Hours #1', timeActive: '10m' },
];

export const mockLeaderboard: LeaderboardUser[] = [
  { rank: 1, name: 'Tunde Bakare', avatar: '/avatars/character5.jpg', xp: 4850, streak: 18, projectsApproved: 4, badge: 'PROJECT HERO' },
  { rank: 2, name: 'You (Alex Reed)', avatar: '/avatars/character15.jpg', xp: 4620, streak: 14, projectsApproved: 3, badge: 'FAST FINISHER', isCurrentUser: true },
  { rank: 3, name: 'Fatima Ibrahim', avatar: '/avatars/character2.jpg', xp: 4100, streak: 12, projectsApproved: 3, badge: 'TOP REVIEWER' },
  { rank: 4, name: 'Amara Nwosu', avatar: '/avatars/character13.jpg', xp: 3950, streak: 9, projectsApproved: 2, badge: 'BEST TEAMMATE' },
  { rank: 5, name: 'Kofi Mensah', avatar: '/avatars/character10.jpg', xp: 3400, streak: 7, projectsApproved: 2, badge: 'BUILDER' },
];

export const mockPortfolio: PortfolioItem[] = [
  {
    id: 'port-1',
    title: 'ResultsPRO Assessment & Gradebook Engine',
    category: 'Fullstack Systems Engineering',
    thumbnail: '"/avatars/character2.jpg"',
    demoUrl: 'https://resultspro.ng/demo',
    githubUrl: 'https://github.com/ifeanyireed/resultspro_suite',
    description: 'A distributed Go microservice handling Continuous Assessment records, automated GPA calculations, class rankings, and instant high-fidelity PDF gradebook generation.',
    techStack: ['Go 1.23', 'GORM', 'MySQL', 'Next.js 15', 'Tailwind CSS', 'Docker'],
    endorsement: 'Alex demonstrated mastery of decoupled service architecture and resilient database pooling under high student traffic.',
  },
  {
    id: 'port-2',
    title: 'examsPRO Multiplayer CBT Battle Arena',
    category: 'Real-Time WebSockets & Gamification',
    thumbnail: '"/avatars/character2.jpg"',
    demoUrl: 'https://examspro.ng/live',
    githubUrl: 'https://github.com/ifeanyireed/resultspro_suite',
    description: 'Low-latency multiplayer battle room connecting students in live timed exam challenges with real-time wager settlements and dynamic ELO leaderboard tracking.',
    techStack: ['Go', 'WebSockets', 'Melody', 'React 19', 'Tailwind CSS'],
    endorsement: 'Superb real-time synchronization with sub-50ms message latency across concurrent exam matches.',
  },
];
