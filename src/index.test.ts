import {
  calculateLevel,
  getRequiredXP,
  getXPProgress,
  getXPToNextLevel,
  getRank,
  getRankTitle,
  getLevelInfo,
  DEFAULT_RANKS,
} from './index';

describe('gamification-level', () => {
  describe('getRequiredXP', () => {
    it('should return 0 for level < 1', () => {
      expect(getRequiredXP(0)).toBe(0);
      expect(getRequiredXP(-5)).toBe(0);
    });

    it('should calculate XP for level 1', () => {
      expect(getRequiredXP(1)).toBe(100);
    });

    it('should calculate XP with default exponential curve', () => {
      // baseXP * level^1.5
      expect(getRequiredXP(2)).toBe(Math.floor(100 * Math.pow(2, 1.5)));
      expect(getRequiredXP(10)).toBe(Math.floor(100 * Math.pow(10, 1.5)));
    });

    it('should respect maxLevel cap', () => {
      const xp100 = getRequiredXP(100, { maxLevel: 100 });
      const xp150 = getRequiredXP(150, { maxLevel: 100 });
      expect(xp150).toBe(xp100);
    });

    it('should support custom baseXP', () => {
      expect(getRequiredXP(1, { baseXP: 200 })).toBe(200);
    });

    it('should support custom exponent', () => {
      // Linear progression with exponent 1
      expect(getRequiredXP(5, { baseXP: 100, exponent: 1 })).toBe(500);
    });
  });

  describe('calculateLevel', () => {
    it('should return 1 for negative XP', () => {
      expect(calculateLevel(-100)).toBe(1);
    });

    it('should return 1 for 0 XP', () => {
      expect(calculateLevel(0)).toBe(1);
    });

    it('should calculate correct level for exact XP', () => {
      const level5XP = getRequiredXP(5);
      expect(calculateLevel(level5XP)).toBe(5);
    });

    it('should handle XP between levels', () => {
      const level5XP = getRequiredXP(5);
      const level6XP = getRequiredXP(6);
      const midXP = Math.floor((level5XP + level6XP) / 2);
      expect(calculateLevel(midXP)).toBe(5);
    });

    it('should respect maxLevel cap', () => {
      expect(calculateLevel(999999, { maxLevel: 50 })).toBeLessThanOrEqual(50);
    });

    it('should work with custom options', () => {
      const level = calculateLevel(500, { baseXP: 100, exponent: 1 });
      expect(level).toBe(5); // 500 / 100 = 5
    });
  });

  describe('getXPProgress', () => {
    it('should return 0 at exact level XP', () => {
      const level5XP = getRequiredXP(5);
      expect(getXPProgress(level5XP)).toBe(0);
    });

    it('should return 100 at max level', () => {
      expect(getXPProgress(999999, { maxLevel: 10 })).toBe(100);
    });

    it('should calculate progress between levels', () => {
      const level5XP = getRequiredXP(5);
      const level6XP = getRequiredXP(6);
      const midXP = Math.floor((level5XP + level6XP) / 2);
      const progress = getXPProgress(midXP);
      expect(progress).toBeGreaterThan(40);
      expect(progress).toBeLessThan(60);
    });

    it('should never exceed 100%', () => {
      expect(getXPProgress(999999)).toBe(100);
    });

    it('should never be negative', () => {
      expect(getXPProgress(-100)).toBeGreaterThanOrEqual(0);
    });
  });

  describe('getXPToNextLevel', () => {
    it('should return correct XP needed', () => {
      const level5XP = getRequiredXP(5);
      const level6XP = getRequiredXP(6);
      const xpNeeded = getXPToNextLevel(level5XP);
      expect(xpNeeded).toBe(level6XP - level5XP);
    });

    it('should return 0 at max level', () => {
      expect(getXPToNextLevel(999999, { maxLevel: 10 })).toBe(0);
    });

    it('should handle XP between levels', () => {
      const level5XP = getRequiredXP(5);
      const level6XP = getRequiredXP(6);
      const midXP = Math.floor((level5XP + level6XP) / 2);
      const xpNeeded = getXPToNextLevel(midXP);
      expect(xpNeeded).toBeGreaterThan(0);
      expect(xpNeeded).toBeLessThan(level6XP - level5XP);
    });
  });

  describe('getRank', () => {
    it('should return correct rank for level 1', () => {
      const rank = getRank(1);
      expect(rank?.rank).toBe('trainee');
    });

    it('should return correct rank for level 50', () => {
      const rank = getRank(50);
      expect(rank?.rank).toBe('intermediate');
    });

    it('should return correct rank for max level', () => {
      const rank = getRank(100);
      expect(rank?.rank).toBe('master');
    });

    it('should return null for out of range level', () => {
      expect(getRank(0)).toBeNull();
      expect(getRank(101)).toBeNull();
    });

    it('should support custom ranks', () => {
      const customRanks = [
        { rank: 'beginner', minLevel: 1, maxLevel: 20, title: 'Beginner' },
        { rank: 'pro', minLevel: 21, maxLevel: 100, title: 'Professional' },
      ];
      expect(getRank(15, customRanks)?.rank).toBe('beginner');
      expect(getRank(50, customRanks)?.rank).toBe('pro');
    });
  });

  describe('getRankTitle', () => {
    it('should return correct title', () => {
      expect(getRankTitle(1)).toBe('Trainee');
      expect(getRankTitle(50)).toBe('Intermediate');
      expect(getRankTitle(100)).toBe('Master');
    });

    it('should return empty string for invalid level', () => {
      expect(getRankTitle(0)).toBe('');
      expect(getRankTitle(101)).toBe('');
    });
  });

  describe('getLevelInfo', () => {
    it('should return complete level information', () => {
      const xp = 1000;
      const info = getLevelInfo(xp);

      expect(info).toHaveProperty('level');
      expect(info).toHaveProperty('currentXP', xp);
      expect(info).toHaveProperty('requiredXP');
      expect(info).toHaveProperty('nextLevelXP');
      expect(info).toHaveProperty('progress');
      expect(info).toHaveProperty('xpToNextLevel');
      expect(info).toHaveProperty('rank');
      expect(info).toHaveProperty('rankTitle');
    });

    it('should have consistent calculations', () => {
      const xp = 1000;
      const info = getLevelInfo(xp);

      expect(info.level).toBe(calculateLevel(xp));
      expect(info.progress).toBe(getXPProgress(xp));
      expect(info.xpToNextLevel).toBe(getXPToNextLevel(xp));
    });

    it('should include rank information', () => {
      const info = getLevelInfo(1000);
      expect(info.rank).toBeTruthy();
      expect(info.rankTitle).toBeTruthy();
      expect(DEFAULT_RANKS.some(r => r.rank === info.rank)).toBe(true);
    });

    it('should work with custom options and ranks', () => {
      const customRanks = [
        { rank: 'newbie', minLevel: 1, maxLevel: 50, title: 'Newbie' },
      ];
      const info = getLevelInfo(500, { baseXP: 100, exponent: 1 }, customRanks);
      expect(info.level).toBe(5);
      expect(info.rank).toBe('newbie');
    });
  });

  describe('DEFAULT_RANKS', () => {
    it('should have complete coverage from 1 to 100', () => {
      for (let level = 1; level <= 100; level++) {
        const rank = getRank(level);
        expect(rank).not.toBeNull();
      }
    });

    it('should have no gaps or overlaps', () => {
      const sorted = [...DEFAULT_RANKS].sort((a, b) => a.minLevel - b.minLevel);

      for (let i = 0; i < sorted.length - 1; i++) {
        expect(sorted[i].maxLevel + 1).toBe(sorted[i + 1].minLevel);
      }
    });
  });

  describe('edge cases', () => {
    it('should handle very large XP values', () => {
      expect(() => calculateLevel(Number.MAX_SAFE_INTEGER)).not.toThrow();
    });

    it('should handle very high max levels', () => {
      const level = calculateLevel(100000, { maxLevel: 10000 });
      expect(level).toBeGreaterThan(0);
      expect(level).toBeLessThanOrEqual(10000);
    });

    it('should handle decimal XP values', () => {
      expect(calculateLevel(100.5)).toBe(calculateLevel(100));
    });

    it('should maintain consistency across different exponents', () => {
      const xp = 500;

      // All should calculate a valid level
      expect(calculateLevel(xp, { exponent: 1 })).toBeGreaterThan(0);
      expect(calculateLevel(xp, { exponent: 1.5 })).toBeGreaterThan(0);
      expect(calculateLevel(xp, { exponent: 2 })).toBeGreaterThan(0);
    });
  });
});
