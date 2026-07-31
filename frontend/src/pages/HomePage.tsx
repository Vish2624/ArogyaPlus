import { useEffect, useState } from "react";

import ErrorState from "@/components/common/ErrorState";
import Spinner from "@/components/common/Spinner";
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
import TestDetailModal from "@/components/tests/TestDetailModal";
import { listBanners } from "@/services/bannerService";
import { getApiErrorMessage } from "@/services/api";
import { listPackages } from "@/services/packageService";
import { listTests } from "@/services/testService";
import type { Banner } from "@/types/banner";
import type { Package } from "@/types/package";
import type { Test } from "@/types/test";

export default function HomePage() {
  const [packages, setPackages] = useState<Package[]>([]);
  const [tests, setTests] = useState<Test[]>([]);
  const [banners, setBanners] = useState<Banner[]>([]);
  const [selectedPackage, setSelectedPackage] = useState<Package | null>(null);
  const [selectedTest, setSelectedTest] = useState<Test | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadData = async () => {
    setLoading(true);
    setError(null);
    try {
      const [packagesData, testsData, bannersData] = await Promise.all([
        listPackages(),
        listTests(),
        listBanners(),
      ]);
      setPackages(packagesData);
      setTests(testsData);
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

  if (loading) return <Spinner className="py-32" label="Loading ArogyaPlus..." />;
  if (error) return <ErrorState message={error} onRetry={loadData} />;

  const featuredPackage =
    packages.find((p) => p.is_featured) ??
    [...packages].sort((a, b) => b.tests.length - a.tests.length)[0] ??
    null;

  return (
    <>
      <Hero banners={banners} featuredPackage={featuredPackage} onViewDetails={setSelectedPackage} />
      <StatsBanner />
      <TrustStrip />
      <PackageCarousel packages={packages.slice(0, 6)} onViewDetails={setSelectedPackage} />
      <FeaturedTests tests={tests.slice(0, 9)} onViewDetails={setSelectedTest} />
      <ArtworkBanner />
      <HowItWorks />
      <Testimonials />
      <CertifiedLabs />
      <FAQSection />
      <PromoCardCarousel />
      <CTABanner />
      <PackageDetailModal pkg={selectedPackage} onClose={() => setSelectedPackage(null)} />
      <TestDetailModal test={selectedTest} onClose={() => setSelectedTest(null)} />
    </>
  );
}
