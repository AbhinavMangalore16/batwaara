import { describe, it, expect } from 'vitest';
import { calculateNetBalances, simplifyDebts } from '../debt-simplifier';
import type { GroupMember, Expense, Settlement } from '@/types/database';

describe('Debt Simplification & Balance Engine', () => {
  const alice: GroupMember = { id: 'm1', group_id: 'g1', user_id: 'u1', guest_name: 'Alice', role: 'admin', joined_at: '' };
  const bob: GroupMember = { id: 'm2', group_id: 'g1', user_id: 'u2', guest_name: 'Bob', role: 'member', joined_at: '' };
  const charlie: GroupMember = { id: 'm3', group_id: 'g1', user_id: 'u3', guest_name: 'Charlie', role: 'member', joined_at: '' };
  const david: GroupMember = { id: 'm4', group_id: 'g1', user_id: 'u4', guest_name: 'David', role: 'member', joined_at: '' };

  const members = [alice, bob, charlie, david];

  it('calculates net balances correctly for a simple dinner expense', () => {
    // Alice pays $100 for dinner, split 4 ways ($25 each)
    const expense: Expense = {
      id: 'e1',
      group_id: 'g1',
      created_by: 'u1',
      paid_by_member_id: 'm1',
      description: 'Dinner',
      amount: 100,
      currency: 'USD',
      category: 'Food',
      split_type: 'equal',
      receipt_url: null,
      is_recurring: false,
      recurrence_period: null,
      date: '',
      created_at: '',
      splits: [
        { id: 's1', expense_id: 'e1', member_id: 'm1', amount: 25 },
        { id: 's2', expense_id: 'e1', member_id: 'm2', amount: 25 },
        { id: 's3', expense_id: 'e1', member_id: 'm3', amount: 25 },
        { id: 's4', expense_id: 'e1', member_id: 'm4', amount: 25 },
      ],
    };

    const balances = calculateNetBalances(members, [expense], []);

    const aliceBal = balances.find((b) => b.member.id === 'm1');
    const bobBal = balances.find((b) => b.member.id === 'm2');

    expect(aliceBal?.netBalance).toBe(75); // Paid 100, owes 25 => +75
    expect(bobBal?.netBalance).toBe(-25); // Paid 0, owes 25 => -25
  });

  it('simplifies circular debt A->B->C down to 1 minimum payment (A->C)', () => {
    // Scenario:
    // Net Balances: Alice: +40, Bob: 0, Charlie: -40
    const balances = [
      { member: alice, totalPaid: 100, totalOwed: 60, netBalance: 40 }, // Creditor (+40)
      { member: bob, totalPaid: 50, totalOwed: 50, netBalance: 0 },
      { member: charlie, totalPaid: 0, totalOwed: 40, netBalance: -40 }, // Debtor (-40)
    ];

    const transactions = simplifyDebts(balances, 'USD');

    expect(transactions).toHaveLength(1);
    expect(transactions[0].fromMember.guest_name).toBe('Charlie');
    expect(transactions[0].toMember.guest_name).toBe('Alice');
    expect(transactions[0].amount).toBe(40);
  });

  it('optimizes 4-member multi-debt network down to minimum transactions', () => {
    // Balances:
    // Alice: +60
    // Bob: +20
    // Charlie: -30
    // David: -50
    const balances = [
      { member: alice, totalPaid: 100, totalOwed: 40, netBalance: 60 },
      { member: bob, totalPaid: 50, totalOwed: 30, netBalance: 20 },
      { member: charlie, totalPaid: 0, totalOwed: 30, netBalance: -30 },
      { member: david, totalPaid: 0, totalOwed: 50, netBalance: -50 },
    ];

    const transactions = simplifyDebts(balances, 'USD');

    expect(transactions).toHaveLength(3);
    // 1. David (-50) pays Alice (+60) $50 (Alice balance: +10)
    // 2. Charlie (-30) pays Alice (+10) $10 (Charlie balance: -20, Alice balance: 0)
    // 3. Charlie (-20) pays Bob (+20) $20 (Charlie balance: 0, Bob balance: 0)
    const totalSettled = transactions.reduce((sum, t) => sum + t.amount, 0);
    expect(totalSettled).toBe(80); // 60 + 20 = 80 total
  });

  it('takes settlements into account when computing net balances', () => {
    const expense: Expense = {
      id: 'e1',
      group_id: 'g1',
      created_by: 'u1',
      paid_by_member_id: 'm1',
      description: 'Groceries',
      amount: 100,
      currency: 'USD',
      category: 'Food',
      split_type: 'equal',
      receipt_url: null,
      is_recurring: false,
      recurrence_period: null,
      date: '',
      created_at: '',
      splits: [
        { id: 's1', expense_id: 'e1', member_id: 'm1', amount: 50 },
        { id: 's2', expense_id: 'e1', member_id: 'm2', amount: 50 },
      ],
    };

    // Bob settles $30 with Alice
    const settlement: Settlement = {
      id: 'set1',
      group_id: 'g1',
      payer_member_id: 'm2',
      payee_member_id: 'm1',
      amount: 30,
      currency: 'USD',
      notes: 'Partial payback',
      date: '',
      created_at: '',
    };

    const balances = calculateNetBalances([alice, bob], [expense], [settlement]);

    const aliceBal = balances.find((b) => b.member.id === 'm1');
    const bobBal = balances.find((b) => b.member.id === 'm2');

    expect(aliceBal?.netBalance).toBe(20); // Original +50, received 30 => +20 left
    expect(bobBal?.netBalance).toBe(-20); // Original -50, paid 30 => -20 left
  });
});
