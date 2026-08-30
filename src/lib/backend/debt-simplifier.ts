import type {
  GroupMember,
  Expense,
  Settlement,
  MemberBalance,
  OptimalTransaction,
} from '@/types/database';

export function calculateNetBalances(
  members: GroupMember[],
  expenses: Expense[],
  settlements: Settlement[] = []
): MemberBalance[] {
  const balanceMap = new Map<string, { totalPaid: number; totalOwed: number }>();

  members.forEach((m) => {
    balanceMap.set(m.id, { totalPaid: 0, totalOwed: 0 });
  });

  // Calculate expense payments & splits
  expenses.forEach((expense) => {
    const paidBy = expense.paid_by_member_id;
    const currentPayer = balanceMap.get(paidBy) || { totalPaid: 0, totalOwed: 0 };
    currentPayer.totalPaid += Number(expense.amount);
    balanceMap.set(paidBy, currentPayer);

    if (expense.splits) {
      expense.splits.forEach((split) => {
        const currentSplitter = balanceMap.get(split.member_id) || { totalPaid: 0, totalOwed: 0 };
        currentSplitter.totalOwed += Number(split.amount);
        balanceMap.set(split.member_id, currentSplitter);
      });
    }
  });

  // Calculate settlement payments
  settlements.forEach((settlement) => {
    if (settlement.status && settlement.status !== 'confirmed') {
      return;
    }

    const payer = balanceMap.get(settlement.payer_member_id) || { totalPaid: 0, totalOwed: 0 };
    payer.totalPaid += Number(settlement.amount);
    balanceMap.set(settlement.payer_member_id, payer);

    const payee = balanceMap.get(settlement.payee_member_id) || { totalPaid: 0, totalOwed: 0 };
    payee.totalOwed += Number(settlement.amount);
    balanceMap.set(settlement.payee_member_id, payee);
  });

  return members.map((member) => {
    const stats = balanceMap.get(member.id) || { totalPaid: 0, totalOwed: 0 };
    const totalPaid = Math.round(stats.totalPaid * 100) / 100;
    const totalOwed = Math.round(stats.totalOwed * 100) / 100;
    const netBalance = Math.round((totalPaid - totalOwed) * 100) / 100;

    return {
      member,
      totalPaid,
      totalOwed,
      netBalance,
    };
  });
}

export function simplifyDebts(
  balances: MemberBalance[],
  currency: string = 'USD'
): OptimalTransaction[] {
  const debtors: { member: GroupMember; amount: number }[] = [];
  const creditors: { member: GroupMember; amount: number }[] = [];

  balances.forEach((b) => {
    const roundedNet = Math.round(b.netBalance * 100) / 100;
    if (roundedNet < -0.005) {
      debtors.push({ member: b.member, amount: roundedNet }); // negative
    } else if (roundedNet > 0.005) {
      creditors.push({ member: b.member, amount: roundedNet }); // positive
    }
  });

  // Sort debtors by most negative (greatest debt first)
  debtors.sort((a, b) => a.amount - b.amount);
  // Sort creditors by most positive (greatest credit first)
  creditors.sort((a, b) => b.amount - a.amount);

  const transactions: OptimalTransaction[] = [];

  let i = 0;
  let j = 0;

  while (i < debtors.length && j < creditors.length) {
    const debtor = debtors[i];
    const creditor = creditors[j];

    const oweAmount = Math.abs(debtor.amount);
    const creditAmount = creditor.amount;

    const settlementAmount = Math.min(oweAmount, creditAmount);
    const roundedAmount = Math.round(settlementAmount * 100) / 100;

    if (roundedAmount > 0) {
      transactions.push({
        fromMember: debtor.member,
        toMember: creditor.member,
        amount: roundedAmount,
        currency,
      });
    }

    debtor.amount = Math.round((debtor.amount + roundedAmount) * 100) / 100;
    creditor.amount = Math.round((creditor.amount - roundedAmount) * 100) / 100;

    if (Math.abs(debtor.amount) < 0.005) {
      i++;
    }
    if (Math.abs(creditor.amount) < 0.005) {
      j++;
    }
  }

  return transactions;
}
