export type QuestionType = 'multiple-choice' | 'type-in' | 'fill-blank'

export interface Question {
  id: string
  type: QuestionType
  prompt: string
  /** For multiple-choice */
  options?: string[]
  /** The correct answer as a string */
  answer: string
  /** Hint shown after wrong answer */
  hint?: string
}

export interface GameTopic {
  id: string
  name: string
  emoji: string
  category: string
  color: string
  description: string
  /** Number of crowns earned (0-5) */
  crowns: number
  /** Whether this topic is unlocked */
  unlocked: boolean
  /** Total questions answered correctly */
  correctCount: number
  /** Total questions attempted */
  totalAttempted: number
}

export interface PlayerProfile {
  name: string
  avatarIndex: number
  createdAt: string
}

export interface GameState {
  profile: PlayerProfile | null
  xp: number
  level: number
  streak: number
  lastPlayedDate: string | null
  hearts: number
  heartsLastRegen: string
  topics: Record<string, GameTopic>
  dailyXp: number
  dailyGoal: number
  totalCorrect: number
  totalAttempted: number
  longestStreak: number
}

export interface SessionState {
  topicId: string
  questions: Question[]
  currentIndex: number
  correctInSession: number
  wrongInSession: number
  xpEarned: number
  finished: boolean
  selectedAnswer: string | null
  isCorrect: boolean | null
  showResult: boolean
}

export const AVATARS = ['🦉', '🐱', '🐶', '🦊', '🐼', '🐸', '🦁', '🐯', '🐰', '🐻', '🦄', '🐲']

export const CATEGORIES = [
  { id: 'numbers', name: 'Numbers', color: '#58CC02' },
  { id: 'fractions', name: 'Fractions & Decimals', color: '#CE82FF' },
  { id: 'ratios', name: 'Ratios & Percents', color: '#00CD9C' },
  { id: 'geometry', name: 'Geometry', color: '#1CB0F6' },
  { id: 'data', name: 'Data & Probability', color: '#FF9600' },
  { id: 'algebra', name: 'Pre-Algebra', color: '#FF4B4B' },
  { id: 'extra', name: 'Challenge Zone', color: '#F472B6' },
] as const

export const TOPIC_DEFINITIONS: Omit<GameTopic, 'crowns' | 'unlocked' | 'correctCount' | 'totalAttempted'>[] = [
  // Numbers
  { id: 'multiplication', name: 'Multiplication', emoji: '✖️', category: 'numbers', color: '#58CC02', description: 'Multiply bigger numbers' },
  { id: 'division', name: 'Long Division', emoji: '➗', category: 'numbers', color: '#58CC02', description: 'Divide with remainders' },
  { id: 'factors-multiples', name: 'Factors & Multiples', emoji: '🔢', category: 'numbers', color: '#58CC02', description: 'GCF, LCM & prime factors' },
  // Fractions & Decimals
  { id: 'fraction-basics', name: 'Fraction Basics', emoji: '🍕', category: 'fractions', color: '#CE82FF', description: 'Simplify & compare fractions' },
  { id: 'add-sub-fractions', name: 'Add & Subtract Fractions', emoji: '➕', category: 'fractions', color: '#CE82FF', description: 'Add & subtract with unlike denominators' },
  { id: 'multiply-divide-fractions', name: 'Multiply & Divide Fractions', emoji: '🔄', category: 'fractions', color: '#CE82FF', description: 'Fraction multiplication & division' },
  { id: 'decimals', name: 'Decimals', emoji: '🔵', category: 'fractions', color: '#CE82FF', description: 'Decimal operations & conversions' },
  // Ratios & Percents
  { id: 'ratios', name: 'Ratios', emoji: '⚖️', category: 'ratios', color: '#00CD9C', description: 'Write & simplify ratios' },
  { id: 'proportions', name: 'Proportions', emoji: '📏', category: 'ratios', color: '#00CD9C', description: 'Solve proportions & cross-multiply' },
  { id: 'percentages', name: 'Percentages', emoji: '💯', category: 'ratios', color: '#00CD9C', description: 'Find percents, discounts & tips' },
  // Geometry
  { id: 'area-perimeter', name: 'Area & Perimeter', emoji: '📐', category: 'geometry', color: '#1CB0F6', description: 'Rectangles, triangles & more' },
  { id: 'volume', name: 'Volume', emoji: '📦', category: 'geometry', color: '#1CB0F6', description: 'Volume of 3D shapes' },
  { id: 'angles', name: 'Angles & Triangles', emoji: '📊', category: 'geometry', color: '#1CB0F6', description: 'Angle types & triangle rules' },
  // Data & Probability
  { id: 'mean-median-mode', name: 'Mean, Median, Mode', emoji: '📊', category: 'data', color: '#FF9600', description: 'Find averages & middle values' },
  { id: 'probability', name: 'Probability', emoji: '🎲', category: 'data', color: '#FF9600', description: 'Chances of events happening' },
  { id: 'coordinate-plane', name: 'Coordinate Plane', emoji: '🗺️', category: 'data', color: '#FF9600', description: 'Plot & read ordered pairs' },
  // Pre-Algebra
  { id: 'integers', name: 'Integers', emoji: '🌡️', category: 'algebra', color: '#FF4B4B', description: 'Positive & negative numbers' },
  { id: 'order-of-operations', name: 'Order of Operations', emoji: '🎯', category: 'algebra', color: '#FF4B4B', description: 'PEMDAS practice' },
  { id: 'simple-equations', name: 'Simple Equations', emoji: '🔍', category: 'algebra', color: '#FF4B4B', description: 'Solve for the unknown' },
  // Challenge Zone
  { id: 'exponents', name: 'Exponents & Roots', emoji: '⚡', category: 'extra', color: '#F472B6', description: 'Powers & square roots' },
]

export const LEVEL_XP_THRESHOLDS = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 6000, 7800, 10000]

export const ENCOURAGING_MESSAGES = {
  correct: [
    'Amazing! 🎉', 'You nailed it! ⭐', 'Brilliant! 🧠', 'On fire! 🔥',
    'Superb! 💪', 'Math wizard! 🧙', 'Correct! ✅', 'Perfect! 💯',
    'Genius move! 🌟', 'Incredible! 🚀',
  ],
  wrong: [
    "Almost there! Keep trying 💪", "Don't give up! 🌟", "Learning is a journey 🛤️",
    "Mistakes help us grow 🌱", "You've got this! 💫",
  ],
  streak: [
    '3 in a row! 🔥', '5 in a row! 🔥🔥', 'Unstoppable! 🔥🔥🔥',
  ],
}
