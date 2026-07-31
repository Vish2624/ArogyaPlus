import { ChevronLeft, ChevronRight, Dna, Leaf, Microscope, TestTubes } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";

interface ArtworkSlide {
  id: number;
  icon: LucideIcon;
  title: string;
  gradient: string;
}

const SLIDES: ArtworkSlide[] = [
  { id: 1, icon: Microscope, title: "Accurate Diagnostics, Every Time", gradient: "from-primary-700 via-primary-600 to-accent-600" },
  { id: 2, icon: TestTubes, title: "State-of-the-Art Laboratory Testing", gradient: "from-accent-700 via-primary-700 to-primary-600" },
  { id: 3, icon: Dna, title: "Precision Health Insights", gradient: "from-primary-800 via-accent-700 to-primary-600" },
  { id: 4, icon: Leaf, title: "Caring for Your Family's Wellbeing", gradient: "from-primary-600 via-accent-600 to-primary-700" },
];

const AUTO_ADVANCE_MS = 4500;

export default function ArtworkBanner() {
  const [slide, setSlide] = useState(0);
  const count = SLIDES.length;

  useEffect(() => {
    const timer = setInterval(() => setSlide((s) => (s + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [count]);

  const goTo = (next: number) => setSlide((next + count) % count);

  return (
    <section className="pb-14 sm:pb-20">
      <div className="container-page">
        <div className="relative overflow-hidden rounded-card shadow-card">
          <div
            className="flex transition-transform duration-700 ease-out"
            style={{ transform: `translateX(-${slide * 100}%)` }}
          >
            {SLIDES.map((s) => {
              const Icon = s.icon;
              return (
                <div
                  key={s.id}
                  className={`relative flex h-32 w-full shrink-0 items-center justify-center overflow-hidden bg-gradient-to-r sm:h-40 lg:h-48 ${s.gradient}`}
                >
                  <Icon className="pointer-events-none absolute -left-6 -top-8 h-36 w-36 text-white/10 sm:h-44 sm:w-44" aria-hidden="true" />
                  <Icon className="pointer-events-none absolute -bottom-10 -right-6 h-44 w-44 text-white/10 sm:h-56 sm:w-56" aria-hidden="true" />
                  <p className="relative px-6 text-center text-lg font-bold text-white sm:text-2xl">{s.title}</p>
                </div>
              );
            })}
          </div>

          {count > 1 && (
            <>
              <button
                type="button"
                onClick={() => goTo(slide - 1)}
                aria-label="Previous artwork"
                className="absolute left-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <button
                type="button"
                onClick={() => goTo(slide + 1)}
                aria-label="Next artwork"
                className="absolute right-3 top-1/2 -translate-y-1/2 rounded-full bg-white/20 p-2 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>

              <div className="absolute bottom-3 left-1/2 flex -translate-x-1/2 gap-1.5">
                {SLIDES.map((s, i) => (
                  <button
                    key={s.id}
                    type="button"
                    onClick={() => goTo(i)}
                    aria-label={`Go to slide ${i + 1}`}
                    className={`h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
