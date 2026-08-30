import { describe, it, expect, vi, beforeEach } from 'vitest';

let mockState = { data: null as any, error: null as any };

vi.mock('@/lib/supabase', () => ({
  supabase: {
    from: () => ({
      insert: () => ({
        select: () => ({
          single: async () => mockState,
        }),
      }),
      select: () => ({
        eq: () => ({
          single: async () => mockState,
          order: async () => mockState,
        }),
      }),
    }),
  },
}));

import {
  createGroup,
  addGroupMember,
  addExpense,
  recordSettlement,
} from '../services';

describe('Group & Expense Backend Services (Integration Mock Tests)', () => {
  beforeEach(() => {
    mockState = { data: null, error: null };
  });

  it('creates a group and adds creator as admin member', async () => {
    const mockGroup = {
      id: 'g1',
      name: 'Beach Trip 2024',
      description: 'Summer fun',
      currency: 'USD',
      invite_code: 'ABC123',
      created_by: 'u1',
      created_at: '2026-08-30T00:00:00Z',
    };

    mockState = { data: mockGroup, error: null };

    const result = await createGroup('Beach Trip 2024', 'Summer fun', 'USD', 'u1');

    expect(result.group.name).toBe('Beach Trip 2024');
  });

  it('adds a guest member to a group', async () => {
    const mockGuestMember = {
      id: 'm2',
      group_id: 'g1',
      user_id: null,
      guest_name: 'Sarah',
      role: 'member',
      joined_at: '2026-08-30T00:00:00Z',
    };

    mockState = { data: mockGuestMember, error: null };

    const result = await addGroupMember('g1', { guestName: 'Sarah' });

    expect(result.guest_name).toBe('Sarah');
    expect(result.role).toBe('member');
  });

  it('adds an expense with equal splits', async () => {
    const mockExpense = {
      id: 'e1',
      group_id: 'g1',
      created_by: 'u1',
      paid_by_member_id: 'm1',
      description: 'Groceries',
      amount: 60,
      currency: 'USD',
      category: 'Food',
      split_type: 'equal',
      receipt_url: null,
      is_recurring: false,
      recurrence_period: null,
      date: '2026-08-30T00:00:00Z',
      created_at: '2026-08-30T00:00:00Z',
    };

    mockState = { data: mockExpense, error: null };

    const result = await addExpense('g1', 'u1', {
      paidByMemberId: 'm1',
      description: 'Groceries',
      amount: 60,
      splitType: 'equal',
      selectedMemberIds: ['m1', 'm2'],
    });

    expect(result.amount).toBe(60);
    expect(result.description).toBe('Groceries');
  });

  it('records a settlement payment', async () => {
    const mockSettlement = {
      id: 'set1',
      group_id: 'g1',
      payer_member_id: 'm2',
      payee_member_id: 'm1',
      amount: 30,
      currency: 'USD',
      notes: 'Paid back via Venmo',
      date: '2026-08-30T00:00:00Z',
      created_at: '2026-08-30T00:00:00Z',
    };

    mockState = { data: mockSettlement, error: null };

    const result = await recordSettlement('g1', 'm2', 'm1', 30, 'USD', 'Paid back via Venmo');

    expect(result.amount).toBe(30);
    expect(result.payer_member_id).toBe('m2');
    expect(result.payee_member_id).toBe('m1');
  });
});
