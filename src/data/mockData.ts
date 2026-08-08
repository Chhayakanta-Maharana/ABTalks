export interface StudentProfile {
  name: string;
  username: string;
  avatar: string;
  track: string;
  currentStreak: number;
  longestStreak: number;
  completedDays: number;
  totalDays: number;
  standingRank: string;
  githubHandle: string;
  linkedinHandle: string;
}

export interface Achievement {
  id: string;
  title: string;
  description: string;
  icon: string;
  unlockedAt: string | null;
  category: "consistency" | "code" | "community";
}

export interface ActivityFeedItem {
  id: string;
  studentName: string;
  avatar: string;
  dayNumber: number;
  commitMessage: string;
  githubUrl: string;
  linkedinUrl: string;
  timeAgo: string;
  reactionsCount: number;
}

export interface DayTask {
  dayNumber: number;
  title: string;
  track: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  estimatedTime: string;
  description: string;
  requirements: string[];
  starterRepoUrl: string;
  resources: { title: string; url: string }[];
  isSubmitted: boolean;
  submissionDetails?: {
    githubCommitUrl: string;
    linkedinPostUrl: string;
    submittedAt: string;
  };
}

export const INITIAL_STUDENT_PROFILE: StudentProfile = {
  name: "Chhayakanta Maharana",
  username: "@chhayakanta",
  avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=250&q=80",
  track: "Fullstack Web & AI Systems",
  currentStreak: 11,
  longestStreak: 11,
  completedDays: 11,
  totalDays: 60,
  standingRank: "Top 5% Cohort",
  githubHandle: "chhayakanta",
  linkedinHandle: "in/chhayakanta-maharana",
};

export const MOCK_ACHIEVEMENTS: Achievement[] = [
  {
    id: "first_commit",
    title: "First Proof",
    description: "Submitted your very first day of public proof of work.",
    icon: "🚀",
    unlockedAt: "Day 01",
    category: "consistency",
  },
  {
    id: "streak_10",
    title: "Consistency Titan",
    description: "Maintained an unbroken 10-day coding streak.",
    icon: "🔥",
    unlockedAt: "Day 10",
    category: "consistency",
  },
  {
    id: "github_warrior",
    title: "Git Master",
    description: "Committed clean, documented code for 10 straight builds.",
    icon: "⚡",
    unlockedAt: "Day 10",
    category: "code",
  },
  {
    id: "halfway_hero",
    title: "Halfway Hero",
    description: "Reach Day 30 without missing a single submission.",
    icon: "👑",
    unlockedAt: null,
    category: "consistency",
  },
  {
    id: "ship_it_all",
    title: "60-Day Champion",
    description: "Complete all 60 builds and finish the challenge.",
    icon: "🏆",
    unlockedAt: null,
    category: "community",
  },
];

export const MOCK_DAY_12_TASK: DayTask = {
  dayNumber: 12,
  title: "Responsive Dashboard Layout",
  track: "Fullstack Web & AI Systems",
  difficulty: "Intermediate",
  estimatedTime: "2 hours",
  description:
    "Design and build a sleek, mobile-first responsive dashboard layout with dark theme aesthetics, metric cards, real-time activity feed, and fluid breakpoint scaling.",
  requirements: [
    "Build a mobile-first (390px viewport baseline) fluid layout using CSS grid/flexbox",
    "Include key metric cards: streak count, overall completion percentage, standing rank",
    "Add interactive proof submission form with GitHub and LinkedIn URL inputs",
    "Ensure dark mode contrast ratio compliance and smooth glassmorphism styling",
  ],
  starterRepoUrl: "https://github.com/Chhayakanta-Maharana/ABTalks/",
  resources: [
    { title: "Tailwind CSS Layout Guidelines", url: "https://tailwindcss.com/docs/responsive-design" },
    { title: "Mobile-First CSS Best Practices", url: "https://web.dev/responsive-web-design-basics/" },
    { title: "Glassmorphism UI Patterns", url: "https://css.glass" },
  ],
  isSubmitted: false,
};

export const MOCK_ACTIVITY_FEED: ActivityFeedItem[] = [
  {
    id: "act-1",
    studentName: "Aarav Sharma",
    avatar: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&w=120&q=80",
    dayNumber: 12,
    commitMessage: "feat: responsive dashboard layout with mobile bottom nav",
    githubUrl: "https://github.com/aarav/day12-dashboard",
    linkedinUrl: "https://linkedin.com/in/aarav-sharma-builds",
    timeAgo: "15 mins ago",
    reactionsCount: 14,
  },
  {
    id: "act-2",
    studentName: "Priya Patel",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=120&q=80",
    dayNumber: 12,
    commitMessage: "feat: interactive streak progress grid & animated badges",
    githubUrl: "https://github.com/priyacodes/day-12-abtalks",
    linkedinUrl: "https://linkedin.com/in/priya-patel-dev",
    timeAgo: "42 mins ago",
    reactionsCount: 28,
  },
  {
    id: "act-3",
    studentName: "Rohan Verma",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=120&q=80",
    dayNumber: 12,
    commitMessage: "refactor: glassmorphism cards and smooth tab switching",
    githubUrl: "https://github.com/rohan-v/build-day-12",
    linkedinUrl: "https://linkedin.com/in/rohanverma-dev",
    timeAgo: "2 hours ago",
    reactionsCount: 19,
  },
];
