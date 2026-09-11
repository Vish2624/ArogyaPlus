import { useEffect, useState } from "react";

import bannerTrustedDiagnostics from "@/assets/banner-trusted-diagnostics.jpg";
import bannerAccurateResults from "@/assets/banner-accurate-results.jpg";
import bannerBetterLife from "@/assets/banner-better-life.jpg";
import CarouselNav from "@/components/common/CarouselNav";

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
  const [isPlaying, setIsPlaying] = useState(true);
  const count = SLIDES.length;

  useEffect(() => {
    if (count < 2 || !isPlaying) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [count, isPlaying]);

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

        <CarouselNav
          slide={slide}
          count={count}
          goTo={goTo}
          isPlaying={isPlaying}
          onTogglePlay={() => setIsPlaying((p) => !p)}
          variant="onLight"
          label="banner"
        />
      </div>
    </section>
  );
}
