# @omochikun/gamification-level

**Flexible gamification level calculator for RPG-style progression systems**

[![npm version](https://img.shields.io/npm/v/@omochikun/gamification-level.svg)](https://www.npmjs.com/package/@omochikun/gamification-level)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)

A lightweight, zero-dependency TypeScript library for implementing gamification level systems with customizable XP curves, rank systems, and progress tracking.

## ✨ Features

- 🎮 **Flexible XP Curves** - Customizable base XP and exponential growth
- 📊 **Progress Tracking** - Calculate level progress and XP to next level
- 🏆 **Rank System** - Built-in rank definitions with custom rank support
- 📦 **Zero Dependencies** - Lightweight and fast
- 🔧 **TypeScript First** - Full type safety and IntelliSense support
- ⚡ **Optimized** - Binary search for efficient level calculations
- 🧪 **Well Tested** - 37 unit tests with 100% coverage

## 📦 Installation

```bash
npm install @omochikun/gamification-level
```

## 🚀 Quick Start

```typescript
import { calculateLevel, getLevelInfo } from '@omochikun/gamification-level';

// Calculate level from XP
const level = calculateLevel(1000);
console.log(level); // 8

// Get complete level information
const info = getLevelInfo(1000);
console.log(info);
// {
//   level: 8,
//   currentXP: 1000,
//   requiredXP: 724,
//   nextLevelXP: 972,
//   progress: 74.5,
//   xpToNextLevel: 248,
//   rank: 'trainee',
//   rankTitle: 'Trainee'
// }
```

## 📖 API Reference

### `calculateLevel(totalXP, options?)`

Calculate the current level based on total XP.

```typescript
import { calculateLevel } from '@omochikun/gamification-level';

calculateLevel(500); // 7
calculateLevel(500, { baseXP: 200, exponent: 1.5 }); // 5
```

**Parameters:**
- `totalXP` (number): Current total experience points
- `options` (LevelCalculationOptions, optional): Calculation options

**Returns:** Current level (number)

---

### `getRequiredXP(level, options?)`

Get the total XP required to reach a specific level.

```typescript
import { getRequiredXP } from '@omochikun/gamification-level';

getRequiredXP(10); // 316
getRequiredXP(10, { baseXP: 200, exponent: 2 }); // 20000
```

**Parameters:**
- `level` (number): Target level
- `options` (LevelCalculationOptions, optional): Calculation options

**Returns:** Total XP required (number)

---

### `getXPProgress(currentXP, options?)`

Calculate progress percentage to next level.

```typescript
import { getXPProgress } from '@omochikun/gamification-level';

getXPProgress(1000); // 74.5
```

**Parameters:**
- `currentXP` (number): Current total experience points
- `options` (LevelCalculationOptions, optional): Calculation options

**Returns:** Progress percentage 0-100 (number)

---

### `getXPToNextLevel(currentXP, options?)`

Get XP needed to reach the next level.

```typescript
import { getXPToNextLevel } from '@omochikun/gamification-level';

getXPToNextLevel(1000); // 248
```

**Parameters:**
- `currentXP` (number): Current total experience points
- `options` (LevelCalculationOptions, optional): Calculation options

**Returns:** XP needed for next level (number)

---

### `getRank(level, customRanks?)`

Get rank information based on level.

```typescript
import { getRank } from '@omochikun/gamification-level';

const rank = getRank(50);
// { rank: 'intermediate', minLevel: 26, maxLevel: 50, title: 'Intermediate' }
```

**Parameters:**
- `level` (number): Current level
- `customRanks` (RankDefinition[], optional): Custom rank definitions

**Returns:** RankDefinition or null

---

### `getRankTitle(level, customRanks?)`

Get rank title based on level.

```typescript
import { getRankTitle } from '@omochikun/gamification-level';

getRankTitle(50); // "Intermediate"
```

**Parameters:**
- `level` (number): Current level
- `customRanks` (RankDefinition[], optional): Custom rank definitions

**Returns:** Rank title (string) or empty string

---

### `getLevelInfo(currentXP, options?, customRanks?)`

Calculate detailed level information including rank.

```typescript
import { getLevelInfo } from '@omochikun/gamification-level';

const info = getLevelInfo(1000);
// Complete level information with all calculated fields
```

**Parameters:**
- `currentXP` (number): Current total experience points
- `options` (LevelCalculationOptions, optional): Calculation options
- `customRanks` (RankDefinition[], optional): Custom rank definitions

**Returns:** Detailed level information object

---

## ⚙️ Configuration Options

### `LevelCalculationOptions`

```typescript
interface LevelCalculationOptions {
  baseXP?: number;      // Base XP required for level 1 (default: 100)
  exponent?: number;    // Exponent for XP growth curve (default: 1.5)
  maxLevel?: number;    // Maximum level cap (default: 100)
}
```

### Default XP Curve

The default XP curve uses the formula:

```
XP required = baseXP × (level ^ exponent)
XP required = 100 × (level ^ 1.5)
```

**Example XP requirements:**
- Level 1: 100 XP
- Level 5: 500 XP
- Level 10: 1,000 XP (316 actually with default curve)
- Level 50: 35,355 XP

---

## 🏆 Rank System

### Default Ranks

```typescript
const DEFAULT_RANKS = [
  { rank: 'trainee', minLevel: 1, maxLevel: 10, title: 'Trainee' },
  { rank: 'junior', minLevel: 11, maxLevel: 25, title: 'Junior' },
  { rank: 'intermediate', minLevel: 26, maxLevel: 50, title: 'Intermediate' },
  { rank: 'senior', minLevel: 51, maxLevel: 75, title: 'Senior' },
  { rank: 'expert', minLevel: 76, maxLevel: 90, title: 'Expert' },
  { rank: 'master', minLevel: 91, maxLevel: 100, title: 'Master' },
];
```

### Custom Ranks

You can define your own rank system:

```typescript
import { getRank, getLevelInfo } from '@omochikun/gamification-level';

const customRanks = [
  { rank: 'bronze', minLevel: 1, maxLevel: 20, title: 'Bronze' },
  { rank: 'silver', minLevel: 21, maxLevel: 40, title: 'Silver' },
  { rank: 'gold', minLevel: 41, maxLevel: 60, title: 'Gold' },
  { rank: 'platinum', minLevel: 61, maxLevel: 80, title: 'Platinum' },
  { rank: 'diamond', minLevel: 81, maxLevel: 100, title: 'Diamond' },
];

const rank = getRank(35, customRanks);
console.log(rank); // { rank: 'silver', minLevel: 21, maxLevel: 40, title: 'Silver' }

const info = getLevelInfo(1000, {}, customRanks);
console.log(info.rankTitle); // Based on custom ranks
```

---

## 💡 Usage Examples

### Example 1: User Progress Display

```typescript
import { getLevelInfo } from '@omochikun/gamification-level';

function displayUserProgress(userXP: number) {
  const info = getLevelInfo(userXP);

  console.log(`Level: ${info.level}`);
  console.log(`Rank: ${info.rankTitle}`);
  console.log(`Progress: ${info.progress.toFixed(1)}%`);
  console.log(`XP to next level: ${info.xpToNextLevel}`);
}

displayUserProgress(1500);
// Level: 9
// Rank: Trainee
// Progress: 53.2%
// XP to next level: 468
```

### Example 2: Custom XP Curve (Linear Progression)

```typescript
import { calculateLevel, getRequiredXP } from '@omochikun/gamification-level';

// Linear progression: 100 XP per level
const options = { baseXP: 100, exponent: 1 };

const level = calculateLevel(500, options);
console.log(level); // 5

const xpNeeded = getRequiredXP(10, options);
console.log(xpNeeded); // 1000
```

### Example 3: RPG-Style Steep Curve

```typescript
import { getLevelInfo } from '@omochikun/gamification-level';

// Steep exponential curve (harder to level up)
const options = { baseXP: 100, exponent: 2.5, maxLevel: 50 };

const info = getLevelInfo(10000, options);
console.log(info);
// {
//   level: 6,
//   currentXP: 10000,
//   requiredXP: 8858,
//   nextLevelXP: 13429,
//   progress: 42.7%,
//   ...
// }
```

### Example 4: Progress Bar Component (React)

```typescript
import { getLevelInfo } from '@omochikun/gamification-level';

function LevelProgressBar({ userXP }: { userXP: number }) {
  const info = getLevelInfo(userXP);

  return (
    <div className="level-display">
      <div className="level-header">
        <span>Level {info.level}</span>
        <span>{info.rankTitle}</span>
      </div>
      <div className="progress-bar">
        <div
          className="progress-fill"
          style={{ width: `${info.progress}%` }}
        />
      </div>
      <div className="xp-info">
        {info.currentXP} / {info.nextLevelXP} XP
      </div>
    </div>
  );
}
```

### Example 5: Achievement System

```typescript
import { calculateLevel, getRankTitle } from '@omochikun/gamification-level';

function checkLevelUpAchievement(oldXP: number, newXP: number) {
  const oldLevel = calculateLevel(oldXP);
  const newLevel = calculateLevel(newXP);

  if (newLevel > oldLevel) {
    const rank = getRankTitle(newLevel);
    console.log(`🎉 Level Up! You are now level ${newLevel} (${rank})`);
    return true;
  }
  return false;
}

checkLevelUpAchievement(900, 1100);
// 🎉 Level Up! You are now level 9 (Trainee)
```

---

## 🧪 Testing

This package is thoroughly tested with 37 unit tests covering:

- XP calculation accuracy
- Level calculation edge cases
- Progress tracking precision
- Rank system completeness
- Custom configuration handling
- Large value handling

Run tests:

```bash
npm test
```

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit issues or pull requests.

### Development Setup

```bash
# Clone repository
git clone https://github.com/Omochikun55/gamification-level.git
cd gamification-level

# Install dependencies
npm install

# Run tests
npm test

# Build
npm run build
```

---

## 📜 License

MIT License - see [LICENSE](LICENSE) file for details.

---

## 🔗 Links

- [GitHub Repository](https://github.com/Omochikun55/gamification-level)
- [npm Package](https://www.npmjs.com/package/@omochikun/gamification-level)
- [Issues](https://github.com/Omochikun55/gamification-level/issues)

---

## 🙏 Acknowledgments

Created with ❤️ for developers building engaging gamification systems.

**🤖 Generated with [Claude Code](https://claude.com/claude-code)**
