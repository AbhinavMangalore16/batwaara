"use client";

import React from "react";
import { motion } from "motion/react";
import { SignUpButton, useUser } from "@clerk/nextjs";
import Link from "next/link";
import { ArrowRight, Zap, ShieldCheck } from "lucide-react";

export function IntegrationsSection() {
  const { isSignedIn } = useUser();

  const paymentLogos = [
    {
      name: "Google Pay",
      src: "/integrations/payments/gpay.png",
      pos: "top-4 left-12 md:top-6 md:left-16",
      size: "w-14 h-14 md:w-16 md:h-16",
    },
    {
      name: "PhonePe",
      src: "/integrations/payments/PhonePe_Logo.svg.webp",
      pos: "top-4 right-12 md:top-6 md:right-16",
      size: "w-14 h-14 md:w-16 md:h-16",
    },
    {
      name: "UPI Universal",
      src: "/integrations/payments/UPI-Logo-vector.svg.webp",
      pos: "top-1/2 -translate-y-1/2 -left-3 md:-left-4",
      size: "w-16 h-16 md:w-20 md:h-20",
    },
    {
      name: "Paytm",
      src: "/integrations/payments/Paytm_logo.png",
      pos: "top-1/2 -translate-y-1/2 -right-3 md:-right-4",
      size: "w-16 h-16 md:w-20 md:h-20",
    },
    {
      name: "WhatsApp Pay",
      src: "https://upload.wikimedia.org/wikipedia/commons/6/6b/WhatsApp.svg",
      pos: "bottom-4 left-12 md:bottom-6 md:left-16",
      size: "w-14 h-14 md:w-16 md:h-16",
    },
    {
      name: "BHIM / CRED",
      src: "https://upload.wikimedia.org/wikipedia/commons/e/e1/UPI-Logo-vector.svg",
      pos: "bottom-4 right-12 md:bottom-6 md:right-16",
      size: "w-14 h-14 md:w-16 md:h-16",
    },
  ];

  return (
    <section className="relative w-full py-20 lg:py-28 px-4 sm:px-6 lg:px-8 bg-[#090d16] overflow-hidden border-b border-white/5">
      {/* Glow Orbs background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/2 left-1/4 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-500/10 rounded-full blur-[120px] opacity-40" />
        <div className="absolute top-1/2 right-1/4 -translate-y-1/2 w-[400px] h-[400px] bg-cyan-500/10 rounded-full blur-[100px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
        {/* Left Side: Orbiting Glass Logo Grid */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          whileInView={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-6 flex justify-center"
        >
          <div className="relative w-[340px] h-[340px] sm:w-[420px] sm:h-[420px] md:w-[460px] md:h-[460px] flex items-center justify-center">
            {/* Background concentric orbit rings */}
            <div className="absolute inset-0 rounded-full border border-white/5 bg-slate-950/40 backdrop-blur-md shadow-2xl" />
            <div className="absolute inset-10 sm:inset-12 rounded-full border border-white/10 bg-slate-900/30" />
            <div className="absolute inset-24 sm:inset-28 rounded-full border border-emerald-500/20 bg-emerald-500/5 animate-pulse" />

            {/* Center Logo Card (Batwaara Core) */}
            <motion.div
              animate={{ scale: [1, 1.03, 1] }}
              transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
              className="relative z-20 w-24 h-24 sm:w-28 sm:h-28 md:w-32 md:h-32 rounded-2xl sm:rounded-3xl bg-slate-900/90 border-2 border-emerald-500/60 p-4 shadow-[0_0_40px_rgba(16,185,129,0.35)] flex items-center justify-center backdrop-blur-xl group"
            >
              <img
                src="/batwara-logo.png"
                alt="Batwaara"
                className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
              />
              <div className="absolute -bottom-2.5 px-2.5 py-0.5 bg-emerald-500 text-slate-950 text-[10px] font-mono font-bold rounded-full shadow-md uppercase tracking-wider">
                Batwaara Pay
              </div>
            </motion.div>

            {/* Satellite Payment App Tiles */}
            {paymentLogos.map((logo, idx) => (
              <motion.div
                key={logo.name}
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1, duration: 0.4 }}
                viewport={{ once: true }}
                whileHover={{ scale: 1.15, zIndex: 30 }}
                className={`absolute ${logo.pos} ${logo.size} rounded-2xl bg-slate-900/85 border border-white/15 p-2.5 sm:p-3 shadow-xl backdrop-blur-md flex items-center justify-center cursor-pointer hover:border-emerald-400 hover:shadow-[0_0_25px_rgba(16,185,129,0.4)] transition-all group`}
              >
                <img
                  src={logo.src}
                  alt={logo.name}
                  className="w-full h-full object-contain filter drop-shadow transition-transform duration-300 group-hover:scale-105"
                />
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Right Side: Copy & Action */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6 }}
          viewport={{ once: true }}
          className="lg:col-span-6 space-y-6 text-left"
        >

          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-white font-space tracking-tight leading-tight">
            Integrate with your <br className="hidden sm:block" />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-300 to-indigo-300">
              favorite payment apps
            </span>
          </h2>

          <p className="text-slate-300 text-base sm:text-lg font-sans leading-relaxed">
            Connect seamlessly with popular platforms and services — <strong className="text-white">PhonePe, Google Pay, Paytm, and BHIM UPI</strong> — to clear group debts in a single tap without manual VPA copy-pasting.
          </p>


          <div className="pt-4">
            {isSignedIn ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm rounded-xl font-space shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all cursor-pointer"
              >
                Go to Dashboard <ArrowRight className="w-4 h-4" />
              </Link>
            ) : (
              <SignUpButton mode="modal">
                <button className="inline-flex items-center gap-2.5 px-6 py-3 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold text-sm rounded-xl font-space shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 hover:scale-105 transition-all cursor-pointer">
                  Get Started Free <ArrowRight className="w-4 h-4" />
                </button>
              </SignUpButton>
            )}
          </div>
        </motion.div>
      </div>
    </section>
  );
}

export default IntegrationsSection;
