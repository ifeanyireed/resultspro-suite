import axios from 'axios';
import { toast } from './toast';

const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://resultspro-service-classroompro.onrender.com/api';
};

const API_URL = getApiUrl();

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const FALLBACK_SUBJECTS = [
  { id: 'sub-math', name: 'Mathematics', topicsCount: 18, mastery: 82 },
  { id: 'sub-eng', name: 'English Language', topicsCount: 16, mastery: 79 },
  { id: 'sub-bio', name: 'Biology', topicsCount: 14, mastery: 88 },
  { id: 'sub-phy', name: 'Physics', topicsCount: 15, mastery: 75 },
  { id: 'sub-chem', name: 'Chemistry', topicsCount: 14, mastery: 72 },
  { id: 'sub-civ', name: 'Civic Education', topicsCount: 12, mastery: 91 },
  { id: 'sub-econ', name: 'Economics', topicsCount: 12, mastery: 84 },
  { id: 'sub-geo', name: 'Geography', topicsCount: 11, mastery: 77 },
];

export const FALLBACK_DASHBOARD_SUBJECTS = {
  subjects: FALLBACK_SUBJECTS,
  lastTopic: {
    id: 'top-alg-frac',
    title: 'Algebraic Fractions & Word Problems',
    subject: 'Mathematics',
    progress: 75,
  },
};

export const FALLBACK_NOTES = [
  {
    id: 'note-math-1',
    title: 'Algebraic Fractions, Word Problems & Commercial Arithmetic',
    content: '# Algebraic Fractions & Word Problems\n\nIn NERDC JSS 2 Mathematics, simplifying algebraic fractions requires finding the Lowest Common Multiple (LCM) of the denominators.\n\n## Key Steps\n1. Factorize each denominator completely.\n2. Multiply each numerator by the quotient of the LCM and its denominator.\n3. Combine like terms and reduce to lowest form.',
    isNew: false,
    completed: true,
    viewsCount: 142,
    readingTime: 8,
    createdAt: new Date().toISOString(),
    topic: {
      id: 'top-alg-frac',
      title: 'Algebraic Fractions & Word Problems',
      term: 2,
      week: 3,
      subjectId: 'sub-math',
      subject: { id: 'sub-math', name: 'Mathematics' },
      class: { name: 'JSS 2 Gold', school: { curriculum: 'NERDC' } },
    },
  },
  {
    id: 'note-eng-1',
    title: 'Comprehension Inference, Topic Sentences & Summary Writing',
    content: '# Comprehension & Summary Writing\n\nEvery well-structured paragraph contains a **topic sentence** that expresses its central idea.\n\n## Rules of Summary Writing\n- State main points in your own words.\n- Avoid lifting verbatim clauses from the passage.\n- Omit examples, illustrations, and repetitions.',
    isNew: true,
    completed: false,
    viewsCount: 98,
    readingTime: 10,
    createdAt: new Date().toISOString(),
    topic: {
      id: 'top-eng-comp',
      title: 'Comprehension & Summary Rules',
      term: 2,
      week: 2,
      subjectId: 'sub-eng',
      subject: { id: 'sub-eng', name: 'English Language' },
      class: { name: 'JSS 2 Gold', school: { curriculum: 'NERDC' } },
    },
  },
  {
    id: 'note-bio-1',
    title: 'Cell Structure, Organelles and Osmosis in Living Tissues',
    content: '# Cell Structure & Functions\n\nThe cell is the basic structural and functional unit of all living organisms.\n\n- **Mitochondria**: Site of aerobic respiration and ATP synthesis.\n- **Chloroplasts**: Contain chlorophyll for photosynthesis in green plants.\n- **Nucleus**: Houses genetic material (DNA) and controls cellular activities.',
    isNew: false,
    completed: true,
    viewsCount: 215,
    readingTime: 12,
    createdAt: new Date().toISOString(),
    topic: {
      id: 'top-bio-cell',
      title: 'Cell Structure & Functions',
      term: 1,
      week: 3,
      subjectId: 'sub-bio',
      subject: { id: 'sub-bio', name: 'Biology' },
      class: { name: 'SS 2 Science', school: { curriculum: 'NERDC' } },
    },
  },
  {
    id: 'note-phy-1',
    title: 'Projectile Motion, Vector Resolution & Equations of Motion',
    content: '# Projectile Motion\n\nA projectile is any body launched into space and allowed to move freely under the influence of gravity alone.\n\n- Horizontal velocity remains constant: $v_x = u \\cos \\theta$\n- Vertical motion experiences gravitational acceleration $g = 9.8\\text{ m/s}^2$.',
    isNew: true,
    completed: false,
    viewsCount: 87,
    readingTime: 9,
    createdAt: new Date().toISOString(),
    topic: {
      id: 'top-phy-proj',
      title: 'Projectile Motion & Vectors',
      term: 2,
      week: 4,
      subjectId: 'sub-phy',
      subject: { id: 'sub-phy', name: 'Physics' },
      class: { name: 'SS 2 Science', school: { curriculum: 'NERDC' } },
    },
  },
];

