"use client";
import React from "react";
import Link from "next/link";

export const CustomFooter: React.FC = () => {
  return (
    <footer className="w-full bg-transparent py-8 font-sans">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-400">© {new Date().getFullYear()} Batwaara. All Rights Reserved</div>

        <div className="flex items-center gap-6 text-sm font-mono">
          <Link href="/privacy" className="text-neutral-400 hover:text-emerald-400 transition-colors">Privacy</Link>
          <Link href="/terms" className="text-neutral-400 hover:text-emerald-400 transition-colors">Terms</Link>
          <a href="/#contact" className="text-neutral-400 hover:text-emerald-400 transition-colors">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
