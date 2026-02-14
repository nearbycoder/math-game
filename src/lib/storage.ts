import type { GameState, GameTopic, PlayerProfile } from './types'
import { TOPIC_DEFINITIONS } from './types'

const STORAGE_KEY = 'mathquest-game-state'

function buildDefaultTopics(): Record<string, GameTopic> {
  const topics: Record<string, GameTopic> = {}
  for (let i = 0; i < TOPIC_DEFINITIONS.length; i++) {
    const def = TOPIC_DEFINITIONS[i]
    topics[def.id] = {
      ...def,
      crowns: 0,
      unlocked: i < 3, // First 3 topics unlocked by default
      correctCount: 0,
      totalAttempted: 0,
    }
  }
  return topics
}

function defaultState(): GameState {
  return {
    profile: null,
    xp: 0,
    level: 1,
    streak: 0,
    lastPlayedDate: null,
    hearts: 5,
    heartsLastRegen: new Date().toISOString(),
    topics: buildDefaultTopics(),
    dailyXp: 0,
    dailyGoal: 50,
    totalCorrect: 0,
    totalAttempted: 0,
    longestStreak: 0,
  }
}

export function loadGameState(): GameState {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    if (!raw) return defaultState()
    const parsed = JSON.parse(raw) as GameState

    // Rebuild topics: keep progress for current topics, remove stale ones
    const defaults = buildDefaultTopics()
    const cleanedTopics: Record<string, GameTopic> = {}
    for (const def of TOPIC_DEFINITIONS) {
      if (parsed.topics[def.id]) {
        // Preserve existing progress for this topic
        cleanedTopics[def.id] = { ...defaults[def.id], ...parsed.topics[def.id] }
      } else {
        cleanedTopics[def.id] = defaults[def.id]
      }
    }
    // Remove any stale topic IDs not in current definitions
    parsed.topics = cleanedTopics

    // Recalculate unlocks based on current topic order
    const topicIds = TOPIC_DEFINITIONS.map(t => t.id)
    let totalCrowns = 0
    for (const id of topicIds) totalCrowns += parsed.topics[id].crowns
    const unlockedCount = Math.min(topicIds.length, 3 + Math.floor(totalCrowns / 2))
    for (let i = 0; i < topicIds.length; i++) {
      parsed.topics[topicIds[i]].unlocked = i < unlockedCount
    }

    // Regenerate hearts (1 heart per 30 minutes, max 5)
    const now = Date.now()
    const lastRegen = new Date(parsed.heartsLastRegen).getTime()
    const elapsed = now - lastRegen
    const heartsToAdd = Math.floor(elapsed / (30 * 60 * 1000))
    if (heartsToAdd > 0 && parsed.hearts < 5) {
      parsed.hearts = Math.min(5, parsed.hearts + heartsToAdd)
      parsed.heartsLastRegen = new Date().toISOString()
    }

    // Check streak
    const today = new Date().toDateString()
    const lastPlayed = parsed.lastPlayedDate ? new Date(parsed.lastPlayedDate).toDateString() : null
    if (lastPlayed && lastPlayed !== today) {
      const yesterday = new Date(Date.now() - 86400000).toDateString()
      if (lastPlayed !== yesterday) {
        // Streak broken
        parsed.streak = 0
      }
      // Reset daily XP for new day
      parsed.dailyXp = 0
    }

    return parsed
  } catch {
    return defaultState()
  }
}

export function saveGameState(state: GameState): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state))
}

export function updateProfile(state: GameState, profile: PlayerProfile): GameState {
  const newState = { ...state, profile }
  saveGameState(newState)
  return newState
}

export function addXp(state: GameState, amount: number): GameState {
  const newXp = state.xp + amount
  const newDailyXp = state.dailyXp + amount

  // Calculate level from XP thresholds
  const thresholds = [0, 100, 250, 500, 850, 1300, 1900, 2600, 3500, 4600, 6000, 7800, 10000]
  let newLevel = 1
  for (let i = thresholds.length - 1; i >= 0; i--) {
    if (newXp >= thresholds[i]) {
      newLevel = i + 1
      break
    }
  }

  const newState = {
    ...state,
    xp: newXp,
    dailyXp: newDailyXp,
    level: newLevel,
    lastPlayedDate: new Date().toISOString(),
  }
  saveGameState(newState)
  return newState
}

export function recordAnswer(state: GameState, topicId: string, correct: boolean): GameState {
  const topic = state.topics[topicId]
  if (!topic) return state

  const newTopics = {
    ...state.topics,
    [topicId]: {
      ...topic,
      correctCount: topic.correctCount + (correct ? 1 : 0),
      totalAttempted: topic.totalAttempted + 1,
    },
  }

  // Check for crown upgrades (every 10 correct answers = 1 crown, max 5)
  const updatedTopic = newTopics[topicId]
  const newCrowns = Math.min(5, Math.floor(updatedTopic.correctCount / 10))
  newTopics[topicId] = { ...updatedTopic, crowns: newCrowns }

  // Unlock next topics based on crowns earned (use TOPIC_DEFINITIONS order)
  const topicIds = TOPIC_DEFINITIONS.map(t => t.id)
  let totalCrowns = 0
  for (const id of topicIds) {
    if (newTopics[id]) totalCrowns += newTopics[id].crowns
  }
  // Unlock one more topic for every 2 crowns earned
  const unlockedCount = Math.min(topicIds.length, 3 + Math.floor(totalCrowns / 2))
  for (let i = 0; i < topicIds.length; i++) {
    if (newTopics[topicIds[i]]) {
      newTopics[topicIds[i]] = {
        ...newTopics[topicIds[i]],
        unlocked: i < unlockedCount,
      }
    }
  }

  const newStreak = correct ? state.streak + 1 : 0
  const newState: GameState = {
    ...state,
    topics: newTopics,
    hearts: correct ? state.hearts : Math.max(0, state.hearts - 1),
    streak: newStreak,
    longestStreak: Math.max(state.longestStreak, newStreak),
    totalCorrect: state.totalCorrect + (correct ? 1 : 0),
    totalAttempted: state.totalAttempted + 1,
    lastPlayedDate: new Date().toISOString(),
  }
  saveGameState(newState)
  return newState
}

export function resetGameState(): GameState {
  const state = defaultState()
  saveGameState(state)
  return state
}
