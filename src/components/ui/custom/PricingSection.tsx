"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Check, Play, Volume2, VolumeX, X, Sparkles, Zap } from "lucide-react";
import { SignUpButton, useUser } from "@clerk/nextjs";

interface PricingTier {
  name: string;
  subtitle: string;
  price: number;
  description: string;
  image: string;
  video: string;
  features: string[];
  highlighted?: boolean;
  buttonText: string;
  buttonVariant: "primary" | "secondary" | "outline";
}

const pricingTiers: PricingTier[] = [
  {
    name: "Tetrahedron",
    subtitle: "Free ",
    price: 0,
    description: "Getting started with small group expenses.",
    image: "/tetrahedron.png",
    video: "/tiers/videos/tetrahedron.mp4",
    features: [
      "Basic bill splitting & equal division",
      "Create up to 3 active groups",
      "Add up to 10 friends per group",
      "Manual expense & settlement entry",
      "Basic settlement history ledger",
      "Clean dark & light mode interface",
    ],
    buttonText: "Start Free",
    buttonVariant: "outline",
  },
  {
    name: "Octahedron",
    subtitle: "Growth",
    price: 99,
    description: "For casual group travel and housemates.",
    image: "/octahedron.png",
    video: "/tiers/videos/octahedron.mp4",
    features: [
      "Unlimited active groups",
      "Add up to 50 friends per group",
      "Image upload for physical receipts",
      "Smart WhatsApp due reminders",
      "Categorized expense breakdown",
      "Export group ledger to CSV",
    ],
    buttonText: "Choose Octahedron",
    buttonVariant: "secondary",
  },
  {
    name: "Dodecahedron",
    subtitle: "Popular ",
    price: 199,
    description: "Recommended for frequent trips and travel.",
    image: "/dodecahedron.png",
    video: "/tiers/videos/dodecahedron.mp4",
    features: [
      "All Octahedron features included",
      "Optimal Greedy Debt Simplification",
      "Multi-currency support & exchange conversion",
      "Monthly financial analytics dashboard",
      "DeepSeek v4 AI Expense Insights",
      "Priority instant push notifications",
    ],
    highlighted: true,
    buttonText: "Get Dodecahedron",
    buttonVariant: "primary",
  },
  {
    name: "Icosahedron",
    subtitle: "Pro ",
    price: 399,
    description: "For power users, large circles & communities.",
    image: "/icosahedron.png",
    video: "/tiers/videos/icosahedron.mp4",
    features: [
      "All Dodecahedron features included",
      "AI OCR Receipt Scanning (Auto-fill)",
      "1-Click NPCI Universal UPI App Deep-Linking",
      "Voice & Natural Language AI expense logger",
      "Unlimited cloud storage for receipts",
      "Early access to new feature releases",
      "Dedicated 24/7 priority support channel",
    ],
    buttonText: "Upgrade to Icosahedron",
    buttonVariant: "secondary",
  },
];

