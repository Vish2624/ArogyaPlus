import { CONTACT, SITE_URL } from "@/utils/constants";

/**
 * Sitewide identity - who ArogyaPlus is. Deliberately typed as Organization (not
 * MedicalBusiness/MedicalClinic): the site's own disclaimer states ArogyaPlus is a booking
 * platform, with the actual home visits/lab work independently performed by CAP-accredited
 * labs and DHA-licensed professionals. Claiming a medical-provider schema type would misrepresent
 * that and risks scrutiny under Google's stricter YMYL (health) quality standards.
 */
export function organizationSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "ArogyaPlus",
    url: SITE_URL,
    logo: `${SITE_URL}/apple-touch-icon.png`,
    telephone: CONTACT.phone,
    email: CONTACT.email,
    address: {
      "@type": "PostalAddress",
      streetAddress: "First Floor, M-4, Gold Building, Near Bus Stand, Al Karama",
      addressLocality: "Dubai",
      addressCountry: "AE",
    },
  };
}

/** Enables the sitelinks search box in Google results for site-wide package/test search. */
export function websiteSchema() {
  return {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "ArogyaPlus",
    url: SITE_URL,
    potentialAction: {
      "@type": "SearchAction",
      target: `${SITE_URL}/packages?search={search_term_string}`,
      "query-input": "required name=search_term_string",
    },
  };
}

export interface FaqItem {
  question: string;
  answer: string;
}

/** Must mirror on-page visible FAQ content exactly - structured data that doesn't match what a
 * user actually sees on the page violates Google's rich-results guidelines and risks a manual
 * action. Build this from the same ITEMS array FAQSection renders, not a separate copy. */
export function faqSchema(items: FaqItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    mainEntity: items.map((item) => ({
      "@type": "Question",
      name: item.question,
      acceptedAnswer: {
        "@type": "Answer",
        text: item.answer,
      },
    })),
  };
}

export interface BreadcrumbItem {
  name: string;
  path: string;
}

export function breadcrumbSchema(items: BreadcrumbItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      name: item.name,
      item: `${SITE_URL}${item.path}`,
    })),
  };
}

export interface CatalogueListItem {
  name: string;
  price: number;
}

/**
 * Represents the catalogue as a list for rich-result eligibility, without needing per-item
 * public detail pages/URLs (none currently exist - see SEO report). No `url` per item since
 * there's nowhere unique to point it at yet.
 */
export function itemListSchema(items: CatalogueListItem[]) {
  return {
    "@context": "https://schema.org",
    "@type": "ItemList",
    itemListElement: items.map((item, index) => ({
      "@type": "ListItem",
      position: index + 1,
      item: {
        "@type": "Service",
        name: item.name,
        offers: {
          "@type": "Offer",
          price: item.price,
          priceCurrency: "AED",
        },
      },
    })),
  };
}
