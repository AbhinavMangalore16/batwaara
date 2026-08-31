'use client';

import { useState } from 'react';
import { ChevronDown, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';

export function LandingFAQ() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const faqs = [
    {
      q: "How does Batwaara split bills?",
      a: "Create a group, add expenses with members, and select equal, percentage, exact, or shares splits. Batwaara calculates net balances and computes the optimal minimum cash transfers to settle all group debts.",
    },
    {
      q: "How does 1-Click UPI Deep Linking work for settlements?",
      a: "When settling debts, Batwaara generates direct upi://pay intent deep-links for Google Pay, PhonePe, Paytm, and BHIM UPI along with dynamic QR codes. You can pay directly from your mobile banking app in a single tap.",
    },
    {
      q: "What happens if a friend in the group delays or refuses to pay?",
      a: "Batwaara provides transparent group debt visibility and automated settlement tracking. Because group balances are updated in real-time, every member sees who has settled up and who is pending.",
    },
    {
      q: "Does Batwaara store my UPI PIN or bank credentials?",
      a: "Never! Batwaara generates direct upi://pay intent links that open your native banking app (GPay, PhonePe, Paytm). All PIN verification and payment authorization occur securely inside your bank's encrypted app.",
    },
    {
      q: "How does the OCR Receipt Scanner work?",
      a: "When adding an expense, upload or drop a receipt photo. Our OCR Space engine automatically extracts merchant name, date, total amount, and category, auto-filling your expense modal in seconds.",
    },
    {
      q: "Can guest members be added without creating an account?",
      a: "Yes! You can onboard guest members using just their name or nickname. Later, when they sign up with Clerk, Batwaara seamlessly links their guest profile to their registered account so no transaction history is lost.",
    },
    {
      q: "How does the AI Voice & Natural Language logger work?",
      a: "You can type or speak prompts like 'Rahul paid 1500 for dinner split with Priya and Alex'. Our AI parsing engine extracts the amount, description, category, and matches group member names automatically.",
    },
    {
      q: "How does Batwaara compare to Splitwise or Venmo?",
      a: "Unlike traditional apps with ads or paywalled OCR scanning, Batwaara is 100% free and developer-first. It features instant 1-Click UPI deep linking, AI Voice logging, and a Greedy Minimum Debt algorithm.",
    },
    {
      q: "How does the Greedy Debt Simplification Algorithm work?",
      a: "Instead of everyone paying everyone back individually (N x N transfers), our algorithm calculates the net balance for each member and computes the absolute minimum number of directed transfers required to clear all group balances.",
    },
    {
      q: "Who can click the 'Settle Up' button?",
      a: "Transfer information is visible to all members for transparency, but the interactive 'Settle Up (UPI)' button is enabled ONLY for the person who owes money (the debtor). For others, it remains disabled displaying 'Waiting for [Payer]'.",
    },
    {
      q: "Can Batwaara handle multi-currency conversions on international trips?",
      a: "Yes! You can record expenses in INR (₹), USD ($), EUR (€), GBP (£), JPY (¥), or CAD ($) with tabular monospaced currency formatting.",
    },
    {
      q: "Is there any limit on group size or total expenses?",
      a: "Zero limits! Whether you're splitting a 2-person coffee run or a 50-person road trip, Batwaara handles unlimited members, expenses, and splits effortlessly.",
    },
    {
      q: "Is my group financial data private and secure?",
      a: "Yes. All data stored in Supabase PostgreSQL is strictly protected with Row-Level Security (RLS) policies and Clerk OAuth authentication. We never store raw payment credentials or sell user data.",
    },
  ];

  return (
    <section id="faq" className="py-16 lg:py-24 relative bg-[#090d16]">
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
                className="bg-slate-900/60 border border-white/10 rounded-2xl overflow-hidden transition-colors shadow-lg"
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? null : idx)}
                  className="w-full px-6 py-4.5 flex items-center justify-between text-left hover:bg-slate-800/40 transition-colors cursor-pointer"
                >
                  <span className="font-space font-semibold text-white text-base sm:text-lg pr-4">
                    {faq.q}
                  </span>
                  <ChevronDown
                    className={`w-5 h-5 text-emerald-400 transition-transform duration-300 shrink-0 ${
                      isOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>

                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.16, 1, 0.3, 1] }}
                      className="overflow-hidden"
                    >
                      <div className="px-6 pb-5 pt-1 text-slate-300 font-sans text-sm border-t border-white/5 leading-relaxed">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
