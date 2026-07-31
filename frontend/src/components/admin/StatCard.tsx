import type { LucideIcon } from "lucide-react";

type StatCardColor = "primary" | "accent" | "gold" | "slate";

const COLOR_STYLES: Record<StatCardColor, string> = {
  primary: "bg-primary-50 text-primary-700",
  accent: "bg-accent-50 text-accent-700",
  gold: "bg-gold-50 text-gold-600",
  slate: "bg-slate-100 text-slate-600",
};

interface StatCardProps {
  icon: LucideIcon;
  label: string;
  value: number | string;
  color?: StatCardColor;
}

export default function StatCard({ icon: Icon, label, value, color = "primary" }: StatCardProps) {
  return (
    <div className="card flex items-center gap-4 p-5 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-hover">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ${COLOR_STYLES[color]}`}>
        <Icon className="h-5 w-5" aria-hidden="true" />
      </div>
      <div>
        <p className="text-2xl font-bold text-slate-900">{value}</p>
        <p className="text-xs text-slate-500">{label}</p>
      </div>
    </div>
  );
}