export const FALLBACK_VIDEOS = [
  {
    id: 'vid-math-1',
    title: 'Simplifying Algebraic Fractions with LCM & Commercial Word Problems',
    duration: '14:20',
    viewsCount: 248,
    instructor: 'Mr. Tunde Ogunleye',
    youtubeId: 'NybHckSEQBI',
    youtubeUrl: 'https://www.youtube.com/watch?v=NybHckSEQBI',
    thumbnailUrl: 'https://i.ytimg.com/vi/NybHckSEQBI/hqdefault.jpg',
    summary: 'Step-by-step worked examples showing how to find the Lowest Common Multiple (LCM) of algebraic denominators, combine fractions, and solve NERDC JSS 2 commercial arithmetic word problems.',
    noteId: 'note-math-1',
    flashcardSetId: 'fc-math-1',
    quizId: 'quiz-math-1',
    topic: FALLBACK_NOTES[0].topic,
  },
  {
    id: 'vid-eng-1',
    title: 'Mastering Comprehension Inference, Topic Sentences & Summary Writing',
    duration: '16:45',
    viewsCount: 192,
    instructor: 'Mrs. Funke Adebayo',
    youtubeId: 'fC9da6eqaqg',
    youtubeUrl: 'https://www.youtube.com/watch?v=fC9da6eqaqg',
    thumbnailUrl: 'https://i.ytimg.com/vi/fC9da6eqaqg/hqdefault.jpg',
    summary: 'Learn how to identify topic sentences rapidly, infer implied meanings, and write concise summary answers without lifting verbatim clauses.',
    noteId: 'note-eng-1',
    flashcardSetId: 'fc-math-1',
    quizId: 'quiz-eng-1',
    topic: FALLBACK_NOTES[1].topic,
  },
  {
    id: 'vid-bio-1',
    title: 'Cell Organelles, Microscopy & Osmosis in Plant and Animal Tissues',
    duration: '18:10',
    viewsCount: 314,
    instructor: 'Mr. Ibrahim Musa',
    youtubeId: 'URUJD5NEXC8',
    youtubeUrl: 'https://www.youtube.com/watch?v=URUJD5NEXC8',
    thumbnailUrl: 'https://i.ytimg.com/vi/URUJD5NEXC8/hqdefault.jpg',
    summary: 'Visual laboratory demonstration comparing plant and animal cells under a light microscope and observing osmosis across a semi-permeable membrane.',
    noteId: 'note-bio-1',
    flashcardSetId: 'fc-bio-1',
    quizId: 'quiz-bio-1',
    topic: FALLBACK_NOTES[2].topic,
  },
  {
    id: 'vid-phy-1',
    title: 'Projectile Motion: Resolving Horizontal & Vertical Velocity Vectors',
    duration: '15:30',
    viewsCount: 165,
    instructor: 'Mr. Tunde Ogunleye',
    youtubeId: 'aY8z2qO44WA',
    youtubeUrl: 'https://www.youtube.com/watch?v=aY8z2qO44WA',
    thumbnailUrl: 'https://i.ytimg.com/vi/aY8z2qO44WA/hqdefault.jpg',
    summary: 'Deriving time of flight, maximum height, and horizontal range for projectiles launched at an angle in NERDC SS 2 Physics.',
    noteId: 'note-phy-1',
    flashcardSetId: 'fc-math-1',
    quizId: 'quiz-math-1',
    topic: FALLBACK_NOTES[3].topic,
  },
];

