import Link from 'next/link';
import { ArrowLeft, FileText, Scale, CheckCircle2, AlertTriangle } from 'lucide-react';
import { CustomNavbar } from '@/components/ui/custom/CustomNavbar';
import CustomFooter from '@/components/ui/custom/CustomFooter';

export const metadata = {
  title: "Terms & Conditions — Batwaara",
  description: "Terms of service and usage conditions for Batwaara.",
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#090d16] text-white flex flex-col font-sans">
      <CustomNavbar />

      <main className="flex-1 max-w-4xl mx-auto px-6 py-16 lg:py-24">
        <Link
          href="/"
          className="inline-flex items-center gap-2 text-xs font-mono text-emerald-400 hover:text-emerald-300 mb-8 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back to Home
        </Link>

        <div className="space-y-6 mb-12">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-xs font-mono text-cyan-400">
            <FileText className="w-4 h-4" /> Legal Agreement
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-space text-white tracking-tight">
            Terms & Conditions
          </h1>
          <p className="text-slate-400 text-sm font-mono">
            Last Updated: September 1, 2026
          </p>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white font-space font-bold text-lg">
              <CheckCircle2 className="w-5 h-5 text-emerald-400" />
              1. Acceptance of Terms
            </div>
            <p>
              By accessing or using Batwaara, you agree to be bound by these Terms & Conditions. Batwaara is provided as an open-source, web-based tool for calculating shared group expenses, managing bill splits, and generating debt settlement suggestions.
            </p>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white font-space font-bold text-lg">
              <Scale className="w-5 h-5 text-cyan-400" />
              2. Debt Calculation & Accuracy Disclaimer
            </div>
            <p>
              Batwaara utilizes mathematical algorithms (such as Greedy Minimum Cash Flow) to simplify multi-party debt transfers. While we strive for 100% calculation precision:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li>Users are responsible for verifying expense inputs, currency conversions, and member split proportions before executing payments.</li>
              <li>Batwaara is not a licensed bank, escrow provider, or money service business. We do not hold user funds.</li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white font-space font-bold text-lg">
              <AlertTriangle className="w-5 h-5 text-amber-400" />
              3. User Responsibilities & Acceptable Use
            </div>
            <p>You agree not to:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li>Upload fraudulent receipts or false financial claims to deceive group members.</li>
              <li>Attempt to bypass Row-Level Security policies or gain unauthorized access to other groups.</li>
              <li>Use the service for illegal transactions or money laundering activities.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <h2 className="text-white font-space font-bold text-lg">4. Open Source License & Modifications</h2>
            <p className="text-slate-400">
              The Batwaara platform codebase is open-source under the MIT License. We reserve the right to update these terms as features evolve. Continued use of the platform constitutes acceptance of revised terms.
            </p>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <h2 className="text-white font-space font-bold text-lg">5. Support</h2>
            <p className="text-slate-400">
              For legal inquiries or technical assistance, reach out via our contact form or directly at <a href="mailto:abhinavm16104@gmail.com" className="text-emerald-400 hover:underline">abhinavm16104@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}
