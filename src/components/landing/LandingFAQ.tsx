'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Batwaara split bills?",
      a: "Create a group, add expenses with members, and select equal, percentage, or custom amount splits. Batwaara calculates net balances and computes the optimal minimum cash transfers to settle all group debts.",
    },
    {
      q: "How does the OCR Receipt Scanner work?",
      a: "When adding an expense, upload or drop a receipt photo. Our OCR space engine extracts the merchant name, date, total amount, and category auto-filling your expense modal in seconds.",
    },
    {
      q: "How fast are debt settlements?",
      a: "Settlement calculations are instant! Our greedy debt-simplification algorithm resolves multi-person debt networks into minimum direct transactions immediately. You can click 'Settle Up' and trigger settlement payments anytime.",
    },
    {
      q: "Is my group financial data private?",
      a: "Yes. All data stored in Supabase PostgreSQL is strictly protected with Row-Level Security (RLS) rules and Clerk OAuth authentication. We never store raw payment credentials or sell user data.",
    },
  ];

  return (
    <section id="faq" className="py-16 lg:py-24 border-b border-white/10 relative">
      <div className="max-w-4xl mx-auto px-4 lg:px-8">
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-xs font-mono text-emerald-400 mb-3">
            <HelpCircle className="w-3.5 h-3.5" /> Support & Info
          </div>
          <h2 className="text-3xl sm:text-4xl font-extrabold text-white font-space">
            Frequently Asked Questions
          </h2>
          <p className="text-slate-400 text-sm mt-2 font-sans">
            Everything you need to know about Batwaara settlements, privacy, and OCR scanning.
          </p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openIndex === idx;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 border border-white/10 rounded-xl overflow-hidden transition-colors"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors"
                >
                  <span className="font-space font-semibold text-white text-base sm:text-lg">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-400 transition-transform duration-200 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                {isOpen && (
                  <div className="px-6 pb-5 pt-1 text-slate-300 font-sans text-sm border-t border-white/5 leading-relaxed">
                    {faq.a}
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
