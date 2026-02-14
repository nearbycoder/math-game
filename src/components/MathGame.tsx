import { useState, useEffect, useCallback, useRef, forwardRef, createContext, useContext } from 'react'
import {
  Heart,
  Flame,
  Star,
  Trophy,
  Crown,
  Lock,
  ChevronRight,
  ArrowLeft,
  Zap,
  Target,
  RotateCcw,
  CheckCircle2,
  XCircle,
  Sparkles,
  BookOpen,
  Palette,
} from 'lucide-react'
import type { GameState, SessionState, PlayerProfile } from '@/lib/types'
import {
  AVATARS,
  CATEGORIES,
  TOPIC_DEFINITIONS,
  LEVEL_XP_THRESHOLDS,
  ENCOURAGING_MESSAGES,
} from '@/lib/types'
import {
  loadGameState,
  updateProfile,
  addXp,
  recordAnswer,
  resetGameState,
} from '@/lib/storage'
import { generateQuestions } from '@/lib/questions'
import type { Theme } from '@/lib/themes'
import { THEMES, loadTheme, saveTheme, getTheme } from '@/lib/themes'

// ─── THEME CONTEXT ─────────────────────────────────────────────
const ThemeContext = createContext<Theme>(THEMES[0])
function useTheme() { return useContext(ThemeContext) }

type Screen = 'onboarding' | 'dashboard' | 'topic-select' | 'playing' | 'results'

