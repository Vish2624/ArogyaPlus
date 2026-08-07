import { Helmet } from "react-helmet-async";

import { APP_NAME, SITE_URL } from "@/utils/constants";

interface SeoProps {
  /** Page-specific title. Rendered as "{title} | ArogyaPlus" - don't include the brand suffix yourself. */
  title: string;
  /** ~150-160 char unique summary of this page's content. */
  description: string;
  /**
   * Route path this page is canonically reachable at, e.g. "/packages". Always the clean
   * listing URL with no query string - search/filter/sort params are view states of the same
   * content, not distinct pages, so they must canonicalize back to this to avoid duplicate-
   * content signals from e.g. /packages?search=cbc and /packages?category=Blood.
   */
  path: string;
  /** Set true for pages that shouldn't appear in search results (admin, login, 404). */
  noindex?: boolean;
  /** Set true to also stop link equity flowing through this page's outbound links (rarely
   * needed - admin/login pages want this; a noindex checkout page usually still wants `follow`). */
  nofollow?: boolean;
  /** Absolute or root-relative image URL for social previews. Defaults to the site's og-default.jpg. */
  ogImage?: string;
  /** "website" for listing/marketing pages, "article" only if this ever becomes a blog/article page. */
  ogType?: "website" | "article";
  /** One or more JSON-LD structured data objects to embed as <script type="application/ld+json">. */
  jsonLd?: object | object[];
}

export default function Seo({
  title,
  description,
  path,
  noindex = false,
  nofollow = false,
  ogImage,
  ogType = "website",
  jsonLd,
}: SeoProps) {
  const fullTitle = `${title} | ${APP_NAME}`;
  const canonicalUrl = `${SITE_URL}${path}`;
  const imageUrl = ogImage ? (ogImage.startsWith("http") ? ogImage : `${SITE_URL}${ogImage}`) : `${SITE_URL}/og-default.jpg`;
  const schemas = jsonLd ? (Array.isArray(jsonLd) ? jsonLd : [jsonLd]) : [];
  const robotsContent = `${noindex ? "noindex" : "index"}, ${nofollow ? "nofollow" : "follow"}`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={canonicalUrl} />
      <meta name="robots" content={robotsContent} />

      <meta property="og:type" content={ogType} />
      <meta property="og:site_name" content={APP_NAME} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:image" content={imageUrl} />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:locale" content="en_AE" />

      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={fullTitle} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={imageUrl} />

      {schemas.map((schema, i) => (
        <script key={i} type="application/ld+json">
          {JSON.stringify(schema)}
        </script>
      ))}
    </Helmet>
  );
}
