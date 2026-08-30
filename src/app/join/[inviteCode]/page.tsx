'use client';

import { useEffect, useState, use } from 'react';
import { useUser, SignInButton } from '@clerk/nextjs';
import { useRouter } from 'next/navigation';
import { Users, CheckCircle2, AlertCircle, ArrowRight } from 'lucide-react';
import { HashLoader } from 'react-spinners';
import { supabase } from '@/lib/supabase';
import type { Group } from '@/types/database';

export default function JoinGroupPage({ params }: { params: Promise<{ inviteCode: string }> }) {
  const { inviteCode } = use(params);
  const { isSignedIn, user, isLoaded } = useUser();
  const router = useRouter();

  const [group, setGroup] = useState<Group | null>(null);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [joining, setJoining] = useState(false);
  const [alreadyMember, setAlreadyMember] = useState(false);

  useEffect(() => {
    fetchGroupDetails();
  }, [inviteCode, isSignedIn, user]);

  async function fetchGroupDetails() {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('groups')
        .select('*')
        .eq('invite_code', inviteCode.toUpperCase())
        .single();

      if (error || !data) {
        setErrorMsg('Invalid or expired group invite code.');
      } else {
        setGroup(data as Group);

        if (user) {
          const { data: memberData } = await supabase
            .from('group_members')
            .select('id')
            .eq('group_id', data.id)
            .eq('user_id', user.id)
            .single();

          if (memberData) {
            setAlreadyMember(true);
          }
        }
      }
    } catch (err: any) {
      setErrorMsg(err.message || 'Error loading group details.');
    } finally {
      setLoading(false);
    }
  }

  async function handleJoinGroup() {
    if (!group || !user) return;

    setJoining(true);
    try {
      const { error } = await supabase.from('group_members').insert({
        group_id: group.id,
        user_id: user.id,
        role: 'member',
      });

      if (error) {
        setErrorMsg(`Failed to join group: ${error.message}`);
      } else {
        router.push(`/groups/${group.id}`);
      }
    } catch (err: any) {
      setErrorMsg(err.message);
    } finally {
      setJoining(false);
    }
  }

  if (!isLoaded || loading) {
    return (
      <div className="max-w-md mx-auto my-20 p-8 bg-slate-900/60 border border-white/10 rounded-2xl flex flex-col items-center justify-center text-center">
        <HashLoader color="#10b981" size={40} />
        <p className="text-slate-400 font-mono text-sm mt-5">Verifying invite code...</p>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto my-16 px-4">
      <div className="bg-[#0b0f19] border border-white/10 rounded-2xl p-8 shadow-2xl text-center space-y-6">
        <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-emerald-500/20 to-cyan-500/20 border border-emerald-500/30 flex items-center justify-center mx-auto text-emerald-400">
          <Users className="w-8 h-8" />
        </div>

        {errorMsg ? (
          <div className="space-y-4">
            <div className="flex items-center justify-center gap-2 text-rose-400 font-bold font-space">
              <AlertCircle className="w-5 h-5" /> Invite Error
            </div>
            <p className="text-slate-400 text-sm">{errorMsg}</p>
            <button
              onClick={() => router.push('/')}
              className="px-6 py-2.5 bg-slate-800 text-white rounded-xl text-xs font-mono font-semibold"
            >
              Back to Dashboard
            </button>
          </div>
        ) : group ? (
          <div className="space-y-6">
            <div>
              <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider">Group Invitation</span>
              <h1 className="text-2xl font-bold text-white font-space mt-1">{group.name}</h1>
              <p className="text-slate-400 text-sm mt-2">{group.description || 'You have been invited to join this expense group.'}</p>
            </div>

            {alreadyMember ? (
              <div className="bg-emerald-500/10 border border-emerald-500/20 rounded-xl p-4 space-y-3">
                <div className="flex items-center justify-center gap-2 text-emerald-400 font-semibold text-sm font-space">
                  <CheckCircle2 className="w-4 h-4" /> You are already a member!
                </div>
                <button
                  onClick={() => router.push(`/groups/${group.id}`)}
                  className="w-full py-2.5 bg-emerald-500 text-slate-950 font-bold rounded-xl text-xs font-space flex items-center justify-center gap-2"
                >
                  Open Group Hub <ArrowRight className="w-4 h-4" />
                </button>
              </div>
            ) : isSignedIn ? (
              <button
                onClick={handleJoinGroup}
                disabled={joining}
                className="w-full py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-sm font-space shadow-lg hover:shadow-emerald-500/20 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {joining ? 'Joining...' : 'Join Group Now'} <ArrowRight className="w-4 h-4" />
              </button>
            ) : (
              <div className="space-y-3">
                <p className="text-xs text-slate-400 font-mono">Sign in to accept this group invitation</p>
                <SignInButton mode="modal">
                  <button className="w-full py-3 bg-emerald-400 text-slate-950 font-bold rounded-xl text-sm font-space shadow-lg">
                    Sign In to Join Group
                  </button>
                </SignInButton>
              </div>
            )}
          </div>
        ) : null}
      </div>
    </div>
  );
}
