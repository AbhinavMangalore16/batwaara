"use client";

import * as React from "react";
import { useEffect, useRef } from "react";
import Link from "next/link";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { cn } from "@/lib/utils";
import { ArrowUpRight, Sparkles } from "lucide-react";
import { IconBrandGithub, IconBrandLinkedin, IconBrandTwitter } from "@tabler/icons-react";

// Register ScrollTrigger safely for React
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

// -------------------------------------------------------------------------
// 1. THEME-ADAPTIVE INLINE STYLES
// -------------------------------------------------------------------------
const STYLES = `
@import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800;900&display=swap');

.cinematic-footer-wrapper {
  font-family: 'Plus Jakarta Sans', sans-serif;
  -webkit-font-smoothing: antialiased;
  
  /* Dynamic Variables using standard shadcn/tailwind v4 tokens */
  --pill-bg-1: color-mix(in oklch, var(--foreground) 5%, transparent);
  --pill-bg-2: color-mix(in oklch, var(--foreground) 2%, transparent);
  --pill-shadow: color-mix(in oklch, var(--background) 50%, transparent);
  --pill-highlight: color-mix(in oklch, var(--foreground) 10%, transparent);
  --pill-inset-shadow: color-mix(in oklch, var(--background) 80%, transparent);
  --pill-border: color-mix(in oklch, var(--foreground) 10%, transparent);
  
  --pill-bg-1-hover: color-mix(in oklch, var(--foreground) 12%, transparent);
  --pill-bg-2-hover: color-mix(in oklch, var(--foreground) 4%, transparent);
  --pill-border-hover: color-mix(in oklch, #10b981 40%, transparent);
  --pill-shadow-hover: color-mix(in oklch, #10b981 20%, transparent);
  --pill-highlight-hover: color-mix(in oklch, var(--foreground) 25%, transparent);
}

@keyframes footer-breathe {
  0% { transform: translate(-50%, -50%) scale(1); opacity: 0.6; }
  100% { transform: translate(-50%, -50%) scale(1.1); opacity: 1; }
}

@keyframes footer-scroll-marquee {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

@keyframes footer-heartbeat {
  0%, 100% { transform: scale(1); filter: drop-shadow(0 0 5px rgba(244, 63, 94, 0.5)); }
  15%, 45% { transform: scale(1.25); filter: drop-shadow(0 0 10px rgba(244, 63, 94, 0.8)); }
  30% { transform: scale(1); }
}

.animate-footer-breathe {
  animation: footer-breathe 8s ease-in-out infinite alternate;
}

.animate-footer-scroll-marquee {
  animation: footer-scroll-marquee 35s linear infinite;
}

.animate-footer-heartbeat {
  animation: footer-heartbeat 2s cubic-bezier(0.25, 1, 0.5, 1) infinite;
}

/* Theme-adaptive Grid Background */
.footer-bg-grid {
  background-size: 60px 60px;
  background-image: 
    linear-gradient(to right, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px),
    linear-gradient(to bottom, color-mix(in oklch, var(--foreground) 3%, transparent) 1px, transparent 1px);
  mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
  -webkit-mask-image: linear-gradient(to bottom, transparent, black 30%, black 70%, transparent);
}

/* Theme-adaptive Aurora Glow */
.footer-aurora {
  background: radial-gradient(
    circle at 50% 50%, 
    rgba(16, 185, 129, 0.15) 0%, 
    rgba(6, 182, 212, 0.12) 40%, 
    transparent 70%
  );
}

/* Glass Pill Theming */
.footer-glass-pill {
  background: linear-gradient(145deg, var(--pill-bg-1) 0%, var(--pill-bg-2) 100%);
  box-shadow: 
      0 10px 30px -10px var(--pill-shadow), 
      inset 0 1px 1px var(--pill-highlight), 
      inset 0 -1px 2px var(--pill-inset-shadow);
  border: 1px solid var(--pill-border);
  backdrop-filter: blur(16px);
  -webkit-backdrop-filter: blur(16px);
  transition: all 0.4s cubic-bezier(0.16, 1, 0.3, 1);
}

.footer-glass-pill:hover {
  background: linear-gradient(145deg, var(--pill-bg-1-hover) 0%, var(--pill-bg-2-hover) 100%);
  border-color: var(--pill-border-hover);
  box-shadow: 
      0 20px 40px -10px var(--pill-shadow-hover), 
      inset 0 1px 1px var(--pill-highlight-hover);
  color: var(--foreground);
}

/* Giant Background Text Masking */
.footer-giant-bg-text {
  font-size: 21vw;
  line-height: 0.75;
  font-weight: 900;
  letter-spacing: -0.05em;
  color: transparent;
  -webkit-text-stroke: 1px color-mix(in oklch, var(--foreground) 8%, transparent);
  background: linear-gradient(180deg, color-mix(in oklch, var(--foreground) 14%, transparent) 0%, transparent 65%);
  -webkit-background-clip: text;
  background-clip: text;
}

/* Metallic Text Glow */
.footer-text-glow {
  background: linear-gradient(180deg, #ffffff 0%, rgba(255, 255, 255, 0.6) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  filter: drop-shadow(0px 0px 30px rgba(16, 185, 129, 0.25));
}
`;

