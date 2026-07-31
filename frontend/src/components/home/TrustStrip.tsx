import { Award, Home, Lock, ShieldCheck, Timer } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const BADGES = [
  { title: "NABH Accredited Labs", subtitle: "Government certified" },
  { title: "HIPAA Compliant", subtitle: "Your data is safe" },
  { title: "Free Home Collection", subtitle: "At your doorstep" },
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
    <div className="border-b border-slate-100 bg-white py-6">
      <div className="container-page flex flex-wrap items-center justify-center gap-x-10 gap-y-5">
        {BADGES.map((badge, index) => {
          const Icon = iconFor(badge.title);
          return (
            <div key={`${badge.title}-${index}`} className="flex items-center gap-3">
              <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary-100 text-primary-700 ring-4 ring-primary-50">
                <Icon className="h-[18px] w-[18px]" aria-hidden="true" />
              </span>
              <div className="leading-tight">
                <p className="text-sm font-bold text-slate-900">{badge.title}</p>
                <p className="text-xs text-slate-500">{badge.subtitle}</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
