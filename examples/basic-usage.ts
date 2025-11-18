/**
 * Basic Usage Examples for Gamification Level Calculator
 */

import {
  calculateLevel,
  getRequiredXP,
  getXPProgress,
  getXPToNextLevel,
  getRank,
  getRankTitle,
  getLevelInfo,
} from '../src/index';

/**
 * Example 1: Calculate user's current level from XP
 */
function example1_BasicLevelCalculation() {
  console.log('=== Example 1: Basic Level Calculation ===\n');

  const userXP = 1500;
  const level = calculateLevel(userXP);

  console.log(`User has ${userXP} XP`);
  console.log(`Current Level: ${level}`);
  console.log();
}

/**
 * Example 2: Show level progression
 */
function example2_LevelProgression() {
  console.log('=== Example 2: Level Progression ===\n');

  console.log('Level | Required XP');
  console.log('------|------------');

  for (let level = 1; level <= 20; level++) {
    const xp = getRequiredXP(level);
    console.log(`  ${level.toString().padStart(2)}  |  ${xp.toString().padStart(8)}`);
  }
  console.log();
}

/**
 * Example 3: Track progress to next level
 */
function example3_ProgressTracking() {
  console.log('=== Example 3: Progress Tracking ===\n');

  const currentXP = 1000;
  const level = calculateLevel(currentXP);
  const progress = getXPProgress(currentXP);
  const xpNeeded = getXPToNextLevel(currentXP);

  console.log(`Current XP: ${currentXP}`);
  console.log(`Current Level: ${level}`);
  console.log(`Progress to Level ${level + 1}: ${progress.toFixed(1)}%`);
  console.log(`XP needed for next level: ${xpNeeded}`);
  console.log();

  // Visual progress bar
  const barLength = 20;
  const filledLength = Math.floor((progress / 100) * barLength);
  const bar = '█'.repeat(filledLength) + '░'.repeat(barLength - filledLength);
  console.log(`Progress: [${bar}] ${progress.toFixed(1)}%`);
  console.log();
}

/**
 * Example 4: Rank system
 */
function example4_RankSystem() {
  console.log('=== Example 4: Rank System ===\n');

  const testLevels = [1, 15, 30, 60, 80, 95];

  testLevels.forEach((level) => {
    const rank = getRank(level);
    const title = getRankTitle(level);
    console.log(`Level ${level.toString().padStart(2)}: ${title} (${rank?.rank})`);
  });
  console.log();
}

/**
 * Example 5: Complete level information
 */
function example5_CompleteLevelInfo() {
  console.log('=== Example 5: Complete Level Information ===\n');

  const userXP = 2500;
  const info = getLevelInfo(userXP);

  console.log('User Profile:');
  console.log(`  Current XP: ${info.currentXP}`);
  console.log(`  Level: ${info.level}`);
  console.log(`  Rank: ${info.rankTitle} (${info.rank})`);
  console.log(`  Progress: ${info.progress.toFixed(1)}%`);
  console.log(`  XP for current level: ${info.requiredXP}`);
  console.log(`  XP for next level: ${info.nextLevelXP}`);
  console.log(`  XP needed: ${info.xpToNextLevel}`);
  console.log();
}

/**
 * Example 6: Custom XP curve (Linear progression)
 */
function example6_CustomLinearCurve() {
  console.log('=== Example 6: Custom Linear Curve ===\n');

  const options = { baseXP: 100, exponent: 1 }; // Linear: 100 XP per level

  console.log('Linear Progression (100 XP per level):');
  console.log('Level | Required XP');
  console.log('------|------------');

  for (let level = 1; level <= 10; level++) {
    const xp = getRequiredXP(level, options);
    console.log(`  ${level.toString().padStart(2)}  |  ${xp.toString().padStart(8)}`);
  }
  console.log();
}

/**
 * Example 7: Custom XP curve (Steep exponential)
 */
