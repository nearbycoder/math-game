export interface Theme {
  id: string
  name: string
  emoji: string
  isDark: boolean
  bg: string
  bgGradient: string
  cardBg: string
  cardBorder: string
  topBarBg: string
  topBarBorder: string
  textPrimary: string
  textSecondary: string
  textMuted: string
  inputBg: string
  inputBorder: string
  progressBg: string
  answerBg: string
  answerBorder: string
  answerShadow: string
  answerHoverBorder: string
  answerHoverBg: string
  answerLetterBg: string
  answerLetterText: string
  correctBg: string
  wrongBg: string
  accentXpBg: string
  accentXpText: string
}

export const THEMES: Theme[] = [
  {
    id: 'classic-light',
    name: 'Classic',
    emoji: '☀️',
    isDark: false,
    bg: '#F7F7F7',
    bgGradient: 'radial-gradient(circle at 20% 20%, rgba(88,204,2,0.04) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(28,176,246,0.04) 0%, transparent 50%)',
    cardBg: '#ffffff',
    cardBorder: 'transparent',
    topBarBg: 'rgba(255,255,255,0.8)',
    topBarBorder: '#f3f4f6',
    textPrimary: '#1f2937',
    textSecondary: '#6b7280',
    textMuted: '#9ca3af',
    inputBg: '#ffffff',
    inputBorder: '#e5e7eb',
    progressBg: '#f3f4f6',
    answerBg: '#ffffff',
    answerBorder: '#E5E5E5',
    answerShadow: '#E5E5E5',
    answerHoverBorder: '#1CB0F6',
    answerHoverBg: '#F0F9FF',
    answerLetterBg: '#F3F4F6',
    answerLetterText: '#9CA3AF',
    correctBg: '#ecfdf5',
    wrongBg: '#fef2f2',
    accentXpBg: '#fffbeb',
    accentXpText: '#d97706',
  },
  {
    id: 'ocean-light',
    name: 'Ocean',
    emoji: '🌊',
    isDark: false,
    bg: '#EFF6FF',
    bgGradient: 'radial-gradient(circle at 30% 30%, rgba(59,130,246,0.06) 0%, transparent 50%), radial-gradient(circle at 70% 70%, rgba(6,182,212,0.05) 0%, transparent 50%)',
    cardBg: '#ffffff',
    cardBorder: '#dbeafe',
    topBarBg: 'rgba(239,246,255,0.85)',
    topBarBorder: '#dbeafe',
    textPrimary: '#1e3a5f',
    textSecondary: '#3b82f6',
    textMuted: '#93c5fd',
    inputBg: '#ffffff',
    inputBorder: '#bfdbfe',
    progressBg: '#dbeafe',
    answerBg: '#ffffff',
    answerBorder: '#bfdbfe',
    answerShadow: '#93c5fd',
    answerHoverBorder: '#3b82f6',
    answerHoverBg: '#eff6ff',
    answerLetterBg: '#dbeafe',
    answerLetterText: '#3b82f6',
    correctBg: '#ecfdf5',
    wrongBg: '#fef2f2',
    accentXpBg: '#fef3c7',
    accentXpText: '#b45309',
  },
  {
    id: 'midnight-dark',
    name: 'Midnight',
    emoji: '🌙',
    isDark: true,
    bg: '#0f172a',
    bgGradient: 'radial-gradient(circle at 20% 20%, rgba(99,102,241,0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(139,92,246,0.06) 0%, transparent 50%)',
    cardBg: '#1e293b',
    cardBorder: '#334155',
    topBarBg: 'rgba(15,23,42,0.85)',
    topBarBorder: '#1e293b',
    textPrimary: '#f1f5f9',
    textSecondary: '#94a3b8',
    textMuted: '#475569',
    inputBg: '#1e293b',
    inputBorder: '#334155',
    progressBg: '#334155',
    answerBg: '#1e293b',
    answerBorder: '#334155',
    answerShadow: '#0f172a',
    answerHoverBorder: '#818cf8',
    answerHoverBg: '#1e1b4b',
    answerLetterBg: '#334155',
    answerLetterText: '#94a3b8',
    correctBg: '#064e3b',
    wrongBg: '#450a0a',
    accentXpBg: '#451a03',
    accentXpText: '#fbbf24',
  },
  {
    id: 'forest-dark',
    name: 'Forest',
    emoji: '🌲',
    isDark: true,
    bg: '#0a1f0a',
    bgGradient: 'radial-gradient(circle at 30% 40%, rgba(34,197,94,0.07) 0%, transparent 50%), radial-gradient(circle at 70% 60%, rgba(16,185,129,0.05) 0%, transparent 50%)',
    cardBg: '#14291a',
    cardBorder: '#1f3d26',
    topBarBg: 'rgba(10,31,10,0.85)',
    topBarBorder: '#14291a',
    textPrimary: '#dcfce7',
    textSecondary: '#86efac',
    textMuted: '#365e3d',
    inputBg: '#14291a',
    inputBorder: '#1f3d26',
    progressBg: '#1f3d26',
    answerBg: '#14291a',
    answerBorder: '#1f3d26',
    answerShadow: '#0a1f0a',
    answerHoverBorder: '#22c55e',
    answerHoverBg: '#0a2a10',
    answerLetterBg: '#1f3d26',
    answerLetterText: '#86efac',
    correctBg: '#052e16',
    wrongBg: '#450a0a',
    accentXpBg: '#422006',
    accentXpText: '#fbbf24',
  },
]

const THEME_STORAGE_KEY = 'mathquest-theme'

export function loadTheme(): string {
  try {
    return localStorage.getItem(THEME_STORAGE_KEY) ?? 'classic-light'
  } catch {
    return 'classic-light'
  }
}

export function saveTheme(themeId: string): void {
  localStorage.setItem(THEME_STORAGE_KEY, themeId)
}

export function getTheme(id: string): Theme {
  return THEMES.find(t => t.id === id) ?? THEMES[0]
}
