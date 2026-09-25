import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "full" | "icon" | "wordmark";

interface LogoProps {
  href?: string;
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  showText?: boolean;
  priority?: boolean;
  invertPlate?: boolean;
}

const sizeMap: Record<
  LogoSize,
  { full: { w: number; h: number }; icon: { w: number; h: number }; text: string }
> = {
  sm: { full: { w: 100, h: 30 }, icon: { w: 26, h: 26 }, text: "text-sm" },
  md: { full: { w: 130, h: 38 }, icon: { w: 32, h: 32 }, text: "text-base" },
  lg: { full: { w: 180, h: 50 }, icon: { w: 44, h: 44 }, text: "text-lg" },
  xl: { full: { w: 230, h: 64 }, icon: { w: 58, h: 58 }, text: "text-xl" },
};

export function Logo({
  href,
  size = "md",
  variant = "full",
  className,
  showText = false,
  priority = false,
  invertPlate = false,
}: LogoProps) {
  const s = sizeMap[size];

  const mark =
    variant === "full" ? (
      <div className="relative flex items-center">
        <Image
          src="/brand/logo.png"
          alt="IHI — Innovative Hack Intelligence"
          width={s.full.w}
          height={s.full.h}
          priority={priority}
          className={clsx(
            "object-contain object-left filter brightness-95 contrast-105",
            invertPlate && "rounded-lg bg-black p-1.5 shadow-sm"
          )}
        />
      </div>
    ) : (
      <div className="relative flex items-center">
        <Image
          src="/brand/logo.png"
          alt="IHI"
          width={s.icon.w}
          height={s.icon.h}
          priority={priority}
          className={clsx(
            "object-contain",
            invertPlate && "rounded-lg bg-black p-1.5 shadow-sm"
          )}
        />
      </div>
    );

  const content = (
    <span
      className={clsx(
        "inline-flex select-none items-center gap-2",
        "transition-all duration-300 hover:opacity-95 active:scale-95",
        className
      )}
    >
      {mark}
      {showText && variant !== "full" && (
        <span
          className={clsx(
            "font-serif font-semibold tracking-tight text-[#0A0A0A]",
            s.text
          )}
        >
          IHI
          <span className="ml-1.5 hidden text-[0.75em] font-mono tracking-wider text-[#706F6B] sm:inline">
            CONSOLE
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex rounded-md focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#C6A24A]"
      aria-label="IHI home"
    >
      {content}
    </Link>
  );
}