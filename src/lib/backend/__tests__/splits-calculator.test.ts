import { describe, it, expect } from 'vitest';
import { calculateSplits } from '../splits-calculator';

describe('Splits Calculator Engine', () => {
  describe('Equal Splits', () => {
    it('splits evenly when amount is cleanly divisible', () => {
      const result = calculateSplits(100, 'equal', ['m1', 'm2', 'm3', 'm4']);
      expect(result).toHaveLength(4);
      expect(result.map((r) => r.amount)).toEqual([25, 25, 25, 25]);
      expect(result.reduce((sum, r) => sum + r.amount, 0)).toBe(100);
    });

    it('handles penny remainder rounding cleanly ($10 / 3 members)', () => {
      const result = calculateSplits(10, 'equal', ['m1', 'm2', 'm3']);
      expect(result).toHaveLength(3);
      expect(result.map((r) => r.amount)).toEqual([3.34, 3.33, 3.33]);
      expect(result.reduce((sum, r) => sum + r.amount, 0)).toBe(10);
    });

    it('throws error when total amount is 0 or negative', () => {
      expect(() => calculateSplits(0, 'equal', ['m1'])).toThrow('Total amount must be greater than 0');
    });

    it('throws error when no members selected', () => {
      expect(() => calculateSplits(50, 'equal', [])).toThrow('At least one member must be included in the split');
    });
  });

  describe('Percentage Splits', () => {
    it('calculates correct amounts for 50%, 30%, 20%', () => {
      const result = calculateSplits(200, 'percentage', ['m1', 'm2', 'm3'], {
        m1: { memberId: 'm1', percentage: 50 },
        m2: { memberId: 'm2', percentage: 30 },
        m3: { memberId: 'm3', percentage: 20 },
      });
      expect(result.map((r) => r.amount)).toEqual([100, 60, 40]);
      expect(result.reduce((sum, r) => sum + r.amount, 0)).toBe(200);
    });

    it('throws error when total percentage does not equal 100%', () => {
      expect(() =>
        calculateSplits(100, 'percentage', ['m1', 'm2'], {
          m1: { memberId: 'm1', percentage: 50 },
          m2: { memberId: 'm2', percentage: 40 },
        })
      ).toThrow('Total percentage must equal 100%');
    });
  });

  describe('Exact Amount Splits', () => {
    it('accepts exact amounts that sum to total', () => {
      const result = calculateSplits(75.5, 'exact', ['m1', 'm2'], {
        m1: { memberId: 'm1', exactAmount: 50.25 },
        m2: { memberId: 'm2', exactAmount: 25.25 },
      });
      expect(result.map((r) => r.amount)).toEqual([50.25, 25.25]);
      expect(result.reduce((sum, r) => sum + r.amount, 0)).toBe(75.5);
    });

    it('throws error when exact amounts do not match total', () => {
      expect(() =>
        calculateSplits(100, 'exact', ['m1', 'm2'], {
          m1: { memberId: 'm1', exactAmount: 50 },
          m2: { memberId: 'm2', exactAmount: 40 },
        })
      ).toThrow('Sum of exact amounts (90.00) does not equal expense total (100.00)');
    });
  });

  describe('Shares Splits', () => {
    it('splits proportionally according to share weights (3 shares vs 1 share)', () => {
      const result = calculateSplits(100, 'shares', ['m1', 'm2'], {
        m1: { memberId: 'm1', shares: 3 },
        m2: { memberId: 'm2', shares: 1 },
      });
      expect(result.map((r) => r.amount)).toEqual([75, 25]);
      expect(result.reduce((sum, r) => sum + r.amount, 0)).toBe(100);
    });

    it('throws error when total shares <= 0', () => {
      expect(() =>
        calculateSplits(100, 'shares', ['m1', 'm2'], {
          m1: { memberId: 'm1', shares: 0 },
          m2: { memberId: 'm2', shares: 0 },
        })
      ).toThrow('Total shares must be greater than 0');
    });
  });
});
