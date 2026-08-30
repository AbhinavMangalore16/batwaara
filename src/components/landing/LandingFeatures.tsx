'use client';

import { Check, ShieldCheck, Zap, Sparkles, PieChart, Receipt, Layers, Users } from 'lucide-react';

export function LandingFeatures() {
  const featureList = [
    {
      icon: Users,
      title: "Settle debts effectively",
      description: "Track shared expenses without the drama. We handle the math so you don't have to send awkward 'you owe me' texts.",
      badge: "Group Management",
    },
    {
      icon: Receipt,
      title: "Receipts? Just snap 'em",
      description: "Don't type out numbers manually. Our OCR engine scans receipt photos, extracts amounts, and itemizes them instantly.",
      badge: "OCR Scanner",
    },
    {
      icon: Zap,
      title: "The 'Lazy Math' Engine",
      description: "Why make 10 transfers when 1 will do? We calculate the optimal minimum path to settle debts so money doesn't go in circles.",
      badge: "Greedy Debt Algorithm",
    },
    {
      icon: Layers,
      title: "The Live Scoreboard",
      description: "No more guessing. Your dashboard shows exactly who owes you (and who you need to pay) right this second.",
      badge: "Real-Time Balances",
    },
    {
      icon: Sparkles,
      title: "AI Financial Insights",
      description: "Powered by AI, Batwaara generates conversational summaries of group spending trends.",
      badge: "AI DeepSeek v4",
    },
    {
      icon: PieChart,
      title: "Visual Category Breakdown",
      description: "Interactive Recharts donut and bar charts giving full spending clarity per category and per member.",
      badge: "Visual Analytics",
    },
  ];

  return (
    <section id="features" className="py-16 lg:py-24 border-b border-white/10 relative">
      <div className="max-w-7xl mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-semibold">
            Next-Gen Expense Technology
          </span>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space mt-2">
            Packed with Powerful Features
          </h2>
          <p className="text-slate-400 text-base mt-4 font-sans">
            Batwaara simplifies group expenses with real-time tracking, AI-optimized settlements, OCR image parsing, and total financial transparency.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featureList.map((f, idx) => {
            const IconComponent = f.icon;
            return (
              <div
                key={idx}
                className="bg-slate-900/60 backdrop-blur-md border border-white/10 hover:border-emerald-500/40 rounded-2xl p-6 space-y-4 transition-all duration-200 hover:shadow-xl hover:shadow-emerald-500/10 group"
              >
                <div className="flex items-center justify-between">
                  <div className="w-12 h-12 rounded-xl bg-slate-800 border border-white/10 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
                    <IconComponent className="w-6 h-6" />
                  </div>
                  <span className="px-2.5 py-1 bg-slate-950 border border-white/10 rounded-md text-[10px] font-mono text-emerald-400">
                    {f.badge}
                  </span>
                </div>

                <h3 className="text-xl font-bold text-white font-space group-hover:text-emerald-400 transition-colors">
                  {f.title}
                </h3>

                <p className="text-sm text-slate-400 font-sans leading-relaxed">
                  {f.description}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
