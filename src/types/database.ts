export type Category =
  | 'Food'
  | 'Transport'
  | 'Lodging'
  | 'Activities'
  | 'Shopping'
  | 'Other';

export type SplitType = 'equal' | 'percentage' | 'exact' | 'shares';

export type MemberRole = 'admin' | 'member';

export interface Profile {
  id: string; // Clerk User ID
  email: string;
  full_name: string | null;
  avatar_url: string | null;
  upi_id?: string | null;
  created_at: string;
}

export interface Group {
  id: string;
  name: string;
  description: string | null;
  currency: string;
  invite_code: string;
  created_by: string;
  created_at: string;
}

export interface GroupMember {
  id: string;
  group_id: string;
  user_id: string | null;
  guest_name: string | null;
  upi_id?: string | null;
  role: MemberRole;
  joined_at: string;
  // Joined fields
  profile?: Profile | null;
}

export interface Expense {
  id: string;
  group_id: string;
  created_by: string;
  paid_by_member_id: string;
  description: string;
  amount: number;
  currency: string;
  category: Category;
  split_type: SplitType;
  receipt_url: string | null;
  is_recurring: boolean;
  recurrence_period: string | null;
  date: string;
  created_at: string;
  // Joined fields
  paid_by_member?: GroupMember;
  splits?: ExpenseSplit[];
}

export interface ExpenseSplit {
  id: string;
  expense_id: string;
  member_id: string;
  amount: number;
  percentage?: number | null;
  shares?: number | null;
  // Joined fields
  member?: GroupMember;
}

export interface Settlement {
  id: string;
  group_id: string;
  payer_member_id: string;
  payee_member_id: string;
  amount: number;
  currency: string;
  notes: string | null;
  status?: 'confirmed' | 'pending_confirmation' | 'disputed';
  date: string;
  created_at: string;
  // Joined fields
  payer_member?: GroupMember;
  payee_member?: GroupMember;
}

export interface MemberBalance {
  member: GroupMember;
  totalPaid: number;
  totalOwed: number;
  netBalance: number; // positive = owed to member, negative = member owes
}

export interface OptimalTransaction {
  fromMember: GroupMember;
  toMember: GroupMember;
  amount: number;
  currency: string;
}
