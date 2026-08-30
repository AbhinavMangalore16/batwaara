'use client';

import Link from 'next/link';

export function LandingFooter() {
  return (
    <footer className="py-12 bg-slate-950 border-t border-white/10 text-slate-400 font-sans text-sm">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-lg bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 font-mono font-bold text-sm">
            B
          </div>
          <span className="font-space font-bold text-white tracking-tight text-base">
            Batwaara
          </span>
          <span className="text-xs text-slate-500 ml-2">© {new Date().getFullYear()} Batwaara Inc.</span>
        </div>

        <div className="flex items-center gap-6 text-xs font-mono">
          <a href="#features" className="hover:text-emerald-400 transition-colors">Features</a>
          <a href="#pricing" className="hover:text-emerald-400 transition-colors">Pricing</a>
          <a href="#faq" className="hover:text-emerald-400 transition-colors">FAQ</a>
          <a href="https://github.com" target="_blank" rel="noreferrer" className="hover:text-emerald-400 transition-colors">GitHub</a>
        </div>
      </div>
    </footer>
  );
}