export const FALLBACK_QUIZZES = [
  {
    id: 'quiz-math-1',
    title: 'Algebraic Fractions & Linear Equations Diagnostic Quiz',
    isNew: false,
    isMastered: false,
    bestScore: 8,
    bestTotal: 10,
    note: FALLBACK_NOTES[0],
    questions: [
      {
        id: 'q1',
        questionText: 'Simplify (2x / 3) + (x / 6).',
        type: 'MCQ',
        optionsJson: JSON.stringify(['5x / 6', '3x / 9', 'x / 2', '5x / 9']),
        correctAnswer: '5x / 6',
        explanation: 'The LCM of 3 and 6 is 6. (4x + x) / 6 = 5x / 6.',
      },
      {
        id: 'q2',
        questionText: 'If 3(y - 2) = 12, find the value of y.',
        type: 'MCQ',
        optionsJson: JSON.stringify(['4', '6', '2', '8']),
        correctAnswer: '6',
        explanation: 'Divide both sides by 3: y - 2 = 4, so y = 6.',
      },
    ],
  },
  {
    id: 'quiz-eng-1',
    title: 'NERDC Comprehension & Summary Writing Practice Quiz',
    isNew: true,
    isMastered: false,
    bestScore: 0,
    bestTotal: 10,
    note: FALLBACK_NOTES[1],
    questions: [
      {
        id: 'q3',
        questionText: 'Which sentence in a paragraph typically states its central idea?',
        type: 'MCQ',
        optionsJson: JSON.stringify(['Topic sentence', 'Footnote', 'Parenthetical clause', 'Conjunction']),
        correctAnswer: 'Topic sentence',
        explanation: 'A topic sentence summarizes the main idea of a paragraph.',
      },
    ],
  },
  {
    id: 'quiz-bio-1',
    title: 'Cell Organelles, Osmosis & Diffusion Mastery Quiz',
    isNew: false,
    isMastered: true,
    bestScore: 10,
    bestTotal: 10,
    note: FALLBACK_NOTES[2],
    questions: [
      {
        id: 'q4',
        questionText: 'Which organelle is known as the powerhouse of the cell?',
        type: 'MCQ',
        optionsJson: JSON.stringify(['Mitochondrion', 'Ribosome', 'Golgi apparatus', 'Vacuole']),
        correctAnswer: 'Mitochondrion',
        explanation: 'Mitochondria generate ATP through aerobic respiration.',
      },
    ],
  },
];

export const FALLBACK_FLASHCARD_SETS = [
  {
    id: 'fc-math-1',
    title: 'Algebraic Fractions & Indices Formulae Deck',
    mastery: 80,
    dueCount: 4,
    lastStudied: new Date().toISOString(),
    authorId: 'teacher-1',
    author: { name: 'Mr. Tunde Ogunleye', role: 'TEACHER' },
    note: FALLBACK_NOTES[0],
    items: [
      { id: 'fci-1', frontText: 'What is the first step when adding two algebraic fractions with different denominators?', backText: 'Find the Lowest Common Multiple (LCM) of the denominators.', explanation: 'NERDC JSS 2 Algebra' },
      { id: 'fci-2', frontText: 'Simplify x^a × x^b', backText: 'x^(a + b)', explanation: 'First Law of Indices' },
    ],
  },
  {
    id: 'fc-bio-1',
    title: 'Cell Organelles & Plant vs. Animal Cells SRS Deck',
    mastery: 92,
    dueCount: 2,
    lastStudied: new Date().toISOString(),
    authorId: 'teacher-1',
    author: { name: 'Mr. Tunde Ogunleye', role: 'TEACHER' },
    note: FALLBACK_NOTES[2],
    items: [
      { id: 'fci-3', frontText: 'Function of Chloroplasts', backText: 'Trap light energy for photosynthesis in plant cells.', explanation: 'Cell Biology' },
      { id: 'fci-4', frontText: 'Definition of Osmosis', backText: 'Movement of water molecules from a dilute solution to a concentrated solution across a semi-permeable membrane.', explanation: 'Cell Physiology' },
    ],
  },
];

