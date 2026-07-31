import { ArrowRight } from "lucide-react";
import { Link } from "react-router-dom";

import LabArtworkBackdrop from "@/components/home/LabArtworkBackdrop";
import PackageCarouselCard from "@/components/packages/PackageCarouselCard";
import type { Package } from "@/types/package";

interface PackageCarouselProps {
  packages: Package[];
  onViewDetails: (pkg: Package) => void;
}

const TITLE = "Popular Health Packages";
const DESCRIPTION =
  "Preventive care and early detection from certified labs - with free home sample collection and digital reports delivered in 48 hours.";

export default function PackageCarousel({ packages, onViewDetails }: PackageCarouselProps) {
  if (packages.length === 0) return null;

  return (
    <section className="section relative overflow-hidden bg-white">
      <LabArtworkBackdrop />

      <div className="container-page relative">
        <div className="flex flex-col items-start justify-between gap-4 sm:flex-row sm:items-end">
          <div>
            <p className="eyebrow text-primary-600">Health Packages</p>
            <h2 className="mt-2 text-page-title font-bold text-slate-900">{TITLE}</h2>
            <p className="mt-2 max-w-xl text-base leading-7 text-slate-500">{DESCRIPTION}</p>
          </div>
          <Link to="/packages" className="flex items-center gap-1.5 whitespace-nowrap text-sm font-semibold text-primary-700 hover:text-primary-800">
            View All Packages
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>

        <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {packages.map((pkg) => (
            <PackageCarouselCard key={pkg.id} pkg={pkg} onViewDetails={onViewDetails} />
          ))}
        </div>

        <div className="mt-10 flex justify-center">
          <Link to="/packages" className="btn-primary">
            View All Packages
            <ArrowRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        </div>
      </div>
    </section>
  );
}
