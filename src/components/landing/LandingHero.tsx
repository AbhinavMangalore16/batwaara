'use client';

import { Highlight } from "@/components/ui/hero-highlight";
import { SignInButton, SignUpButton, useUser } from "@clerk/nextjs";
import { ArrowRight, Sparkles, Zap, ShieldCheck } from "lucide-react";
import Link from "next/link";

export function LandingHero() {
  const { isSignedIn } = useUser();

  return (
    <div className="relative py-16 lg:py-24 flex flex-col items-center justify-center text-center overflow-hidden border-b border-white/10">
      <div className="inline-flex items-center gap-2 px-3 py-1 bg-emerald-500/10 border border-emerald-500/30 rounded-full text-xs font-mono text-emerald-400 mb-6">
        <Sparkles className="w-3.5 h-3.5" /> Next-Gen AI & OCR Expense Engine
      </div>

      <h1 className="max-w-4xl px-4 text-4xl sm:text-5xl lg:text-7xl font-extrabold tracking-tight font-space text-white leading-tight">
        The smartest way to <br className="hidden sm:inline" />
        <Highlight className="mt-2">split payments!</Highlight>
      </h1>

      <p className="max-w-2xl px-6 py-6 text-base sm:text-lg text-slate-400 font-sans leading-relaxed">
        Batwaara handles the complex math so you can focus on the moment. Split equal, percentage, or custom amounts, scan receipts instantly, and calculate minimum cash-flow settlements.
      </p>

      <div className="flex flex-wrap items-center justify-center gap-4 pt-2">
        {isSignedIn ? (
          <a
            href="#dashboard"
            className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 font-space text-sm"
          >
            Go to Group Dashboard <ArrowRight className="w-4 h-4" />
          </a>
        ) : (
          <>
            <SignUpButton mode="modal">
              <button className="px-8 py-3.5 bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 font-bold rounded-xl shadow-lg shadow-emerald-500/20 hover:scale-105 transition-all flex items-center gap-2 font-space text-sm cursor-pointer">
                Get Started Free &rarr;
              </button>
            </SignUpButton>
            <SignInButton mode="modal">
              <button className="px-8 py-3.5 border border-white/20 bg-slate-900/60 text-white font-medium rounded-xl hover:bg-slate-800 transition-colors font-space text-sm cursor-pointer">
                Sign In
              </button>
            </SignInButton>
          </>
        )}
      </div>

      {/* Value props badges */}
      <div className="mt-12 flex flex-wrap justify-center gap-8 text-xs font-mono text-slate-400">
        <div className="flex items-center gap-2">
          <Zap className="w-4 h-4 text-emerald-400" /> Instant Minimum Debt Path
        </div>
        <div className="flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-cyan-400" /> OCR Receipt Scanning
        </div>
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-4 h-4 text-emerald-400" /> Supabase & Clerk Secured
        </div>
      </div>
    </div>
  );
}
