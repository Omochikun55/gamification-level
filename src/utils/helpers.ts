/**
 * Helper utilities for gamification level system
 */

import { calculateLevel, getRequiredXP, getLevelInfo } from '../index';

/**
 * Calculate XP needed between two levels
 */
export function getXPBetweenLevels(
  fromLevel: number,
  toLevel: number,
  options?: any
): number {
  const fromXP = getRequiredXP(fromLevel, options);
  const toXP = getRequiredXP(toLevel, options);
  return toXP - fromXP;
}

/**
 * Estimate time to reach target level based on XP per day
 */
export function estimateTimeToLevel(
  currentXP: number,
  targetLevel: number,
  xpPerDay: number,
  options?: any
): { days: number; date: Date } {
  const targetXP = getRequiredXP(targetLevel, options);
  const xpNeeded = targetXP - currentXP;

  if (xpNeeded <= 0) {
    return { days: 0, date: new Date() };
  }

  const days = Math.ceil(xpNeeded / xpPerDay);
  const date = new Date();
  date.setDate(date.getDate() + days);

  return { days, date };
}

/**
 * Calculate XP bonus with multiplier
 */
export function calculateXPBonus(
  baseXP: number,
  multiplier: number = 1,
  bonuses: number[] = []
): number {
  const totalBonus = bonuses.reduce((sum, bonus) => sum + bonus, 0);
  return Math.floor(baseXP * multiplier + totalBonus);
}

/**
 * Check if user leveled up after adding XP
 */
export function checkLevelUp(
  previousXP: number,
  addedXP: number,
  options?: any
): {
  leveledUp: boolean;
  previousLevel: number;
  newLevel: number;
  levelsGained: number;
} {
  const previousLevel = calculateLevel(previousXP, options);
  const newXP = previousXP + addedXP;
  const newLevel = calculateLevel(newXP, options);
  const levelsGained = newLevel - previousLevel;

  return {
    leveledUp: levelsGained > 0,
    previousLevel,
    newLevel,
    levelsGained,
  };
}

/**
 * Generate level milestones
 */
export function generateMilestones(
  maxLevel: number = 100,
  milestoneInterval: number = 10,
  options?: any
): Array<{ level: number; requiredXP: number; isM ilestone: boolean }> {
  const milestones = [];

  for (let level = 1; level <= maxLevel; level++) {
    milestones.push({
      level,
      requiredXP: getRequiredXP(level, options),
      isMilestone: level % milestoneInterval === 0,
    });
  }

  return milestones;
}

/**
 * Calculate daily XP requirement to reach target in given days
 */
export function calculateDailyXPRequirement(
  currentXP: number,
  targetLevel: number,
  days: number,
  options?: any
): number {
  const targetXP = getRequiredXP(targetLevel, options);
  const xpNeeded = targetXP - currentXP;

  if (xpNeeded <= 0) return 0;
  if (days <= 0) return Infinity;

  return Math.ceil(xpNeeded / days);
}

/**
 * Compare two users' progression
 */
export function compareProgression(
  user1XP: number,
  user2XP: number,
  options?: any
): {
  user1Level: number;
  user2Level: number;
  levelDifference: number;
  xpDifference: number;
  leader: 'user1' | 'user2' | 'tie';
} {
  const user1Level = calculateLevel(user1XP, options);
  const user2Level = calculateLevel(user2XP, options);

  return {
    user1Level,
    user2Level,
    levelDifference: Math.abs(user1Level - user2Level),
    xpDifference: Math.abs(user1XP - user2XP),
    leader: user1XP > user2XP ? 'user1' : user2XP > user1XP ? 'user2' : 'tie',
  };
}

/**
 * Calculate prestige (reset with bonus)
 */
export function calculatePrestige(
  currentLevel: number,
  currentXP: number,
  prestigeBonus: number = 0.1
): {
  newXP: number;
  bonusXP: number;
  prestigeLevel: number;
} {
  const bonusXP = Math.floor(currentXP * prestigeBonus);
  const newXP = bonusXP;
  const prestigeLevel = 1;

  return {
    newXP,
    bonusXP,
    prestigeLevel,
  };
}