// -------------------------------------------------------------------------
// 2. MAGNETIC BUTTON PRIMITIVE
// -------------------------------------------------------------------------
export type MagneticButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & 
  React.AnchorHTMLAttributes<HTMLAnchorElement> & {
    as?: React.ElementType;
  };

const MagneticButton = React.forwardRef<HTMLElement, MagneticButtonProps>(
  ({ className, children, as: Component = "button", ...props }, forwardedRef) => {
    const localRef = useRef<HTMLElement>(null);

    useEffect(() => {
      if (typeof window === "undefined") return;
      const element = localRef.current;
      if (!element) return;

      const ctx = gsap.context(() => {
        const handleMouseMove = (e: MouseEvent) => {
          const rect = element.getBoundingClientRect();
          const h = rect.width / 2;
          const w = rect.height / 2;
          const x = e.clientX - rect.left - h;
          const y = e.clientY - rect.top - w;

          gsap.to(element, {
            x: x * 0.35,
            y: y * 0.35,
            rotationX: -y * 0.12,
            rotationY: x * 0.12,
            scale: 1.04,
            ease: "power2.out",
            duration: 0.4,
          });
        };

        const handleMouseLeave = () => {
          gsap.to(element, {
            x: 0,
            y: 0,
            rotationX: 0,
            rotationY: 0,
            scale: 1,
            ease: "elastic.out(1, 0.3)",
            duration: 1.2,
          });
        };

        element.addEventListener("mousemove", handleMouseMove as any);
        element.addEventListener("mouseleave", handleMouseLeave);

        return () => {
          element.removeEventListener("mousemove", handleMouseMove as any);
          element.removeEventListener("mouseleave", handleMouseLeave);
        };
      }, element);

      return () => ctx.revert();
    }, []);

    return (
      <Component
        ref={(node: HTMLElement) => {
          (localRef as any).current = node;
          if (typeof forwardedRef === "function") forwardedRef(node);
          else if (forwardedRef) (forwardedRef as any).current = node;
        }}
        className={cn("cursor-pointer", className)}
        {...props}
      >
        {children}
      </Component>
    );
  }
);
MagneticButton.displayName = "MagneticButton";

// -------------------------------------------------------------------------
// 3. MAIN COMPONENT
// -------------------------------------------------------------------------
const MarqueeItem = () => (
  <div className="flex items-center space-x-10 px-6">
    <span>Bill Splitting Redefined</span> <span className="text-emerald-400">✦</span>
    <span>Transparent Debt Tracking</span> <span className="text-cyan-400">✦</span>
    <span>1-Click UPI Settlements</span> <span className="text-emerald-400">✦</span>
    <span>AI OCR Receipt Scanning</span> <span className="text-cyan-400">✦</span>
    <span>100% Free & Open Source</span> <span className="text-emerald-400">✦</span>
  </div>
);

