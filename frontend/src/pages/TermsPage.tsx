import Breadcrumbs from "@/components/common/Breadcrumbs";
import Seo from "@/components/common/Seo";
import { CONTACT } from "@/utils/constants";

const BREADCRUMB_ITEMS = [{ name: "Terms of Use", path: "/terms" }];

export default function TermsPage() {
  return (
    <div className="section container-page max-w-3xl">
      <Seo
        title="Terms of Use"
        description="The terms and conditions governing your use of ArogyaPlus's health package and lab test booking platform."
        path="/terms"
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} className="mb-4" />
      <h1 className="text-3xl font-bold text-slate-900">Terms of Use</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 26 July 2026</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">1. Acceptance of Terms</h2>
          <p className="mt-2">
            By using the ArogyaPlus website to browse packages, browse tests, or submit a booking request,
            you agree to these Terms of Use.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">2. Booking Requests</h2>
          <p className="mt-2">
            Submitting a booking through our website is a request for an appointment, not a guaranteed confirmation.
            Our team will contact you to confirm your appointment date, time, and visit mode.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">3. Pricing</h2>
          <p className="mt-2">
            Prices for packages and tests are shown in AED and may differ between Lab Visit and Home Visit modes.
            Prices are subject to change without prior notice.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">4. No Online Payment</h2>
          <p className="mt-2">
            ArogyaPlus does not process online payments through this website. Payment arrangements will be
            communicated directly by our team.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">5. Medical Disclaimer</h2>
          <p className="mt-2">
            Information on this website is provided for general purposes only and does not constitute medical
            advice. Please consult a qualified healthcare professional regarding your test results.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">6. Contact Us</h2>
          <p className="mt-2">
            For any questions about these Terms of Use, please contact us at{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-medium text-primary-700">{CONTACT.email}</a> or{" "}
            {CONTACT.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
