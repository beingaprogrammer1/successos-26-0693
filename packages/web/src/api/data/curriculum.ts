/**
 * Single source of truth for SuccessOS 26 course content, achievements and the changelog.
 * Lessons are static; only a member's progress and gem ledger live in the database.
 */

export interface Lesson {
  id: string;
  title: string;
  summary: string;
  minutes: number;
  gems: number;
}

export interface Course {
  slug: string;
  title: string;
  tagline: string;
  description: string;
  notebookUrl: string;
  level: "Foundation" | "Core" | "Advanced";
  accent: "navy" | "gem" | "sage" | "ink";
  icon: string;
  completionBonus: number;
  outcomes: string[];
  lessons: Lesson[];
}

export const COURSES: Course[] = [
  {
    slug: "studying",
    title: "Studying",
    tagline: "Learn faster, forget less.",
    description:
      "The study system underneath everything else on SuccessOS 26. You will build a repeatable loop for reading, recalling and reviewing so the material actually sticks past exam week.",
    notebookUrl: "https://notebook.google.com/notebook/75ed83b1-5901-4181-8b56-13f06144947d",
    level: "Foundation",
    accent: "navy",
    icon: "BookOpen",
    completionBonus: 120,
    outcomes: [
      "Run an active-recall session without notes in front of you",
      "Space your reviews so nothing needs cramming",
      "Turn any chapter into questions in under ten minutes",
    ],
    lessons: [
      {
        id: "studying-1",
        title: "Why re-reading fails",
        summary: "Recognition is not recall. What your brain is actually doing when a page feels familiar.",
        minutes: 12,
        gems: 20,
      },
      {
        id: "studying-2",
        title: "Active recall, properly done",
        summary: "Closing the book and pulling the answer out — the single highest-return study move.",
        minutes: 18,
        gems: 25,
      },
      {
        id: "studying-3",
        title: "Spaced repetition schedules",
        summary: "How to space reviews across days so one pass keeps paying off for weeks.",
        minutes: 15,
        gems: 25,
      },
      {
        id: "studying-4",
        title: "Notes that are built to be tested",
        summary: "Writing notes as questions and cues instead of transcripts.",
        minutes: 14,
        gems: 20,
      },
      {
        id: "studying-5",
        title: "Deep work blocks and breaks",
        summary: "Session length, phone placement, and what a real break looks like.",
        minutes: 16,
        gems: 25,
      },
      {
        id: "studying-6",
        title: "Exam week without the panic",
        summary: "Working backwards from the paper date and running past questions under time.",
        minutes: 20,
        gems: 30,
      },
    ],
  },
  {
    slug: "empathy",
    title: "Empathy",
    tagline: "Understand people before you answer them.",
    description:
      "Empathy is a skill with steps, not a personality trait. This course covers listening, reading emotion, and responding in a way that leaves people better than you found them.",
    notebookUrl: "https://notebook.google.com/notebook/a335524a-85d3-47b3-ac44-fd65023b4337",
    level: "Core",
    accent: "sage",
    icon: "HeartHandshake",
    completionBonus: 120,
    outcomes: [
      "Listen for the need under the words",
      "Handle someone else's bad day without absorbing it",
      "Disagree without making it personal",
    ],
    lessons: [
      {
        id: "empathy-1",
        title: "Empathy vs sympathy vs pity",
        summary: "Three different responses people mix up, and what each one does to a conversation.",
        minutes: 11,
        gems: 20,
      },
      {
        id: "empathy-2",
        title: "Listening without loading a reply",
        summary: "The habit of rehearsing your answer mid-sentence, and how to break it.",
        minutes: 14,
        gems: 25,
      },
      {
        id: "empathy-3",
        title: "Reading tone, face and pause",
        summary: "The signals that carry most of the message, especially the silences.",
        minutes: 13,
        gems: 20,
      },
      {
        id: "empathy-4",
        title: "Asking the second question",
        summary: "Why the first answer is rarely the real one, and how to open the door politely.",
        minutes: 12,
        gems: 25,
      },
      {
        id: "empathy-5",
        title: "Boundaries and emotional load",
        summary: "Caring at full strength without carrying everyone's weight home.",
        minutes: 15,
        gems: 25,
      },
      {
        id: "empathy-6",
        title: "Repairing after you get it wrong",
        summary: "The short, specific apology that actually rebuilds trust.",
        minutes: 13,
        gems: 30,
      },
    ],
  },
  {
    slug: "life-advice",
    title: "Life Advice",
    tagline: "The things nobody sat you down and explained.",
    description:
      "Practical judgement for decisions that compound: habits, time, people you keep close, and what to do when a plan falls apart. Broad by design, useful immediately.",
    notebookUrl: "https://notebook.google.com/notebook/4d7cfebc-a979-46fb-aa48-a56aa2faff5a",
    level: "Foundation",
    accent: "gem",
    icon: "Compass",
    completionBonus: 120,
    outcomes: [
      "Make a decision you can defend a year from now",
      "Build a habit that survives a bad week",
      "Recover from a setback without losing the month",
    ],
    lessons: [
      {
        id: "life-advice-1",
        title: "Decisions you can reverse",
        summary: "Sorting choices by how expensive a mistake would be, then moving fast on the cheap ones.",
        minutes: 13,
        gems: 20,
      },
      {
        id: "life-advice-2",
        title: "Habits over motivation",
        summary: "Designing the smallest version of a habit that still counts.",
        minutes: 15,
        gems: 25,
      },
      {
        id: "life-advice-3",
        title: "Where your hours actually go",
        summary: "An honest audit of a week, and the two leaks almost everyone finds.",
        minutes: 14,
        gems: 20,
      },
      {
        id: "life-advice-4",
        title: "Choosing the room you sit in",
        summary: "How the five people around you set your defaults, for better or worse.",
        minutes: 12,
        gems: 25,
      },
      {
        id: "life-advice-5",
        title: "Failing on purpose, cheaply",
        summary: "Running small experiments so the big bets have evidence behind them.",
        minutes: 16,
        gems: 25,
      },
      {
        id: "life-advice-6",
        title: "Getting back up quickly",
        summary: "A short routine for the days after something goes badly wrong.",
        minutes: 14,
        gems: 30,
      },
    ],
  },
  {
    slug: "presentation-skills",
    title: "Presentation Skills",
    tagline: "Say it so the room remembers.",
    description:
      "From the first sentence to the last slide: structure, delivery, nerves and questions. Built for classrooms, interviews and pitches alike.",
    notebookUrl: "https://notebook.google.com/notebook/53f7ff9f-0127-43e6-b2ff-7635f0de4c68",
    level: "Core",
    accent: "ink",
    icon: "Presentation",
    completionBonus: 130,
    outcomes: [
      "Open with a line the room leans into",
      "Build slides that support you instead of replacing you",
      "Take a hostile question without losing the floor",
    ],
    lessons: [
      {
        id: "presentation-skills-1",
        title: "One idea per talk",
        summary: "Finding the single sentence your audience should leave repeating.",
        minutes: 12,
        gems: 20,
      },
      {
        id: "presentation-skills-2",
        title: "Structure that carries an audience",
        summary: "Hook, tension, turn, payoff — the shape behind talks that hold attention.",
        minutes: 16,
        gems: 25,
      },
      {
        id: "presentation-skills-3",
        title: "Slides as support, not script",
        summary: "One point per slide, big type, and why bullet walls kill a room.",
        minutes: 14,
        gems: 20,
      },
      {
        id: "presentation-skills-4",
        title: "Voice, pace and the useful pause",
        summary: "Using silence deliberately and landing your last three words.",
        minutes: 15,
        gems: 25,
      },
      {
        id: "presentation-skills-5",
        title: "Nerves as fuel",
        summary: "A pre-talk routine that turns adrenaline into energy instead of shake.",
        minutes: 13,
        gems: 25,
      },
      {
        id: "presentation-skills-6",
        title: "Q&A without getting cornered",
        summary: "Answer structures for hard, vague and hostile questions.",
        minutes: 17,
        gems: 35,
      },
    ],
  },
  {
    slug: "money-management",
    title: "Money Management",
    tagline: "Know where every unit goes.",
    description:
      "Budgeting, saving, debt and the basics of growth, explained without jargon. The aim is a system you can run in ten minutes a week.",
    notebookUrl: "https://notebook.google.com/notebook/026bd951-4a44-49d4-a3fe-c678e33d2bc1",
    level: "Core",
    accent: "navy",
    icon: "Wallet",
    completionBonus: 140,
    outcomes: [
      "Run a budget that survives a real month",
      "Build an emergency fund on an ordinary income",
      "Read a debt or a fee and know what it truly costs",
    ],
    lessons: [
      {
        id: "money-management-1",
        title: "Money in, money out",
        summary: "Getting an exact picture before changing a single habit.",
        minutes: 12,
        gems: 20,
      },
      {
        id: "money-management-2",
        title: "A budget you will actually keep",
        summary: "Simple splits, sinking funds, and leaving room for being human.",
        minutes: 16,
        gems: 25,
      },
      {
        id: "money-management-3",
        title: "The emergency fund",
        summary: "How much, where to keep it, and what genuinely counts as an emergency.",
        minutes: 13,
        gems: 25,
      },
      {
        id: "money-management-4",
        title: "Debt, interest and order of attack",
        summary: "What compounding does against you, and which balance to kill first.",
        minutes: 18,
        gems: 30,
      },
      {
        id: "money-management-5",
        title: "Saving vs growing",
        summary: "Time horizons, risk, fees, and why boring usually wins.",
        minutes: 17,
        gems: 25,
      },
      {
        id: "money-management-6",
        title: "Your ten-minute money review",
        summary: "A weekly checklist that keeps the whole system honest.",
        minutes: 11,
        gems: 30,
      },
    ],
  },
  {
    slug: "leadership-skills",
    title: "Leadership Skills",
    tagline: "Take responsibility before you take the title.",
    description:
      "Leading a group project, a team or a club: setting direction, giving feedback, handling conflict, and making decisions people will follow.",
    notebookUrl: "https://notebook.google.com/notebook/b9130b0e-19d7-46a6-bc58-d2aebe896695",
    level: "Advanced",
    accent: "sage",
    icon: "Users",
    completionBonus: 150,
    outcomes: [
      "Set a direction a group can repeat back to you",
      "Give feedback that changes behaviour without bruising people",
      "Run a decision when the group disagrees",
    ],
    lessons: [
      {
        id: "leadership-skills-1",
        title: "Trust before authority",
        summary: "Why people follow reliability, and how quickly it is spent.",
        minutes: 13,
        gems: 20,
      },
      {
        id: "leadership-skills-2",
        title: "Direction people can repeat",
        summary: "Turning a vague goal into a sentence the whole group holds.",
        minutes: 15,
        gems: 25,
      },
      {
        id: "leadership-skills-3",
        title: "Delegating without dumping",
        summary: "Handing over outcomes, context and authority — not just tasks.",
        minutes: 16,
        gems: 25,
      },
      {
        id: "leadership-skills-4",
        title: "Feedback in specifics",
        summary: "Behaviour, impact, ask: a three-part script for a hard conversation.",
        minutes: 14,
        gems: 30,
      },
      {
        id: "leadership-skills-5",
        title: "Conflict you do not avoid",
        summary: "Surfacing disagreement early so it never becomes a factional war.",
        minutes: 17,
        gems: 30,
      },
      {
        id: "leadership-skills-6",
        title: "Deciding under pressure",
        summary: "Committing with incomplete information, then owning the outcome out loud.",
        minutes: 18,
        gems: 40,
      },
    ],
  },
];

