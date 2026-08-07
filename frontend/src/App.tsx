import { Helmet } from "react-helmet-async";

import AppRoutes from "./routes/AppRoutes";
import { organizationSchema, websiteSchema } from "@/utils/structuredData";

export default function App() {
  return (
    <>
      {/* Sitewide baseline - present on every route regardless of whether that page also
          renders its own <Seo>. Per-page tags (title, description, etc.) override this. */}
      <Helmet>
        <script type="application/ld+json">{JSON.stringify(organizationSchema())}</script>
        <script type="application/ld+json">{JSON.stringify(websiteSchema())}</script>
      </Helmet>
      <AppRoutes />
    </>
  );
}
