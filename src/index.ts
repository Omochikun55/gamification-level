/**
 * @omochikun/gamification-level
 * Flexible gamification level calculator for RPG-style progression systems
 */

export interface LevelCalculationOptions {
  /** Base XP required for level 1 (default: 100) */
  baseXP?: number;
  /** Exponent for XP growth curve (default: 1.5) */
  exponent?: number;
  /** Maximum level cap (default: 100) */
  maxLevel?: number;
}

export interface RankDefinition {
  /** Rank identifier */
  rank: string;
  /** Minimum level for this rank */
  minLevel: number;
  /** Maximum level for this rank */
  maxLevel: number;
  /** Display title for this rank */
  title: string;
}

const DEFAULT_OPTIONS: Required<LevelCalculationOptions> = {
  baseXP: 100,
  exponent: 1.5,
  maxLevel: 100,
};

const DEFAULT_RANKS: RankDefinition[] = [
  { rank: 'trainee', minLevel: 1, maxLevel: 10, title: 'Trainee' },
  { rank: 'junior', minLevel: 11, maxLevel: 25, title: 'Junior' },
  { rank: 'intermediate', minLevel: 26, maxLevel: 50, title: 'Intermediate' },
  { rank: 'senior', minLevel: 51, maxLevel: 75, title: 'Senior' },
  { rank: 'expert', minLevel: 76, maxLevel: 90, title: 'Expert' },
  { rank: 'master', minLevel: 91, maxLevel: 100, title: 'Master' },
];

/**
 * Calculate the total XP required to reach a specific level
 * @param level Target level
 * @param options Calculation options
 * @returns Total XP required
 */
export function getRequiredXP(
  level: number,
  options: LevelCalculationOptions = {}
): number {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (level < 1) return 0;
  if (level > opts.maxLevel) level = opts.maxLevel;

  // XP required = baseXP * (level ^ exponent)
  return Math.floor(opts.baseXP * Math.pow(level, opts.exponent));
}

/**
 * Calculate the current level based on total XP
 * @param totalXP Current total experience points
 * @param options Calculation options
 * @returns Current level
 */
export function calculateLevel(
  totalXP: number,
  options: LevelCalculationOptions = {}
): number {
  const opts = { ...DEFAULT_OPTIONS, ...options };

  if (totalXP < 0) return 1;

  // Binary search for efficiency with large level caps
  let low = 1;
  let high = opts.maxLevel;
  let currentLevel = 1;

  while (low <= high) {
    const mid = Math.floor((low + high) / 2);
    const requiredXP = getRequiredXP(mid, options);

    if (requiredXP <= totalXP) {
      currentLevel = mid;
      low = mid + 1;
    } else {
      high = mid - 1;
    }
  }

  return currentLevel;
}

/**
 * Calculate progress percentage to next level
 * @param currentXP Current total experience points
 * @param options Calculation options
 * @returns Progress percentage (0-100)
 */
export function getXPProgress(
  currentXP: number,
  options: LevelCalculationOptions = {}
): number {
  const currentLevel = calculateLevel(currentXP, options);
  const currentLevelXP = getRequiredXP(currentLevel, options);
  const nextLevelXP = getRequiredXP(currentLevel + 1, options);

  if (currentLevel >= (options.maxLevel || DEFAULT_OPTIONS.maxLevel)) {
    return 100; // Max level reached
  }

  const xpInCurrentLevel = currentXP - currentLevelXP;
  const xpNeededForNext = nextLevelXP - currentLevelXP;

  return Math.min(100, Math.max(0, (xpInCurrentLevel / xpNeededForNext) * 100));
}

/**
 * Get XP needed for next level
 * @param currentXP Current total experience points
 * @param options Calculation options
 * @returns XP needed to reach next level
 */
export function getXPToNextLevel(
  currentXP: number,
  options: LevelCalculationOptions = {}
): number {
  const currentLevel = calculateLevel(currentXP, options);
  const nextLevelXP = getRequiredXP(currentLevel + 1, options);

  return Math.max(0, nextLevelXP - currentXP);
}

/**
 * Get rank information based on level
 * @param level Current level
 * @param customRanks Optional custom rank definitions
 * @returns Rank definition or null if not found
 */
export function getRank(
  level: number,
  customRanks?: RankDefinition[]
): RankDefinition | null {
  const ranks = customRanks || DEFAULT_RANKS;

  return ranks.find(r => level >= r.minLevel && level <= r.maxLevel) || null;
}

/**
 * Get rank title based on level
 * @param level Current level
 * @param customRanks Optional custom rank definitions
 * @returns Rank title or empty string if not found
 */
export function getRankTitle(
  level: number,
  customRanks?: RankDefinition[]
): string {
  const rank = getRank(level, customRanks);
  return rank?.title || '';
}

/**
 * Calculate detailed level information
 * @param currentXP Current total experience points
 * @param options Calculation options
 * @param customRanks Optional custom rank definitions
 * @returns Detailed level information
 */
export function getLevelInfo(
  currentXP: number,
  options: LevelCalculationOptions = {},
  customRanks?: RankDefinition[]
) {
  const level = calculateLevel(currentXP, options);
  const requiredXP = getRequiredXP(level, options);
  const nextLevelXP = getRequiredXP(level + 1, options);
  const progress = getXPProgress(currentXP, options);
  const xpToNext = getXPToNextLevel(currentXP, options);
  const rank = getRank(level, customRanks);

  return {
    level,
    currentXP,
    requiredXP,
    nextLevelXP,
    progress,
    xpToNextLevel: xpToNext,
    rank: rank?.rank || null,
    rankTitle: rank?.title || null,
  };
}

// Export default ranks for convenience
export { DEFAULT_RANKS };
