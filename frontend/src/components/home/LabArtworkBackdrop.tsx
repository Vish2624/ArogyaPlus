import { Beaker, Dna, FlaskConical, Leaf, Microscope, Pipette, TestTubes } from "lucide-react";

interface LabArtworkBackdropProps {
  className?: string;
  /** Smaller, tighter arrangement for compact boxes like page headers, instead of a full section. */
  compact?: boolean;
}

/**
 * Ambient decorative layer of lab-themed icon "artwork" + soft blurred blobs, used behind
 * page headers and section intros for visual texture. Purely decorative (aria-hidden,
 * pointer-events-none) — never place interactive content inside it. Hidden below `sm:` so it
 * never competes with text for space on narrow screens.
 */
export default function LabArtworkBackdrop({ className = "", compact = false }: LabArtworkBackdropProps) {
  if (compact) {
    return (
      <div
        className={`pointer-events-none absolute inset-0 hidden overflow-hidden sm:block ${className}`}
        aria-hidden="true"
      >
        <div className="absolute -bottom-16 -right-16 h-64 w-64 rounded-full bg-gradient-to-br from-primary-100 via-primary-50 to-transparent blur-2xl" />
        <Microscope className="absolute -bottom-2 right-2 h-20 w-20 text-primary-200/60 lg:h-24 lg:w-24" />
        <TestTubes className="absolute bottom-2 right-24 hidden h-12 w-12 -rotate-12 text-primary-300/50 lg:block lg:right-28" />
        <Leaf className="absolute bottom-14 right-12 h-7 w-7 rotate-12 text-accent-300/60 lg:h-8 lg:w-8" />
      </div>
    );
  }

  return (
    <div className={`pointer-events-none absolute inset-0 hidden overflow-hidden sm:block ${className}`} aria-hidden="true">
      <div className="absolute -bottom-28 -right-28 h-[32rem] w-[32rem] rounded-full bg-gradient-to-br from-primary-100 via-primary-50 to-transparent blur-2xl" />
      <div className="absolute -left-20 -top-20 h-80 w-80 rounded-full bg-gradient-to-br from-accent-100/70 via-accent-50/40 to-transparent blur-2xl" />

      <Microscope className="absolute bottom-6 right-6 h-32 w-32 text-primary-200/70 lg:h-48 lg:w-48" />
      <TestTubes className="absolute bottom-2 right-40 h-20 w-20 -rotate-12 text-primary-300/60 lg:right-52 lg:h-24 lg:w-24" />
      <Dna className="absolute top-4 right-16 h-16 w-16 rotate-6 text-accent-300/50 lg:h-20 lg:w-20" />
      <FlaskConical className="absolute bottom-32 right-64 hidden h-14 w-14 -rotate-6 text-accent-200/60 lg:block" />
      <Leaf className="absolute bottom-40 right-24 h-10 w-10 rotate-12 text-accent-300/70 lg:h-12 lg:w-12" />
      <Beaker className="absolute left-8 top-8 hidden h-12 w-12 -rotate-6 text-primary-200/50 lg:block" />
      <Pipette className="absolute bottom-10 left-10 hidden h-10 w-10 rotate-45 text-primary-200/40 lg:block" />
    </div>
  );
}
