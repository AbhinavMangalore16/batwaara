'use client';

import { Check, Sparkles } from 'lucide-react';
import { SignUpButton } from '@clerk/nextjs';

export function LandingPricing() {
  const tiers = [
    {
      name: "Alpha Free",
      price: "$0",
      description: "Perfect for casual outings and roommate groups.",
      features: [
        "Equal, Percentage & Exact Splits",
        "Up to 5 active groups",
        "Greedy Debt Simplification",
        "CSV Expense Export",
        "Standard Analytics",
      ],
      cta: "Get Started Free",
      highlighted: false,
    },
    {
      name: "Pro Gamma",
      price: "$9",
      period: "/month",
      description: "For active travelers, housemates, and event planners.",
      features: [
        "Everything in Free",
        "Unlimited Groups & Members",
        "OCR Receipt Scanner (Auto-fill)",
        "AI Financial Insights",
        "Multi-Currency Exchange Conversion",
        "Priority Support",
      ],
      cta: "Start Free 14-Day Trial",
      highlighted: true,
    },
    {
      name: "Enterprise Circle",
      price: "$29",
      period: "/month",
      description: "For organizations, communities, and travel agencies.",
      features: [
        "Everything in Pro Gamma",
        "Custom API Webhooks",
        "Dedicated Supabase RLS Tenant",
        "Automated PDF Invoicing",
        "24/7 Priority Manager",
      ],
      cta: "Contact Enterprise",
      highlighted: false,
    },
  ];

  return (
    <section id="pricing" className="py-16 lg:py-24 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-semibold">
            Flexible Plans
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space mt-2">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-base mt-4 font-sans">
            Choose the plan that fits your bill-splitting needs. All plans include end-to-end encryption.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {tiers.map((tier, idx) => (
            <div
              key={idx}
              className={`rounded-2xl p-8 flex flex-col justify-between transition-all duration-300 relative ${
                tier.highlighted
                  ? "bg-slate-900 border-2 border-emerald-500/80 shadow-xl shadow-emerald-500/10"
                  : "bg-slate-900/40 border border-white/10 hover:border-white/20"
              }`}
            >
              {tier.highlighted && (
                <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 px-3 py-1 bg-emerald-500 text-slate-950 text-xs font-bold font-mono rounded-full flex items-center gap-1">
                  <Sparkles className="w-3 h-3" /> Most Popular
                </div>
              )}

              <div>
                <h3 className="text-2xl font-bold text-white font-space">{tier.name}</h3>
                <p className="text-xs text-slate-400 mt-2 font-sans">{tier.description}</p>

                <div className="my-6 pb-6 border-b border-white/10 flex items-baseline gap-1">
                  <span className="text-4xl font-extrabold text-white font-mono">{tier.price}</span>
                  {tier.period && <span className="text-sm font-mono text-slate-400">{tier.period}</span>}
                </div>

                <ul className="space-y-3 mb-8 text-sm font-sans text-slate-300">
                  {tier.features.map((feat, fIdx) => (
                    <li key={fIdx} className="flex items-center gap-2.5">
                      <Check className="w-4 h-4 text-emerald-400 shrink-0" />
                      <span>{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <SignUpButton mode="modal">
                <button
                  className={`w-full py-3 rounded-xl font-bold font-space text-sm transition-all cursor-pointer ${
                    tier.highlighted
                      ? "bg-gradient-to-r from-emerald-400 to-cyan-400 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/25"
                      : "bg-slate-800 text-white hover:bg-slate-700 border border-white/10"
                  }`}
                >
                  {tier.cta}
                </button>
              </SignUpButton>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