function example7_CustomSteepCurve() {
  console.log('=== Example 7: Custom Steep Curve ===\n');

  const options = { baseXP: 100, exponent: 2.5 }; // Very steep

  console.log('Steep Exponential Progression (exponent 2.5):');
  console.log('Level | Required XP');
  console.log('------|------------');

  for (let level = 1; level <= 10; level++) {
    const xp = getRequiredXP(level, options);
    console.log(`  ${level.toString().padStart(2)}  |  ${xp.toString().padStart(8)}`);
  }
  console.log();
}

/**
 * Example 8: Award XP and level up
 */
function example8_AwardXP() {
  console.log('=== Example 8: Award XP and Level Up ===\n');

  let currentXP = 800;
  let currentLevel = calculateLevel(currentXP);

  console.log(`Starting: Level ${currentLevel}, ${currentXP} XP`);
  console.log();

  // Award XP for completing a task
  const xpReward = 300;
  currentXP += xpReward;

  console.log(`Awarded ${xpReward} XP for completing task`);

  const newLevel = calculateLevel(currentXP);

  if (newLevel > currentLevel) {
    const newRank = getRankTitle(newLevel);
    console.log(`🎉 LEVEL UP! Level ${currentLevel} → ${newLevel}`);
    console.log(`   New Rank: ${newRank}`);
  } else {
    const progress = getXPProgress(currentXP);
    console.log(`   Progress to next level: ${progress.toFixed(1)}%`);
  }

  console.log(`   Current XP: ${currentXP}`);
  console.log();
}

/**
 * Example 9: Leaderboard simulation
 */
function example9_Leaderboard() {
  console.log('=== Example 9: Leaderboard ===\n');

  const users = [
    { name: 'Alice', xp: 5000 },
    { name: 'Bob', xp: 3200 },
    { name: 'Carol', xp: 7500 },
    { name: 'Dave', xp: 2100 },
    { name: 'Eve', xp: 6800 },
  ];

  // Sort by XP descending
  users.sort((a, b) => b.xp - a.xp);

  console.log('Rank | Name  | Level | XP   | Rank Title');
  console.log('-----|-------|-------|------|-------------');

  users.forEach((user, index) => {
    const level = calculateLevel(user.xp);
    const rankTitle = getRankTitle(level);
    console.log(
      `  ${(index + 1).toString().padStart(2)}  | ${user.name.padEnd(5)} |   ${level.toString().padStart(2)}  | ${user.xp.toString().padStart(4)} | ${rankTitle}`
    );
  });
  console.log();
}

/**
 * Example 10: XP multiplier for events
 */
function example10_XPMultiplier() {
  console.log('=== Example 10: XP Multiplier (Double XP Event) ===\n');

  const baseXPReward = 100;
  const isDoubleXPEvent = true;
  const multiplier = isDoubleXPEvent ? 2 : 1;

  const actualXPReward = baseXPReward * multiplier;

  console.log(`Base XP Reward: ${baseXPReward}`);
  console.log(`Double XP Event: ${isDoubleXPEvent ? 'Active' : 'Inactive'}`);
  console.log(`Multiplier: ${multiplier}x`);
  console.log(`Actual XP Awarded: ${actualXPReward}`);
  console.log();

  if (isDoubleXPEvent) {
    console.log('🎊 Double XP Event is active! Earn twice the XP!');
  }
  console.log();
}

// Run all examples
if (require.main === module) {
  example1_BasicLevelCalculation();
  example2_LevelProgression();
  example3_ProgressTracking();
  example4_RankSystem();
  example5_CompleteLevelInfo();
  example6_CustomLinearCurve();
  example7_CustomSteepCurve();
  example8_AwardXP();
  example9_Leaderboard();
  example10_XPMultiplier();
}

export {
  example1_BasicLevelCalculation,
  example2_LevelProgression,
  example3_ProgressTracking,
  example4_RankSystem,
  example5_CompleteLevelInfo,
  example6_CustomLinearCurve,
  example7_CustomSteepCurve,
  example8_AwardXP,
  example9_Leaderboard,
  example10_XPMultiplier,
};
