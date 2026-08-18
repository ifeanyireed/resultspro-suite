export interface Module {
  id: string;
  stageId: number;
  title: string;
  duration: string;
  description: string;
  readingsCount: number;
  hasQuiz: boolean;
  hasChallenge: boolean;
  completed: boolean;
  videoUrl?: string;
  content: string;
  aiSummary: string;
  reflectionQuestions: string[];
}

export interface JourneyStage {
  id: number;
  number: string;
  title: string;
  subtitle: string;
  status: 'COMPLETED' | 'IN_PROGRESS' | 'LOCKED';
  modules: Module[];
}

export interface Project {
  id: string;
  title: string;
  stageNumber: string;
  description: string;
  deliverables: string[];
  rubric: { criterion: string; weight: string; description: string }[];
  acceptanceCriteria: string[];
  status: 'BACKLOG' | 'IN_PROGRESS' | 'PEER_REVIEW' | 'MENTOR_REVIEW' | 'REVISION_REQUESTED' | 'APPROVED';
  submittedUrl?: string;
  mentorFeedback?: {
    mentorName: string;
    avatar: string;
    rating: number;
    comment: string;
    timestamp: string;
    videoReviewUrl?: string;
  };
}

export interface Peer {
  id: string;
  name: string;
  avatar: string;
  role: string;
  skills: string[];
  currentStage: string;
  timezone: string;
  isPair: boolean;
  status: 'online' | 'coding' | 'designing' | 'reviewing' | 'studying' | 'offline';
}

export interface PresenceUser {
  id: string;
  name: string;
  avatar: string;
  activity: 'Designing' | 'Coding' | 'Reviewing' | 'Studying' | 'In Mentor 1:1';
  room: string;
  timeActive: string;
}

export interface LeaderboardUser {
  rank: number;
  name: string;
  avatar: string;
  xp: number;
  streak: number;
  projectsApproved: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  thumbnail: string;
  demoUrl: string;
  githubUrl?: string;
  figmaUrl?: string;
  description: string;
  techStack: string[];
  endorsement?: string;
}
