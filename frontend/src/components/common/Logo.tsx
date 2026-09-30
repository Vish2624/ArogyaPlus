import { useId } from "react";
import { LOGO_PATHS } from "@/components/common/logoPaths";

type LogoVariant = "mark" | "tagline" | "full";

interface LogoProps {
  className?: string;
  /**
   * - `mark`: heart + wordmark only (compact spaces like the admin sidebar)
   * - `tagline`: adds "Your Trusted Wellness Partner" under the wordmark
   * - `full`: tagline plus the "Powered by Wallet Edge Technologies" line
   */
  variant?: LogoVariant;
}

// Artwork coordinates come from the original CorelDRAW export (public/logo.svg).
const VIEW_X = 1886;
const VIEW_Y = 7458;
const VIEW_W = 17227;
const HEIGHT: Record<LogoVariant, number> = { mark: 5250, tagline: 6084, full: 7520 };

// Left/right edges of the "Arogya Plus" wordmark, used to justify the tagline under it.
const WORDMARK_X = 9230;
const WORDMARK_W = 9830;

export default function Logo({ className = "h-12 w-auto", variant = "full" }: LogoProps) {
  const gradientId = `arogya-heart-gradient-${useId().replace(/:/g, "")}`;
  const label =
    variant === "full"
      ? "ArogyaPlus – Your Trusted Wellness Partner. Powered by Wallet Edge Technologies"
      : variant === "tagline"
        ? "ArogyaPlus – Your Trusted Wellness Partner"
        : "ArogyaPlus";

  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox={`${VIEW_X} ${VIEW_Y} ${VIEW_W} ${HEIGHT[variant]}`}
      className={className}
      role="img"
      aria-label={label}
      style={{ fillRule: "evenodd", clipRule: "evenodd" }}
    >
      <defs>
        <linearGradient id={gradientId} gradientUnits="userSpaceOnUse" x1="5860.92" y1="11413.5" x2="8801.34" y2="10984.5">
          <stop offset="0" stopColor="#1D4334" />
          <stop offset="0.141176" stopColor="#3C3030" />
          <stop offset="1" stopColor="#5B1D2B" />
        </linearGradient>
      </defs>

      {LOGO_PATHS.map(({ fill, d }, i) => (
        <path key={i} d={d} fill={fill.startsWith("url(") ? `url(#${gradientId})` : fill} />
      ))}

      {variant !== "mark" && (
        <text
          x={WORDMARK_X}
          y={13380}
          textLength={WORDMARK_W}
          lengthAdjust="spacing"
          fill="#3E5A4D"
          style={{ fontFamily: "Inter, system-ui, sans-serif", fontSize: 720, fontWeight: 600 }}
        >
          Your Trusted Wellness Partner
        </text>
      )}

      {variant === "full" && (
        <text
          x={VIEW_X + VIEW_W / 2}
          y={14760}
          textAnchor="middle"
          fill="#1D4334"
          style={{ fontFamily: "'Plus Jakarta Sans', Inter, system-ui, sans-serif", fontSize: 760, fontWeight: 700 }}
        >
          Powered by Wallet Edge Technologies
        </text>
      )}
    </svg>
  );
}
