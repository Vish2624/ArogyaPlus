import {
  Activity,
  Bone,
  Brain,
  Droplet,
  HeartPulse,
  Pill,
  ShieldCheck,
  Stethoscope,
  Zap,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

const RULES: [RegExp, LucideIcon][] = [
  [/heart|cardio|essential/i, HeartPulse],
  [/blood|hemat|hemogram/i, Droplet],
  [/hormone|thyroid|diabetes|sugar/i, Zap],
  [/vitamin|nutrition/i, Pill],
  [/bone|ortho/i, Bone],
  [/neuro|brain/i, Brain],
  [/immun|comprehensive/i, ShieldCheck],
  [/specialized|screening/i, Stethoscope],
];

export function iconForCategory(category: string | null | undefined): LucideIcon {
  if (category) {
    const match = RULES.find(([pattern]) => pattern.test(category));
    if (match) return match[1];
  }
  return Activity;
}
