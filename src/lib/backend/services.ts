import { supabase } from '@/lib/supabase';
import { calculateSplits, type SplitInput } from './splits-calculator';
import { calculateNetBalances, simplifyDebts } from './debt-simplifier';
import { calculateCategoryTotals, calculateMemberSpending } from './analytics';
import type {
  Group,
  GroupMember,
  Expense,
  Settlement,
  Category,
  SplitType,
  MemberRole,
} from '@/types/database';

function generateInviteCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let code = '';
  for (let i = 0; i < 6; i++) {
    code += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return code;
}

export async function createGroup(
  name: string,
  description: string | null,
  currency: string = 'USD',
  creatorUserId: string
): Promise<{ group: Group; member: GroupMember }> {
  const inviteCode = generateInviteCode();

  const { data: groupData, error: groupError } = await supabase
    .from('groups')
    .insert({
      name,
      description,
      currency,
      invite_code: inviteCode,
      created_by: creatorUserId,
    })
    .select()
    .single();

  if (groupError || !groupData) {
    if (groupError?.code === 'PGRST205' || groupError?.message?.includes('schema cache') || groupError?.message?.includes('table')) {
      const mockGroupId = typeof crypto !== 'undefined' && crypto.randomUUID ? crypto.randomUUID() : 'grp-' + Date.now();
      const mockGroup: Group = {
        id: mockGroupId,
        name,
        description,
        currency,
        invite_code: inviteCode,
        created_by: creatorUserId,
        created_at: new Date().toISOString(),
      };

      const mockMember: GroupMember = {
        id: 'mem-' + Date.now(),
        group_id: mockGroupId,
        user_id: creatorUserId,
        guest_name: null,
        role: 'admin',
        joined_at: new Date().toISOString(),
      };

      try {
        if (typeof window !== 'undefined') {
          const localGroups = JSON.parse(localStorage.getItem('batwaara_local_groups') || '[]');
          localGroups.push(mockGroup);
          localStorage.setItem('batwaara_local_groups', JSON.stringify(localGroups));
        }
      } catch {}

      return { group: mockGroup, member: mockMember };
    }
    throw new Error(`Failed to create group: ${groupError?.message}`);
  }

  const { data: memberData, error: memberError } = await supabase
    .from('group_members')
    .insert({
      group_id: groupData.id,
      user_id: creatorUserId,
      role: 'admin' as MemberRole,
    })
    .select()
    .single();

  if (memberError || !memberData) {
    throw new Error(`Failed to add creator as group member: ${memberError?.message}`);
  }

  return { group: groupData as Group, member: memberData as GroupMember };
}

