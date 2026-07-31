import { HeartPulse } from "lucide-react";
import { Link } from "react-router-dom";

const TITLE = "Start Your Health Journey Today";
const SUBTITLE =
  "Join thousands of families who trust ArogyaPlus for their health checkups. Book now and get your results in 48 hours.";

export default function CTABanner() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-br from-primary-900 to-primary-700 py-16 text-center text-white sm:py-20">
      <div
        className="pointer-events-none absolute -left-20 -top-20 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        aria-hidden="true"
      />
      <div
        className="pointer-events-none absolute -right-20 -bottom-20 h-72 w-72 rounded-full bg-accent-500/20 blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative mx-auto max-w-2xl">
        <span className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-white/10 ring-1 ring-inset ring-white/20">
          <HeartPulse className="h-7 w-7 text-accent-300" aria-hidden="true" />
        </span>
        <h2 className="mt-6 text-page-title font-bold text-white">{TITLE}</h2>
        <p className="mt-4 text-base leading-7 text-primary-100">{SUBTITLE}</p>
        <div className="mt-9 flex flex-wrap justify-center gap-3">
          <Link
            to="/booking"
            className="btn bg-white text-primary-800 shadow-lg shadow-black/10 transition-transform hover:-translate-y-0.5 hover:bg-primary-50"
          >
            Book a Package
          </Link>
          <Link to="/packages" className="btn-outline transition-transform hover:-translate-y-0.5">
            Browse Packages
          </Link>
        </div>
      </div>
    </section>
  );
}