export interface Achievement {
  id: string;
  title: string;
  description: string;
  gems: number;
  tier: "Bronze" | "Silver" | "Gold" | "Legend";
  /** How the achievement is evaluated against a member's progress. */
  rule:
    | { type: "lessons"; count: number }
    | { type: "courses"; count: number }
    | { type: "course"; slug: string }
    | { type: "firstLesson" };
}

export const ACHIEVEMENTS: Achievement[] = [
  {
    id: "first-step",
    title: "First Step",
    description: "Complete your very first lesson on SuccessOS 26.",
    gems: 25,
    tier: "Bronze",
    rule: { type: "firstLesson" },
  },
  {
    id: "five-deep",
    title: "Five Deep",
    description: "Finish five lessons across any courses.",
    gems: 50,
    tier: "Bronze",
    rule: { type: "lessons", count: 5 },
  },
  {
    id: "double-digits",
    title: "Double Digits",
    description: "Finish ten lessons. You are past the point where most people stop.",
    gems: 90,
    tier: "Silver",
    rule: { type: "lessons", count: 10 },
  },
  {
    id: "twenty-club",
    title: "Twenty Club",
    description: "Finish twenty lessons.",
    gems: 160,
    tier: "Gold",
    rule: { type: "lessons", count: 20 },
  },
  {
    id: "course-clear",
    title: "Course Clear",
    description: "Complete every lesson in a single course.",
    gems: 100,
    tier: "Silver",
    rule: { type: "courses", count: 1 },
  },
  {
    id: "triple-threat",
    title: "Triple Threat",
    description: "Complete three full courses.",
    gems: 220,
    tier: "Gold",
    rule: { type: "courses", count: 3 },
  },
  {
    id: "study-master",
    title: "Study Master",
    description: "Complete the Studying course end to end.",
    gems: 80,
    tier: "Silver",
    rule: { type: "course", slug: "studying" },
  },
  {
    id: "money-mind",
    title: "Money Mind",
    description: "Complete the Money Management course end to end.",
    gems: 80,
    tier: "Silver",
    rule: { type: "course", slug: "money-management" },
  },
  {
    id: "the-full-six",
    title: "The Full Six",
    description: "Complete all six SuccessOS 26 courses. The highest honour on the platform.",
    gems: 500,
    tier: "Legend",
    rule: { type: "courses", count: 6 },
  },
];