export function CinematicFooter() {
  const wrapperRef = useRef<HTMLDivElement>(null);
  const giantTextRef = useRef<HTMLDivElement>(null);
  const headingRef = useRef<HTMLHeadingElement>(null);
  const linksRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (typeof window === "undefined") return;
    if (!wrapperRef.current) return;

    const ctx = gsap.context(() => {
      gsap.fromTo(
        giantTextRef.current,
        { y: "10vh", scale: 0.8, opacity: 0 },
        {
          y: "0vh",
          scale: 1,
          opacity: 1,
          ease: "power1.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 80%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );

      gsap.fromTo(
        [headingRef.current, linksRef.current],
        { y: 50, opacity: 0 },
        {
          y: 0,
          opacity: 1,
          stagger: 0.15,
          ease: "power3.out",
          scrollTrigger: {
            trigger: wrapperRef.current,
            start: "top 40%",
            end: "bottom bottom",
            scrub: 1,
          },
        }
      );
    }, wrapperRef);

    return () => ctx.revert();
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <>
      <style dangerouslySetInnerHTML={{ __html: STYLES }} />
      
      <div
        ref={wrapperRef}
        className="relative min-h-screen w-full bg-[#090d16]"
        style={{ clipPath: "polygon(0% 0, 100% 0%, 100% 100%, 0 100%)" }}
      >
        <footer className="fixed bottom-0 left-0 flex h-screen w-full flex-col justify-between overflow-hidden bg-[#090d16] text-white cinematic-footer-wrapper">
          
          {/* Ambient Light & Grid Background */}
          <div className="footer-aurora absolute left-1/2 top-1/2 h-[65vh] w-[85vw] -translate-x-1/2 -translate-y-1/2 animate-footer-breathe rounded-[50%] blur-[100px] pointer-events-none z-0" />
          <div className="footer-bg-grid absolute inset-0 z-0 pointer-events-none" />

          {/* Giant background watermark text */}
          <div
            ref={giantTextRef}
            className="footer-giant-bg-text absolute -bottom-[4vh] left-1/2 -translate-x-1/2 whitespace-nowrap z-0 pointer-events-none select-none font-space text-center uppercase"
          >
            BATWAARA
          </div>

          {/* 1. Diagonal Sleek Marquee (Shifted lower down to top-20 md:top-24) */}
          <div className="absolute top-20 md:top-24 lg:top-28 left-0 w-full overflow-hidden border-y border-white/10 bg-slate-950/70 backdrop-blur-md py-3.5 z-10 -rotate-2 scale-110 shadow-2xl">
            <div className="flex w-max animate-footer-scroll-marquee text-xs md:text-sm font-bold tracking-[0.25em] text-slate-300 font-mono uppercase">
              <MarqueeItem />
              <MarqueeItem />
            </div>
          </div>

          {/* 2. Main Center Content */}
          <div className="relative z-10 flex flex-1 flex-col items-center justify-center px-6 mt-24 md:mt-20 w-full max-w-5xl mx-auto">
            <h2
              ref={headingRef}
              className="text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black footer-text-glow font-space tracking-tighter mb-8 sm:mb-10 text-center"
            >
              Ready to split expenses?
            </h2>

            {/* Interactive Magnetic Pills Layout */}
            <div ref={linksRef} className="flex flex-col items-center gap-6 w-full">
              {/* Primary Action Buttons */}
              <div className="flex flex-wrap justify-center gap-4 w-full">
                <MagneticButton
                  as={Link}
                  href="/dashboard"
                  className="px-8 py-4 rounded-full text-slate-950 bg-white hover:bg-slate-100 font-bold font-space text-sm md:text-base flex items-center gap-2.5 group shadow-xl shadow-white/10 transition-all hover:scale-105 cursor-pointer border border-white"
                >
                  <Sparkles className="w-5 h-5 text-slate-950" />
                  Open App Dashboard
                  <ArrowUpRight className="w-4 h-4 text-slate-950 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                </MagneticButton>
                
                <MagneticButton
                  as="a"
                  href="#features"
                  className="footer-glass-pill px-8 py-4 rounded-full text-white font-bold font-space text-sm md:text-base flex items-center gap-2 group"
                >
                  Explore Features
                </MagneticButton>
              </div>

              {/* Secondary Legal & Social Links */}
              <div className="flex flex-wrap justify-center gap-3 md:gap-5 w-full mt-2">
                <MagneticButton as={Link} href="/privacy" className="footer-glass-pill px-5 py-2.5 rounded-full text-slate-300 font-medium text-xs md:text-sm hover:text-emerald-400 transition-colors">
                  Privacy Policy
                </MagneticButton>
                <MagneticButton as={Link} href="/terms" className="footer-glass-pill px-5 py-2.5 rounded-full text-slate-300 font-medium text-xs md:text-sm hover:text-emerald-400 transition-colors">
                  Terms of Service
                </MagneticButton>
                <MagneticButton as="a" href="#contact" className="footer-glass-pill px-5 py-2.5 rounded-full text-slate-300 font-medium text-xs md:text-sm hover:text-emerald-400 transition-colors">
                  Contact & Support
                </MagneticButton>

                <div className="flex items-center gap-2 ml-2">
                  <MagneticButton as="a" href="https://github.com/AbhinavMangalore16" target="_blank" rel="noopener noreferrer" className="footer-glass-pill p-2.5 rounded-full text-slate-400 hover:text-emerald-400">
                    <IconBrandGithub className="w-4 h-4" />
                  </MagneticButton>
                  <MagneticButton as="a" href="https://www.linkedin.com/in/abhinav-mangalore/" target="_blank" rel="noopener noreferrer" className="footer-glass-pill p-2.5 rounded-full text-slate-400 hover:text-cyan-400">
                    <IconBrandLinkedin className="w-4 h-4" />
                  </MagneticButton>
                  <MagneticButton as="a" href="https://x.com/PhoenixRFTA16" target="_blank" rel="noopener noreferrer" className="footer-glass-pill p-2.5 rounded-full text-slate-400 hover:text-emerald-400">
                    <IconBrandTwitter className="w-4 h-4" />
                  </MagneticButton>
                </div>
              </div>
            </div>
          </div>

          {/* 3. Bottom Bar / Credits */}
          <div className="relative z-20 w-full pb-8 px-6 md:px-12 flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-slate-400 text-[10px] md:text-xs font-mono tracking-wider uppercase order-2 md:order-1">
              © {new Date().getFullYear()} Batwaara Inc. All rights reserved.
            </div>

            <div className="footer-glass-pill px-5 py-2.5 rounded-full flex items-center gap-2 order-1 md:order-2 cursor-default border-white/10">
              <span className="text-slate-400 text-[10px] md:text-xs font-mono uppercase tracking-wider">Crafted with</span>
              <span className="animate-footer-heartbeat text-sm text-rose-500">❤</span>
              <span className="text-slate-400 text-[10px] md:text-xs font-mono uppercase tracking-wider">by</span>
              <span className="text-white font-bold font-space text-xs md:text-sm tracking-normal ml-0.5">Abhinav Mangalore</span>
            </div>

            <MagneticButton
              as="button"
              onClick={scrollToTop}
              className="w-11 h-11 rounded-full footer-glass-pill flex items-center justify-center text-slate-300 hover:text-emerald-400 group order-3"
              aria-label="Scroll to top"
            >
              <svg className="w-5 h-5 transform group-hover:-translate-y-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2.5" d="M5 10l7-7m0 0l7 7m-7-7v18"></path>
              </svg>
            </MagneticButton>
          </div>
        </footer>
      </div>
    </>
  );
}

export default CinematicFooter;
