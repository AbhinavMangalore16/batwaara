"use client";
import React from "react";

export const CustomFooter: React.FC = () => {
  return (
    <footer className="w-full border-t border-white/10 bg-transparent py-8">
      <div className="max-w-6xl mx-auto px-6 flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="text-sm text-neutral-400">© 2025 Batwara. All Rights Reserved</div>

        <div className="flex items-center gap-4 text-sm">
          <a href="/privacy" className="text-neutral-400 hover:text-neutral-200">Privacy</a>
          <a href="/terms" className="text-neutral-400 hover:text-neutral-200">Terms</a>
          <a href="/contact" className="text-neutral-400 hover:text-neutral-200">Contact</a>
        </div>
      </div>
    </footer>
  );
};

export default CustomFooter;
