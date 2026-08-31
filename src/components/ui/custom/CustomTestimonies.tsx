"use client";

import React from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Card, CardContent } from "@/components/ui/card";
import { Marquee } from "@/components/ui/3d-testimonails";

const testimonials = [
  {
    name: "Rohan Sharma",
    username: "@rohan_mumbai",
    body: "Batwaara turned 40 messy Goa trip expenses into just 3 direct UPI transfers! Pure magic.",
    img: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    country: "🇮🇳 Mumbai",
  },
  {
    name: "Ananya Sen",
    username: "@ananya_s",
    body: "The AI receipt OCR scanner is insane! I dropped a long dinner bill and it auto-filled everything.",
    img: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    country: "🇮🇳 Bengaluru",
  },
  {
    name: "Mateo Rossi",
    username: "@mat_euro",
    body: "Multi-currency support in EUR & USD made our Eurotrip settlement effortless.",
    img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    country: "🇮🇹 Rome",
  },
  {
    name: "Priya Nair",
    username: "@priya_nair",
    body: "1-Click UPI deep linking with PhonePe & GPay saves us so much time after flat rent payments.",
    img: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    country: "🇮🇳 Delhi",
  },
  {
    name: "Lucas Vance",
    username: "@lucas_v",
    body: "Greedy debt simplification math is brilliant. No more N x N transfer chaos!",
    img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    country: "🇺🇸 San Francisco",
  },
  {
    name: "Haruto Sato",
    username: "@haruto_tokyo",
    body: "Voice expense logging lets me speak 'Rahul paid 1500 for dinner' and it just splits!",
    img: "https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80",
    country: "🇯🇵 Tokyo",
  },
  {
    name: "Sophia Martinez",
    username: "@sophia_m",
    body: "100% free and developer-first. Replaced Splitwise completely for our housemates.",
    img: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    country: "🇪🇸 Madrid",
  },
  {
    name: "Arjun Kapoor",
    username: "@arjun_k",
    body: "Settle Up button authorization ensures only the person who owes can trigger settlements.",
    img: "https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?w=150&auto=format&fit=crop&q=80",
    country: "🇮🇳 Hyderabad",
  },
  {
    name: "Emma Watson",
    username: "@emma_london",
    body: "Beautiful neo-grotesque UI, ultra smooth animations, and total data privacy.",
    img: "https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80",
    country: "🇬🇧 London",
  },
];

function TestimonialCard({ img, name, username, body, country }: (typeof testimonials)[number]) {
  return (
    <Card className="w-[260px] sm:w-80 bg-slate-900/90 border-none backdrop-blur-xl shadow-xl hover:shadow-[0_0_30px_rgba(16,185,129,0.25)] transition-all duration-300 cursor-pointer group/card shrink-0">
      <CardContent className="p-4 sm:p-5 space-y-3 sm:space-y-3.5">
        <div className="flex items-center gap-3 sm:gap-3.5">
          <Avatar className="h-10 w-10 sm:h-11 sm:w-11 border border-white/10 group-hover/card:border-emerald-400/50 transition-colors">
            <AvatarImage src={img} alt={name} />
            <AvatarFallback>{name[0]}</AvatarFallback>
          </Avatar>
          <div className="flex flex-col overflow-hidden">
            <figcaption className="text-xs sm:text-base font-bold text-white font-space truncate flex items-center gap-1.5">
              {name} <span className="text-[10px] sm:text-xs font-normal text-slate-400">{country}</span>
            </figcaption>
            <p className="text-[10px] sm:text-xs font-mono text-emerald-400 truncate">{username}</p>
          </div>
        </div>
        <blockquote className="text-xs sm:text-sm font-sans text-slate-300 leading-relaxed italic">
          "{body}"
        </blockquote>
      </CardContent>
    </Card>
  );
}

export function CustomTestimonies() {
  return (
    <section className="py-8 sm:py-12 lg:py-20 bg-[#090d16] relative overflow-hidden flex flex-col items-center justify-center">
      <div className="relative flex h-[460px] sm:h-[580px] lg:h-[640px] w-full max-w-7xl flex-row items-center justify-center overflow-hidden gap-4 sm:gap-6 [perspective:1200px] px-2 sm:px-4">
        <div
          className="flex flex-row items-center gap-4 sm:gap-6 lg:gap-8 transform-gpu will-change-transform"
          style={{
            transform:
              "translateX(0px) translateY(0px) translateZ(0px) rotateX(12deg) rotateY(-6deg) rotateZ(8deg)",
          }}
        >
          {/* Vertical Marquee 1 */}
          <Marquee vertical pauseOnHover repeat={4} className="[--duration:35s]">
            {testimonials.slice(0, 3).map((review) => (
              <TestimonialCard key={review.username} {...review} />
            ))}
          </Marquee>

          {/* Vertical Marquee 2 */}
          <Marquee vertical pauseOnHover reverse repeat={4} className="[--duration:40s]">
            {testimonials.slice(3, 6).map((review) => (
              <TestimonialCard key={`col2-${review.username}`} {...review} />
            ))}
          </Marquee>

          {/* Vertical Marquee 3 (Visible on tablet & desktop) */}
          <Marquee vertical pauseOnHover repeat={4} className="[--duration:35s] hidden md:flex">
            {testimonials.slice(6, 9).map((review) => (
              <TestimonialCard key={`col3-${review.username}`} {...review} />
            ))}
          </Marquee>

          {/* Vertical Marquee 4 (Visible on desktop) */}
          <Marquee vertical pauseOnHover reverse repeat={4} className="[--duration:40s] hidden lg:flex">
            {testimonials.slice(0, 3).map((review) => (
              <TestimonialCard key={`col4-${review.username}`} {...review} />
            ))}
          </Marquee>

          {/* Vertical Marquee 5 (Visible on extra-wide screens) */}
          <Marquee vertical pauseOnHover repeat={4} className="[--duration:38s] hidden xl:flex">
            {testimonials.slice(3, 6).map((review) => (
              <TestimonialCard key={`col5-${review.username}`} {...review} />
            ))}
          </Marquee>

          {/* Multi-stop smooth fade overlays so borders disappear gradually */}
          <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-[#090d16] via-[#090d16]/90 via-[#090d16]/40 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-x-0 bottom-0 h-2/5 bg-gradient-to-t from-[#090d16] via-[#090d16]/90 via-[#090d16]/40 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 left-0 w-1/4 sm:w-1/3 bg-gradient-to-r from-[#090d16] via-[#090d16]/90 via-[#090d16]/30 to-transparent z-20" />
          <div className="pointer-events-none absolute inset-y-0 right-0 w-1/4 sm:w-1/3 bg-gradient-to-l from-[#090d16] via-[#090d16]/90 via-[#090d16]/30 to-transparent z-20" />
        </div>
      </div>
    </section>
  );
}

export default CustomTestimonies;