export default function MathGame() {
  const [themeId, setThemeId] = useState(loadTheme)
  const theme = getTheme(themeId)
  const [showThemePicker, setShowThemePicker] = useState(false)

  const changeTheme = (id: string) => {
    setThemeId(id)
    saveTheme(id)
    setShowThemePicker(false)
  }

  const [gameState, setGameState] = useState<GameState>(loadGameState)
  const [screen, setScreen] = useState<Screen>(gameState.profile ? 'dashboard' : 'onboarding')
  const [session, setSession] = useState<SessionState | null>(null)
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [confetti, setConfetti] = useState(false)
  const [shakeWrong, setShakeWrong] = useState(false)
  const [streakCount, setStreakCount] = useState(0)
  const inputRef = useRef<HTMLInputElement>(null)

  const [onboardName, setOnboardName] = useState('')
  const [onboardAvatar, setOnboardAvatar] = useState(0)

  const handleCreateProfile = () => {
    if (!onboardName.trim()) return
    const profile: PlayerProfile = {
      name: onboardName.trim(),
      avatarIndex: onboardAvatar,
      createdAt: new Date().toISOString(),
    }
    const newState = updateProfile(gameState, profile)
    setGameState(newState)
    setScreen('dashboard')
  }

  const startGame = useCallback((topicId: string) => {
    if (gameState.hearts <= 0) return
    const questions = generateQuestions(topicId, 10)
    setSession({
      topicId,
      questions,
      currentIndex: 0,
      correctInSession: 0,
      wrongInSession: 0,
      xpEarned: 0,
      finished: false,
      selectedAnswer: null,
      isCorrect: null,
      showResult: false,
    })
    setStreakCount(0)
    setScreen('playing')
  }, [gameState.hearts])

  const submitAnswer = useCallback((answer: string) => {
    if (!session || session.showResult) return
    const currentQ = session.questions[session.currentIndex]
    const isCorrect = answer.trim().toLowerCase() === currentQ.answer.trim().toLowerCase()

    let newGameState = recordAnswer(gameState, session.topicId, isCorrect)
    if (isCorrect) {
      newGameState = addXp(newGameState, 10)
    }
    setGameState(newGameState)

    const newStreakCount = isCorrect ? streakCount + 1 : 0
    setStreakCount(newStreakCount)

    if (isCorrect) {
      setConfetti(true)
      setTimeout(() => setConfetti(false), 1500)
    } else {
      setShakeWrong(true)
      setTimeout(() => setShakeWrong(false), 600)
    }

    setSession({
      ...session,
      selectedAnswer: answer,
      isCorrect,
      showResult: true,
      correctInSession: session.correctInSession + (isCorrect ? 1 : 0),
      wrongInSession: session.wrongInSession + (isCorrect ? 0 : 1),
      xpEarned: session.xpEarned + (isCorrect ? 10 : 0),
    })
  }, [session, gameState, streakCount])

  const nextQuestion = useCallback(() => {
    if (!session) return
    const nextIdx = session.currentIndex + 1
    if (gameState.hearts <= 0) {
      setSession({ ...session, finished: true })
      setScreen('results')
      return
    }
    if (nextIdx >= session.questions.length) {
      setSession({ ...session, finished: true })
      setScreen('results')
    } else {
      setSession({
        ...session,
        currentIndex: nextIdx,
        selectedAnswer: null,
        isCorrect: null,
        showResult: false,
      })
    }
  }, [session, gameState.hearts])

  useEffect(() => {
    if (screen === 'playing' && session && !session.showResult) {
      const q = session.questions[session.currentIndex]
      if ((q.type === 'type-in' || q.type === 'fill-blank') && inputRef.current) {
        inputRef.current.focus()
      }
    }
  }, [screen, session])

  const xpForNextLevel = LEVEL_XP_THRESHOLDS[gameState.level] ?? LEVEL_XP_THRESHOLDS[LEVEL_XP_THRESHOLDS.length - 1]
  const xpForCurrentLevel = LEVEL_XP_THRESHOLDS[gameState.level - 1] ?? 0
  const xpProgress = xpForNextLevel > xpForCurrentLevel
    ? ((gameState.xp - xpForCurrentLevel) / (xpForNextLevel - xpForCurrentLevel)) * 100
    : 100

  // Theme picker floating button (shown on dashboard / topic-select)
  const themeFab = (screen === 'dashboard' || screen === 'topic-select') && (
    <>
      <button
        onClick={() => setShowThemePicker(!showThemePicker)}
        className="fixed bottom-6 right-6 z-40 w-14 h-14 rounded-full flex items-center justify-center shadow-lg transition-all hover:scale-110 active:scale-95"
        style={{ backgroundColor: theme.cardBg, border: `2px solid ${theme.cardBorder}` }}
      >
        <Palette className="w-6 h-6" style={{ color: theme.textSecondary }} />
      </button>
      {showThemePicker && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setShowThemePicker(false)} />
          <div
            className="fixed bottom-24 right-6 z-50 rounded-2xl p-4 shadow-xl"
            style={{ backgroundColor: theme.cardBg, border: `1px solid ${theme.cardBorder}` }}
          >
            <div className="text-sm font-bold mb-3" style={{ color: theme.textPrimary }}>Choose Theme</div>
            <div className="grid grid-cols-2 gap-2">
              {THEMES.map((t) => (
                <button
                  key={t.id}
                  onClick={() => changeTheme(t.id)}
                  className="flex items-center gap-2 px-3 py-2.5 rounded-xl transition-all text-left"
                  style={{
                    backgroundColor: themeId === t.id ? (t.isDark ? '#334155' : '#f0fdf4') : 'transparent',
                    border: themeId === t.id ? '2px solid #58CC02' : '2px solid transparent',
                  }}
                >
                  <span className="text-xl">{t.emoji}</span>
                  <div>
                    <div className="text-sm font-bold" style={{ color: theme.textPrimary }}>{t.name}</div>
                    <div className="text-xs" style={{ color: theme.textMuted }}>
                      {t.isDark ? 'Dark' : 'Light'}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  )

  return (
    <ThemeContext.Provider value={theme}>
      <div style={{ backgroundColor: theme.bg, backgroundImage: theme.bgGradient, minHeight: '100vh', color: theme.textPrimary }}>
        {themeFab}

        {screen === 'onboarding' && (
          <OnboardingScreen
            onboardName={onboardName}
            setOnboardName={setOnboardName}
            onboardAvatar={onboardAvatar}
            setOnboardAvatar={setOnboardAvatar}
            onSubmit={handleCreateProfile}
          />
        )}
        {screen === 'dashboard' && (
          <DashboardScreen
            gameState={gameState}
            xpProgress={xpProgress}
            xpForNextLevel={xpForNextLevel}
            setSelectedCategory={setSelectedCategory}
            setScreen={setScreen}
            setGameState={setGameState}
          />
        )}
        {screen === 'topic-select' && selectedCategory && (
          <TopicSelectScreen
            gameState={gameState}
            selectedCategory={selectedCategory}
            startGame={startGame}
            goBack={() => setScreen('dashboard')}
          />
        )}
        {screen === 'playing' && session && (
          <PlayingScreen
            session={session}
            gameState={gameState}
            streakCount={streakCount}
            confetti={confetti}
            shakeWrong={shakeWrong}
            submitAnswer={submitAnswer}
            nextQuestion={nextQuestion}
            inputRef={inputRef}
            goBack={() => { setSession(null); setScreen('dashboard') }}
          />
        )}
        {screen === 'results' && session && (
          <ResultsScreen
            session={session}
            gameState={gameState}
            startGame={startGame}
            goBack={() => { setSession(null); setScreen('dashboard') }}
          />
        )}
      </div>
    </ThemeContext.Provider>
  )
}

// ─── ONBOARDING ────────────────────────────────────────────────
function OnboardingScreen({ onboardName, setOnboardName, onboardAvatar, setOnboardAvatar, onSubmit }: {
  onboardName: string; setOnboardName: (v: string) => void; onboardAvatar: number; setOnboardAvatar: (v: number) => void; onSubmit: () => void
}) {
  const t = useTheme()
  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      <div className="w-full max-w-md rounded-[2rem] p-10" style={{ backgroundColor: t.cardBg, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div className="text-center mb-8">
          <div className="text-7xl mb-4 animate-bounce-slow">🧮</div>
          <h1 className="font-display text-4xl font-black mb-2" style={{ color: t.textPrimary }}>MathQuest</h1>
          <p className="text-lg" style={{ color: t.textSecondary }}>Master math, one level at a time</p>
        </div>
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-bold mb-2 uppercase tracking-wide" style={{ color: t.textSecondary }}>Your Name</label>
            <input
              type="text"
              value={onboardName}
              onChange={(e) => setOnboardName(e.target.value)}
              placeholder="Enter your name..."
              className="w-full px-4 py-3 rounded-2xl border-2 focus:outline-none text-lg font-medium transition-colors"
              style={{ backgroundColor: t.inputBg, borderColor: t.inputBorder, color: t.textPrimary }}
              onKeyDown={(e) => e.key === 'Enter' && onSubmit()}
            />
          </div>
          <div>
            <label className="block text-sm font-bold mb-3 uppercase tracking-wide" style={{ color: t.textSecondary }}>Choose Your Buddy</label>
            <div className="grid grid-cols-6 gap-2">
              {AVATARS.map((avatar, idx) => (
                <button
                  key={idx}
                  onClick={() => setOnboardAvatar(idx)}
                  className="text-3xl p-2 rounded-xl transition-all duration-200"
                  style={{
                    backgroundColor: onboardAvatar === idx ? (t.isDark ? '#1a3a2a' : '#dcfce7') : t.progressBg,
                    outline: onboardAvatar === idx ? '3px solid #58CC02' : 'none',
                    transform: onboardAvatar === idx ? 'scale(1.1)' : 'scale(1)',
                  }}
                >
                  {avatar}
                </button>
              ))}
            </div>
          </div>
          <button
            onClick={onSubmit}
            disabled={!onboardName.trim()}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white uppercase tracking-wider transition-all duration-200 disabled:opacity-40 disabled:cursor-not-allowed btn-primary"
          >
            Start Learning!
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── DASHBOARD ─────────────────────────────────────────────────
function DashboardScreen({ gameState, xpProgress, xpForNextLevel, setSelectedCategory, setScreen, setGameState }: {
  gameState: GameState; xpProgress: number; xpForNextLevel: number
  setSelectedCategory: (v: string) => void; setScreen: (v: Screen) => void; setGameState: (v: GameState) => void
}) {
  const t = useTheme()
  const profile = gameState.profile!
  const today = new Date().toDateString()
  const playedToday = gameState.lastPlayedDate ? new Date(gameState.lastPlayedDate).toDateString() === today : false
  const dailyGoalMet = gameState.dailyXp >= gameState.dailyGoal

  return (
    <div className="pb-24">
      {/* Top Bar */}
      <div className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ backgroundColor: t.topBarBg, borderColor: t.topBarBorder }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <span className="text-3xl">{AVATARS[profile.avatarIndex]}</span>
            <div>
              <div className="font-bold" style={{ color: t.textPrimary }}>{profile.name}</div>
              <div className="text-xs" style={{ color: t.textMuted }}>Level {gameState.level}</div>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="font-bold text-orange-600">{gameState.streak}</span>
            </div>
            <div className="flex items-center gap-1">
              {Array.from({ length: 5 }).map((_, i) => (
                <Heart key={i} className={`w-5 h-5 transition-all ${i < gameState.hearts ? 'text-red-500 fill-red-500' : 'fill-gray-300 text-gray-300'}`} />
              ))}
            </div>
            <div className="flex items-center gap-1.5 px-3 py-1 rounded-full" style={{ backgroundColor: t.accentXpBg }}>
              <Zap className="w-4 h-4" style={{ color: t.accentXpText }} />
              <span className="font-bold text-sm" style={{ color: t.accentXpText }}>{gameState.xp}</span>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 pt-6">
        {/* XP Progress */}
        <div className="rounded-3xl p-5 shadow-card mb-5" style={{ backgroundColor: t.cardBg }}>
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-bold uppercase tracking-wide" style={{ color: t.textSecondary }}>Level {gameState.level}</span>
            <span className="text-sm font-medium" style={{ color: t.textMuted }}>{gameState.xp} / {xpForNextLevel} XP</span>
          </div>
          <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: t.progressBg }}>
            <div className="h-full bg-gradient-to-r from-emerald-400 to-emerald-500 rounded-full transition-all duration-500" style={{ width: `${Math.min(100, xpProgress)}%` }} />
          </div>
        </div>

        {/* Daily Goal & Streak */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="rounded-3xl p-5 shadow-card" style={{ backgroundColor: t.cardBg }}>
            <div className="flex items-center gap-2 mb-2">
              <Target className="w-5 h-5 text-blue-500" />
              <span className="text-sm font-bold uppercase" style={{ color: t.textSecondary }}>Daily Goal</span>
            </div>
            <div className="h-3 rounded-full overflow-hidden mb-2" style={{ backgroundColor: t.progressBg }}>
              <div className={`h-full rounded-full transition-all duration-500 ${dailyGoalMet ? 'bg-gradient-to-r from-blue-400 to-indigo-500' : 'bg-blue-400'}`} style={{ width: `${Math.min(100, (gameState.dailyXp / gameState.dailyGoal) * 100)}%` }} />
            </div>
            <span className="text-xs" style={{ color: t.textMuted }}>{gameState.dailyXp}/{gameState.dailyGoal} XP today</span>
            {dailyGoalMet && <span className="text-xs text-blue-500 font-bold ml-2">Complete!</span>}
          </div>
          <div className="rounded-3xl p-5 shadow-card" style={{ backgroundColor: t.cardBg }}>
            <div className="flex items-center gap-2 mb-1">
              <Flame className="w-5 h-5 text-orange-500" />
              <span className="text-sm font-bold uppercase" style={{ color: t.textSecondary }}>Streak</span>
            </div>
            <div className="text-3xl font-black text-orange-500">{gameState.streak}</div>
            <span className="text-xs" style={{ color: t.textMuted }}>{playedToday ? 'Keep it going!' : 'Play today to continue!'}</span>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { icon: <Star className="w-5 h-5 text-amber-400" />, val: gameState.totalCorrect, label: 'Correct' },
            { icon: <Trophy className="w-5 h-5 text-purple-400" />, val: gameState.longestStreak, label: 'Best Streak' },
            { icon: <BookOpen className="w-5 h-5 text-emerald-400" />, val: gameState.totalAttempted, label: 'Attempted' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-4 shadow-card text-center" style={{ backgroundColor: t.cardBg }}>
              <div className="mx-auto mb-1 w-fit">{s.icon}</div>
              <div className="text-lg font-black" style={{ color: t.textPrimary }}>{s.val}</div>
              <div className="text-xs" style={{ color: t.textMuted }}>{s.label}</div>
            </div>
          ))}
        </div>

        {/* Categories */}
        <h2 className="font-display text-2xl font-black mb-4" style={{ color: t.textPrimary }}>Choose a Topic</h2>
        <div className="space-y-3">
          {CATEGORIES.map((cat) => {
            const topics = TOPIC_DEFINITIONS.filter(tp => tp.category === cat.id)
            const topicStates = topics.map(tp => gameState.topics[tp.id]).filter(Boolean)
            const totalCrowns = topicStates.reduce((s, tp) => s + tp.crowns, 0)
            const maxCrowns = topics.length * 5
            const unlockedCount = topicStates.filter(tp => tp.unlocked).length
            return (
              <button
                key={cat.id}
                onClick={() => { setSelectedCategory(cat.id); setScreen('topic-select') }}
                className="w-full rounded-3xl p-5 shadow-card hover:shadow-card-hover transition-all duration-200 text-left group"
                style={{ backgroundColor: t.cardBg }}
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl flex items-center justify-center text-white text-2xl font-black shadow-lg" style={{ backgroundColor: cat.color }}>
                      {topics[0]?.emoji}
                    </div>
                    <div>
                      <div className="font-bold text-lg" style={{ color: t.textPrimary }}>{cat.name}</div>
                      <div className="text-sm flex items-center gap-2" style={{ color: t.textMuted }}>
                        <span>{unlockedCount}/{topics.length} unlocked</span>
                        <span style={{ color: t.textMuted }}>|</span>
                        <Crown className="w-3.5 h-3.5 text-amber-400 inline" />
                        <span>{totalCrowns}/{maxCrowns}</span>
                      </div>
                    </div>
                  </div>
                  <ChevronRight className="w-6 h-6 transition-colors" style={{ color: t.textMuted }} />
                </div>
                <div className="mt-3 h-2.5 rounded-full overflow-hidden" style={{ backgroundColor: t.progressBg }}>
                  <div className="h-full rounded-full transition-all duration-500" style={{ width: `${maxCrowns > 0 ? (totalCrowns / maxCrowns) * 100 : 0}%`, backgroundColor: cat.color }} />
                </div>
              </button>
            )
          })}
        </div>

        <div className="mt-12 text-center">
          <button
            onClick={() => {
              if (confirm('Reset all progress? This cannot be undone.')) {
                setGameState(resetGameState())
                setScreen('onboarding')
              }
            }}
            className="text-sm hover:text-red-400 transition-colors flex items-center gap-1 mx-auto"
            style={{ color: t.textMuted }}
          >
            <RotateCcw className="w-3.5 h-3.5" /> Reset Progress
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── TOPIC SELECT ──────────────────────────────────────────────
function TopicSelectScreen({ gameState, selectedCategory, startGame, goBack }: {
  gameState: GameState; selectedCategory: string; startGame: (id: string) => void; goBack: () => void
}) {
  const t = useTheme()
  const cat = CATEGORIES.find(c => c.id === selectedCategory)!
  const topics = TOPIC_DEFINITIONS.filter(tp => tp.category === selectedCategory)

  return (
    <div className="min-h-screen">
      <div className="sticky top-0 z-30 backdrop-blur-xl border-b" style={{ backgroundColor: t.topBarBg, borderColor: t.topBarBorder }}>
        <div className="max-w-2xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={goBack} className="p-2 rounded-xl transition-colors hover:opacity-70">
            <ArrowLeft className="w-5 h-5" style={{ color: t.textSecondary }} />
          </button>
          <div className="w-8 h-8 rounded-lg flex items-center justify-center text-white text-sm font-bold" style={{ backgroundColor: cat.color }}>
            {topics[0]?.emoji}
          </div>
          <h2 className="font-bold text-lg" style={{ color: t.textPrimary }}>{cat.name}</h2>
        </div>
      </div>
      <div className="max-w-2xl mx-auto px-4 pt-6 pb-24">
        <div className="relative">
          <div className="absolute left-1/2 top-0 bottom-0 w-1 -translate-x-1/2 rounded-full" style={{ backgroundColor: t.progressBg }} />
          <div className="space-y-4 relative">
            {topics.map((topicDef, idx) => {
              const topic = gameState.topics[topicDef.id]
              if (!topic) return null
              const isEven = idx % 2 === 0
              return (
                <div key={topic.id} className={`flex items-center gap-4 ${isEven ? 'flex-row' : 'flex-row-reverse'}`}>
                  <div className="flex-1" />
                  <button
                    onClick={() => topic.unlocked && startGame(topic.id)}
                    disabled={!topic.unlocked || gameState.hearts <= 0}
                    className="relative z-10 w-24 h-24 rounded-full flex flex-col items-center justify-center transition-all duration-300"
                    style={{
                      backgroundColor: topic.unlocked ? t.cardBg : t.progressBg,
                      borderWidth: topic.unlocked ? 4 : 0,
                      borderColor: topic.unlocked ? cat.color : 'transparent',
                      boxShadow: topic.unlocked ? '0 8px 30px rgba(0,0,0,0.1)' : 'none',
                      cursor: topic.unlocked ? 'pointer' : 'not-allowed',
                    }}
                  >
                    {topic.unlocked ? (
                      <>
                        <span className="text-2xl">{topic.emoji}</span>
                        {topic.crowns > 0 && (
                          <div className="flex items-center gap-0.5 mt-1">
                            {Array.from({ length: Math.min(topic.crowns, 5) }).map((_, i) => (
                              <Crown key={i} className="w-3 h-3 text-amber-400 fill-amber-400" />
                            ))}
                          </div>
                        )}
                      </>
                    ) : (
                      <Lock className="w-7 h-7" style={{ color: t.textMuted }} />
                    )}
                  </button>
                  <div className={`flex-1 ${isEven ? 'text-left' : 'text-right'}`}>
                    <div className="inline-block rounded-2xl px-4 py-2" style={{ backgroundColor: t.cardBg, opacity: topic.unlocked ? 1 : 0.5, boxShadow: '0 2px 8px rgba(0,0,0,0.05)' }}>
                      <div className="font-bold text-sm" style={{ color: t.textPrimary }}>{topic.name}</div>
                      <div className="text-xs" style={{ color: t.textMuted }}>{topic.description}</div>
                      {topic.unlocked && topic.totalAttempted > 0 && (
                        <div className="text-xs text-emerald-500 font-medium mt-1">{topic.correctCount}/{topic.totalAttempted} correct</div>
                      )}
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        </div>
        {gameState.hearts <= 0 && (
          <div className="mt-8 rounded-3xl p-6 text-center" style={{ backgroundColor: t.wrongBg }}>
            <Heart className="w-10 h-10 text-red-300 mx-auto mb-2" />
            <div className="font-bold text-red-400 text-lg">No Hearts Left!</div>
            <div className="text-sm text-red-300 mt-1">Hearts regenerate every 30 minutes</div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── PLAYING ───────────────────────────────────────────────────
function PlayingScreen({ session, gameState, streakCount, confetti: showConfetti, shakeWrong, submitAnswer, nextQuestion, inputRef, goBack }: {
  session: SessionState; gameState: GameState; streakCount: number; confetti: boolean; shakeWrong: boolean
  submitAnswer: (a: string) => void; nextQuestion: () => void; inputRef: React.RefObject<HTMLInputElement | null>; goBack: () => void
}) {
  const t = useTheme()
  const currentQ = session.questions[session.currentIndex]
  const progress = ((session.currentIndex + (session.showResult ? 1 : 0)) / session.questions.length) * 100
  const topic = gameState.topics[session.topicId]
  const cat = CATEGORIES.find(c => c.id === topic?.category)

  return (
    <div className="min-h-screen flex flex-col">
      {showConfetti && <ConfettiOverlay />}
      <div className="sticky top-0 z-30 backdrop-blur-xl border-b px-4 py-3" style={{ backgroundColor: t.topBarBg, borderColor: t.topBarBorder }}>
        <div className="max-w-2xl mx-auto flex items-center gap-3">
          <button onClick={goBack} className="p-2 rounded-xl hover:opacity-70">
            <XCircle className="w-5 h-5" style={{ color: t.textMuted }} />
          </button>
          <div className="flex-1 h-4 rounded-full overflow-hidden" style={{ backgroundColor: t.progressBg }}>
            <div className="h-full rounded-full transition-all duration-500" style={{ width: `${progress}%`, backgroundColor: cat?.color ?? '#58CC02' }} />
          </div>
          <div className="flex items-center gap-1">
            {Array.from({ length: 5 }).map((_, i) => (
              <Heart key={i} className={`w-4 h-4 ${i < gameState.hearts ? 'text-red-500 fill-red-500' : 'fill-gray-300 text-gray-300'}`} />
            ))}
          </div>
        </div>
      </div>

      <div className="flex-1 flex flex-col max-w-2xl mx-auto w-full px-4 pt-8 pb-6">
        {streakCount >= 3 && !session.showResult && (
          <div className="text-center mb-4 animate-pulse">
            <span className="inline-flex items-center gap-1.5 text-orange-500 px-4 py-1.5 rounded-full font-bold text-sm" style={{ backgroundColor: t.isDark ? '#451a03' : '#fff7ed' }}>
              <Flame className="w-4 h-4" /> {streakCount} in a row!
            </span>
          </div>
        )}

        <div className="text-center mb-3">
          <span className="text-xs font-bold uppercase tracking-wider" style={{ color: t.textMuted }}>
            Question {session.currentIndex + 1} of {session.questions.length}
          </span>
        </div>

        <div className={`rounded-3xl p-8 shadow-card mb-8 ${shakeWrong ? 'animate-shake' : ''}`} style={{ backgroundColor: t.cardBg }}>
          <h2 className="text-xl md:text-2xl font-bold text-center whitespace-pre-line leading-relaxed" style={{ color: t.textPrimary }}>
            {currentQ.prompt}
          </h2>
        </div>

        <div className="flex-1 flex flex-col justify-center">
          {currentQ.type === 'multiple-choice' && currentQ.options && (
            <div className="space-y-3">
              {currentQ.options.map((opt, idx) => {
                let bg = t.answerBg
                let border = t.answerBorder
                let shadow = t.answerShadow
                let color = t.textPrimary
                let icon: React.ReactNode = null

                if (session.showResult) {
                  if (opt === currentQ.answer) {
                    bg = t.correctBg; border = '#58CC02'; shadow = '#46a302'; color = '#2D7A00'
                    icon = <CheckCircle2 className="w-5 h-5 text-emerald-500" />
                  } else if (opt === session.selectedAnswer && !session.isCorrect) {
                    bg = t.wrongBg; border = '#FF4B4B'; shadow = '#E03E3E'; color = '#CC0000'
                    icon = <XCircle className="w-5 h-5 text-red-400" />
                  } else {
                    bg = t.answerBg; border = t.answerBorder; color = t.textMuted
                  }
                }

                return (
                  <button
                    key={idx}
                    onClick={() => submitAnswer(opt)}
                    disabled={session.showResult}
                    className="flex items-center gap-4 w-full px-5 py-4 rounded-2xl font-bold text-base transition-all text-left"
                    style={{
                      backgroundColor: bg,
                      border: `2.5px solid ${border}`,
                      boxShadow: `0 3px 0 ${shadow}`,
                      color,
                      cursor: session.showResult ? 'default' : 'pointer',
                    }}
                  >
                    <span className="flex items-center justify-center w-8 h-8 rounded-lg text-sm font-extrabold flex-shrink-0" style={{ backgroundColor: t.answerLetterBg, color: t.answerLetterText }}>
                      {String.fromCharCode(65 + idx)}
                    </span>
                    <span className="flex-1 text-left">{opt}</span>
                    {icon}
                  </button>
                )
              })}
            </div>
          )}

          {(currentQ.type === 'type-in' || currentQ.type === 'fill-blank') && (
            <TypeInAnswer
              ref={inputRef}
              onSubmit={submitAnswer}
              disabled={session.showResult}
              correctAnswer={session.showResult ? currentQ.answer : undefined}
              isCorrect={session.isCorrect}
            />
          )}
        </div>

        {session.showResult && (
          <div className="mt-6 rounded-3xl p-5 animate-slide-up" style={{ backgroundColor: session.isCorrect ? t.correctBg : t.wrongBg }}>
            <div className="flex items-start justify-between">
              <div>
                <div className={`font-bold text-lg ${session.isCorrect ? 'text-emerald-500' : 'text-red-500'}`}>
                  {session.isCorrect
                    ? ENCOURAGING_MESSAGES.correct[Math.floor(Math.random() * ENCOURAGING_MESSAGES.correct.length)]
                    : ENCOURAGING_MESSAGES.wrong[Math.floor(Math.random() * ENCOURAGING_MESSAGES.wrong.length)]}
                </div>
                {!session.isCorrect && (
                  <div className="text-sm text-red-400 mt-1">
                    Correct answer: <strong>{currentQ.answer}</strong>
                    {currentQ.hint && <div className="mt-1 text-red-300">Hint: {currentQ.hint}</div>}
                  </div>
                )}
                {session.isCorrect && (
                  <div className="text-sm text-emerald-500 mt-1 flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5" /> +10 XP
                  </div>
                )}
              </div>
              <button
                onClick={nextQuestion}
                className={`px-8 py-3 rounded-2xl font-bold text-white transition-all active:scale-95 ${session.isCorrect ? 'bg-emerald-500 hover:bg-emerald-600' : 'bg-red-400 hover:bg-red-500'}`}
              >
                {session.currentIndex + 1 >= session.questions.length ? 'Finish' : 'Continue'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// ─── RESULTS ───────────────────────────────────────────────────
function ResultsScreen({ session, gameState, startGame, goBack }: {
  session: SessionState; gameState: GameState; startGame: (id: string) => void; goBack: () => void
}) {
  const t = useTheme()
  const accuracy = session.correctInSession + session.wrongInSession > 0
    ? Math.round((session.correctInSession / (session.correctInSession + session.wrongInSession)) * 100) : 0
  const isPerfect = session.wrongInSession === 0 && session.correctInSession > 0
  const topic = gameState.topics[session.topicId]

  return (
    <div className="min-h-screen flex items-center justify-center p-4">
      {isPerfect && <ConfettiOverlay />}
      <div className="rounded-3xl p-8 max-w-md w-full text-center" style={{ backgroundColor: t.cardBg, boxShadow: '0 8px 30px rgba(0,0,0,0.1)' }}>
        <div className="text-6xl mb-4">{isPerfect ? '🏆' : accuracy >= 70 ? '🌟' : accuracy >= 40 ? '💪' : '📚'}</div>
        <h2 className="font-display text-3xl font-black mb-2" style={{ color: t.textPrimary }}>
          {isPerfect ? 'Perfect!' : accuracy >= 70 ? 'Great Job!' : accuracy >= 40 ? 'Keep Going!' : 'Keep Practicing!'}
        </h2>
        <p className="mb-6" style={{ color: t.textMuted }}>{topic?.name}</p>

        <div className="grid grid-cols-3 gap-4 mb-8">
          <div className="rounded-2xl p-4" style={{ backgroundColor: t.correctBg }}>
            <div className="text-2xl font-black text-emerald-500">{session.correctInSession}</div>
            <div className="text-xs text-emerald-400 font-medium">Correct</div>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: t.wrongBg }}>
            <div className="text-2xl font-black text-red-400">{session.wrongInSession}</div>
            <div className="text-xs text-red-300 font-medium">Wrong</div>
          </div>
          <div className="rounded-2xl p-4" style={{ backgroundColor: t.accentXpBg }}>
            <div className="text-2xl font-black" style={{ color: t.accentXpText }}>{session.xpEarned}</div>
            <div className="text-xs font-medium" style={{ color: t.accentXpText }}>XP Earned</div>
          </div>
        </div>

        <div className="mb-8">
          <div className="text-sm font-bold mb-2" style={{ color: t.textMuted }}>Accuracy</div>
          <div className="h-4 rounded-full overflow-hidden" style={{ backgroundColor: t.progressBg }}>
            <div className={`h-full rounded-full transition-all duration-1000 ${accuracy >= 70 ? 'bg-emerald-400' : accuracy >= 40 ? 'bg-amber-400' : 'bg-red-400'}`} style={{ width: `${accuracy}%` }} />
          </div>
          <div className="text-right text-sm font-bold mt-1" style={{ color: t.textSecondary }}>{accuracy}%</div>
        </div>

        {topic && topic.crowns > 0 && (
          <div className="flex items-center justify-center gap-1 mb-6">
            {Array.from({ length: topic.crowns }).map((_, i) => (
              <Crown key={i} className="w-6 h-6 text-amber-400 fill-amber-400" />
            ))}
            {Array.from({ length: 5 - topic.crowns }).map((_, i) => (
              <Crown key={i} className="w-6 h-6" style={{ color: t.progressBg }} />
            ))}
          </div>
        )}

        <div className="space-y-3">
          <button
            onClick={() => startGame(session.topicId)}
            disabled={gameState.hearts <= 0}
            className="w-full py-4 rounded-2xl font-bold text-lg text-white btn-primary disabled:opacity-40"
          >
            <Sparkles className="w-5 h-5 inline mr-2" /> Play Again
          </button>
          <button
            onClick={goBack}
            className="w-full py-4 rounded-2xl font-bold text-lg transition-colors"
            style={{ backgroundColor: t.progressBg, color: t.textSecondary }}
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  )
}

// ─── SUB-COMPONENTS ────────────────────────────────────────────
const TypeInAnswer = forwardRef<
  HTMLInputElement,
  { onSubmit: (val: string) => void; disabled: boolean; correctAnswer?: string; isCorrect: boolean | null }
>(({ onSubmit, disabled, correctAnswer, isCorrect }, ref) => {
  const [value, setValue] = useState('')
  const t = useTheme()

  const handleSubmit = () => {
    if (!value.trim() || disabled) return
    onSubmit(value.trim())
  }

  useEffect(() => {
    if (!disabled) setValue('')
  }, [disabled])

  return (
    <div className="space-y-4">
      <input
        ref={ref}
        type="text"
        value={disabled ? (correctAnswer ?? value) : value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && handleSubmit()}
        disabled={disabled}
        placeholder="Type your answer..."
        className="w-full px-6 py-4 rounded-2xl border-3 text-lg font-medium text-center transition-all focus:outline-none"
        style={{
          backgroundColor: disabled ? (isCorrect ? t.correctBg : t.wrongBg) : t.inputBg,
          borderColor: disabled ? (isCorrect ? '#58CC02' : '#FF4B4B') : t.inputBorder,
          color: disabled ? (isCorrect ? '#2D7A00' : '#CC0000') : t.textPrimary,
        }}
      />
      {!disabled && (
        <button
          onClick={handleSubmit}
          disabled={!value.trim()}
          className="w-full py-4 rounded-2xl font-bold text-lg text-white btn-primary disabled:opacity-40 disabled:cursor-not-allowed"
        >
          Check
        </button>
      )}
    </div>
  )
})
TypeInAnswer.displayName = 'TypeInAnswer'

function ConfettiOverlay() {
  const particles = Array.from({ length: 40 }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 0.5,
    duration: 1 + Math.random() * 1.5,
    color: ['#58CC02', '#FFD900', '#FF4B4B', '#1CB0F6', '#CE82FF', '#FF9600'][Math.floor(Math.random() * 6)],
    size: 6 + Math.random() * 8,
  }))

  return (
    <div className="fixed inset-0 z-50 pointer-events-none overflow-hidden">
      {particles.map((p) => (
        <div
          key={p.id}
          className="absolute rounded-sm animate-confetti"
          style={{
            left: `${p.x}%`,
            top: '-10px',
            width: p.size,
            height: p.size,
            backgroundColor: p.color,
            animationDelay: `${p.delay}s`,
            animationDuration: `${p.duration}s`,
          }}
        />
      ))}
    </div>
  )
}
