'use client';

import { use, useEffect, useState, useRef } from 'react';
import { useUser } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import confetti from 'canvas-confetti';
import { HashLoader } from 'react-spinners';
import {
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import {
  ArrowLeft,
  Share2,
  Check,
  Sparkles,
  Plus,
  Receipt,
  Search,
  Filter,
  Download,
  DollarSign,
  TrendingUp,
  Users,
  CheckCircle2,
  X,
  UploadCloud,
  FileText,
  Calendar,
  Tag,
  Percent,
  Calculator,
  ArrowRightLeft,
  Zap,
  ExternalLink,
  QrCode,
  Copy,
  Smartphone,
  UserPlus,
  Mic,
  MicOff,
  Trash2,
  Edit2,
  Settings,
} from 'lucide-react';
import {
  buildUpiUrl,
  buildPaytmUpiUrl,
  buildPhonePeUpiUrl,
  buildGPayUpiUrl,
  generateUpiQrCodeUrl,
} from '@/lib/upi';
import { supabase } from '@/lib/supabase';
import { uploadReceiptToSupabaseStorage } from '@/lib/backend/receipt-storage';
import {
  getGroupSummary,
  addExpense,
  deleteExpense,
  updateExpense,
  deleteGroup,
  removeGroupMember,
  recordSettlement,
  confirmSettlement,
  disputeSettlement,
  addGroupMember,
} from '@/lib/backend/services';
import { filterExpenses } from '@/lib/backend/analytics';
import type {
  Group,
  GroupMember,
  Profile,
  Expense,
  Settlement,
  MemberBalance,
  OptimalTransaction,
  Category,
  SplitType,
} from '@/types/database';

const CATEGORY_ICONS: Record<Category, string> = {
  Food: '🍔',
  Transport: '🚗',
  Lodging: '🏨',
  Activities: '🎟️',
  Shopping: '🛍️',
  Other: '📦',
};

const CHART_COLORS = ['#10b981', '#06b6d4', '#3b82f6', '#8b5cf6', '#ec4899', '#f59e0b'];

export default function GroupDetailsPage({ params }: { params: Promise<{ groupId: string }> }) {
  const { groupId } = use(params);
  const { user } = useUser();
  const router = useRouter();

  const [activeTab, setActiveTab] = useState<'expenses' | 'balances' | 'settle' | 'analytics' | 'members'>('expenses');
  const [loading, setLoading] = useState(true);

  // Group Data State
  const [group, setGroup] = useState<Group | null>(null);
  const [members, setMembers] = useState<GroupMember[]>([]);
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [settlements, setSettlements] = useState<Settlement[]>([]);
  const [netBalances, setNetBalances] = useState<MemberBalance[]>([]);
  const [simplifiedDebts, setSimplifiedDebts] = useState<OptimalTransaction[]>([]);
  const [categoryTotals, setCategoryTotals] = useState<any[]>([]);
  const [memberSpending, setMemberSpending] = useState<any[]>([]);

  // AI Insights State
  const [aiSummary, setAiSummary] = useState<string | null>(null);
  const [aiTokens, setAiTokens] = useState<any | null>(null);
  const [loadingAi, setLoadingAi] = useState(false);

  // Copy Invite Code state
  const [copiedInvite, setCopiedInvite] = useState(false);

  // Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<Category | 'All'>('All');
  const [selectedPayer, setSelectedPayer] = useState<string>('All');

  // Add Expense Modal State
  const [isExpenseModalOpen, setIsExpenseModalOpen] = useState(false);
  const [expenseDesc, setExpenseDesc] = useState('');
  const [expenseAmount, setExpenseAmount] = useState('');
  const [expenseCategory, setExpenseCategory] = useState<Category>('Food');
  const [expensePaidBy, setExpensePaidBy] = useState('');
  const [splitType, setSplitType] = useState<SplitType>('equal');
  const [selectedMembers, setSelectedMembers] = useState<string[]>([]);
  const [splitInputs, setSplitInputs] = useState<Record<string, { percentage?: number; exactAmount?: number; shares?: number }>>({});
  const [receiptUrl, setReceiptUrl] = useState('');
  const [isScanningOCR, setIsScanningOCR] = useState(false);
  const [isSubmittingExpense, setIsSubmittingExpense] = useState(false);

  // Receipt Modal View State
  const [viewReceiptUrl, setViewReceiptUrl] = useState<string | null>(null);

  // Add Member Modal State
  const [isAddMemberOpen, setIsAddMemberOpen] = useState(false);
  const [newGuestName, setNewGuestName] = useState('');

  // Voice & Natural Language AI Logging State
  const [voicePromptText, setVoicePromptText] = useState('');
  const [isListeningVoice, setIsListeningVoice] = useState(false);
  const [isParsingVoiceAI, setIsParsingVoiceAI] = useState(false);
  const recognitionRef = useRef<any>(null);

  function handleToggleVoiceListening() {
    if (isListeningVoice && recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch { }
      setIsListeningVoice(false);
      return;
    }

    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Web Speech API is not supported in this browser version. You can type directly into the natural language box below!');
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognitionRef.current = recognition;
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';

      recognition.onstart = () => {
        setIsListeningVoice(true);
      };

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((result: any) => result[0])
          .map((result) => result.transcript)
          .join('');
        setVoicePromptText(transcript);
      };

      recognition.onerror = (event: any) => {
        console.warn('Speech recognition notice:', event.error);
        setIsListeningVoice(false);
      };

      recognition.onend = () => {
        setIsListeningVoice(false);
      };

      recognition.start();
    } catch (err: any) {
      console.error('Failed to start speech recognition:', err);
      setIsListeningVoice(false);
    }
  }

  async function handleParseVoiceAI() {
    if (!voicePromptText.trim()) return;
    setIsParsingVoiceAI(true);
    try {
      const allNames = members.map((m) => m.profile?.full_name || m.guest_name || '').filter(Boolean);

      const res = await fetch('/api/ai/parse-voice', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: voicePromptText.trim(), memberNames: allNames }),
      });
      const result = await res.json();
      if (result.success && result.data) {
        if (result.data.amount) setExpenseAmount(String(result.data.amount));
        if (result.data.description) setExpenseDesc(result.data.description);
        if (result.data.category) setExpenseCategory(result.data.category);
        if (result.data.splitType) setSplitType(result.data.splitType);

        // Auto-select mentioned members if specified in voice/natural language prompt!
        if (Array.isArray(result.data.matchedMemberNames) && result.data.matchedMemberNames.length > 0) {
          const matchedIds: string[] = [];
          members.forEach((m) => {
            const name = m.profile?.full_name || m.guest_name || '';
            if (result.data.matchedMemberNames.includes(name)) {
              matchedIds.push(m.id);
            }
          });
          if (matchedIds.length > 0) {
            setSelectedMembers(matchedIds);
          }
        }

        confetti({ particleCount: 60, spread: 50, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      alert(`Failed to parse voice prompt: ${err.message}`);
    } finally {
      setIsParsingVoiceAI(false);
    }
  }

  // Inline Member UPI Editing State
  const [editingUpiMemberId, setEditingUpiMemberId] = useState<string | null>(null);
  const [inlineUpiText, setInlineUpiText] = useState('');

  async function handleSaveMemberUpi(memberId: string) {
    if (!inlineUpiText.trim()) {
      setEditingUpiMemberId(null);
      return;
    }
    try {
      await supabase.from('group_members').update({ upi_id: inlineUpiText.trim() }).eq('id', memberId);
      setEditingUpiMemberId(null);
      await loadGroupData();
    } catch (err: any) {
      console.error('Failed to save UPI ID:', err);
    }
  }

  // Add Member Modal Options & Claim Profile State
  const [addMemberTab, setAddMemberTab] = useState<'guest' | 'registered'>('registered');
  const [userSearchQuery, setUserSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Profile[]>([]);
  const [isSearchingUsers, setIsSearchingUsers] = useState(false);
  const [newGuestUpi, setNewGuestUpi] = useState('');
  const [unclaimedProfile, setUnclaimedProfile] = useState<GroupMember | null>(null);
  const [claimingProfile, setClaimingProfile] = useState(false);

  // Settlement Recording State
  const [settlingTransaction, setSettlingTransaction] = useState<OptimalTransaction | null>(null);
  const [payeeUpiId, setPayeeUpiId] = useState('');
  const [showQrCode, setShowQrCode] = useState(false);
  const [copiedUpi, setCopiedUpi] = useState(false);
  const [isSubmittingSettlement, setIsSubmittingSettlement] = useState(false);

  useEffect(() => {
    loadGroupData(true);
  }, [groupId, user?.id]);

  async function handleSearchUsers(query: string) {
    setUserSearchQuery(query);
    const cleanQuery = query.trim();
    if (!cleanQuery || cleanQuery.length < 1) {
      setSearchResults([]);
      return;
    }
    setIsSearchingUsers(true);
    try {
      // Exclude users who are ALREADY members in this group
      const existingMemberUserIds = new Set(
        members.map((m) => m.user_id).filter(Boolean) as string[]
      );

      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .or(`full_name.ilike.%${cleanQuery}%,email.ilike.%${cleanQuery}%`)
        .limit(10);

      if (!error && data) {
        // Exclude: 1) Currently logged-in self user, 2) Existing group members
        const filtered = (data as Profile[]).filter(
          (p) => p.id !== user?.id && !existingMemberUserIds.has(p.id)
        );
        setSearchResults(filtered);
      } else {
        setSearchResults([]);
      }
    } catch (err) {
      console.error('Failed to search profiles:', err);
    } finally {
      setIsSearchingUsers(false);
    }
  }

  async function handleAddRegisteredUser(userId: string) {
    if (!group) return;

    if (user && userId === user.id) {
      alert('You are already a member of this group!');
      return;
    }
    if (members.some((m) => m.user_id === userId)) {
      alert('This user is already a member of this group!');
      return;
    }

    try {
      await addGroupMember(group.id, { userId, role: 'member' });
      setIsAddMemberOpen(false);
      setUserSearchQuery('');
      setSearchResults([]);
      await loadGroupData(false);
    } catch (err: any) {
      alert(`Failed to add member: ${err.message}`);
    }
  }

  async function handleClaimProfile(guestMemberId: string) {
    if (!user) return;
    setClaimingProfile(true);
    try {
      await supabase
        .from('group_members')
        .update({ user_id: user.id })
        .eq('id', guestMemberId);

      setUnclaimedProfile(null);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      await loadGroupData(false);
    } catch (err: any) {
      alert(`Failed to claim profile: ${err.message}`);
    } finally {
      setClaimingProfile(false);
    }
  }

  async function loadGroupData(isInitial = false) {
    if (isInitial) setLoading(true);
    try {
      // Auto-sync profile into Supabase
      if (user) {
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || `${user.id}@clerk.user`,
            full_name: user.fullName || user.firstName || 'User',
            avatar_url: user.imageUrl || null,
          });
        } catch { }
      }

      const summary = await getGroupSummary(groupId);
      setGroup(summary.group);
      setMembers(summary.members);
      setExpenses(summary.expenses);
      setSettlements(summary.settlements);
      setNetBalances(summary.netBalances);
      setSimplifiedDebts(summary.simplifiedDebts);
      setCategoryTotals(summary.categoryTotals);
      setMemberSpending(summary.memberSpending);

      if (summary.members.length > 0 && selectedMembers.length === 0) {
        setExpensePaidBy(summary.members[0].id);
        setSelectedMembers(summary.members.map((m) => m.id));
      }

      if (user && summary.members.length > 0) {
        const userFullName = (user.fullName || '').toLowerCase();
        const userFirstName = (user.firstName || '').toLowerCase();
        const userEmailName = (user.primaryEmailAddress?.emailAddress || '').split('@')[0].toLowerCase();

        const match = summary.members.find((m) => {
          if (m.user_id) return false;
          const guestNameLower = (m.guest_name || '').toLowerCase();
          if (!guestNameLower || guestNameLower.length < 2) return false;

          return (
            (userFullName && userFullName.includes(guestNameLower)) ||
            (userFirstName && userFirstName === guestNameLower) ||
            (userEmailName && userEmailName.includes(guestNameLower))
          );
        });

        setUnclaimedProfile(match || null);
      }
    } catch (err: any) {
      console.error('Failed to fetch group summary:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }

  async function generateAIInsights() {
    if (!group) return;
    setLoadingAi(true);
    try {
      const res = await fetch('/api/ai/insights', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ groupId: group.id }),
      });
      const json = await res.json();
      if (json.success) {
        setAiSummary(json.summary);
        setAiTokens(json.tokensUsed);
      }
    } catch (err) {
      console.error('Error calling AI insights API:', err);
    } finally {
      setLoadingAi(false);
    }
  }

  // Handle OCR Receipt Scanning
  async function handleReceiptOCRScan(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningOCR(true);
    try {
      // 1. Upload receipt binary image to Supabase Storage bucket 'receipts'
      const uploadedCdnUrl = await uploadReceiptToSupabaseStorage(file, file.name);
      setReceiptUrl(uploadedCdnUrl);

      // 2. Read base64 for OCR scanning engine
      const reader = new FileReader();
      reader.onloadend = async () => {
        const base64Data = reader.result as string;

        // Call OCR API Endpoint
        const res = await fetch('/api/ocr/scan', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageUrl: base64Data }),
        });

        const result = await res.json();
        if (result.success && result.data) {
          if (result.data.amount) setExpenseAmount(String(result.data.amount));
          if (result.data.description) setExpenseDesc(result.data.description);
          if (result.data.category) setExpenseCategory(result.data.category);
        }
      };
      reader.readAsDataURL(file);
    } catch (err: any) {
      alert(`OCR Scanning error: ${err.message}`);
    } finally {
      setIsScanningOCR(false);
    }
  }

  // Handle Add Expense Form Submit
  async function handleAddExpenseSubmit(e: React.FormEvent) {
    e.preventDefault();
    const amountNum = parseFloat(expenseAmount);
    if (!group || !user || isNaN(amountNum) || amountNum <= 0 || !expenseDesc.trim()) return;

    if (selectedMembers.length === 0) {
      alert('Please select at least one member to split this expense with.');
      return;
    }

    // Sanitize splitInputs for percentage, exact, and shares
    const sanitizedInputs: Record<string, { percentage?: number; exactAmount?: number; shares?: number }> = {};
    selectedMembers.forEach((id) => {
      const inp = splitInputs[id] || {};
      sanitizedInputs[id] = {
        percentage: inp.percentage,
        exactAmount: inp.exactAmount,
        shares: inp.shares ?? (splitType === 'shares' ? 1 : undefined),
      };
    });

    setIsSubmittingExpense(true);
    try {
      await addExpense(group.id, user.id, {
        paidByMemberId: expensePaidBy,
        description: expenseDesc.trim(),
        amount: amountNum,
        currency: group.currency,
        category: expenseCategory,
        splitType,
        selectedMemberIds: selectedMembers,
        splitInputs: sanitizedInputs as any,
        receiptUrl: receiptUrl || null,
      });

      setIsExpenseModalOpen(false);
      setExpenseDesc('');
      setExpenseAmount('');
      setReceiptUrl('');
      setSplitInputs({});
      await loadGroupData();
    } catch (err: any) {
      alert(`Failed to add expense: ${err.message}`);
    } finally {
      setIsSubmittingExpense(false);
    }
  }

  // Handle Settle Up Payment Submit
  async function handleConfirmSettlement() {
    if (!settlingTransaction || !group) return;

    setIsSubmittingSettlement(true);
    try {
      const isSelfPayee = user && settlingTransaction.toMember.user_id === user.id;
      const initialStatus = isSelfPayee ? 'confirmed' : 'pending_confirmation';

      await recordSettlement(
        group.id,
        settlingTransaction.fromMember.id,
        settlingTransaction.toMember.id,
        settlingTransaction.amount,
        group.currency,
        'Direct settlement via Batwaara',
        initialStatus
      );

      setSettlingTransaction(null);

      // Trigger Confetti Celebration!
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
      });

      await loadGroupData(false);
    } catch (err: any) {
      alert(`Failed to record settlement: ${err.message}`);
    } finally {
      setIsSubmittingSettlement(false);
    }
  }

  async function handleConfirmPendingSettlement(settlementId: string) {
    try {
      await confirmSettlement(settlementId);
      confetti({ particleCount: 100, spread: 70, origin: { y: 0.5 } });
      await loadGroupData(false);
    } catch (err: any) {
      alert(`Failed to confirm settlement: ${err.message}`);
    }
  }

  async function handleDisputePendingSettlement(settlementId: string) {
    try {
      await disputeSettlement(settlementId);
      await loadGroupData(false);
    } catch (err: any) {
      alert(`Failed to decline settlement: ${err.message}`);
    }
  }

  // Handle Add Guest Member
  async function handleAddGuestMember(e: React.FormEvent) {
    e.preventDefault();
    if (!group || !newGuestName.trim()) return;

    try {
      await addGroupMember(group.id, { guestName: newGuestName.trim() });
      setNewGuestName('');
      setIsAddMemberOpen(false);
      await loadGroupData();
    } catch (err: any) {
      alert(`Failed to add member: ${err.message}`);
    }
  }

  // Handle Delete Expense
  async function handleDeleteExpense(expenseId: string, description: string) {
    if (!confirm(`Are you sure you want to delete "${description}"? This action cannot be undone.`)) {
      return;
    }
    try {
      await deleteExpense(expenseId);
      await loadGroupData(false);
    } catch (err: any) {
      alert(`Failed to delete expense: ${err.message}`);
    }
  }

  // Handle Delete Group
  async function handleDeleteGroup() {
    if (!group) return;
    if (!confirm(`Are you sure you want to delete "${group.name}"? All expenses and group balances will be permanently deleted.`)) {
      return;
    }
    try {
      await deleteGroup(group.id);
      router.push('/dashboard');
    } catch (err: any) {
      alert(`Failed to delete group: ${err.message}`);
    }
  }

  // Handle Remove Member
  async function handleRemoveMember(memberId: string, memberName: string) {
    if (!group) return;
    if (!confirm(`Remove ${memberName} from this group?`)) {
      return;
    }
    try {
      await removeGroupMember(group.id, memberId);
      await loadGroupData(false);
    } catch (err: any) {
      alert(`Failed to remove member: ${err.message}`);
    }
  }

  // CSV Export Utility
  function exportExpensesToCSV() {
    if (!group || expenses.length === 0) return;

    const headers = ['Date', 'Description', 'Category', 'Amount', 'Currency', 'Paid By', 'Split Type'];
    const rows = expenses.map((e) => [
      e.date.substring(0, 10),
      `"${e.description.replace(/"/g, '""')}"`,
      e.category,
      e.amount,
      e.currency,
      `"${(e.paid_by_member?.profile?.full_name || e.paid_by_member?.guest_name || 'Member').replace(/"/g, '""')}"`,
      e.split_type,
    ]);

    const csvContent = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `${group.name.replace(/\s+/g, '_')}_expenses.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  function copyInviteLink() {
    if (!group) return;
    const url = `${window.location.origin}/join/${group.invite_code}`;
    navigator.clipboard.writeText(url);
    setCopiedInvite(true);
    setTimeout(() => setCopiedInvite(false), 2500);
  }

  const filteredExpensesList = filterExpenses(expenses, {
    category: selectedCategory,
    paidByMemberId: selectedPayer === 'All' ? undefined : selectedPayer,
    searchQuery,
  });

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-16 flex flex-col items-center justify-center min-h-[60vh]">
        <HashLoader color="#10b981" size={50} />
        <p className="text-slate-400 font-mono text-sm mt-5">Synchronizing group ledger...</p>
      </div>
    );
  }

  if (!group) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-900/60 border border-white/10 rounded-2xl text-center">
        <h2 className="text-xl font-bold text-white font-space mb-2">Group Not Found</h2>
        <Link href="/" className="text-xs font-mono text-emerald-400 hover:underline">
          &larr; Return to Dashboard
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
      {/* Header Breadcrumb & Actions */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <Link
            href="/"
            className="text-xs font-mono text-slate-400 hover:text-emerald-400 flex items-center gap-1.5 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Groups
          </Link>
          <div className="flex items-center gap-3">
            <h1 className="text-3xl lg:text-4xl font-extrabold text-white font-space tracking-tight">
              {group.name}
            </h1>
            <span className="px-2.5 py-1 bg-slate-800 border border-white/10 rounded-lg text-xs font-mono text-emerald-400 font-semibold">
              {group.currency}
            </span>
          </div>
          {group.description && <p className="text-sm text-slate-400 mt-1 font-sans">{group.description}</p>}
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={copyInviteLink}
            className="px-4 py-2 bg-slate-900 hover:bg-slate-800 border border-white/10 rounded-xl text-xs font-mono text-slate-300 flex items-center gap-2 transition-colors cursor-pointer"
          >
            {copiedInvite ? (
              <>
                <Check className="w-4 h-4 text-emerald-400" /> Link Copied!
              </>
            ) : (
              <>
                <Share2 className="w-4 h-4 text-emerald-400" /> Invite Code: {group.invite_code}
              </>
            )}
          </button>

          <button
            onClick={() => setIsExpenseModalOpen(true)}
            className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-xs font-space flex items-center gap-2 cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Add Expense
          </button>

          <button
            onClick={handleDeleteGroup}
            className="p-2.5 bg-slate-900/80 hover:bg-rose-500/20 border border-white/10 hover:border-rose-500/40 text-slate-400 hover:text-rose-400 rounded-xl transition-all cursor-pointer"
            title="Delete Group"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* CLAIM PROFILE BANNER (The Upgrade Path) */}
      {unclaimedProfile && (
        <div className="bg-gradient-to-r from-amber-500/20 via-emerald-500/20 to-cyan-500/20 border-2 border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 flex items-center justify-center text-amber-400 font-bold shrink-0">
              🌟
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-space">
                Are you <span className="text-amber-400 font-extrabold">{unclaimedProfile.guest_name}</span>?
              </h3>
              <p className="text-xs text-slate-300 font-sans mt-0.5">
                Claim this guest profile to automatically link your past expenses and balances to your account.
              </p>
            </div>
          </div>
          <button
            onClick={() => handleClaimProfile(unclaimedProfile.id)}
            disabled={claimingProfile}
            className="px-5 py-2.5 bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-bold rounded-xl text-xs font-space shadow-lg shadow-amber-500/20 hover:shadow-amber-500/35 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {claimingProfile ? 'Claiming Profile...' : 'Claim My Profile '}
          </button>
        </div>
      )}

      {/* PENDING SETTLEMENT VERIFICATION BANNER FOR RECEIVER/PAYEE */}
      {(() => {
        const userMember = members.find((m) => m.user_id === user?.id);
        const pendingConfirmations = settlements.filter(
          (s) => s.status === 'pending_confirmation' && userMember && s.payee_member_id === userMember.id
        );
        if (pendingConfirmations.length === 0) return null;

        const firstPending = pendingConfirmations[0];
        const payerName = firstPending.payer_member?.profile?.full_name || firstPending.payer_member?.guest_name || 'A member';

        return (
          <div className="bg-gradient-to-r from-amber-950/60 via-slate-900/90 to-emerald-950/60 border border-amber-500/40 rounded-2xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3 shadow-xl">
            <div className="flex items-center gap-3 text-left">
              <div className="w-10 h-10 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold shrink-0">
                📩
              </div>
              <div>
                <h4 className="font-bold text-white text-xs font-space flex items-center gap-2">
                  Payment Confirmation Needed ({pendingConfirmations.length})
                </h4>
                <p className="text-xs text-slate-300 font-sans mt-0.5">
                  <strong className="text-amber-300">{payerName}</strong> logged paying you <strong className="text-emerald-400">{group.currency} {firstPending.amount.toFixed(2)}</strong>. Confirm when received in your bank!
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end">
              <button
                onClick={() => handleConfirmPendingSettlement(firstPending.id)}
                className="px-4 py-2 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold text-xs rounded-xl font-space transition-colors cursor-pointer"
              >
                Confirm Received ✓
              </button>
              <button
                onClick={() => handleDisputePendingSettlement(firstPending.id)}
                className="px-3.5 py-2 bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 border border-rose-500/30 text-xs rounded-xl font-mono transition-colors cursor-pointer"
              >
                Decline ❌
              </button>
            </div>
          </div>
        );
      })()}

      {/* AI Financial Insights Banner */}
      <div className="bg-gradient-to-r from-slate-900/80 via-indigo-950/40 to-slate-900/80 backdrop-blur-md border border-indigo-500/30 rounded-2xl p-6 shadow-xl relative overflow-hidden">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-1 max-w-3xl">
            <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 font-semibold uppercase tracking-wider">
              <Sparkles className="w-4 h-4 text-cyan-400 animate-pulse" /> AI Flash Insights
            </div>
            <p className="text-sm text-slate-200 font-sans leading-relaxed">
              {aiSummary || 'Click "Analyze Spending" to generate a 2-sentence AI summary of group spending trends and net debt balances.'}
            </p>
            {aiTokens && (
              <span className="inline-block text-[11px] font-mono text-slate-500 mt-2">
                Token Usage: Prompt {aiTokens.prompt_tokens} | Completion {aiTokens.completion_tokens} | Total {aiTokens.total_tokens}
              </span>
            )}
          </div>

          <button
            onClick={generateAIInsights}
            disabled={loadingAi}
            className="px-4 py-2.5 bg-indigo-500/20 hover:bg-indigo-500/30 border border-indigo-500/40 text-cyan-300 rounded-xl text-xs font-mono font-semibold flex items-center gap-2 transition-all cursor-pointer disabled:opacity-50 shrink-0"
          >
            {loadingAi ? (
              <span className="flex items-center gap-2">
                <HashLoader color="#22d3ee" size={16} />
                Analyzing...
              </span>
            ) : (
              <>
                <Zap className="w-4 h-4 text-cyan-400" /> Analyze Spending
              </>
            )}
          </button>
        </div>
      </div>

      {/* Tab Navigation */}
      <div className="flex items-center gap-2 border-b border-white/10 overflow-x-auto pb-1">
        {[
          { id: 'expenses', label: `Expenses (${expenses.length})`, icon: Receipt },
          { id: 'balances', label: 'Running Balances', icon: DollarSign },
          { id: 'settle', label: `Settle Up (${simplifiedDebts.length})`, icon: ArrowRightLeft },
          { id: 'analytics', label: 'Spending Analytics', icon: TrendingUp },
          { id: 'members', label: `Members (${members.length})`, icon: Users },
        ].map((tab) => {
          const IconComponent = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as any)}
              className={`px-4 py-2.5 rounded-t-xl text-xs font-space font-bold transition-colors flex items-center gap-2 shrink-0 cursor-pointer ${isActive
                ? 'bg-slate-900 text-emerald-400 border-t-2 border-emerald-400'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900/40'
                }`}
            >
              <IconComponent className={`w-4 h-4 ${isActive ? 'text-emerald-400' : 'text-slate-500'}`} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {/* TAB 1: EXPENSES TIMELINE */}
      {activeTab === 'expenses' && (
        <div className="space-y-6">
          {/* Timeline Toolbar Filters & CSV Export */}
          <div className="flex flex-col lg:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/5">
            <div className="flex flex-wrap items-center gap-3 w-full lg:w-auto">
              <div className="relative flex-1 sm:w-64">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  placeholder="Search description..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500"
                />
              </div>

              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value as any)}
                className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Categories</option>
                <option value="Food">Food 🍔</option>
                <option value="Transport">Transport 🚗</option>
                <option value="Lodging">Lodging 🏨</option>
                <option value="Activities">Activities 🎟️</option>
                <option value="Shopping">Shopping 🛍️</option>
                <option value="Other">Other 📦</option>
              </select>

              <select
                value={selectedPayer}
                onChange={(e) => setSelectedPayer(e.target.value)}
                className="bg-slate-950/80 border border-white/10 rounded-xl px-3 py-1.5 text-xs text-white font-mono focus:outline-none focus:border-emerald-500"
              >
                <option value="All">All Payers</option>
                {members.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.profile?.full_name || m.guest_name || 'Member'}
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={exportExpensesToCSV}
              className="px-4 py-2 bg-slate-800/80 hover:bg-slate-700 border border-white/10 text-slate-300 rounded-xl text-xs font-mono flex items-center gap-2 transition-colors cursor-pointer shrink-0"
            >
              <Download className="w-4 h-4 text-emerald-400" /> Export CSV
            </button>
          </div>

          {/* Expenses List */}
          {filteredExpensesList.length === 0 ? (
            <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-12 text-center text-slate-400 font-sans">
              No expenses recorded matching your filter criteria.
            </div>
          ) : (
            <div className="space-y-3">
              {filteredExpensesList.map((expense) => {
                const payerName =
                  expense.paid_by_member?.profile?.full_name ||
                  expense.paid_by_member?.guest_name ||
                  'Member';

                return (
                  <div
                    key={expense.id}
                    className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-white/20 rounded-2xl p-4 lg:p-5 flex flex-col md:flex-row md:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-start gap-4">
                      <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-2xl shrink-0">
                        {CATEGORY_ICONS[expense.category] || '📦'}
                      </div>

                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <h3 className="font-bold text-base text-white font-space">
                            {expense.description}
                          </h3>
                          <span className="px-2 py-0.5 bg-slate-800 border border-white/10 rounded text-[10px] font-mono text-slate-400 uppercase">
                            {expense.split_type}
                          </span>
                        </div>

                        <div className="text-xs text-slate-400 font-sans flex flex-wrap items-center gap-3">
                          <span>
                            Paid by <strong className="text-slate-200">{payerName}</strong>
                          </span>
                          <span>&bull;</span>
                          <span className="font-mono">{expense.date.substring(0, 10)}</span>
                          {expense.receipt_url && (
                            <>
                              <span>&bull;</span>
                              <button
                                onClick={() => setViewReceiptUrl(expense.receipt_url!)}
                                className="text-emerald-400 hover:underline flex items-center gap-1 font-mono cursor-pointer"
                              >
                                <Receipt className="w-3.5 h-3.5" /> View Receipt
                              </button>
                            </>
                          )}
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center justify-between md:justify-end gap-4 border-t md:border-t-0 border-white/5 pt-3 md:pt-0">
                      <div className="text-left md:text-right">
                        <div className="text-xl font-bold font-mono text-white">
                          {expense.currency} {Number(expense.amount).toFixed(2)}
                        </div>
                        <span className="text-xs text-slate-500 font-mono block">
                          {expense.splits?.length || 0} members included
                        </span>
                      </div>

                      <button
                        onClick={() => handleDeleteExpense(expense.id, expense.description)}
                        className="p-2 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-xl transition-colors cursor-pointer"
                        title="Delete Expense"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* TAB 2: RUNNING BALANCES */}
      {activeTab === 'balances' && (
        <div className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {netBalances.map((bal) => {
              const name = bal.member.profile?.full_name || bal.member.guest_name || 'Member';
              const isPositive = bal.netBalance > 0.005;
              const isNegative = bal.netBalance < -0.005;

              return (
                <div
                  key={bal.member.id}
                  className={`bg-slate-900/60 backdrop-blur-md border rounded-2xl p-6 space-y-4 ${isPositive
                    ? 'border-emerald-500/40 bg-emerald-500/5'
                    : isNegative
                      ? 'border-rose-500/40 bg-rose-500/5'
                      : 'border-white/10'
                    }`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold font-space text-slate-200">
                        {name.charAt(0).toUpperCase()}
                      </div>
                      <div>
                        <h3 className="font-bold text-white font-space text-base">{name}</h3>
                        <span className="text-xs font-mono text-slate-400">
                          Total Paid: {group.currency} {bal.totalPaid.toFixed(2)}
                        </span>
                      </div>
                    </div>

                    <div className="text-right">
                      <span className="text-xs font-mono text-slate-400 block uppercase">Net Balance</span>
                      <span
                        className={`text-xl font-extrabold font-mono ${isPositive
                          ? 'text-emerald-400'
                          : isNegative
                            ? 'text-rose-400'
                            : 'text-slate-300'
                          }`}
                      >
                        {isPositive ? '+' : ''}
                        {group.currency} {bal.netBalance.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  <div className="text-xs font-sans text-slate-300 pt-2 border-t border-white/5">
                    {isPositive ? (
                      <span className="text-emerald-400 font-semibold flex items-center gap-1 font-mono">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Is owed {group.currency} {bal.netBalance.toFixed(2)} total
                      </span>
                    ) : isNegative ? (
                      <span className="text-rose-400 font-semibold flex items-center gap-1 font-mono">
                        Owes {group.currency} {Math.abs(bal.netBalance).toFixed(2)} to group
                      </span>
                    ) : (
                      <span className="text-slate-400 font-mono">Fully settled up</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 3: SETTLE UP & MINIMUM TRANSACTIONS */}
      {activeTab === 'settle' && (
        <div className="space-y-6">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6">
            <h2 className="text-xl font-bold text-white font-space mb-2 flex items-center gap-2">
              <Zap className="w-5 h-5 text-emerald-400" /> Optimal Minimum Settlement Path
            </h2>
            <p className="text-sm text-slate-400 font-sans">
              Calculated using the Greedy Debt Simplification Algorithm to minimize cash transfers between members.
            </p>
          </div>

          {simplifiedDebts.length === 0 ? (
            <div className="bg-emerald-500/10 border border-emerald-500/30 rounded-2xl p-12 text-center space-y-3">
              <CheckCircle2 className="w-12 h-12 text-emerald-400 mx-auto" />
              <h3 className="text-xl font-bold text-white font-space">All Debts Cleared!</h3>
              <p className="text-slate-300 text-sm font-sans">
                Every member in {group.name} is completely settled up. No payments required!
              </p>
            </div>
          ) : (
            <div className="space-y-4">
              {simplifiedDebts.map((tx, idx) => {
                const fromName = tx.fromMember.profile?.full_name || tx.fromMember.guest_name || 'Member';
                const toName = tx.toMember.profile?.full_name || tx.toMember.guest_name || 'Member';

                return (
                  <div
                    key={idx}
                    className="bg-slate-900/80 backdrop-blur-md border border-white/10 hover:border-emerald-500/30 rounded-2xl p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 transition-all"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center font-bold text-rose-400 font-mono">
                        {fromName.charAt(0)}
                      </div>

                      <div className="font-space">
                        <span className="font-bold text-white text-base">{fromName}</span>
                        <span className="text-slate-400 text-xs mx-2">pays</span>
                        <span className="font-bold text-emerald-400 text-base">{toName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between sm:justify-end gap-4">
                      <div className="text-xl font-extrabold font-mono text-white">
                        {tx.currency} {tx.amount.toFixed(2)}
                      </div>

                      <button
                        onClick={() => {
                          setSettlingTransaction(tx);
                          const defaultUpi = tx.toMember.upi_id || `${toName.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`;
                          setPayeeUpiId(defaultUpi);
                          setShowQrCode(false);
                        }}
                        className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs font-space hover:shadow-lg hover:shadow-emerald-500/20 transition-all cursor-pointer flex items-center gap-1.5"
                      >
                        <Zap className="w-3.5 h-3.5 stroke-[2.5]" /> Settle Up (UPI)
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {/* Past Settlement History */}
          {settlements.length > 0 && (
            <div className="pt-6 space-y-3">
              <h3 className="text-base font-bold text-white font-space">Settlement History</h3>
              <div className="space-y-2">
                {settlements.map((s) => {
                  const payer = s.payer_member?.profile?.full_name || s.payer_member?.guest_name || 'Payer';
                  const payee = s.payee_member?.profile?.full_name || s.payee_member?.guest_name || 'Payee';

                  return (
                    <div
                      key={s.id}
                      className="bg-slate-950/60 border border-white/5 rounded-xl p-3 flex items-center justify-between text-xs font-mono text-slate-400"
                    >
                      <div className="flex items-center gap-2 flex-wrap">
                        <span>
                          <strong className="text-slate-200">{payer}</strong> paid{' '}
                          <strong className="text-emerald-400">{payee}</strong>
                        </span>
                        {s.status === 'pending_confirmation' ? (
                          <span className="text-[10px] bg-amber-500/20 text-amber-300 border border-amber-500/30 px-2 py-0.5 rounded-full font-bold">
                            Pending Confirmation ⏳
                          </span>
                        ) : (
                          <span className="text-[10px] bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 px-2 py-0.5 rounded-full font-bold">
                            Confirmed ✓
                          </span>
                        )}
                      </div>
                      <div className="font-bold text-white">
                        {s.currency} {Number(s.amount).toFixed(2)}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 4: SPENDING ANALYTICS */}
      {activeTab === 'analytics' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Category Donut Chart */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                <PieChart className="w-5 h-5 text-emerald-400" /> Category Breakdown
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <RechartsPieChart>
                    <Pie
                      data={categoryTotals.filter((c) => c.amount > 0)}
                      dataKey="amount"
                      nameKey="category"
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={85}
                      paddingAngle={4}
                    >
                      {categoryTotals.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={CHART_COLORS[index % CHART_COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#ffffff20', borderRadius: '12px' }}
                      formatter={(val: any) => [`${group.currency} ${Number(val).toFixed(2)}`, 'Amount']}
                    />
                    <Legend />
                  </RechartsPieChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Member Spending Comparison */}
            <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 space-y-4">
              <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-cyan-400" /> Member Spending Comparison
              </h3>

              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={memberSpending}>
                    <XAxis dataKey="memberName" stroke="#64748b" fontSize={11} />
                    <YAxis stroke="#64748b" fontSize={11} />
                    <Tooltip contentStyle={{ backgroundColor: '#0b0f19', borderColor: '#ffffff20', borderRadius: '12px' }} />
                    <Legend />
                    <Bar dataKey="totalPaid" name="Total Paid" fill="#10b981" radius={[4, 4, 0, 0]} />
                    <Bar dataKey="totalShare" name="Total Share" fill="#06b6d4" radius={[4, 4, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: MEMBERS */}
      {activeTab === 'members' && (
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-bold text-white font-space">Group Members ({members.length})</h3>
            <button
              onClick={() => setIsAddMemberOpen(true)}
              className="px-4 py-2 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl text-xs font-mono font-semibold hover:bg-emerald-500/30 transition-colors flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Add Guest Member
            </button>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {members.map((m) => {
              const name = m.profile?.full_name || m.guest_name || 'Member';
              const currentUpi = m.upi_id || `${name.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`;
              const isEditing = editingUpiMemberId === m.id;
              const isSelf = user && m.user_id === user.id;

              return (
                <div
                  key={m.id}
                  className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-4 space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-slate-800 border border-white/10 flex items-center justify-center font-bold text-slate-200 font-space">
                        {name.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white font-space text-sm">{name} {isSelf && <span className="text-[10px] bg-emerald-500/20 text-emerald-300 px-1.5 py-0.5 rounded font-mono font-normal">You</span>}</h4>
                        <span className="text-[10px] font-mono text-slate-400 uppercase">{m.role}</span>
                      </div>
                    </div>

                    {!isSelf && (
                      <button
                        onClick={() => handleRemoveMember(m.id, name)}
                        className="p-1.5 text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        title="Remove Member"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    )}
                  </div>

                  {/* Member Saved UPI ID & Inline Edit (ONLY for self profile) */}
                  <div className="border-t border-white/5 pt-3">
                    {isEditing ? (
                      <div className="flex items-center gap-2">
                        <input
                          type="text"
                          value={inlineUpiText}
                          onChange={(e) => setInlineUpiText(e.target.value)}
                          placeholder="e.g. 9876543210@paytm"
                          className="flex-1 bg-slate-950 border border-emerald-500 rounded-lg px-2.5 py-1 text-xs font-mono text-white focus:outline-none"
                        />
                        <button
                          onClick={() => handleSaveMemberUpi(m.id)}
                          className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-mono cursor-pointer"
                        >
                          Save
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center justify-between text-xs font-mono text-slate-400">
                        <span>UPI VPA: <strong className="text-emerald-400">{m.upi_id || currentUpi}</strong></span>
                        {isSelf && (
                          <button
                            onClick={() => {
                              setEditingUpiMemberId(m.id);
                              setInlineUpiText(m.upi_id || currentUpi);
                            }}
                            className="text-[11px] text-emerald-400 hover:text-emerald-300 underline cursor-pointer"
                          >
                            Edit My VPA
                          </button>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* ADD EXPENSE MODAL */}
      {isExpenseModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b0f19] border border-white/10 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-6 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white font-space flex items-center gap-2">
                <Receipt className="w-5 h-5 text-emerald-400" /> Add New Expense
              </h2>
              <button
                onClick={() => setIsExpenseModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* VOICE & NATURAL LANGUAGE AI LOGGING WIDGET */}
            <div className="bg-gradient-to-r from-cyan-950/40 via-slate-900/80 to-emerald-950/40 border border-cyan-500/30 rounded-2xl p-4 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-xs font-bold text-cyan-300 font-space uppercase tracking-wider">
                  <Mic className={`w-4 h-4 ${isListeningVoice ? 'text-rose-400 animate-pulse' : 'text-cyan-400'}`} />
                  Voice & Natural Language AI Assistant
                </div>
                {isListeningVoice && (
                  <span className="text-[10px] font-mono text-rose-400 font-bold bg-rose-500/10 px-2 py-0.5 rounded-full border border-rose-500/30 animate-pulse">
                    ● Listening...
                  </span>
                )}
              </div>

              <div className="flex flex-col sm:flex-row gap-2">
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder="Speak or type e.g. 'Dinner at Khan Chacha 1200 rupees split equal'"
                    value={voicePromptText}
                    onChange={(e) => setVoicePromptText(e.target.value)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') {
                        e.preventDefault();
                        handleParseVoiceAI();
                      }
                    }}
                    className="w-full bg-slate-950/90 border border-white/10 rounded-xl pl-3 pr-10 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 font-sans"
                  />
                  <button
                    type="button"
                    onClick={handleToggleVoiceListening}
                    className={`absolute right-2 top-2 p-1.5 rounded-lg transition-all cursor-pointer ${isListeningVoice
                      ? 'bg-rose-500 text-white font-bold animate-pulse hover:bg-rose-600'
                      : 'bg-slate-800 text-cyan-400 hover:bg-slate-700'
                      }`}
                    title={isListeningVoice ? 'Click to Stop Listening' : 'Click to Speak (Web Speech API)'}
                  >
                    {isListeningVoice ? <MicOff className="w-3.5 h-3.5" /> : <Mic className="w-3.5 h-3.5" />}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={handleParseVoiceAI}
                  disabled={isParsingVoiceAI || !voicePromptText.trim()}
                  className="px-4 py-2.5 bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-bold rounded-xl text-xs font-space shadow-md hover:shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-40 shrink-0 flex items-center justify-center gap-1.5"
                >
                  <Sparkles className="w-3.5 h-3.5 stroke-[2.5]" />
                  {isParsingVoiceAI ? 'Parsing...' : 'Parse'}
                </button>
              </div>
            </div>

            {/* OCR Receipt Upload Box */}
            <div className="bg-slate-900/80 border-2 border-dashed border-white/10 hover:border-emerald-500/40 rounded-2xl p-4 text-center space-y-2 transition-colors">
              <UploadCloud className="w-8 h-8 text-emerald-400 mx-auto" />
              <div className="text-xs font-space font-bold text-slate-200">
                Scan Receipt Photo (OCR Auto-Fill)
              </div>
              <p className="text-[11px] text-slate-400 font-sans">
                Drop receipt image here to automatically extract total amount, merchant, and category.
              </p>
              <input
                type="file"
                accept="image/*"
                onChange={handleReceiptOCRScan}
                className="hidden"
                id="receipt-ocr-input"
              />
              <label
                htmlFor="receipt-ocr-input"
                className="inline-block px-4 py-1.5 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-lg text-xs font-mono cursor-pointer hover:bg-emerald-500/30 transition-colors"
              >
                {isScanningOCR ? 'Scanning Receipt...' : 'Choose Receipt Image'}
              </label>
            </div>

            <form onSubmit={handleAddExpenseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Description *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Dinner, Taxi fare"
                    value={expenseDesc}
                    onChange={(e) => setExpenseDesc(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Amount ({group.currency}) *
                  </label>
                  <input
                    type="number"
                    step="0.01"
                    required
                    placeholder="0.00"
                    value={expenseAmount}
                    onChange={(e) => setExpenseAmount(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Paid By
                  </label>
                  <select
                    value={expensePaidBy}
                    onChange={(e) => setExpensePaidBy(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  >
                    {members.map((m) => (
                      <option key={m.id} value={m.id}>
                        {m.profile?.full_name || m.guest_name || 'Member'}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Category
                  </label>
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value as any)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white font-mono focus:outline-none focus:border-emerald-500"
                  >
                    <option value="Food">Food 🍔</option>
                    <option value="Transport">Transport 🚗</option>
                    <option value="Lodging">Lodging 🏨</option>
                    <option value="Activities">Activities 🎟️</option>
                    <option value="Shopping">Shopping 🛍️</option>
                    <option value="Other">Other 📦</option>
                  </select>
                </div>
              </div>

              {/* Split Mode Selector */}
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                  Split Type
                </label>
                <div className="grid grid-cols-4 gap-2">
                  {[
                    { id: 'equal', label: 'Equal' },
                    { id: 'percentage', label: '%' },
                    { id: 'exact', label: 'Exact' },
                    { id: 'shares', label: 'Shares' },
                  ].map((s) => (
                    <button
                      key={s.id}
                      type="button"
                      onClick={() => setSplitType(s.id as any)}
                      className={`py-2 rounded-xl text-xs font-mono font-semibold border transition-all cursor-pointer ${splitType === s.id
                        ? 'bg-emerald-500 text-slate-950 border-emerald-400 font-bold'
                        : 'bg-slate-950 text-slate-400 border-white/10 hover:text-white'
                        }`}
                    >
                      {s.label}
                    </button>
                  ))}
                </div>
              </div>

              {/* Per-Member Split Input Customizer & Auto-Balancer */}
              <div className="space-y-3 pt-2 border-t border-white/10">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-mono uppercase text-slate-400">
                    Split Between ({selectedMembers.length} Selected)
                  </label>
                  <button
                    type="button"
                    onClick={() => {
                      if (selectedMembers.length === members.length) {
                        setSelectedMembers([]);
                      } else {
                        setSelectedMembers(members.map((m) => m.id));
                      }
                    }}
                    className="text-[11px] font-mono text-emerald-400 hover:underline cursor-pointer"
                  >
                    {selectedMembers.length === members.length ? 'Deselect All' : 'Select All'}
                  </button>
                </div>

                {/* MEMBER TOGGLES & SPLIT INPUT FIELDS */}
                <div className="space-y-2 max-h-56 overflow-y-auto pr-1">
                  {members.map((m) => {
                    const isSelected = selectedMembers.includes(m.id);
                    const memberName = m.profile?.full_name || m.guest_name || 'Member';
                    const currentInput = splitInputs[m.id] || {};

                    return (
                      <div
                        key={m.id}
                        className={`p-3 rounded-xl border transition-all flex items-center justify-between gap-3 ${isSelected
                          ? 'bg-slate-900 border-emerald-500/40'
                          : 'bg-slate-950/60 border-white/5 opacity-60'
                          }`}
                      >
                        <label className="flex items-center gap-3 cursor-pointer select-none grow">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={(e) => {
                              if (e.target.checked) {
                                setSelectedMembers([...selectedMembers, m.id]);
                              } else {
                                setSelectedMembers(selectedMembers.filter((id) => id !== m.id));
                              }
                            }}
                            className="w-4 h-4 accent-emerald-500 rounded cursor-pointer"
                          />
                          <span className="text-xs font-bold text-white font-space">{memberName}</span>
                        </label>

                        {/* INPUT FOR PERCENTAGE */}
                        {isSelected && splitType === 'percentage' && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              max="100"
                              placeholder="0"
                              value={currentInput.percentage ?? ''}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSplitInputs({
                                  ...splitInputs,
                                  [m.id]: { ...currentInput, percentage: isNaN(val) ? undefined : val },
                                });
                              }}
                              className="w-20 bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-right text-emerald-400 font-mono focus:outline-none focus:border-emerald-500"
                            />
                            <span className="text-xs font-mono text-slate-400">%</span>
                          </div>
                        )}

                        {/* INPUT FOR EXACT */}
                        {isSelected && splitType === 'exact' && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <span className="text-xs font-mono text-slate-400">{group.currency}</span>
                            <input
                              type="number"
                              step="0.01"
                              min="0"
                              placeholder="0.00"
                              value={currentInput.exactAmount ?? ''}
                              onChange={(e) => {
                                const val = parseFloat(e.target.value);
                                setSplitInputs({
                                  ...splitInputs,
                                  [m.id]: { ...currentInput, exactAmount: isNaN(val) ? undefined : val },
                                });
                              }}
                              className="w-24 bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-right text-cyan-400 font-mono focus:outline-none focus:border-emerald-500"
                            />
                          </div>
                        )}

                        {/* INPUT FOR SHARES */}
                        {isSelected && splitType === 'shares' && (
                          <div className="flex items-center gap-1.5 shrink-0">
                            <input
                              type="number"
                              step="1"
                              min="1"
                              placeholder="1"
                              value={currentInput.shares ?? 1}
                              onChange={(e) => {
                                const val = parseInt(e.target.value, 10);
                                setSplitInputs({
                                  ...splitInputs,
                                  [m.id]: { ...currentInput, shares: isNaN(val) ? 1 : val },
                                });
                              }}
                              className="w-16 bg-slate-950 border border-white/20 rounded-lg px-2.5 py-1 text-xs text-center text-amber-400 font-mono focus:outline-none focus:border-emerald-500"
                            />
                            <span className="text-xs font-mono text-slate-400">share(s)</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>

                {/* LIVE AUTO-CALCULATION & BALANCING HELPER BANNERS */}
                {splitType === 'percentage' && (() => {
                  const totalPct = selectedMembers.reduce((sum, id) => sum + (splitInputs[id]?.percentage || 0), 0);
                  const isBalanced = Math.abs(totalPct - 100) < 0.01;
                  const diff = Math.round((100 - totalPct) * 100) / 100;

                  return (
                    <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${isBalanced ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-rose-500/10 border-rose-500/30 text-rose-300'
                      }`}>
                      <span>Total: <strong>{totalPct.toFixed(1)}%</strong> / 100% {diff !== 0 && `(${diff > 0 ? `${diff}% remaining` : `${Math.abs(diff)}% over`})`}</span>
                      {!isBalanced && selectedMembers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const equalPct = Math.round((100 / selectedMembers.length) * 100) / 100;
                            const updated: any = { ...splitInputs };
                            selectedMembers.forEach((id) => {
                              updated[id] = { ...updated[id], percentage: equalPct };
                            });
                            setSplitInputs(updated);
                          }}
                          className="px-2.5 py-1 bg-emerald-500 text-slate-950 font-bold rounded-lg text-[10px] uppercase font-space hover:bg-emerald-400 cursor-pointer"
                        >
                          Auto-Equalize
                        </button>
                      )}
                    </div>
                  );
                })()}

                {splitType === 'exact' && (() => {
                  const totalAmt = parseFloat(expenseAmount) || 0;
                  const allocatedAmt = selectedMembers.reduce((sum, id) => sum + (splitInputs[id]?.exactAmount || 0), 0);
                  const isBalanced = Math.abs(allocatedAmt - totalAmt) < 0.01;
                  const diff = Math.round((totalAmt - allocatedAmt) * 100) / 100;

                  return (
                    <div className={`p-3 rounded-xl border text-xs font-mono flex items-center justify-between ${isBalanced && totalAmt > 0 ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-300' : 'bg-amber-500/10 border-amber-500/30 text-amber-300'
                      }`}>
                      <span>Allocated: <strong>{group.currency} {allocatedAmt.toFixed(2)}</strong> / {totalAmt.toFixed(2)} {diff !== 0 && `(${diff > 0 ? `${group.currency} ${diff.toFixed(2)} left` : `over by ${group.currency} ${Math.abs(diff).toFixed(2)}`})`}</span>
                      {!isBalanced && totalAmt > 0 && selectedMembers.length > 0 && (
                        <button
                          type="button"
                          onClick={() => {
                            const equalAmt = Math.round((totalAmt / selectedMembers.length) * 100) / 100;
                            const updated: any = { ...splitInputs };
                            selectedMembers.forEach((id) => {
                              updated[id] = { ...updated[id], exactAmount: equalAmt };
                            });
                            setSplitInputs(updated);
                          }}
                          className="px-2.5 py-1 bg-cyan-400 text-slate-950 font-bold rounded-lg text-[10px] uppercase font-space hover:bg-cyan-300 cursor-pointer"
                        >
                          Equalize Exact
                        </button>
                      )}
                    </div>
                  );
                })()}
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsExpenseModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmittingExpense}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs font-space disabled:opacity-50 cursor-pointer"
                >
                  {isSubmittingExpense ? 'Saving...' : 'Add Expense'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CONFIRM SETTLEMENT & 1-CLICK UPI INTENT DEEP-LINKING MODAL */}
      {settlingTransaction && (() => {
        const payerName = settlingTransaction.fromMember.profile?.full_name || settlingTransaction.fromMember.guest_name || 'Member';
        const payeeName = settlingTransaction.toMember.profile?.full_name || settlingTransaction.toMember.guest_name || 'Member';
        const amountStr = settlingTransaction.amount.toFixed(2);

        const currentPayeeUpi = payeeUpiId.trim() || settlingTransaction.toMember.upi_id || `${payeeName.toLowerCase().replace(/[^a-z0-9]/g, '')}@upi`;
        const noteText = group ? `Batwaara: ${group.name} Settle Up` : 'Batwaara Settlement';

        const upiUniversalLink = buildUpiUrl({ pa: currentPayeeUpi, pn: payeeName, am: settlingTransaction.amount, cu: group?.currency || 'INR', tn: noteText });
        const upiPaytmLink = buildPaytmUpiUrl({ pa: currentPayeeUpi, pn: payeeName, am: settlingTransaction.amount, cu: group?.currency || 'INR', tn: noteText });
        const upiPhonePeLink = buildPhonePeUpiUrl({ pa: currentPayeeUpi, pn: payeeName, am: settlingTransaction.amount, cu: group?.currency || 'INR', tn: noteText });
        const upiGPayLink = buildGPayUpiUrl({ pa: currentPayeeUpi, pn: payeeName, am: settlingTransaction.amount, cu: group?.currency || 'INR', tn: noteText });
        const qrCodeImageUrl = generateUpiQrCodeUrl(upiUniversalLink, 220);

        return (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
            <div className="bg-[#0b0f19] border border-white/10 rounded-2xl max-w-md w-full p-5 shadow-2xl space-y-4 text-center relative my-6">
              <button
                onClick={() => setSettlingTransaction(null)}
                className="absolute top-4 right-4 text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="text-left space-y-1">
                <span className="text-[11px] font-mono font-bold text-emerald-400 uppercase tracking-wider">
                  Online Settlement
                </span>
                <h3 className="text-lg font-bold text-white font-space">
                  Pay {payeeName}
                </h3>
              </div>

              {/* Clean Amount Card */}
              <div className="bg-slate-900/90 border border-emerald-500/30 rounded-2xl p-4 flex items-center justify-between">
                <div className="text-left">
                  <span className="text-[11px] text-slate-400 font-mono block">Amount Owed</span>
                  <span className="text-2xl font-extrabold font-mono text-emerald-400">
                    {group?.currency || 'INR'} {amountStr}
                  </span>
                </div>
                <div className="text-right text-xs font-mono text-slate-400">
                  <span className="block text-slate-300 font-bold">To</span>
                  <span>&rarr; {payeeName}</span>
                </div>
              </div>

              {/* Primary 1-Click UPI Pay Button */}
              <a
                href={upiUniversalLink}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-extrabold rounded-xl text-sm font-space shadow-lg shadow-emerald-500/20 hover:shadow-emerald-500/35 transition-all flex items-center justify-center gap-2 cursor-pointer"
              >
                <img src="/integrations/payments/UPI-Logo-vector.svg.webp" alt="UPI" className="h-4 object-contain" />
                <span>Pay {group?.currency || 'INR'} {amountStr} via UPI</span>
              </a>

              {/* App Quick Deep-Links (Paytm, PhonePe, GPay) */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                <a
                  href={upiPaytmLink}
                  className="py-2.5 px-2 bg-blue-950/80 hover:bg-blue-900/60 border border-blue-500/30 rounded-xl text-xs font-bold font-mono text-blue-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <img src="/integrations/payments/Paytm_logo.png" alt="Paytm" className="h-3.5 object-contain" />

                </a>
                <a
                  href={upiPhonePeLink}
                  className="py-2.5 px-2 bg-purple-950/80 hover:bg-purple-900/60 border border-purple-500/30 rounded-xl text-xs font-bold font-mono text-purple-300 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <img src="/integrations/payments/PhonePe_Logo.svg.webp" alt="PhonePe" className="h-3.5 object-contain" />

                </a>
                <a
                  href={upiGPayLink}
                  className="py-2.5 px-2 bg-slate-900 hover:bg-slate-800 border border-white/20 rounded-xl text-xs font-bold font-mono text-slate-200 flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                >
                  <img src="/integrations/payments/gpay.png" alt="GPay" className="h-3.5 object-contain" />

                </a>
              </div>

              {/* Collapsible VPA ID & QR Code details */}
              <div className="pt-2 border-t border-white/10 space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-400 bg-slate-950/80 px-3 py-2 rounded-xl border border-white/5">
                  <span className="truncate mr-2">VPA: <strong className="text-emerald-400">{currentPayeeUpi}</strong></span>
                  <button
                    type="button"
                    onClick={() => {
                      navigator.clipboard.writeText(currentPayeeUpi);
                      setCopiedUpi(true);
                      setTimeout(() => setCopiedUpi(false), 2000);
                    }}
                    className="text-[11px] text-emerald-400 hover:underline shrink-0 font-bold cursor-pointer"
                  >
                    {copiedUpi ? 'Copied ✓' : 'Copy VPA'}
                  </button>
                </div>

                <button
                  type="button"
                  onClick={() => setShowQrCode(!showQrCode)}
                  className="text-xs font-mono text-slate-400 hover:text-slate-200 underline cursor-pointer"
                >
                  {showQrCode ? 'Hide QR Code' : 'Show QR Code 📷'}
                </button>

                {showQrCode && (
                  <div className="p-3 bg-white rounded-2xl border-2 border-emerald-500/40 shadow-lg inline-block mx-auto">
                    <img src={qrCodeImageUrl} alt="UPI QR Code" className="w-36 h-36 mx-auto rounded-lg" />
                  </div>
                )}
              </div>

              {/* Confirm Record Settlement Action */}
              <div className="pt-2 border-t border-white/10 flex items-center justify-between gap-3">
                <button
                  onClick={() => setSettlingTransaction(null)}
                  className="px-4 py-2.5 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmSettlement}
                  disabled={isSubmittingSettlement}
                  className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-400 text-slate-950 font-bold rounded-xl text-xs font-space transition-colors disabled:opacity-50 cursor-pointer shadow-lg shadow-emerald-500/20"
                >
                  {isSubmittingSettlement ? 'Recording...' : 'Record Paid & Clear Debt 🎉'}
                </button>
              </div>
            </div>
          </div>
        );
      })()}

      {/* VIEW RECEIPT IMAGE MODAL */}
      {viewReceiptUrl && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/90 backdrop-blur-md">
          <div className="relative max-w-2xl w-full bg-[#0b0f19] border border-white/10 rounded-2xl p-4 text-center">
            <button
              onClick={() => setViewReceiptUrl(null)}
              className="absolute top-3 right-3 text-slate-400 hover:text-white p-1 bg-slate-800 rounded-lg"
            >
              <X className="w-5 h-5" />
            </button>
            <h4 className="text-sm font-mono text-slate-300 mb-4">Scanned Receipt Attachment</h4>
            <img src={viewReceiptUrl} alt="Receipt" className="max-h-[75vh] mx-auto rounded-xl border border-white/10" />
          </div>
        </div>
      )}

      {/* DUAL ONBOARDING ADD MEMBER MODAL (OPTION A & OPTION B) */}
      {isAddMemberOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b0f19] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-white/10 pb-3">
              <h3 className="text-lg font-bold text-white font-space flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-400" /> Add Member to Group
              </h3>
              <button
                onClick={() => setIsAddMemberOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* TAB SELECTOR: OPTION A vs OPTION B */}
            <div className="grid grid-cols-2 gap-2 bg-slate-950 p-1 rounded-xl border border-white/10">
              <button
                type="button"
                onClick={() => setAddMemberTab('registered')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${addMemberTab === 'registered'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Option A: App Users
              </button>
              <button
                type="button"
                onClick={() => setAddMemberTab('guest')}
                className={`py-2 px-3 rounded-lg text-xs font-mono font-bold transition-all cursor-pointer ${addMemberTab === 'guest'
                  ? 'bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 shadow-md'
                  : 'text-slate-400 hover:text-white'
                  }`}
              >
                Option B: Non-App Guest
              </button>
            </div>

            {/* TAB 1: OPTION A (Search Registered App Users) */}
            {addMemberTab === 'registered' && (
              <div className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Search App Users by Name or Email
                  </label>
                  <div className="relative">
                    <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3" />
                    <input
                      type="text"
                      placeholder="Type name (e.g. Rahul) or email..."
                      value={userSearchQuery}
                      onChange={(e) => handleSearchUsers(e.target.value)}
                      className="w-full bg-slate-950 border border-white/10 rounded-xl pl-9 pr-4 py-2.5 text-xs font-sans text-white focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                </div>

                {/* SEARCH RESULTS LIST */}
                <div className="space-y-2 max-h-48 overflow-y-auto">
                  {isSearchingUsers ? (
                    <div className="text-center py-4 text-xs font-mono text-slate-400">Searching platform users...</div>
                  ) : searchResults.length === 0 ? (
                    <div className="text-center py-4 text-xs font-sans text-slate-500">
                      {userSearchQuery.length >= 2
                        ? 'No registered users found matching query. Try Option B to add them as a guest!'
                        : 'Type at least 2 characters to search registered users.'}
                    </div>
                  ) : (
                    searchResults.map((u) => (
                      <div
                        key={u.id}
                        className="bg-slate-900 border border-white/10 hover:border-emerald-500/40 rounded-xl p-3 flex items-center justify-between transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center font-bold text-xs text-emerald-300 font-space">
                            {(u.full_name || u.email).charAt(0).toUpperCase()}
                          </div>
                          <div>
                            <div className="font-bold text-xs text-white font-space">{u.full_name || 'App User'}</div>
                            <div className="text-[10px] font-mono text-slate-400">{u.email}</div>
                          </div>
                        </div>
                        <button
                          onClick={() => handleAddRegisteredUser(u.id)}
                          className="px-3 py-1.5 bg-emerald-500 text-slate-950 font-bold rounded-lg text-xs font-mono hover:bg-emerald-400 transition-colors cursor-pointer"
                        >
                          + Add
                        </button>
                      </div>
                    ))
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: OPTION B (Add Guest Member by Name) */}
            {addMemberTab === 'guest' && (
              <form onSubmit={handleAddGuestMember} className="space-y-4 pt-1">
                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    Display Name *
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Rahul, Priya, Alex (Guest)"
                    value={newGuestName}
                    onChange={(e) => setNewGuestName(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                    UPI VPA / Phone (Optional)
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. 9876543210@paytm or rahul@okicici"
                    value={newGuestUpi}
                    onChange={(e) => setNewGuestUpi(e.target.value)}
                    className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-xs text-white focus:outline-none focus:border-emerald-500 font-mono"
                  />
                </div>

                <div className="flex justify-end gap-3 pt-2 border-t border-white/10">
                  <button
                    type="button"
                    onClick={() => setIsAddMemberOpen(false)}
                    className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs font-space shadow-lg cursor-pointer"
                  >
                    Add Guest Member
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function RechartsPieChart({ children }: { children: React.ReactNode }) {
  return <PieChart>{children}</PieChart>;
}
