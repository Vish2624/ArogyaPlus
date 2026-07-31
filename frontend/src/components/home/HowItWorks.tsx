import { CalendarCheck, ClipboardCheck, FileHeart, Search } from "lucide-react";
import type { LucideIcon } from "lucide-react";

const ICONS: Record<string, LucideIcon> = {
  Search,
  CalendarCheck,
  ClipboardCheck,
  FileHeart,
};

const TITLE = "Booking in Four Simple Steps";

const STEPS = [
  { icon: "Search", title: "Pick a Package", description: "Browse packages and choose what fits your health goals." },
  { icon: "CalendarCheck", title: "Book a Slot", description: "Select a convenient date and time." },
  { icon: "ClipboardCheck", title: "Sample Collected", description: "A certified professional collects the sample safely." },
  { icon: "FileHeart", title: "Get Your Report", description: "Receive your digital report and review the findings." },
];

export default function HowItWorks() {
  return (
    <section id="how-it-works" className="section scroll-mt-24 bg-slate-50">
      <div className="container-page">
        <div className="text-center">
          <p className="eyebrow text-primary-600">How It Works</p>
          <h2 className="mt-2 text-page-title font-bold text-slate-900">{TITLE}</h2>
        </div>

        <div className="relative mt-14 grid gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
          <div
            className="absolute left-[12.5%] right-[12.5%] top-7 hidden h-0.5 bg-gradient-to-r from-primary-100 via-primary-400 to-primary-100 lg:block"
            aria-hidden="true"
          />
          {STEPS.map((step, index) => {
            const Icon = ICONS[step.icon] ?? Search;
            return (
              <div key={`${step.title}-${index}`} className="relative text-center">
                <div className="relative z-10 mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-primary-600 text-white shadow-lg shadow-primary-600/25 ring-8 ring-white">
                  <Icon className="h-6 w-6" aria-hidden="true" />
                </div>
                <p className="mt-4 text-xs font-bold text-primary-600">STEP {index + 1}</p>
                <h3 className="mt-1 text-base font-semibold text-slate-900">{step.title}</h3>
                <p className="mt-1.5 text-base leading-7 text-slate-500">{step.description}</p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
