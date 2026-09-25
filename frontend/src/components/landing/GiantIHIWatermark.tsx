"use client";

import React from "react";
import { clsx } from "clsx";

/**
 * 3D Isometric { I H I } Illustration (MLH Style)
 * Highly visible, colorful, animated.
 */
export function GiantIHIWatermark({ className }: { className?: string }) {
  // Helper to generate thick 3D isometric shadows
  const get3DShadow = (darkColor: string) => {
    let shadow = "";
    for (let i = 1; i <= 20; i++) {
      shadow += `${i}px ${i}px 0px ${darkColor}${i === 20 ? "" : ", "}`;
    }
    return shadow;
  };

  return (
    <div
      className={clsx(
        "absolute inset-0 z-0 flex items-center justify-center overflow-hidden select-none pointer-events-none",
        className
      )}
      aria-hidden="true"
    >
      {/* 
        We use a wrapper to rotate the entire block isometrically 
        and scale it up so it fills the background.
      */}
      <div className="relative flex -rotate-[15deg] skew-x-[10deg] items-center gap-6 sm:gap-10 md:gap-16 scale-75 md:scale-100 opacity-90">
        
        {/* Left Brace */}
        <span 
          className="font-display text-[10rem] sm:text-[16rem] md:text-[20rem] font-black text-gray-200 animate-float-slow"
          style={{ textShadow: get3DShadow("#D4D4D4"), animationDelay: "0s" }}
        >
          {"{"}
        </span>

        {/* I - Brand Red */}
        <span 
          className="font-display text-[12rem] sm:text-[18rem] md:text-[24rem] font-black text-[#E4574C] animate-float"
          style={{ textShadow: get3DShadow("#B8362B"), animationDelay: "0.2s" }}
        >
          I
        </span>

        {/* H - Brand Gold */}
        <span 
          className="font-display text-[12rem] sm:text-[18rem] md:text-[24rem] font-black text-[#C9A227] animate-float"
          style={{ textShadow: get3DShadow("#9E7E1C"), animationDelay: "0.4s" }}
        >
          H
        </span>

        {/* I - Brand Blue */}
        <span 
          className="font-display text-[12rem] sm:text-[18rem] md:text-[24rem] font-black text-[#3E6FF3] animate-float"
          style={{ textShadow: get3DShadow("#2A50BD"), animationDelay: "0.6s" }}
        >
          I
        </span>

        {/* Right Brace */}
        <span 
          className="font-display text-[10rem] sm:text-[16rem] md:text-[20rem] font-black text-gray-200 animate-float-slow"
          style={{ textShadow: get3DShadow("#D4D4D4"), animationDelay: "0.8s" }}
        >
          {"}"}
        </span>

      </div>
    </div>
  );
}