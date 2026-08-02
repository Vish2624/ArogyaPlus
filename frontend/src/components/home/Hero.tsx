import { CheckCircle2, ChevronLeft, ChevronRight, Eye, Star } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import QuickSearchBar from "./QuickSearchBar";
import heroFamilyImage from "@/assets/hero-family.jpg";
import { useCartStore } from "@/store/cartStore";
import { useToastStore } from "@/store/toastStore";
import type { Banner } from "@/types/banner";
import type { Package } from "@/types/package";
import { formatCurrency } from "@/utils/formatters";

interface HeroProps {
  banners: Banner[];
  featuredPackage: Package | null;
  onViewDetails: (pkg: Package) => void;
}

const HERO_EYEBROW = "Trusted by 50,000+ Families";
const HERO_TITLE = "Comprehensive Healthcare, Made Simple.";
const HERO_SUBTITLE =
  "Book trusted health packages and laboratory tests from the comfort of your home or at our partner locations.";

const AUTO_ADVANCE_MS = 9000;
const SLIDE_HEIGHT = "h-[26rem] sm:h-[29rem] lg:h-[32rem]";

export default function Hero({ banners, featuredPackage, onViewDetails }: HeroProps) {
  const addItem = useCartStore((s) => s.addItem);
  const inCart = useCartStore((s) =>
    featuredPackage ? s.items.some((i) => i.type === "package" && i.id === featuredPackage.id) : false
  );
  const showToast = useToastStore((s) => s.showToast);

  const slideCount = 1 + banners.length;
  const [slide, setSlide] = useState(0);

  useEffect(() => {
    if (slideCount < 2) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % slideCount), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [slideCount]);

  const goTo = (next: number) => setSlide((next + slideCount) % slideCount);
  const banner = slide === 0 ? null : banners[slide - 1];
  const tags = banner?.tags
    ? banner.tags.split(",").map((t) => t.trim()).filter(Boolean)
    : [];

  return (
    <section id="hero-section" className="hero-gradient curve-mask relative overflow-hidden text-white">
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-96 w-96 rounded-full bg-white/10 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-16 top-1/3 h-80 w-80 rounded-full bg-accent-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative pb-16 pt-10 sm:pb-20 sm:pt-14 lg:pt-16">
        <div className="grid gap-8 lg:grid-cols-2 lg:items-start">
          <div className="order-2 flex flex-col justify-center lg:order-1">
            <div key={`text-${slide}`} className="hero-slide-fade will-change-transform">
              {!banner ? (
                <>
                  <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
                    {HERO_EYEBROW}
                  </span>
                  <h1 className="mt-4 text-4xl text-white sm:text-hero">
                    {HERO_TITLE}
                  </h1>
                  <p className="mt-3 max-w-lg text-base leading-7 text-primary-100">{HERO_SUBTITLE}</p>
                </>
              ) : (
                <>
                  <span className="eyebrow inline-flex items-center gap-1.5 rounded-full bg-white/10 px-3.5 py-1.5 text-[10px] text-white ring-1 ring-inset ring-white/20 backdrop-blur-sm">
                    <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-accent-400" />
                    Featured Offer
                  </span>
                  {banner.title && (
                    <h2 className="mt-4 text-4xl text-white sm:text-hero">
                      {banner.title}
                    </h2>
                  )}
                  {banner.subtitle && (
                    <p className="mt-3 max-w-lg text-base leading-7 text-primary-100">{banner.subtitle}</p>
                  )}
                  {tags.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-white/15 px-3 py-1 text-xs font-bold text-white ring-1 ring-inset ring-white/25 backdrop-blur-sm"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  )}
                </>
              )}
            </div>

            {/* Fixed CTAs - stay put regardless of which slide is showing */}
            <div className="mt-6 flex flex-wrap gap-3">
              <Link
                to="/booking"
                className="btn bg-white text-primary-800 shadow-lg shadow-black/10 transition-all duration-200 hover:-translate-y-0.5 hover:bg-primary-50 hover:shadow-xl hover:shadow-black/20"
              >
                Book Now
              </Link>
              <Link to="/packages" className="btn-outline">
                View Packages
              </Link>
            </div>

            <div className="relative z-10 mt-6 max-w-xl">
              <QuickSearchBar />
            </div>
          </div>

          <div key={`visual-${slide}`} className={`hero-slide-fade relative order-1 will-change-transform lg:order-2 ${SLIDE_HEIGHT}`}>
            {!banner ? (
              featuredPackage && (
                <>
                  <img
                    src={heroFamilyImage}
                    alt="A family that booked a health checkup with ArogyaPlus"
                    className="h-full w-full rounded-card object-cover shadow-2xl shadow-black/20 ring-1 ring-white/20"
                  />
                  <div
                    className="pointer-events-none absolute inset-0 rounded-card bg-gradient-to-t from-black/25 via-transparent to-transparent"
                    aria-hidden="true"
                  />

                  <div className="animate-float absolute -top-3 -right-2 flex items-center gap-2 rounded-xl bg-white p-2.5 text-slate-800 shadow-2xl shadow-black/20 ring-1 ring-black/5 sm:-right-3 sm:p-3">
                    <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gold-100 text-gold-600">
                      <Star className="h-4 w-4 fill-current" aria-hidden="true" />
                    </span>
                    <div>
                      <p className="text-sm font-extrabold leading-none text-slate-900">
                        4.9<span className="text-[10px] font-semibold text-slate-500">/5</span>
                      </p>
                      <p className="mt-1 whitespace-nowrap text-[10px] font-medium text-slate-500">2,000+ reviews</p>
                    </div>
                  </div>

                  <div className="absolute -bottom-4 left-3 w-[62%] max-w-[15rem] flex flex-col overflow-hidden rounded-2xl bg-white p-3.5 text-slate-800 shadow-2xl shadow-black/20 ring-1 ring-black/5 transition-all duration-300 ease-out hover:-translate-y-1 hover:shadow-black/30 sm:-bottom-6 sm:left-4 sm:w-[52%] sm:max-w-[18rem] sm:rounded-card sm:p-5 lg:-left-6 lg:max-w-[21rem]">
                    <span className="badge inline-flex w-fit items-center gap-1 bg-accent-50 text-accent-700">
                      <Star className="h-3 w-3 fill-current" aria-hidden="true" />
                      Most Popular Package
                    </span>
                    <h3 className="mt-2 line-clamp-1 text-sm font-bold text-slate-900 sm:text-lg">{featuredPackage.name}</h3>
                    {featuredPackage.description && (
                      <p className="mt-1 line-clamp-2 hidden text-xs text-slate-500 sm:block">{featuredPackage.description}</p>
                    )}

                    <div className="mt-2 flex items-center gap-1.5 text-[11px] text-slate-500 sm:mt-3 sm:text-xs">
                      <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-primary-600" aria-hidden="true" />
                      {featuredPackage.tests.length} tests included
                    </div>

                    <div className="mt-2.5 grid grid-cols-2 gap-2 sm:mt-4 sm:gap-3">
                      <div className="rounded-full border border-slate-100 bg-slate-50 p-2 text-center sm:p-3.5">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">Lab Visit</p>
                        <p className="text-xs font-bold text-slate-900 sm:text-base">{formatCurrency(featuredPackage.lab_price)}</p>
                      </div>
                      <div className="rounded-full border border-slate-100 bg-slate-50 p-2 text-center sm:p-3.5">
                        <p className="text-[9px] font-bold uppercase tracking-wide text-slate-500 sm:text-[10px]">Home Visit</p>
                        <p className="text-xs font-bold text-slate-900 sm:text-base">{formatCurrency(featuredPackage.home_price)}</p>
                      </div>
                    </div>

                    <div className="mt-2.5 flex gap-2 sm:mt-4">
                      <button
                        type="button"
                        onClick={() => onViewDetails(featuredPackage)}
                        className="btn-secondary hidden flex-1 !px-3 !py-2 !text-xs sm:inline-flex"
                      >
                        <Eye className="h-3.5 w-3.5" aria-hidden="true" />
                        View Details
                      </button>
                      <button
                        type="button"
                        disabled={inCart}
                        onClick={() => {
                          addItem({
                            type: "package",
                            id: featuredPackage.id,
                            name: featuredPackage.name,
                            category: featuredPackage.category,
                            labPrice: featuredPackage.lab_price,
                            homePrice: featuredPackage.home_price,
                            tat: featuredPackage.tat,
                          });
                          showToast(`${featuredPackage.name} added to cart`);
                        }}
                        className="btn-primary flex-1 !px-3 !py-2 !text-xs"
                      >
                        {inCart ? "Added" : "Book Now"}
                      </button>
                    </div>
                  </div>
                </>
              )
            ) : (
              <div className="relative h-full w-full overflow-hidden rounded-card ring-1 ring-white/20 shadow-2xl shadow-black/20">
                <img
                  key={banner.image_url}
                  src={banner.image_url}
                  alt={banner.title ?? ""}
                  className="image-fade-in h-full w-full object-cover"
                />
                <div
                  className="pointer-events-none absolute inset-x-0 bottom-0 h-24 bg-gradient-to-t from-black/40 to-transparent"
                  aria-hidden="true"
                />
                {banner.link_url && (
                  <Link
                    to={banner.link_url}
                    className="absolute bottom-4 right-4 rounded-full bg-white px-5 py-2 text-xs font-extrabold text-primary-800 shadow-lg transition-transform hover:-translate-y-0.5"
                  >
                    Explore
                  </Link>
                )}
              </div>
            )}
          </div>
        </div>

        {slideCount > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4 sm:mt-12">
            <button
              type="button"
              onClick={() => goTo(slide - 1)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
              aria-label="Previous slide"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center">
              {Array.from({ length: slideCount }).map((_, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => goTo(i)}
                  aria-label={`Go to slide ${i + 1}`}
                  className="flex items-center justify-center p-2"
                >
                  <span
                    className={`block h-1.5 rounded-full transition-all duration-300 ${i === slide ? "w-5 bg-white" : "w-1.5 bg-white/50"}`}
                  />
                </button>
              ))}
            </div>
            <button
              type="button"
              onClick={() => goTo(slide + 1)}
              className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full border border-white/30 bg-white/15 text-white backdrop-blur-md transition-colors hover:bg-white/25"
              aria-label="Next slide"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>
    </section>
  );
}
