import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";

import bannerTrustedDiagnostics from "@/assets/banner-trusted-diagnostics.jpg";
import bannerAccurateResults from "@/assets/banner-accurate-results.jpg";
import bannerBetterLife from "@/assets/banner-better-life.jpg";

interface ArtworkSlide {
  id: number;
  image: string;
  alt: string;
}

const SLIDES: ArtworkSlide[] = [
  { id: 1, image: bannerTrustedDiagnostics, alt: "Trusted Diagnostics. Stronger Tomorrow." },
  { id: 2, image: bannerAccurateResults, alt: "Accurate Results. Better Health." },
  { id: 3, image: bannerBetterLife, alt: "Better Diagnostics. Better Life." },
];

const AUTO_ADVANCE_MS = 5000;

export default function ArtworkBanner() {
  const [slide, setSlide] = useState(0);
  const count = SLIDES.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [count]);

  const goTo = (next: number) => setSlide((next + count) % count);
  const current = SLIDES[slide];

  return (
    <section className="pb-14 sm:pb-20">
      <div className="container-page">
        <div className="h-40 overflow-hidden rounded-card shadow-card sm:h-56 lg:h-72">
          <img
            key={current.id}
            src={current.image}
            alt={current.alt}
            loading="lazy"
            className="image-fade-in h-full w-full object-cover"
          />
        </div>

        {count > 1 && (
          <div className="mt-4 flex items-center justify-center gap-4">
            <button
              type="button"
              onClick={() => goTo(slide - 1)}
              aria-label="Previous banner"
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-elevated transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>

            <div className="flex gap-1.5">
              {SLIDES.map((s, i) => (
                // The visual dot stays small; the button's own box (via p-2) is what gives it a
                // real touch target instead of a 6x6px hit area.
                <button
                  key={s.id}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to banner ${i + 1}`}
                  className="flex items-center justify-center p-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${
                      i === slide ? "w-5 bg-primary-600" : "w-1.5 bg-slate-300"
                    }`}
                  />
                </button>
              ))}
            </div>

            <button
              type="button"
              onClick={() => goTo(slide + 1)}
              aria-label="Next banner"
              className="rounded-full border border-slate-200 bg-white p-2 text-slate-500 shadow-elevated transition-colors hover:bg-primary-50 hover:text-primary-700"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
