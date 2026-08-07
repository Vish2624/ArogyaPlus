import { useEffect, useState } from "react";

import ArtworkBanner from "@/components/home/ArtworkBanner";
import CertifiedLabs from "@/components/home/CertifiedLabs";
import CTABanner from "@/components/home/CTABanner";
import FAQSection from "@/components/home/FAQSection";
import FeaturedTests from "@/components/home/FeaturedTests";
import Hero from "@/components/home/Hero";
import HowItWorks from "@/components/home/HowItWorks";
import PackageCarousel from "@/components/home/PackageCarousel";
import StatsBanner from "@/components/home/StatsBanner";
import Testimonials from "@/components/home/Testimonials";
import TrustStrip from "@/components/home/TrustStrip";
import PackageDetailModal from "@/components/packages/PackageDetailModal";
import PromoCardCarousel from "@/components/home/PromoCardCarousel";
import Seo from "@/components/common/Seo";
import { FAQ_ITEMS } from "@/content/faqItems";
import { listBanners } from "@/services/bannerService";
import { getApiErrorMessage } from "@/services/api";
import { listPackagesPaginated } from "@/services/packageService";
import { listTestsPaginated } from "@/services/testService";
import type { Banner } from "@/types/banner";
import type { Package } from "@/types/package";
import type { Test } from "@/types/test"; // still needed for tests state
import { faqSchema } from "@/utils/structuredData";

const SEO_DESCRIPTION =
  "Book trusted health packages and individual lab tests in Dubai, UAE. Home sample collection or partner-lab visits, transparent pricing, and digital reports in 24-48 hours.";

const HOME_PACKAGE_COUNT = 6;
const HOME_TEST_COUNT = 9;

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      // Only ever need a handful of each for the homepage carousels — a small paginated
      // request lands faster than fetching (and discarding most of) the full catalogue.
      const [packagesData, testsData, bannersData] = await Promise.all([
        listPackagesPaginated({ page: 1, page_size: HOME_PACKAGE_COUNT }),
        listTestsPaginated({ page: 1, page_size: HOME_TEST_COUNT }),
        listBanners(),
      ]);
      setPackages(packagesData.items);
      setTests(testsData.items);
      setBanners([...bannersData].sort((a, b) => a.display_order - b.display_order));
    } catch (err) {
      setError(getApiErrorMessage(err, "We couldn't load the homepage content. Please try again."));
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const featuredPackage = loading
    ? null
    : packages.find((p) => p.is_featured) ??
      [...packages].sort((a, b) => b.tests.length - a.tests.length)[0] ??
      null;

  // Everything below only depends on data that loads fast or not at all (the static
  // marketing sections) — none of it should sit behind a full-page spinner waiting on
  // packages/tests/banners. Only Hero's visual and the two data carousels show their own
  // loading state; the rest of the page renders immediately.
  return (
    <>
      <Seo
        title="Health Package & Lab Test Booking in Dubai"
        description={SEO_DESCRIPTION}
        path="/"
        jsonLd={faqSchema(FAQ_ITEMS)}
      />
      <Hero banners={banners} featuredPackage={featuredPackage} onViewDetails={setSelectedPackage} loading={loading} />
      <StatsBanner />
      <TrustStrip />
      {error ? (
        <div className="container-page py-10">
          <p className="rounded-card border border-red-100 bg-red-50 px-5 py-4 text-sm text-red-700">
            {error}{" "}
            <button type="button" onClick={loadData} className="font-semibold underline underline-offset-2">
              Retry
            </button>
          </p>
        </div>
      ) : (
        <>
          <PackageCarousel packages={packages} onViewDetails={setSelectedPackage} loading={loading} />
          <FeaturedTests tests={tests} loading={loading} />
        </>
      )}
      <ArtworkBanner />
      <HowItWorks />
      <Testimonials />
      <CertifiedLabs />
      <FAQSection />
      <PromoCardCarousel />
      <CTABanner />
      <PackageDetailModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
    </>
  );
}
