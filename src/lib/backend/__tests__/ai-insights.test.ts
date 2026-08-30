import { describe, it, expect } from 'vitest';
import { generateGroupInsights } from '../ai-insights';
import type { Expense, GroupMember } from '@/types/database';

describe('AI Financial Insights Engine', () => {
  const alice: GroupMember = { id: 'm1', group_id: 'g1', user_id: 'u1', guest_name: 'Alice', role: 'admin', joined_at: '' };
  const bob: GroupMember = { id: 'm2', group_id: 'g1', user_id: 'u2', guest_name: 'Bob', role: 'member', joined_at: '' };

  it('handles empty expense list gracefully', async () => {
    const result = await generateGroupInsights('Beach Trip', 'USD', [alice, bob], []);
    expect(result.summary).toContain('No expenses recorded yet in Beach Trip');
    expect(result.tokensUsed.total_tokens).toBe(0);
  });

  it('generates structured 2-sentence fallback summary when API key is unconfigured', async () => {
    const expenses: Expense[] = [
      {
        id: 'e1',
        group_id: 'g1',
        created_by: 'u1',
        paid_by_member_id: 'm1',
        paid_by_member: alice,
        description: 'Hotel Stay',
        amount: 300,
        currency: 'USD',
        category: 'Lodging',
        split_type: 'equal',
        receipt_url: null,
        is_recurring: false,
        recurrence_period: null,
        date: '2026-08-10T00:00:00Z',
        created_at: '2026-08-10T00:00:00Z',
        splits: [
          { id: 's1', expense_id: 'e1', member_id: 'm1', amount: 150 },
          { id: 's2', expense_id: 'e1', member_id: 'm2', amount: 150 },
        ],
      },
    ];

    const result = await generateGroupInsights('Beach Trip', 'USD', [alice, bob], expenses);

    expect(result.summary.length).toBeGreaterThan(10);
    expect(result.tokensUsed.total_tokens).toBeGreaterThan(0);
  });
});