const PricingCard: React.FC<{
  tier: PricingTier;
  index: number;
  onOpenModal: (tier: PricingTier) => void;
}> = ({ tier, index, onOpenModal }) => {
  const { isSignedIn } = useUser();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      viewport={{ once: true }}
      className={`relative rounded-2xl p-5 backdrop-blur-md transition-all duration-300 flex flex-col justify-between ${tier.highlighted
        ? "border-2 border-emerald-500/80 bg-gradient-to-br from-emerald-500/15 via-slate-900/90 to-cyan-500/15 shadow-[0_0_30px_rgba(16,185,129,0.25)] hover:shadow-[0_0_40px_rgba(16,185,129,0.35)]"
        : "border border-white/10 bg-slate-900/60 hover:bg-slate-900/80 hover:border-white/20"
        }`}
    >
      {/* Most Recommended Badge */}
      {tier.highlighted && (
        <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-20">
          <div className="bg-gradient-to-r from-emerald-400 to-cyan-400 px-4 py-1 rounded-full text-xs font-bold text-slate-950 shadow-md flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3" /> Recommended
          </div>
        </div>
      )}

      <div>
        {/* Muted Video Thumbnail */}
        <div
          onClick={() => onOpenModal(tier)}
          className="w-full h-44 mb-5 rounded-xl overflow-hidden relative group border border-white/10 shadow-inner bg-slate-950 cursor-pointer"
        >
          <video
            src={tier.video}
            autoPlay
            loop
            muted
            playsInline
            className="w-full h-full object-cover scale-[1.20] translate-x-[4%] transition-transform duration-500 group-hover:scale-[1.25]"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-80 group-hover:opacity-60 transition-opacity" />

        </div>

        {/* Header */}
        <div className="mb-4">
          <h3
            onClick={() => onOpenModal(tier)}
            className="text-2xl font-bold text-white hover:text-emerald-400 transition-colors cursor-pointer font-space"
          >
            {tier.name}
          </h3>
          <p className="text-xs text-slate-400 mt-0.5 font-mono">{tier.subtitle}</p>
          <p className="text-slate-300 text-xs mt-2 font-sans line-clamp-2">{tier.description}</p>
        </div>

        {/* Pricing */}
        <div className="mb-5 pb-4 border-b border-white/10">
          <div className="flex items-baseline gap-1 font-mono">
            <span className="text-sm text-slate-400">₹</span>
            <span className="text-4xl font-extrabold text-white">{tier.price}</span>
            <span className="text-slate-400 text-xs ml-1">/month</span>
          </div>

        </div>

        {/* Features List */}
        <div className="mb-6 space-y-2.5">
          {tier.features.slice(0, 4).map((feature, idx) => (
            <div key={idx} className="flex items-start gap-2.5">
              <Check className="w-4 h-4 text-emerald-400 flex-shrink-0 mt-0.5" />
              <span className="text-xs text-slate-300 font-sans">{feature}</span>
            </div>
          ))}
          {tier.features.length > 4 && (
            <button
              onClick={() => onOpenModal(tier)}
              className="text-xs  text-emerald-400 hover:underline pt-1 block cursor-pointer"
            >
              + {tier.features.length - 4} more features...
            </button>
          )}
        </div>
      </div>

      {/* CTA Button */}
      <div className="space-y-2">
        <button
          onClick={() => onOpenModal(tier)}
          className="w-full py-2.5 px-4 bg-slate-800 hover:bg-slate-700 border border-white/10 text-emerald-300 font-bold rounded-xl text-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
        >
          <Zap className="w-3.5 h-3.5" /> View Tier Features
        </button>

        {isSignedIn ? (
          <a
            href="/dashboard"
            className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all duration-300 cursor-pointer text-center block text-xs font-space ${tier.buttonVariant === "primary"
              ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
              : tier.buttonVariant === "secondary"
                ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
                : "bg-transparent border border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-900/50"
              }`}
          >
            {tier.buttonText}
          </a>
        ) : (
          <SignUpButton mode="modal">
            <button
              className={`w-full py-2.5 px-4 rounded-xl font-bold transition-all duration-300 cursor-pointer text-xs font-space ${tier.buttonVariant === "primary"
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 hover:shadow-lg hover:shadow-emerald-500/30 hover:scale-[1.02]"
                : tier.buttonVariant === "secondary"
                  ? "bg-slate-800 text-white border border-slate-700 hover:bg-slate-700"
                  : "bg-transparent border border-slate-600 text-slate-300 hover:border-slate-400 hover:bg-slate-900/50"
                }`}
            >
              {tier.buttonText}
            </button>
          </SignUpButton>
        )}
      </div>
    </motion.div>
  );
};

export function PricingSection() {
  const [selectedModalTier, setSelectedModalTier] = useState<PricingTier | null>(null);
  const [isAudioMuted, setIsAudioMuted] = useState(false);
  const [isVideoEnded, setIsVideoEnded] = useState(false);
  const modalVideoRef = useRef<HTMLVideoElement | null>(null);

  const toggleModalAudio = () => {
    if (modalVideoRef.current) {
      modalVideoRef.current.muted = !modalVideoRef.current.muted;
      setIsAudioMuted(modalVideoRef.current.muted);
    }
  };

  const handleTimeUpdate = () => {
    if (!modalVideoRef.current) return;
    const video = modalVideoRef.current;
    const duration = video.duration;
    const currentTime = video.currentTime;

    if (!duration || isNaN(duration)) return;

    // Smoothly fade out audio during the last 1.5 seconds
    const fadeDuration = 1.5;
    const remainingTime = duration - currentTime;

    if (remainingTime <= fadeDuration && remainingTime > 0) {
      const vol = Math.max(0, Math.min(1, remainingTime / fadeDuration));
      video.volume = vol;
    } else if (remainingTime > fadeDuration) {
      video.volume = 1.0;
    }
  };

  useEffect(() => {
    if (selectedModalTier) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [selectedModalTier]);

  return (
    <section className="relative w-full py-16 lg:py-20 px-4 sm:px-6 lg:px-8 bg-[#090d16]">
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-emerald-500/10 rounded-full blur-3xl opacity-40" />
        <div className="absolute bottom-20 right-10 w-72 h-72 bg-cyan-500/10 rounded-full blur-3xl opacity-40" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          viewport={{ once: true }}
          className="text-center mb-12 lg:mb-16"
        >
          <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-semibold">
            Batwaara Membership Tiers
          </span>
          <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-white mb-3 mt-1 font-space">
            Simple, Transparent Pricing
          </h2>
          <p className="text-slate-400 text-sm sm:text-base max-w-2xl mx-auto font-sans">
            Click on any tier card to preview 3D geometry features, audio showcase, and full plan capabilities.
          </p>
        </motion.div>

        {/* Pricing Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-4">
          {pricingTiers.map((tier, index) => (
            <PricingCard
              key={tier.name}
              tier={tier}
              index={index}
              onOpenModal={(t) => {
                setSelectedModalTier(t);
                setIsAudioMuted(false);
                setIsVideoEnded(false);
              }}
            />
          ))}
        </div>

        {/* TIER FEATURES DETAILED MODAL WITH SINGLE PLAY & AUDIO FADE OUT VIDEO */}
        <AnimatePresence>
          {selectedModalTier && (
            <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/85 backdrop-blur-md overflow-y-auto">
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="bg-[#0b0f19] border border-white/10 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-6 relative my-8"
              >
                {/* Close Button */}
                <button
                  onClick={() => setSelectedModalTier(null)}
                  className="absolute top-4 right-4 text-slate-400 hover:text-white p-1.5 rounded-xl bg-slate-900/80 border border-white/10 hover:bg-slate-800 transition-colors z-30 cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>

                {/* Video Player Header (Plays Once & Freezes on Final Frame with Audio Fade Out) */}
                <div className="relative w-full h-64 sm:h-72 rounded-xl overflow-hidden border border-white/10 bg-slate-950 shadow-inner">
                  <video
                    ref={modalVideoRef}
                    src={selectedModalTier.video}
                    autoPlay
                    playsInline
                    muted={isAudioMuted}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => {
                      setIsVideoEnded(true);
                      if (modalVideoRef.current) modalVideoRef.current.volume = 0;
                    }}
                    onPlay={() => {
                      setIsVideoEnded(false);
                      if (modalVideoRef.current) modalVideoRef.current.volume = 1.0;
                    }}
                    className="w-full h-full object-cover scale-[1.20] translate-x-[4%]"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#0b0f19] via-transparent to-transparent opacity-90" />

                  {/* Sound Toggle Control Overlay */}
                  <div className="absolute top-4 left-4 z-20 flex items-center gap-2">
                    <button
                      onClick={toggleModalAudio}
                      className="px-3 py-1.5 bg-slate-950/80 hover:bg-slate-900 backdrop-blur-md border border-white/20 rounded-xl text-xs font-mono text-emerald-400 font-bold flex items-center gap-2 shadow-lg transition-colors cursor-pointer"
                    >
                      {isAudioMuted ? (
                        <>
                          <VolumeX className="w-4 h-4 text-rose-400" />
                        </>
                      ) : (
                        <>
                          <Volume2 className="w-4 h-4 text-emerald-400 animate-pulse" />
                        </>
                      )}
                    </button>

                  </div>

                  {/* Tier Title overlay */}
                  <div className="absolute bottom-4 left-4 right-4 z-20 flex items-end justify-between">
                    <div>
                      <span className="text-xs font-mono uppercase text-emerald-400 tracking-wider font-bold">
                        {selectedModalTier.subtitle}
                      </span>
                      <h3 className="text-3xl font-extrabold text-white font-space">
                        {selectedModalTier.name} Tier
                      </h3>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-3xl font-bold text-emerald-400">
                        ₹{selectedModalTier.price}
                      </span>
                      <span className="text-slate-400 text-xs">/month</span>
                    </div>
                  </div>
                </div>

                {/* Description */}
                <p className="text-slate-300 text-sm font-sans leading-relaxed">
                  {selectedModalTier.description}
                </p>

                {/* Full Features Breakdown List */}
                <div className="space-y-3 pt-2 border-t border-white/10">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-slate-400 font-bold">
                    Included Tier Features & Capabilities:
                  </h4>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {selectedModalTier.features.map((feat, idx) => (
                      <div
                        key={idx}
                        className="bg-slate-900/80 border border-white/5 p-3 rounded-xl flex items-start gap-2.5"
                      >
                        <Check className="w-4 h-4 text-emerald-400 shrink-0 mt-0.5" />
                        <span className="text-xs text-slate-200 font-sans">{feat}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Footer Action */}
                <div className="pt-4 border-t border-white/10 flex items-center justify-between gap-4">
                  <button
                    onClick={() => setSelectedModalTier(null)}
                    className="px-4 py-2.5 text-xs font-mono text-slate-400 hover:text-white cursor-pointer"
                  >
                    Close Preview
                  </button>
                  <SignUpButton mode="modal">
                    <button className="px-6 py-2.5 bg-gradient-to-r from-emerald-500 to-cyan-500 text-slate-950 font-bold rounded-xl text-xs font-space shadow-lg shadow-emerald-500/25 hover:shadow-emerald-500/40 transition-all cursor-pointer">
                      Get Started with {selectedModalTier.name} ⚡
                    </button>
                  </SignUpButton>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}

export default PricingSection;
