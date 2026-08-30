'use client';

import { useState, useEffect } from 'react';
import { useUser, UserButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { HashLoader } from 'react-spinners';
import {
  Users,
  Plus,
  ArrowUpRight,
  ArrowDownLeft,
  Sparkles,
  Search,
  Share2,
  Check,
  X,
  UserPlus,
  ArrowRight,
  LogOut,
  Home,
  TrendingDown,
  TrendingUp,
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { createGroup, getGroupSummary } from '@/lib/backend/services';
import type { Group } from '@/types/database';

export default function DashboardPage() {
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  // Financial Metrics State across all groups
  const [totalYouOwe, setTotalYouOwe] = useState(0);
  const [pendingPaymentsCount, setPendingPaymentsCount] = useState(0);
  const [totalOwedToYou, setTotalOwedToYou] = useState(0);
  const [receivablesCount, setReceivablesCount] = useState(0);
  const [firstDebtGroupId, setFirstDebtGroupId] = useState<string | null>(null);

  // Create Group Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newGroupName, setNewGroupName] = useState('');
  const [newGroupDesc, setNewGroupDesc] = useState('');
  const [newGroupCurrency, setNewGroupCurrency] = useState('INR');
  const [memberInputs, setMemberInputs] = useState<string[]>(['']);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [copiedInvite, setCopiedInvite] = useState<string | null>(null);

  useEffect(() => {
    if (isLoaded) {
      if (!isSignedIn || !user) {
        router.push('/');
      } else {
        loadUserGroups(true);
      }
    }
  }, [isLoaded, isSignedIn, user?.id, router]);

  async function loadUserGroups(isInitial = false) {
    if (isInitial) setLoading(true);
    try {
      // 1. Auto-sync Clerk user profile into Supabase profiles table
      if (user) {
        try {
          await supabase.from('profiles').upsert({
            id: user.id,
            email: user.primaryEmailAddress?.emailAddress || `${user.id}@clerk.user`,
            full_name: user.fullName || user.firstName || 'User',
            avatar_url: user.imageUrl || null,
          });
        } catch {}
      }

      // 2. Fetch groups from Supabase
      let fetchedGroups: Group[] = [];
      const { data: memberRows, error: memErr } = await supabase
        .from('group_members')
        .select('group_id, groups(*)')
        .eq('user_id', user?.id);

      if (!memErr && memberRows) {
        fetchedGroups = memberRows
          .map((row: any) => row.groups)
          .filter(Boolean) as Group[];
      }

      // 3. Merge with local groups if Supabase table is empty or being created
      try {
        if (typeof window !== 'undefined') {
          const localGroups = JSON.parse(localStorage.getItem('batwaara_local_groups') || '[]');
          const existingIds = new Set(fetchedGroups.map((g) => g.id));
          for (const lg of localGroups) {
            if (!existingIds.has(lg.id)) {
              fetchedGroups.push(lg);
            }
          }
        }
      } catch {}

      setGroups(fetchedGroups);

      // 4. Calculate total money owed and receivables across all user groups
      let youOweSum = 0;
      let pendingCount = 0;
      let owedToYouSum = 0;
      let debtGroupId: string | null = null;
      const debtorFriendsSet = new Set<string>();

      await Promise.all(
        fetchedGroups.map(async (g) => {
          try {
            const summary = await getGroupSummary(g.id);
            const userMember = summary.members.find(
              (m) =>
                m.user_id === user?.id ||
                (m.guest_name &&
                  user?.fullName?.toLowerCase().includes(m.guest_name.toLowerCase()))
            );
            if (!userMember) return;

            summary.simplifiedDebts.forEach((debt) => {
              if (debt.fromMember.id === userMember.id) {
                youOweSum += debt.amount;
                pendingCount++;
                if (!debtGroupId) debtGroupId = g.id;
              } else if (debt.toMember.id === userMember.id) {
                owedToYouSum += debt.amount;
                debtorFriendsSet.add(debt.fromMember.id);
              }
            });
          } catch (err) {
            console.error(`Failed to calculate metrics for group ${g.id}:`, err);
          }
        })
      );

      setTotalYouOwe(youOweSum);
      setPendingPaymentsCount(pendingCount);
      setTotalOwedToYou(owedToYouSum);
      setReceivablesCount(debtorFriendsSet.size);
      setFirstDebtGroupId(debtGroupId);
    } catch (err) {
      console.error('Failed to load groups:', err);
    } finally {
      if (isInitial) setLoading(false);
    }
  }

  function handleAddMemberInput() {
    setMemberInputs([...memberInputs, '']);
  }

  function handleMemberInputChange(index: number, value: string) {
    const updated = [...memberInputs];
    updated[index] = value;
    setMemberInputs(updated);
  }

  function handleRemoveMemberInput(index: number) {
    if (memberInputs.length === 1) return;
    setMemberInputs(memberInputs.filter((_, i) => i !== index));
  }

  async function handleCreateGroupSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!newGroupName.trim() || !user) return;

    setIsSubmitting(true);
    try {
      // Auto-sync profile first
      try {
        await supabase.from('profiles').upsert({
          id: user.id,
          email: user.primaryEmailAddress?.emailAddress || `${user.id}@clerk.user`,
          full_name: user.fullName || user.firstName || 'User',
          avatar_url: user.imageUrl || null,
        });
      } catch {}

      const { group } = await createGroup(
        newGroupName.trim(),
        newGroupDesc.trim() || null,
        newGroupCurrency,
        user.id
      );

      const validMembers = memberInputs.map((m) => m.trim()).filter((m) => m.length > 0);
      for (const memberName of validMembers) {
        try {
          await supabase.from('group_members').insert({
            group_id: group.id,
            guest_name: memberName,
            role: 'member',
          });
        } catch {}
      }

      setIsModalOpen(false);
      setNewGroupName('');
      setNewGroupDesc('');
      setMemberInputs(['']);
      await loadUserGroups();
    } catch (err: any) {
      console.error('Group creation notice:', err);
      await loadUserGroups();
      setIsModalOpen(false);
    } finally {
      setIsSubmitting(false);
    }
  }

  function copyInviteLink(code: string, e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();
    const url = `${window.location.origin}/join/${code}`;
    navigator.clipboard.writeText(url);
    setCopiedInvite(code);
    setTimeout(() => setCopiedInvite(null), 2500);
  }

  const filteredGroups = groups.filter(
    (g) =>
      g.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (g.description && g.description.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  if (!isLoaded || loading) {
    return (
      <div className="min-h-screen bg-[#090d16] flex flex-col items-center justify-center">
        <HashLoader color="#10b981" size={50} />
        <p className="text-slate-400 font-mono text-sm mt-5">Loading Batwaara Dashboard...</p>
      </div>
    );
  }

  if (!isSignedIn) {
    return null;
  }

  return (
    <div className="min-h-screen bg-[#090d16] text-white">
      {/* Top Fixed Header */}
      <header className="sticky top-0 z-40 bg-slate-950/80 backdrop-blur-md border-b border-white/10 px-4 lg:px-8 py-3.5">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Link href="/" className="flex items-center gap-2 group">
              <img src="/batwara-logo.png" alt="Batwara Logo" className="w-8 h-8 object-contain" />
              <span className="font-bold text-lg text-white font-space group-hover:text-emerald-400 transition-colors">
                Batwara <span className="text-xs text-emerald-400 font-mono font-normal">Hub</span>
              </span>
            </Link>
          </div>

          <div className="flex items-center gap-4">
            <Link
              href="/"
              className="text-xs font-semibold text-slate-400 hover:text-white transition-colors flex items-center gap-1 font-space"
            >
              <Home className="w-3.5 h-3.5" /> Landing Page
            </Link>
            <div className="h-4 w-[1px] bg-white/10" />
            <div className="flex items-center gap-3">
              <span className="text-xs text-slate-300 font-medium hidden sm:inline-block">
                {user?.fullName || user?.firstName || 'User'}
              </span>
              <UserButton
                appearance={{
                  elements: {
                    userButtonAvatarBox: "w-9 h-9 border-2 border-emerald-500/30 hover:border-emerald-400 transition-colors",
                  },
                }}
              />
            </div>
          </div>
        </div>
      </header>

      {/* Welcome Banner */}
      <div className="w-full bg-emerald-500/10 border-b border-emerald-500/20 py-4 px-4 lg:px-8">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-sm font-medium text-emerald-400 font-space flex items-center gap-2">
            <Sparkles className="w-4 h-4 text-emerald-400" />
            Welcome to your Dashboard, <span className="font-bold text-white">{user?.firstName || 'User'}</span>! Manage groups & settle expenses.
          </p>
          <button
            onClick={() => setIsModalOpen(true)}
            className="flex items-center gap-1.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 text-xs font-bold px-4 py-2 rounded-xl transition-all hover:shadow-lg hover:shadow-emerald-500/25 font-space cursor-pointer"
          >
            + Create New Group <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Dashboard Main Content */}
      <main className="max-w-7xl mx-auto px-4 lg:px-8 py-8 space-y-8">
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-slate-900/60 backdrop-blur-md border border-white/10 rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-slate-700 group-hover:text-emerald-500/20 transition-colors">
              <Users className="w-16 h-16" />
            </div>
            <span className="text-xs font-mono text-slate-400 uppercase tracking-wider">Active Groups</span>
            <div className="text-3xl font-extrabold font-mono text-white mt-2">{groups.length}</div>
            <span className="text-xs text-slate-400 mt-1 block">Groups you are a member of</span>
          </div>

          {/* Card 2: YOU OWE (Pending Outflow) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-rose-500/20 hover:border-rose-500/40 transition-all rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-rose-500/10 group-hover:text-rose-500/20 transition-colors">
              <TrendingDown className="w-16 h-16 text-rose-500" />
            </div>
            <span className="text-xs font-mono text-rose-400 font-bold uppercase tracking-wider">YOU OWE</span>
            <div className="text-3xl font-extrabold font-mono text-rose-400 mt-2">
              ₹{totalYouOwe.toFixed(2)}
            </div>
            <span className="text-xs text-slate-400 mt-1 block font-sans">
              {pendingPaymentsCount > 0 ? (
                <>
                  {pendingPaymentsCount} pending payment{pendingPaymentsCount > 1 ? 's' : ''} to clear
                  {firstDebtGroupId && (
                    <Link
                      href={`/groups/${firstDebtGroupId}`}
                      className="text-emerald-400 hover:text-emerald-300 underline font-semibold ml-1.5 cursor-pointer"
                    >
                      (Settle Up)
                    </Link>
                  )}
                </>
              ) : (
                'All clear! No pending debts 🎉'
              )}
            </span>
          </div>

          {/* Card 3: OWED TO YOU (Pending Inflow) */}
          <div className="bg-slate-900/60 backdrop-blur-md border border-emerald-500/20 hover:border-emerald-500/40 transition-all rounded-2xl p-6 relative overflow-hidden group">
            <div className="absolute top-0 right-0 p-4 text-emerald-500/10 group-hover:text-emerald-500/20 transition-colors">
              <TrendingUp className="w-16 h-16 text-emerald-500" />
            </div>
            <span className="text-xs font-mono text-emerald-400 font-bold uppercase tracking-wider">OWED TO YOU</span>
            <div className="text-3xl font-extrabold font-mono text-emerald-400 mt-2">
              ₹{totalOwedToYou.toFixed(2)}
            </div>
            <span className="text-xs text-slate-400 mt-1 block font-sans">
              {receivablesCount > 0
                ? `From ${receivablesCount} friend${receivablesCount > 1 ? 's' : ''} across groups`
                : 'No pending receivables'}
            </span>
          </div>
        </div>

        {/* Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-slate-900/40 p-4 rounded-2xl border border-white/10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              placeholder="Search your groups..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950/80 border border-white/10 rounded-xl pl-10 pr-4 py-2 text-sm text-white placeholder-slate-500 focus:outline-none focus:border-emerald-500/50 font-sans"
            />
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer font-space text-sm"
          >
            <Plus className="w-4 h-4 stroke-[3]" /> Create New Group
          </button>
        </div>

        {/* Groups Grid */}
        {filteredGroups.length === 0 ? (
          <div className="bg-slate-900/40 border border-white/10 rounded-2xl p-12 text-center flex flex-col items-center">
            <div className="w-16 h-16 rounded-full bg-slate-800/80 flex items-center justify-center mb-4 text-slate-500">
              <Users className="w-8 h-8 text-emerald-400" />
            </div>
            <h3 className="text-xl font-bold text-white font-space mb-2">No Groups Found</h3>
            <p className="text-slate-400 text-sm max-w-md mb-6 font-sans">
              {searchQuery
                ? `No groups matching "${searchQuery}"`
                : 'You are not part of any expense groups yet. Create your first group to start splitting bills!'}
            </p>
            <button
              onClick={() => setIsModalOpen(true)}
              className="px-6 py-3 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 rounded-xl hover:bg-emerald-500/30 transition-colors font-space text-sm font-semibold flex items-center gap-2 cursor-pointer"
            >
              <Plus className="w-4 h-4" /> Create Group
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Link
                key={group.id}
                href={`/groups/${group.id}`}
                className="group bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/10 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-start justify-between gap-2 mb-3">
                    <h2 className="text-xl font-bold text-white font-space group-hover:text-emerald-400 transition-colors line-clamp-1">
                      {group.name}
                    </h2>
                    <span className="px-2.5 py-1 bg-slate-800 border border-white/10 rounded-md text-xs font-mono text-slate-300">
                      {group.currency}
                    </span>
                  </div>

                  <p className="text-sm text-slate-400 line-clamp-2 mb-6 font-sans min-h-[2.5rem]">
                    {group.description || 'No description provided.'}
                  </p>
                </div>

                <div className="border-t border-white/5 pt-4 flex items-center justify-between">
                  <button
                    onClick={(e) => copyInviteLink(group.invite_code, e)}
                    className="px-3 py-1.5 bg-slate-800/80 hover:bg-slate-700 border border-white/10 rounded-lg text-xs font-mono text-slate-300 flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    {copiedInvite === group.invite_code ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" /> Copied!
                      </>
                    ) : (
                      <>
                        <Share2 className="w-3.5 h-3.5 text-slate-400" /> Code: {group.invite_code}
                      </>
                    )}
                  </button>

                  <span className="text-xs font-mono text-emerald-400 flex items-center gap-1 font-semibold group-hover:translate-x-1 transition-transform">
                    Open Hub &rarr;
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </main>

      {/* Create Group Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm">
          <div className="bg-[#0b0f19] border border-white/10 rounded-2xl max-w-lg w-full p-6 shadow-2xl space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h2 className="text-xl font-bold text-white font-space flex items-center gap-2">
                <Users className="w-5 h-5 text-emerald-400" /> Create New Group
              </h2>
              <button
                onClick={() => setIsModalOpen(false)}
                className="text-slate-400 hover:text-white p-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateGroupSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Group Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beach Trip 2026, Apartment Roommates"
                  value={newGroupName}
                  onChange={(e) => setNewGroupName(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Description
                </label>
                <input
                  type="text"
                  placeholder="Optional trip summary or note"
                  value={newGroupDesc}
                  onChange={(e) => setNewGroupDesc(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-sans"
                />
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-1">
                  Base Currency
                </label>
                <select
                  value={newGroupCurrency}
                  onChange={(e) => setNewGroupCurrency(e.target.value)}
                  className="w-full bg-slate-950 border border-white/10 rounded-xl px-4 py-2.5 text-sm text-white focus:outline-none focus:border-emerald-500 font-mono"
                >
                  <option value="INR">INR (₹)</option>
                  <option value="USD">USD ($)</option>
                  <option value="EUR">EUR (€)</option>
                  <option value="GBP">GBP (£)</option>
                  <option value="CAD">CAD ($)</option>
                  <option value="AUD">AUD ($)</option>
                  <option value="JPY">JPY (¥)</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-mono uppercase text-slate-400 mb-2">
                  Add Additional Members (Optional)
                </label>
                <div className="space-y-2 max-h-36 overflow-y-auto pr-1">
                  {memberInputs.map((inputVal, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="text"
                        placeholder={`Member ${idx + 1} Name (e.g. Sarah, Mike)`}
                        value={inputVal}
                        onChange={(e) => handleMemberInputChange(idx, e.target.value)}
                        className="flex-1 bg-slate-950 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-emerald-500 font-sans"
                      />
                      {memberInputs.length > 1 && (
                        <button
                          type="button"
                          onClick={() => handleRemoveMemberInput(idx)}
                          className="p-2 text-rose-400 hover:bg-rose-500/10 rounded-lg transition-colors cursor-pointer"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      )}
                    </div>
                  ))}
                </div>
                <button
                  type="button"
                  onClick={handleAddMemberInput}
                  className="mt-2 text-xs font-mono text-emerald-400 hover:underline flex items-center gap-1 cursor-pointer"
                >
                  <UserPlus className="w-3.5 h-3.5" /> + Add Another Member
                </button>
              </div>

              <div className="pt-4 flex items-center justify-end gap-3 border-t border-white/10">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl hover:shadow-lg hover:shadow-emerald-500/25 transition-all text-xs font-space disabled:opacity-50 cursor-pointer"
                >
                  {isSubmitting ? 'Creating...' : 'Create Group'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
