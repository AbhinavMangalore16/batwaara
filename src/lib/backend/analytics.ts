import type { Expense, Category } from '@/types/database';

export interface CategorySummary {
  category: Category;
  amount: number;
  percentage: number;
  count: number;
}

export interface MemberSpendingSummary {
  memberId: string;
  memberName: string;
  totalPaid: number;
  totalShare: number;
}

export interface ExpenseFilters {
  category?: Category | 'All';
  paidByMemberId?: string;
  searchQuery?: string;
  startDate?: string;
  endDate?: string;
}

export function calculateCategoryTotals(expenses: Expense[]): CategorySummary[] {
  const totalSpent = expenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const map = new Map<Category, { amount: number; count: number }>();

  const categories: Category[] = [
    'Food',
    'Transport',
    'Lodging',
    'Activities',
    'Shopping',
    'Other',
  ];

  categories.forEach((cat) => map.set(cat, { amount: 0, count: 0 }));

  expenses.forEach((e) => {
    const current = map.get(e.category) || { amount: 0, count: 0 };
    current.amount += Number(e.amount);
    current.count += 1;
    map.set(e.category, current);
  });

  return categories
    .map((category) => {
      const data = map.get(category) || { amount: 0, count: 0 };
      const amount = Math.round(data.amount * 100) / 100;
      const percentage =
        totalSpent > 0 ? Math.round((amount / totalSpent) * 10000) / 100 : 0;
      return {
        category,
        amount,
        percentage,
        count: data.count,
      };
    })
    .sort((a, b) => b.amount - a.amount);
}

export function calculateMemberSpending(expenses: Expense[]): MemberSpendingSummary[] {
  const memberMap = new Map<
    string,
    { memberName: string; totalPaid: number; totalShare: number }
  >();

  expenses.forEach((e) => {
    const payerId = e.paid_by_member_id;
    const payerName =
      e.paid_by_member?.profile?.full_name ||
      e.paid_by_member?.guest_name ||
      'Member';

    const currentPayer = memberMap.get(payerId) || {
      memberName: payerName,
      totalPaid: 0,
      totalShare: 0,
    };
    currentPayer.totalPaid += Number(e.amount);
    memberMap.set(payerId, currentPayer);

    if (e.splits) {
      e.splits.forEach((split) => {
        const splitMemberId = split.member_id;
        const splitMemberName =
          split.member?.profile?.full_name ||
          split.member?.guest_name ||
          'Member';

        const currentSplitter = memberMap.get(splitMemberId) || {
          memberName: splitMemberName,
          totalPaid: 0,
          totalShare: 0,
        };
        currentSplitter.totalShare += Number(split.amount);
        memberMap.set(splitMemberId, currentSplitter);
      });
    }
  });

  return Array.from(memberMap.entries()).map(([memberId, data]) => ({
    memberId,
    memberName: data.memberName,
    totalPaid: Math.round(data.totalPaid * 100) / 100,
    totalShare: Math.round(data.totalShare * 100) / 100,
  }));
}

export function filterExpenses(
  expenses: Expense[],
  filters: ExpenseFilters
): Expense[] {
  return expenses.filter((e) => {
    if (filters.category && filters.category !== 'All' && e.category !== filters.category) {
      return false;
    }
    if (filters.paidByMemberId && e.paid_by_member_id !== filters.paidByMemberId) {
      return false;
    }
    if (filters.searchQuery && filters.searchQuery.trim() !== '') {
      const query = filters.searchQuery.toLowerCase().trim();
      const matchDesc = e.description.toLowerCase().includes(query);
      const matchPayer =
        e.paid_by_member?.guest_name?.toLowerCase().includes(query) ||
        e.paid_by_member?.profile?.full_name?.toLowerCase().includes(query);
      if (!matchDesc && !matchPayer) return false;
    }
    if (filters.startDate && new Date(e.date) < new Date(filters.startDate)) {
      return false;
    }
    if (filters.endDate && new Date(e.date) > new Date(filters.endDate)) {
      return false;
    }
    return true;
  });
}
