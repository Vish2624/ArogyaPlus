import { Building2, ChevronLeft, ChevronRight, TrendingUp, Users } from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

// Placeholder images, kept as local files so they can be swapped by simply replacing
// each file with a real photo (same filename) — no admin upload flow needed.
import promoPartnerImage from "@/assets/promo-partner-card.svg";
import promoCorporateImage from "@/assets/promo-corporate-card.svg";
import promoHomeVisitImage from "@/assets/promo-homevisit-card.svg";

interface PromoCard {
  id: number;
  eyebrow: string;
  title: string;
  description: string;
  statIcon: LucideIcon;
  statText: string;
  buttonLabel: string;
  buttonLink: string;
  imageUrl: string;
}

const CARDS: PromoCard[] = [
  {
    id: 1,
    eyebrow: "Partner Program",
    title: "Own a Clinic or Lab? Partner With Us",
    description:
      "Join the ArogyaPlus network and reach thousands of families across Dubai looking for trusted diagnostic and health-checkup services.",
    statIcon: Users,
    statText: "500+ Partner Facilities Nationwide",
    buttonLabel: "Become a Partner",
    buttonLink: "/packages",
    imageUrl: promoPartnerImage,
  },
  {
    id: 2,
    eyebrow: "Corporate Wellness",
    title: "Health Checkup Plans for Your Team",
    description:
      "Give your employees convenient, affordable annual health screenings with flexible corporate billing and on-site or home collection.",
    statIcon: Building2,
    statText: "50+ Companies Onboarded",
    buttonLabel: "Explore Corporate Plans",
    buttonLink: "/packages",
    imageUrl: promoCorporateImage,
  },
  {
    id: 3,
    eyebrow: "Home Collection",
    title: "Home Sample Collection, Anytime",
    description:
      "Skip the trip to the lab — a certified phlebotomist collects your sample at home, at a time slot that works for you.",
    statIcon: TrendingUp,
    statText: "10,000+ Home Visits Completed",
    buttonLabel: "Book a Home Visit",
    buttonLink: "/booking",
    imageUrl: promoHomeVisitImage,
  },
];

const AUTO_ADVANCE_MS = 7000;

function splitTitle(title: string): [string, string] {
  const lastSpace = title.trim().lastIndexOf(" ");
  if (lastSpace === -1) return ["", title];
  return [title.slice(0, lastSpace + 1), title.slice(lastSpace + 1)];
}

export default function PromoCardCarousel() {
  const [slide, setSlide] = useState(0);
  const count = CARDS.length;

  useEffect(() => {
    if (count < 2) return;
    const timer = setInterval(() => setSlide((s) => (s + 1) % count), AUTO_ADVANCE_MS);
    return () => clearInterval(timer);
  }, [count]);

  const goTo = (next: number) => setSlide((next + count) % count);
  const card = CARDS[slide];
  const [titleLead, titleHighlight] = splitTitle(card.title);
  const StatIcon = card.statIcon;

  return (
    <section className="section bg-slate-50">
      <div className="container-page">
        <div className="mx-auto max-w-5xl">
          <div key={card.id} className="image-fade-in card grid overflow-hidden sm:grid-cols-2">
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <p className="eyebrow text-primary-600">{card.eyebrow}</p>
              <h3 className="mt-2 text-2xl font-extrabold leading-tight text-slate-900 sm:text-3xl">
                {titleLead}
                <span className="text-accent-600">{titleHighlight}</span>
              </h3>
              <p className="mt-3 text-base leading-7 text-slate-600">{card.description}</p>
              <span className="mt-4 inline-flex w-fit items-center gap-1.5 rounded-full bg-primary-50 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-primary-700">
                <StatIcon className="h-3.5 w-3.5" aria-hidden="true" />
                {card.statText}
              </span>
              <Link to={card.buttonLink} className="btn-primary mt-6 w-fit">
                {card.buttonLabel}
              </Link>
            </div>
            <div className="min-h-[240px] sm:min-h-[320px]">
              <img src={card.imageUrl} alt={card.title} className="h-full w-full object-cover" />
            </div>
          </div>

          {count > 1 && (
            <div className="mt-6 flex items-center justify-center gap-5">
              <button
                type="button"
                onClick={() => goTo(slide - 1)}
                aria-label="Previous card"
                className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-elevated transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                <ChevronLeft className="h-5 w-5" />
              </button>

              <div className="flex items-center gap-3">
                <div className="flex gap-1.5">
                  {CARDS.map((c, i) => (
                    <button
                      key={c.id}
                      type="button"
                      onClick={() => goTo(i)}
                      aria-label={`Go to card ${i + 1}`}
                      className={`h-1.5 rounded-full transition-all duration-300 ${
                        i === slide ? "w-5 bg-primary-600" : "w-1.5 bg-slate-300"
                      }`}
                    />
                  ))}
                </div>
                <span className="rounded-full bg-slate-800 px-2.5 py-1 text-xs font-bold text-white">
                  {slide + 1}/{count}
                </span>
              </div>

              <button
                type="button"
                onClick={() => goTo(slide + 1)}
                aria-label="Next card"
                className="rounded-full border border-slate-200 bg-white p-2.5 text-slate-500 shadow-elevated transition-colors hover:bg-primary-50 hover:text-primary-700"
              >
                <ChevronRight className="h-5 w-5" />
              </button>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