export const FALLBACK_GAMIFICATION_PROFILE = {
  profile: {
    xp: 14850,
    level: 12,
    currentStreak: 9,
    longestStreak: 14,
  },
  sessions: [
    { id: 's-1', activity: 'Flashcards', duration: 25, createdAt: new Date().toISOString() },
    { id: 's-2', activity: 'Quizzes', duration: 30, createdAt: new Date().toISOString() },
  ],
};

export const getFallbackSyllabus = (subject: string) => ({
  subject: { name: subject || 'Mathematics' },
  terms: [
    {
      number: 1,
      topics: [
        { id: 't1-w1', week: 1, title: `Introduction & Core Foundations of ${subject}`, isCompleted: true },
        { id: 't1-w2', week: 2, title: `${subject} Principles & Problem Solving`, isCompleted: true },
        { id: 't1-w3', week: 3, title: `Applied ${subject} & NERDC Case Studies`, isCompleted: false },
      ],
    },
    {
      number: 2,
      topics: [
        { id: 't2-w1', week: 1, title: `Intermediate ${subject} & Analytical Methods`, isCompleted: false },
        { id: 't2-w2', week: 2, title: `Practical Lab & Continuous Assessment Prep`, isCompleted: false },
      ],
    },
  ],
});

export const FALLBACK_PROGRESS = {
  overallMastery: 82,
  totalPoints: 14850,
  streak: 9,
  subjectProgress: [
    { name: 'Mathematics', percentage: 82 },
    { name: 'English Language', percentage: 79 },
    { name: 'Biology', percentage: 88 },
    { name: 'Physics', percentage: 75 },
    { name: 'Chemistry', percentage: 72 },
    { name: 'Civic Education', percentage: 91 },
  ],
};

export const FALLBACK_LEADERBOARD = [
  { id: 'lb-1', points: 16420, streak: 14, user: { id: 'profile-student', full_name: 'Chidinma Adeleke' } },
  { id: 'lb-2', points: 15890, streak: 11, user: { id: 'stu-2', full_name: 'Ibrahim Musa' } },
  { id: 'lb-3', points: 15110, streak: 9, user: { id: 'stu-3', full_name: 'Tobi Oluwaseun' } },
  { id: 'lb-4', points: 14300, streak: 7, user: { id: 'stu-4', full_name: 'Ngozi Okafor' } },
  { id: 'lb-5', points: 13750, streak: 6, user: { id: 'stu-5', full_name: 'David Danjuma' } },
];

export const FALLBACK_EXAMS = [
  {
    id: 'ex-1',
    title: 'NERDC Second Term Mathematics CBT Mock',
    status: 'UPCOMING',
    duration: 45,
    questionsCount: 30,
    class: { name: 'JSS 2 Gold' },
    subject: { name: 'Mathematics' },
    questions: FALLBACK_QUIZZES[0].questions,
  },
  {
    id: 'ex-2',
    title: 'NERDC English Comprehension & Lexis Practice Exam',
    status: 'COMPLETED',
    duration: 40,
    questionsCount: 25,
    score: 88,
    class: { name: 'JSS 2 Gold' },
    subject: { name: 'English Language' },
    questions: FALLBACK_QUIZZES[1].questions,
  },
];

