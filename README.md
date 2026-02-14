# MathQuest

A Duolingo-inspired math learning game built for 6th graders. Practice 20 different math topics across 7 categories with an XP system, streak tracking, lives, crowns, and theme customization — all saved locally so you can pick up where you left off.

![React](https://img.shields.io/badge/React-19-blue) ![TypeScript](https://img.shields.io/badge/TypeScript-5-blue) ![Tailwind](https://img.shields.io/badge/Tailwind_CSS-4-blue) ![Vite](https://img.shields.io/badge/Vite-7-purple)

## Features

### 20 Math Topics

| Category | Topics |
|---|---|
| **Numbers** | Multiplication, Long Division, Factors & Multiples |
| **Fractions & Decimals** | Fraction Basics, Add & Subtract Fractions, Multiply & Divide Fractions, Decimals |
| **Ratios & Percents** | Ratios, Proportions, Percentages |
| **Geometry** | Area & Perimeter, Volume, Angles & Triangles |
| **Data & Probability** | Mean/Median/Mode, Probability, Coordinate Plane |
| **Pre-Algebra** | Integers, Order of Operations, Simple Equations |
| **Challenge Zone** | Exponents & Roots |

### Duolingo-Style Progression

- **XP & Levels** — Earn XP for correct answers and level up through 13 tiers
- **Daily Streaks** — Keep your streak alive by playing every day
- **Hearts** — 5 lives that regenerate over time (1 every 30 minutes)
- **Crowns** — Earn up to 5 crowns per topic by answering questions correctly
- **Skill Tree** — Unlock new topics as you earn crowns
- **Daily Goals** — Track your daily XP progress

### Game Mechanics

- Multiple choice questions with 4 answer options
- Type-in answers for more advanced practice
- Celebration animations on correct answers
- Encouraging feedback messages
- Hints after wrong answers
- Session summaries with XP earned

### Themes

4 built-in themes with a floating theme picker:

- **Classic** (light) — Clean and bright
- **Ocean** (light) — Cool blue tones
- **Midnight** (dark) — Deep indigo dark mode
- **Forest** (dark) — Rich green dark mode

### Local Storage Persistence

All progress is saved automatically to localStorage:

- Player profile (name + avatar)
- XP, level, streaks, and hearts
- Per-topic crowns and answer history
- Daily goals and longest streak
- Theme preference

## Getting Started

```bash
# Install dependencies
bun install

# Start dev server
bun run dev
```

The app runs at [http://localhost:3000](http://localhost:3000).

## Build for Production

```bash
bun run build
bun run preview
```

## Tech Stack

- **React 19** + **TypeScript**
- **Vite 7** for bundling
- **Tailwind CSS 4** for styling
- **TanStack Router** for file-based routing
- **Biome** for linting and formatting
- **Google Fonts** — Nunito + Fredoka

## License

MIT