export interface ChangelogEntry {
  version: string;
  date: string;
  title: string;
  tag: "Launch" | "New" | "Improved" | "Fixed";
  notes: string[];
}

export const CHANGELOG: ChangelogEntry[] = [
  {
    version: "v1.4",
    date: "2026-09-24",
    title: "Leadership Skills joins the catalogue",
    tag: "New",
    notes: [
      "Leadership Skills is live with six lessons and a 150 Gem completion bonus.",
      "Added the Legend-tier achievement The Full Six for clearing all six courses.",
      "Course cards now show the exact Gem payout before you start.",
    ],
  },
  {
    version: "v1.3",
    date: "2026-09-10",
    title: "Gem ledger and achievement engine",
    tag: "Improved",
    notes: [
      "Every Success Gem you earn is now itemised in a ledger on your dashboard.",
      "Achievements unlock the moment their condition is met, with the bonus paid instantly.",
      "Lesson ticks apply immediately, even on a slow connection.",
    ],
  },
  {
    version: "v1.2",
    date: "2026-08-28",
    title: "Money Management and Presentation Skills",
    tag: "New",
    notes: [
      "Two more courses opened, each linked to its own NotebookLM workspace.",
      "Course pages gained a What you will walk away with section.",
    ],
  },
  {
    version: "v1.1",
    date: "2026-08-12",
    title: "Reports go two-way",
    tag: "Improved",
    notes: [
      "The Report tab now keeps a history of everything you have sent with its status.",
      "Added severity and area so urgent problems get triaged first.",
    ],
  },
  {
    version: "v1.0",
    date: "2026-07-30",
    title: "SuccessOS 26 opens",
    tag: "Launch",
    notes: [
      "Studying, Empathy and Life Advice launched as the founding three courses.",
      "Success Gems introduced as the platform currency for lessons and achievements.",
      "Google and email sign-in, dashboard, Terms of Service and Contact pages shipped.",
    ],
  },
];

export const TOTAL_LESSONS = COURSES.reduce((n, c) => n + c.lessons.length, 0);

export const TOTAL_GEMS_AVAILABLE =
  COURSES.reduce(
    (n, c) => n + c.completionBonus + c.lessons.reduce((m, l) => m + l.gems, 0),
    0,
  ) + ACHIEVEMENTS.reduce((n, a) => n + a.gems, 0);

export function findCourse(slug: string): Course | undefined {
  return COURSES.find((c) => c.slug === slug);
}

export function findLesson(lessonId: string): { course: Course; lesson: Lesson } | undefined {
  for (const course of COURSES) {
    const lesson = course.lessons.find((l) => l.id === lessonId);
    if (lesson) return { course, lesson };
  }
  return undefined;
}
