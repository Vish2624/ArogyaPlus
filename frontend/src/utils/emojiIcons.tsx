import { Award, Bell, CheckCircle2, CreditCard, Home, Microscope, ShieldCheck, Star, Stethoscope, Zap } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const EMOJI_TO_ICON: Record<string, LucideIcon> = {
  "🏅": Award,
  "🏠": Home,
  "⚡": Zap,
  "👨‍⚕️": Stethoscope,
  "💳": CreditCard,
  "🔔": Bell,
  "⭐": Star,
  "🔬": Microscope,
  "🇦🇪": ShieldCheck,
  "✅": CheckCircle2,
};

interface EmojiIconProps {
  emoji: string;
  className?: string;
}

/** Renders a mapped Lucide icon for known emoji, falling back to the raw
 * character for anything an admin enters that isn't in the map. */
export default function EmojiIcon({ emoji, className }: EmojiIconProps) {
  const Icon = EMOJI_TO_ICON[emoji.trim()];
  if (!Icon) return <span className={className}>{emoji}</span>;
  return <Icon className={className} aria-hidden="true" />;
}
