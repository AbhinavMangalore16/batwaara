import { describe, it, expect } from 'vitest';
import {
  calculateCategoryTotals,
  calculateMemberSpending,
  filterExpenses,
} from '../analytics';
import type { Expense, GroupMember } from '@/types/database';

describe('Analytics & Filter Engine', () => {
  const member1: GroupMember = { id: 'm1', group_id: 'g1', user_id: 'u1', guest_name: 'Alice', role: 'admin', joined_at: '' };
  const member2: GroupMember = { id: 'm2', group_id: 'g1', user_id: 'u2', guest_name: 'Bob', role: 'member', joined_at: '' };

  const expenses: Expense[] = [
    {
      id: 'e1',
      group_id: 'g1',
      created_by: 'u1',
      paid_by_member_id: 'm1',
      paid_by_member: member1,
      description: 'Restaurant Dinner',
      amount: 120,
      currency: 'USD',
      category: 'Food',
      split_type: 'equal',
      receipt_url: null,
      is_recurring: false,
      recurrence_period: null,
      date: '2026-08-01T12:00:00Z',
      created_at: '2026-08-01T12:00:00Z',
      splits: [
        { id: 's1', expense_id: 'e1', member_id: 'm1', amount: 60, member: member1 },
        { id: 's2', expense_id: 'e1', member_id: 'm2', amount: 60, member: member2 },
      ],
    },
    {
      id: 'e2',
      group_id: 'g1',
      created_by: 'u2',
      paid_by_member_id: 'm2',
      paid_by_member: member2,
      description: 'Uber Ride',
      amount: 80,
      currency: 'USD',
      category: 'Transport',
      split_type: 'equal',
      receipt_url: null,
      is_recurring: false,
      recurrence_period: null,
      date: '2026-08-05T12:00:00Z',
      created_at: '2026-08-05T12:00:00Z',
      splits: [
        { id: 's3', expense_id: 'e2', member_id: 'm1', amount: 40, member: member1 },
        { id: 's4', expense_id: 'e2', member_id: 'm2', amount: 40, member: member2 },
      ],
    },
  ];

  it('calculates category totals and percentages correctly', () => {
    const totals = calculateCategoryTotals(expenses);
    const foodCat = totals.find((c) => c.category === 'Food');
    const transportCat = totals.find((c) => c.category === 'Transport');

    expect(foodCat?.amount).toBe(120);
    expect(foodCat?.percentage).toBe(60); // 120 / 200 = 60%
    expect(transportCat?.amount).toBe(80);
    expect(transportCat?.percentage).toBe(40); // 80 / 200 = 40%
  });

  it('calculates member spending totals correctly', () => {
    const memberSummary = calculateMemberSpending(expenses);
    const alice = memberSummary.find((m) => m.memberId === 'm1');
    const bob = memberSummary.find((m) => m.memberId === 'm2');

    expect(alice?.totalPaid).toBe(120);
    expect(alice?.totalShare).toBe(100); // 60 + 40
    expect(bob?.totalPaid).toBe(80);
    expect(bob?.totalShare).toBe(100);
  });

  it('filters expenses by category correctly', () => {
    const foodOnly = filterExpenses(expenses, { category: 'Food' });
    expect(foodOnly).toHaveLength(1);
    expect(foodOnly[0].description).toBe('Restaurant Dinner');
  });

  it('filters expenses by search query matching description', () => {
    const searchResult = filterExpenses(expenses, { searchQuery: 'uber' });
    expect(searchResult).toHaveLength(1);
    expect(searchResult[0].description).toBe('Uber Ride');
  });
});
