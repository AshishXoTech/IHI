"use client";

import React from "react";
import { FloatingTechIcons } from "./FloatingTechIcons";

export function Hero3DGraphic() {
  const get3DShadow = (darkColor: string) => {
    let shadow = "";
    for (let i = 1; i <= 16; i++) {
      shadow += `${i}px ${i}px 0px ${darkColor}${i === 16 ? "" : ", "}`;
    }
    return shadow;
  };

  return (
    <div className="relative w-full h-[500px] lg:h-[700px] flex items-center justify-center">
      {/* Orbiting Tech Icons */}
      <FloatingTechIcons className="scale-75 md:scale-100 opacity-80" />

      {/* The Giant Isometric { I H I } */}
      <div className="relative z-10 flex -rotate-[15deg] skew-x-[10deg] items-center gap-4 sm:gap-6 scale-90 lg:scale-110 transition-transform duration-700 hover:scale-[1.15]">
        
        <span 
          className="font-display text-[8rem] md:text-[12rem] font-black text-gray-200 animate-float-slow"
          style={{ textShadow: get3DShadow("#D4D4D4"), animationDelay: "0s" }}
        >
          {"{"}
        </span>

        <span 
          className="font-display text-[10rem] md:text-[14rem] font-black text-[#E4574C] animate-float"
          style={{ textShadow: get3DShadow("#B8362B"), animationDelay: "0.2s" }}
        >
          I
        </span>

        <span 
          className="font-display text-[10rem] md:text-[14rem] font-black text-[#2FB67C] animate-float"
          style={{ textShadow: get3DShadow("#1E875A"), animationDelay: "0.4s" }}
        >
          H
        </span>

        <span 
          className="font-display text-[10rem] md:text-[14rem] font-black text-[#3E6FF3] animate-float"
          style={{ textShadow: get3DShadow("#2A50BD"), animationDelay: "0.6s" }}
        >
          I
        </span>

        <span 
          className="font-display text-[8rem] md:text-[12rem] font-black text-gray-200 animate-float-slow"
          style={{ textShadow: get3DShadow("#D4D4D4"), animationDelay: "0.8s" }}
        >
          {"}"}
        </span>

      </div>
    </div>
  );
}