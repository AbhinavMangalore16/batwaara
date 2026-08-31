import Link from 'next/link';
import { ArrowLeft, ShieldCheck, Lock, Eye, Server, CreditCard } from 'lucide-react';
import { CustomNavbar } from '@/components/ui/custom/CustomNavbar';
import CustomFooter from '@/components/ui/custom/CustomFooter';

export const metadata = {
  title: "Privacy Policy — Batwaara",
  description: "Learn how Batwaara protects your financial data and privacy.",
};

export default function PrivacyPolicyPage() {
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
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-white/10 rounded-full text-xs font-mono text-emerald-400">
            <ShieldCheck className="w-4 h-4" /> Privacy & Security Standard
          </div>
          <h1 className="text-4xl sm:text-5xl font-extrabold font-space text-white tracking-tight">
            Privacy Policy
          </h1>
          <p className="text-slate-400 text-sm font-mono">
            Last Updated: September 1, 2026
          </p>
        </div>

        <div className="space-y-10 text-slate-300 leading-relaxed text-sm sm:text-base">
          {/* Section 1 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white font-space font-bold text-lg">
              <Lock className="w-5 h-5 text-emerald-400" />
              1. Information We Collect
            </div>
            <p>
              Batwaara is designed to minimize personal data collection. When you create an account or split expenses:
            </p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li><strong>Account Credentials:</strong> Authenticated via Clerk OAuth (Email, Google, or GitHub). We store only your primary user ID, display name, and avatar URL.</li>
              <li><strong>Group & Expense Data:</strong> Group names, member rosters, expense descriptions, split values, and timestamps stored in Supabase PostgreSQL.</li>
              <li><strong>Receipt Scans:</strong> Images uploaded for AI OCR parsing are processed transiently to extract line items and auto-fill amounts.</li>
            </ul>
          </section>

          {/* Section 2 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white font-space font-bold text-lg">
              <CreditCard className="w-5 h-5 text-cyan-400" />
              2. Payment & Banking Credentials
            </div>
            <p>
              <strong>We never store your credit card numbers, bank account numbers, UPI PINs, or raw banking passwords.</strong>
            </p>
            <p className="text-slate-400">
              When triggering debt settlements via UPI or payment gateways, Batwaara generates direct <code>upi://pay</code> intent links that launch your native mobile banking app (Google Pay, PhonePe, Paytm). All payment authorizations take place inside your bank’s encrypted environment.
            </p>
          </section>

          {/* Section 3 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white font-space font-bold text-lg">
              <Server className="w-5 h-5 text-emerald-400" />
              3. Data Security & Storage
            </div>
            <p>
              All database communications enforce TLS 1.3 encryption in transit. Row-Level Security (RLS) policies inside PostgreSQL strictly isolate group data so only authorized group members can read or modify expense ledgers.
            </p>
          </section>

          {/* Section 4 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <div className="flex items-center gap-3 text-white font-space font-bold text-lg">
              <Eye className="w-5 h-5 text-purple-400" />
              4. Third-Party Services
            </div>
            <p>We utilize trusted developer infrastructure providers:</p>
            <ul className="list-disc list-inside space-y-2 text-slate-400 pl-2">
              <li><strong>Clerk Inc.</strong> — Identity & OAuth management.</li>
              <li><strong>Supabase Inc.</strong> — Managed PostgreSQL database with RLS.</li>
              <li><strong>Formspree Inc.</strong> — Contact form message forwarding.</li>
              <li><strong>Vercel Inc.</strong> — Frontend hosting & privacy-friendly analytics.</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="bg-slate-900/60 border border-white/10 p-6 sm:p-8 rounded-2xl space-y-4 backdrop-blur-md">
            <h2 className="text-white font-space font-bold text-lg">5. Contact & Data Deletion</h2>
            <p className="text-slate-400">
              You may request full deletion of your user account and associated group logs at any time by contacting us at <a href="mailto:abhinavm16104@gmail.com" className="text-emerald-400 hover:underline">abhinavm16104@gmail.com</a>.
            </p>
          </section>
        </div>
      </main>

      <CustomFooter />
    </div>
  );
}
