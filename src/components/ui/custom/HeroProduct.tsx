"use client";
import React, { useState, useEffect } from "react";
import { ContainerScroll } from "@/components/ui/container-scroll-animation";

export function HeroProduct() {
  const [useFallbackImage, setUseFallbackImage] = useState(false);

  useEffect(() => {
    // Check network Connection API for slow 2g / saveData mode
    if (typeof window !== "undefined" && "connection" in navigator) {
      const conn = (navigator as any).connection;
      if (conn?.saveData || conn?.effectiveType === "2g" || conn?.effectiveType === "slow-2g") {
        setUseFallbackImage(true);
      }
    }
  }, []);

  return (
    <div className="flex flex-col overflow-hidden">
      <ContainerScroll
        titleComponent={
          <>
            <h1 className="text-4xl font-semibold text-black dark:text-white font-space">
              Redefine how you manage <br />
              <span className="text-4xl md:text-[6rem] font-bold mt-1 leading-none text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-indigo-400">
                Group Expenses
              </span>
            </h1>
          </>
        }
      >
        {!useFallbackImage ? (
          <video
            src="/batwara-product.mp4"
            poster="/batwara-product.png"
            autoPlay
            loop
            muted
            playsInline
            onError={() => setUseFallbackImage(true)}
            className="mx-auto rounded-2xl object-cover h-full w-full object-left-top shadow-2xl border border-white/10"
          />
        ) : (
          <img
            src="/batwara-product.png"
            alt="Batwaara Product Demo"
            height={720}
            width={1400}
            className="mx-auto rounded-2xl object-cover h-full w-full object-left-top shadow-2xl border border-white/10"
            draggable={false}
          />
        )}
      </ContainerScroll>
    </div>
  );
}
