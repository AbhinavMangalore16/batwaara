import type { SplitType } from '@/types/database';

export interface SplitInput {
  memberId: string;
  percentage?: number;
  exactAmount?: number;
  shares?: number;
}

export interface CalculatedSplit {
  memberId: string;
  amount: number;
  percentage?: number;
  shares?: number;
}

/**
 * Calculates individual expense split amounts based on the selected split type.
 * Handles exact rounding (down to 2 decimal places) so that the sum of splits
 * strictly matches the total expense amount.
 */
export function calculateSplits(
  totalAmount: number,
  splitType: SplitType,
  selectedMemberIds: string[],
  inputs?: Record<string, SplitInput>
): CalculatedSplit[] {
  if (totalAmount <= 0) {
    throw new Error('Total amount must be greater than 0');
  }
  if (!selectedMemberIds || selectedMemberIds.length === 0) {
    throw new Error('At least one member must be included in the split');
  }

  const roundedTotal = Math.round(totalAmount * 100) / 100;

  switch (splitType) {
    case 'equal': {
      const count = selectedMemberIds.length;
      const baseAmount = Math.floor((roundedTotal / count) * 100) / 100;
      let remainder = Math.round((roundedTotal - baseAmount * count) * 100);

      return selectedMemberIds.map((memberId) => {
        let amount = baseAmount;
        if (remainder > 0) {
          amount = Math.round((amount + 0.01) * 100) / 100;
          remainder--;
        }
        return {
          memberId,
          amount,
          percentage: Math.round((amount / roundedTotal) * 10000) / 100,
        };
      });
    }

    case 'percentage': {
      if (!inputs) throw new Error('Percentage inputs required');

      let totalPct = 0;
      selectedMemberIds.forEach((id) => {
        const pct = inputs[id]?.percentage || 0;
        totalPct += pct;
      });

      if (Math.abs(totalPct - 100) > 0.01) {
        throw new Error(`Total percentage must equal 100%. Current sum: ${totalPct.toFixed(2)}%`);
      }

      let allocatedSum = 0;
      const initialSplits = selectedMemberIds.map((memberId) => {
        const pct = inputs[memberId]?.percentage || 0;
        const amount = Math.floor(((roundedTotal * pct) / 100) * 100) / 100;
        allocatedSum += amount;
        return { memberId, amount, percentage: pct };
      });

      let remainder = Math.round((roundedTotal - allocatedSum) * 100);
      return initialSplits.map((split) => {
        let amount = split.amount;
        if (remainder > 0) {
          amount = Math.round((amount + 0.01) * 100) / 100;
          remainder--;
        }
        return {
          ...split,
          amount,
        };
      });
    }

    case 'exact': {
      if (!inputs) throw new Error('Exact amount inputs required');

      let totalExact = 0;
      const splits = selectedMemberIds.map((memberId) => {
        const amt = inputs[memberId]?.exactAmount || 0;
        const roundedAmt = Math.round(amt * 100) / 100;
        totalExact += roundedAmt;
        return {
          memberId,
          amount: roundedAmt,
        };
      });

      totalExact = Math.round(totalExact * 100) / 100;

      if (Math.abs(totalExact - roundedTotal) > 0.01) {
        throw new Error(
          `Sum of exact amounts (${totalExact.toFixed(2)}) does not equal expense total (${roundedTotal.toFixed(2)})`
        );
      }

      return splits;
    }

    case 'shares': {
      if (!inputs) throw new Error('Share inputs required');

      let totalShares = 0;
      selectedMemberIds.forEach((id) => {
        const s = inputs[id]?.shares || 0;
        if (s < 0) throw new Error('Shares cannot be negative');
        totalShares += s;
      });

      if (totalShares <= 0) {
        throw new Error('Total shares must be greater than 0');
      }

      let allocatedSum = 0;
      const initialSplits = selectedMemberIds.map((memberId) => {
        const s = inputs[memberId]?.shares || 0;
        const amount = Math.floor((roundedTotal * (s / totalShares)) * 100) / 100;
        allocatedSum += amount;
        return { memberId, amount, shares: s };
      });

      let remainder = Math.round((roundedTotal - allocatedSum) * 100);
      return initialSplits.map((split) => {
        let amount = split.amount;
        if (remainder > 0) {
          amount = Math.round((amount + 0.01) * 100) / 100;
          remainder--;
        }
        return {
          ...split,
          amount,
        };
      });
    }

    default:
      throw new Error(`Unsupported split type: ${splitType}`);
  }
}