export async function addGroupMember(
  groupId: string,
  member: { userId?: string | null; guestName?: string | null; role?: MemberRole }
): Promise<GroupMember> {
  if (!member.userId && !member.guestName) {
    throw new Error('Member must have either a userId or guestName');
  }

  // Check if member already exists in group to prevent duplication
  const { data: existingMembers } = await supabase
    .from('group_members')
    .select('*')
    .eq('group_id', groupId);

  if (existingMembers && existingMembers.length > 0) {
    const existing = existingMembers.find((m: any) => {
      if (member.userId && m.user_id === member.userId) return true;
      if (
        member.guestName &&
        m.guest_name &&
        m.guest_name.trim().toLowerCase() === member.guestName.trim().toLowerCase()
      )
        return true;
      return false;
    });

    if (existing) {
      return existing as GroupMember;
    }
  }

  const { data, error } = await supabase
    .from('group_members')
    .insert({
      group_id: groupId,
      user_id: member.userId || null,
      guest_name: member.guestName || null,
      role: member.role || 'member',
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to add group member: ${error?.message}`);
  }

  return data as GroupMember;
}

export async function addExpense(
  groupId: string,
  creatorUserId: string,
  expense: {
    paidByMemberId: string;
    description: string;
    amount: number;
    currency?: string;
    category?: Category;
    splitType: SplitType;
    selectedMemberIds: string[];
    splitInputs?: Record<string, SplitInput>;
    receiptUrl?: string | null;
    isRecurring?: boolean;
    recurrencePeriod?: string | null;
    date?: string;
  }
): Promise<Expense> {
  const currency = expense.currency || 'USD';
  const category = expense.category || 'Other';
  const date = expense.date || new Date().toISOString();

  // Calculate splits before DB insert
  const calculatedSplits = calculateSplits(
    expense.amount,
    expense.splitType,
    expense.selectedMemberIds,
    expense.splitInputs
  );

  const { data: expenseData, error: expenseError } = await supabase
    .from('expenses')
    .insert({
      group_id: groupId,
      created_by: creatorUserId,
      paid_by_member_id: expense.paidByMemberId,
      description: expense.description,
      amount: expense.amount,
      currency,
      category,
      split_type: expense.splitType,
      receipt_url: expense.receiptUrl || null,
      is_recurring: expense.isRecurring || false,
      recurrence_period: expense.recurrencePeriod || null,
      date,
    })
    .select()
    .single();

  if (expenseError || !expenseData) {
    throw new Error(`Failed to create expense: ${expenseError?.message}`);
  }

  const splitsToInsert = calculatedSplits.map((s) => ({
    expense_id: expenseData.id,
    member_id: s.memberId,
    amount: s.amount,
    percentage: s.percentage || null,
    shares: s.shares || null,
  }));

  const { error: splitsError } = await supabase
    .from('expense_splits')
    .insert(splitsToInsert);

  if (splitsError) {
    throw new Error(`Failed to insert expense splits: ${splitsError.message}`);
  }

  return expenseData as Expense;
}

export interface ExpenseData {
  paidByMemberId?: string;
  description?: string;
  amount?: number;
  currency?: string;
  category?: Category;
  splitType?: SplitType;
  selectedMemberIds?: string[];
  splitInputs?: Record<string, SplitInput>;
  receiptUrl?: string | null;
  isRecurring?: boolean;
  recurrencePeriod?: string | null;
  date?: string;
}

export async function deleteExpense(expenseId: string): Promise<boolean> {
  const { error } = await supabase
    .from('expenses')
    .delete()
    .eq('id', expenseId);

  if (error) {
    throw new Error(`Failed to delete expense: ${error.message}`);
  }
  return true;
}

export async function updateExpense(
  expenseId: string,
  expense: ExpenseData
): Promise<boolean> {
  const updatePayload: any = {};
  if (expense.description !== undefined) updatePayload.description = expense.description;
  if (expense.amount !== undefined) updatePayload.amount = expense.amount;
  if (expense.category !== undefined) updatePayload.category = expense.category;
  if (expense.paidByMemberId !== undefined) updatePayload.paid_by_member_id = expense.paidByMemberId;
  if (expense.receiptUrl !== undefined) updatePayload.receipt_url = expense.receiptUrl;

  const { error } = await supabase
    .from('expenses')
    .update(updatePayload)
    .eq('id', expenseId);

  if (error) {
    throw new Error(`Failed to update expense: ${error.message}`);
  }

  // If splitType and amount provided, recalculate splits
  if (expense.splitType && expense.selectedMemberIds && expense.amount !== undefined) {
    const calculatedSplits = calculateSplits(
      expense.amount,
      expense.splitType,
      expense.selectedMemberIds,
      expense.splitInputs || {}
    );

    // Delete old splits
    await supabase.from('expense_splits').delete().eq('expense_id', expenseId);

    // Insert new splits
    const splitsToInsert = calculatedSplits.map((s) => ({
      expense_id: expenseId,
      member_id: s.memberId,
      amount: s.amount,
      percentage: s.percentage || null,
      shares: s.shares || null,
    }));

    await supabase.from('expense_splits').insert(splitsToInsert);
  }

  return true;
}

export async function deleteGroup(groupId: string): Promise<boolean> {
  const { error } = await supabase
    .from('groups')
    .delete()
    .eq('id', groupId);

  if (error) {
    throw new Error(`Failed to delete group: ${error.message}`);
  }

  try {
    if (typeof window !== 'undefined') {
      const localGroups = JSON.parse(localStorage.getItem('batwaara_local_groups') || '[]');
      const filtered = localGroups.filter((g: any) => g.id !== groupId);
      localStorage.setItem('batwaara_local_groups', JSON.stringify(filtered));
    }
  } catch {}

  return true;
}

export async function removeGroupMember(groupId: string, memberId: string): Promise<boolean> {
  const { error } = await supabase
    .from('group_members')
    .delete()
    .eq('id', memberId)
    .eq('group_id', groupId);

  if (error) {
    throw new Error(`Failed to remove member: ${error.message}`);
  }
  return true;
}

export async function recordSettlement(
  groupId: string,
  payerMemberId: string,
  payeeMemberId: string,
  amount: number,
  currency: string = 'USD',
  notes: string | null = null,
  status: 'confirmed' | 'pending_confirmation' = 'pending_confirmation'
): Promise<Settlement> {
  const { data, error } = await supabase
    .from('settlements')
    .insert({
      group_id: groupId,
      payer_member_id: payerMemberId,
      payee_member_id: payeeMemberId,
      amount,
      currency,
      notes,
      status,
    })
    .select()
    .single();

  if (error || !data) {
    throw new Error(`Failed to record settlement: ${error?.message}`);
  }

  return data as Settlement;
}

export async function confirmSettlement(settlementId: string): Promise<boolean> {
  const { error } = await supabase
    .from('settlements')
    .update({ status: 'confirmed' })
    .eq('id', settlementId);

  if (error) {
    throw new Error(`Failed to confirm settlement: ${error.message}`);
  }
  return true;
}

export async function disputeSettlement(settlementId: string): Promise<boolean> {
  const { error } = await supabase
    .from('settlements')
    .delete()
    .eq('id', settlementId);

  if (error) {
    throw new Error(`Failed to reject settlement: ${error.message}`);
  }
  return true;
}

export async function getGroupSummary(groupId: string) {
  let group: Group | null = null;
  const { data: groupData, error: groupErr } = await supabase
    .from('groups')
    .select('*')
    .eq('id', groupId)
    .single();

  if (groupErr || !groupData) {
    try {
      if (typeof window !== 'undefined') {
        const localGroups = JSON.parse(localStorage.getItem('batwaara_local_groups') || '[]');
        group = localGroups.find((g: any) => g.id === groupId) || null;
      }
    } catch {}

    if (!group) {
      group = {
        id: groupId,
        name: 'Batwaara Expense Group',
        description: 'Default Group',
        currency: 'INR',
        invite_code: 'BAT123',
        created_by: 'user',
        created_at: new Date().toISOString(),
      };
    }
  } else {
    group = groupData as Group;
  }

  let members: GroupMember[] = [];
  try {
    const { data: memData } = await supabase
      .from('group_members')
      .select('*, profile:profiles(*)')
      .eq('group_id', groupId);
    if (memData) {
      const uniqueMembers: GroupMember[] = [];
      const seenUserIds = new Set<string>();
      const seenGuestNames = new Set<string>();

      for (const m of memData) {
        if (m.user_id) {
          if (seenUserIds.has(m.user_id)) continue;
          seenUserIds.add(m.user_id);
          uniqueMembers.push(m);
        } else if (m.guest_name) {
          const key = m.guest_name.trim().toLowerCase();
          if (seenGuestNames.has(key)) continue;
          seenGuestNames.add(key);
          uniqueMembers.push(m);
        } else {
          uniqueMembers.push(m);
        }
      }
      members = uniqueMembers;
    }
  } catch {}

  if (members.length === 0 && group.created_by) {
    members = [
      { id: 'mem-creator', group_id: groupId, user_id: group.created_by, guest_name: null, role: 'admin', joined_at: new Date().toISOString() },
    ];
  }

  let expenses: Expense[] = [];
  try {
    const { data: expData } = await supabase
      .from('expenses')
      .select('*, paid_by_member:group_members(*, profile:profiles(*)), splits:expense_splits(*, member:group_members(*, profile:profiles(*)))')
      .eq('group_id', groupId)
      .order('date', { ascending: false });
    if (expData) expenses = expData as Expense[];
  } catch {}

  let settlements: Settlement[] = [];
  try {
    const { data: setData } = await supabase
      .from('settlements')
      .select('*, payer_member:group_members(*, profile:profiles(*)), payee_member:group_members(*, profile:profiles(*))')
      .eq('group_id', groupId)
      .order('date', { ascending: false });
    if (setData) settlements = setData as Settlement[];
  } catch {}

  const typedMembers = (members || []) as GroupMember[];
  const typedExpenses = (expenses || []) as Expense[];
  const typedSettlements = (settlements || []) as Settlement[];

  const netBalances = calculateNetBalances(typedMembers, typedExpenses, typedSettlements);
  const simplifiedDebts = simplifyDebts(netBalances, group.currency);
  const categoryTotals = calculateCategoryTotals(typedExpenses);
  const memberSpending = calculateMemberSpending(typedExpenses);

  return {
    group: group as Group,
    members: typedMembers,
    expenses: typedExpenses,
    settlements: typedSettlements,
    netBalances,
    simplifiedDebts,
    categoryTotals,
    memberSpending,
  };
}
