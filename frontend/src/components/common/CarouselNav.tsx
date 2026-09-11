import { ChevronLeft, ChevronRight, Pause, Play } from "lucide-react";

interface CarouselNavProps {
  slide: number;
  count: number;
  goTo: (index: number) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  /** Noun used in aria-labels, e.g. "slide", "banner", "card". */
  label: string;
  /** "onDark" for a translucent-white look over a colored/image background, "onLight" for a
   *  white card with a slate border - covers the two carousel backgrounds used on the site. */
  variant?: "onDark" | "onLight";
  className?: string;
}

const DEFAULT_CLASS = "mt-6 flex items-center justify-center gap-3 sm:gap-4";

/** Shared prev/dots+counter/play-pause/next controls, kept visually identical across every
 *  carousel on the site (Hero, ArtworkBanner, PromoCardCarousel) so users learn the pattern once. */
export default function CarouselNav({
  slide,
  count,
  goTo,
  isPlaying,
  onTogglePlay,
  label,
  variant = "onLight",
  className = DEFAULT_CLASS,
}: CarouselNavProps) {
  if (count < 2) return null;

  const isDark = variant === "onDark";
  const buttonClass = isDark
    ? "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
    : "inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-slate-200 bg-white text-slate-500 shadow-elevated transition-colors hover:bg-primary-50 hover:text-primary-700";
  const dotActiveClass = isDark ? "w-5 bg-white" : "w-5 bg-primary-600";
  const dotInactiveClass = isDark ? "w-1.5 bg-white/50" : "w-1.5 bg-slate-300";
  const counterClass = isDark
    ? "rounded-full bg-white/15 px-2.5 py-1 text-xs font-bold text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm"
    : "rounded-full bg-slate-800 px-2.5 py-1 text-xs font-bold text-white";

  return (
    <div className={className}>
      <button type="button" onClick={() => goTo(slide - 1)} aria-label={`Previous ${label}`} className={buttonClass}>
        <ChevronLeft className="h-5 w-5" />
      </button>

      <div className="flex items-center gap-3">
        <div className="flex items-center">
          {Array.from({ length: count }).map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              aria-label={`Go to ${label} ${i + 1}`}
              className="flex items-center justify-center p-2"
            >
              <span
                className={`block h-1.5 rounded-full transition-all duration-300 ${
                  i === slide ? dotActiveClass : dotInactiveClass
                }`}
              />
            </button>
          ))}
        </div>
        <span className={counterClass}>
          {slide + 1}/{count}
        </span>
      </div>

      <button
        type="button"
        onClick={onTogglePlay}
        aria-label={isPlaying ? `Pause ${label} autoplay` : `Resume ${label} autoplay`}
        aria-pressed={!isPlaying}
        className={buttonClass}
      >
        {isPlaying ? <Pause className="h-4 w-4 fill-current" /> : <Play className="h-4 w-4 fill-current" />}
      </button>

      <button type="button" onClick={() => goTo(slide + 1)} aria-label={`Next ${label}`} className={buttonClass}>
        <ChevronRight className="h-5 w-5" />
      </button>
    </div>
  );
}
