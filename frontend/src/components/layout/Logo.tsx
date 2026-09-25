import Link from "next/link";
import Image from "next/image";
import { clsx } from "clsx";

type LogoSize = "sm" | "md" | "lg" | "xl";
type LogoVariant = "full" | "icon" | "wordmark";

interface LogoProps {
  /**
   * Optional navigation target.
   * Leave undefined when a parent already wraps Logo in <Link>
   * (avoids nested <a> hydration errors).
   */
  href?: string;
  size?: LogoSize;
  variant?: LogoVariant;
  className?: string;
  showText?: boolean;
  priority?: boolean;
  /** Inverts/pads logo plate on dark backgrounds */
  invertPlate?: boolean;
}

const sizeMap: Record<
  LogoSize,
  { full: { w: number; h: number }; icon: { w: number; h: number }; text: string }
> = {
  sm: { full: { w: 120, h: 36 }, icon: { w: 28, h: 28 }, text: "text-sm" },
  md: { full: { w: 152, h: 44 }, icon: { w: 36, h: 36 }, text: "text-base" },
  lg: { full: { w: 200, h: 56 }, icon: { w: 48, h: 48 }, text: "text-lg" },
  xl: { full: { w: 260, h: 72 }, icon: { w: 64, h: 64 }, text: "text-xl" },
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
      <Image
        src="/brand/logo.png"
        alt="IHI — Innovative Hack Intelligence"
        width={s.full.w}
        height={s.full.h}
        priority={priority}
        className={clsx(
          "object-contain object-left",
          invertPlate && "rounded-sm bg-white p-0.5"
        )}
      />
    ) : (
      <Image
        src="/brand/logo.png"
        alt="IHI"
        width={s.icon.w}
        height={s.icon.h}
        priority={priority}
        className={clsx(
          "object-contain",
          invertPlate && "rounded-sm bg-white p-0.5"
        )}
      />
    );

  const content = (
    <span
      className={clsx(
        "inline-flex select-none items-center gap-2.5",
        "transition-opacity duration-200 hover:opacity-90",
        className
      )}
    >
      {mark}
      {showText && variant !== "full" && (
        <span
          className={clsx(
            "font-display font-bold tracking-tight text-black theme-tower:text-white",
            s.text
          )}
        >
          IHI
          <span className="ml-1.5 hidden text-[0.7em] font-medium text-gray-500 theme-tower:text-gray-400 sm:inline">
            Intelligence
          </span>
        </span>
      )}
    </span>
  );

  if (!href) return content;

  return (
    <Link
      href={href}
      className="inline-flex rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-gold focus-visible:ring-offset-2"
      aria-label="IHI home"
    >
      {content}
    </Link>
  );
}