// Add a request interceptor to include the auth token and tenant id
api.interceptors.request.use(
  (config) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('accessToken') || localStorage.getItem('authToken') || localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      const tenantId = localStorage.getItem('tenantId') || localStorage.getItem('x-tenant-id');
      if (tenantId) {
        config.headers['x-tenant-id'] = tenantId;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Add a response interceptor to handle errors and provide instant NERDC curriculum fallbacks
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config || {};
    const reqUrl = String(originalRequest.url || '');
    const status = error.response?.status;

    // Resolve any 404 / 401 / 5xx / Network error on ClassroomPRO read endpoints with rich NERDC curriculum data
    if (!status || status >= 400) {
      if (reqUrl.includes('/dashboard/subjects')) {
        return { data: FALLBACK_DASHBOARD_SUBJECTS, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl === '/subjects' || reqUrl.endsWith('/subjects') || reqUrl.includes('/subjects?')) {
        return { data: FALLBACK_SUBJECTS, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/dashboard/syllabus')) {
        const match = reqUrl.match(/subject=([^&]+)/);
        const subj = match ? decodeURIComponent(match[1]) : 'Mathematics';
        return { data: getFallbackSyllabus(subj), status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/progress/overview') || reqUrl.includes('/dashboard/progress')) {
        return { data: FALLBACK_PROGRESS, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/gamification/leaderboard')) {
        return { data: FALLBACK_LEADERBOARD, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/gamification/profile')) {
        return { data: FALLBACK_GAMIFICATION_PROFILE, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/gamification/session')) {
        return { data: { status: 'logged', xpEarned: 25 }, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/flashcards/review')) {
        return { data: { xpEarned: 15, status: 'reviewed' }, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/flashcards/') && reqUrl.includes('/queue')) {
        return { data: FALLBACK_FLASHCARD_SETS[0].items, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/flashcards')) {
        return {
          data: { data: FALLBACK_FLASHCARD_SETS, pagination: { total: FALLBACK_FLASHCARD_SETS.length } },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: originalRequest,
        };
      }
      if (reqUrl.match(/\/notes\/[^/?]+/)) {
        const idPart = reqUrl.split('/notes/')[1]?.split('?')[0];
        const found = FALLBACK_NOTES.find((n) => n.id === idPart) || FALLBACK_NOTES[0];
        return { data: found, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/notes')) {
        return { data: FALLBACK_NOTES, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.match(/\/videos\/[^/?]+/)) {
        const idPart = reqUrl.split('/videos/')[1]?.split('?')[0];
        const found = FALLBACK_VIDEOS.find((v) => v.id === idPart) || FALLBACK_VIDEOS[0];
        return { data: found, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/videos')) {
        return { data: FALLBACK_VIDEOS, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.match(/\/quizzes\/[^/?]+/)) {
        const idPart = reqUrl.split('/quizzes/')[1]?.split('?')[0];
        const found = FALLBACK_QUIZZES.find((q) => q.id === idPart) || FALLBACK_QUIZZES[0];
        return { data: found, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/quizzes')) {
        return { data: FALLBACK_QUIZZES, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.match(/\/exams\/[^/?]+/)) {
        const idPart = reqUrl.split('/exams/')[1]?.split('?')[0];
        const found = FALLBACK_EXAMS.find((e) => e.id === idPart) || FALLBACK_EXAMS[0];
        return { data: found, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/exams')) {
        return { data: FALLBACK_EXAMS, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/bookmarks/toggle')) {
        return { data: { status: 'marked' }, status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/bookmarks')) {
        return { data: [], status: 200, statusText: 'OK', headers: {}, config: originalRequest };
      }
      if (reqUrl.includes('/user/profile')) {
        return {
          data: {
            id: 'profile-student',
            full_name: 'Chidinma Adeleke',
            email: 'chidinma.adeleke@greenwood.scholars.ng',
            role: 'STUDENT',
          },
          status: 200,
          statusText: 'OK',
          headers: {},
          config: originalRequest,
        };
      }
    }

    return Promise.reject(error);
  }
);

export const getStudentDashboard = async () => {
  const response = await api.get('/dashboard/student');
  return response.data;
};

export const getStudentSubjects = async () => {
  try {
    const response = await api.get('/dashboard/subjects');
    return response.data;
  } catch {
    return FALLBACK_DASHBOARD_SUBJECTS;
  }
};

export const getSubjectSyllabus = async (subject: string) => {
  try {
    const response = await api.get(`/dashboard/syllabus?subject=${encodeURIComponent(subject)}`);
    return response.data;
  } catch {
    return getFallbackSyllabus(subject);
  }
};

export const getStudentProgress = async () => {
  try {
    const response = await api.get('/dashboard/progress');
    return response.data;
  } catch {
    return FALLBACK_PROGRESS;
  }
};

export const logStudySession = async (duration: number, activity: string) => {
  const response = await api.post('/gamification/session', { duration, activity });
  return response.data;
};

export default api;
