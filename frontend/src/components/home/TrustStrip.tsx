import { Award, Home, Lock, ShieldCheck, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BADGES = [
  { title: "NABH Accredited Labs", subtitle: "Government certified" },
  { title: "HIPAA Compliant", subtitle: "Your data is safe" },
  { title: "Home Collection Available", subtitle: "At your doorstep" },
  { title: "Digital Reports in 48h", subtitle: "With doctor review" },
];

const ICON_RULES: [RegExp, LucideIcon][] = [
  [/certif|accredit|nabh|award/i, Award],
  [/hipaa|secure|privacy|safe|encrypt/i, Lock],
  [/home|doorstep|collection/i, Home],
  [/fast|quick|48|24|hour|hrs|report|digital/i, Timer],
];

function iconFor(title: string): LucideIcon {
  const match = ICON_RULES.find(([pattern]) => pattern.test(title));
  return match ? match[1] : ShieldCheck;
}

export default function TrustStrip() {
  return (
    <div className="border-b border-slate-100 bg-white py-5 sm:py-6">
      <div className="container-page grid grid-cols-2 gap-x-4 gap-y-4 sm:flex sm:flex-wrap sm:items-center sm:justify-center sm:gap-x-10 sm:gap-y-5">
        {BADGES.map((badge, index) => {
          const Icon = iconFor(badge.title);
          return (
            <div key={`${badge.title}-${index}`} className="flex items-center gap-2.5 sm:gap-3">
              <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 ring-4 ring-primary-50 sm:h-10 sm:w-10">
                <Icon className="h-3.5 w-3.5 sm:h-[18px] sm:w-[18px]" aria-hidden="true" />
              </span>
              <div className="min-w-0 leading-tight">
                <p className="text-xs font-bold text-slate-900 sm:text-sm">{badge.title}</p>
                <p className="text-[11px] text-slate-500 sm:text-xs">{badge.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
