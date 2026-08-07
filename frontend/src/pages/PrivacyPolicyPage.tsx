import Breadcrumbs from "@/components/common/Breadcrumbs";
import Seo from "@/components/common/Seo";
import { CONTACT } from "@/utils/constants";

const BREADCRUMB_ITEMS = [{ name: "Privacy Policy", path: "/privacy-policy" }];

export default function PrivacyPolicyPage() {
  return (
    <div className="section container-page max-w-3xl">
      <Seo
        title="Privacy Policy"
        description="How ArogyaPlus collects, uses, and protects your personal information when you book health packages and lab tests."
        path="/privacy-policy"
      />
      <Breadcrumbs items={BREADCRUMB_ITEMS} className="mb-4" />
      <h1 className="text-3xl font-bold text-slate-900">Privacy Policy</h1>
      <p className="mt-2 text-sm text-slate-500">Last updated: 26 July 2026</p>

      <div className="prose prose-slate mt-8 max-w-none space-y-6 text-sm leading-relaxed text-slate-600">
        <section>
          <h2 className="text-lg font-semibold text-slate-900">1. Information We Collect</h2>
          <p className="mt-2">
            When you submit a booking through ArogyaPlus, we collect the personal details you provide,
            including your full name, age, gender, phone number, email address, preferred appointment date and
            time, and the packages or tests you have selected.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">2. How We Use Your Information</h2>
          <p className="mt-2">
            We use the information you provide solely to process and fulfil your booking, contact you about your
            appointment, and deliver your test results. We do not require you to create an account to use our
            website.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">3. Information Sharing</h2>
          <p className="mt-2">
            Your booking details are shared only with our internal clinical and operations team for the purpose of
            scheduling sample collection and delivering your results. We do not sell your personal information to
            third parties.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">4. Data Security</h2>
          <p className="mt-2">
            We apply reasonable technical and organisational measures to protect your personal information from
            unauthorised access, loss, or misuse.
          </p>
        </section>

        <section>
          <h2 className="text-lg font-semibold text-slate-900">5. Contact Us</h2>
          <p className="mt-2">
            If you have any questions about this Privacy Policy, please contact us at{" "}
            <a href={`mailto:${CONTACT.email}`} className="font-medium text-primary-700">{CONTACT.email}</a> or{" "}
            {CONTACT.phone}.
          </p>
        </section>
      </div>
    </div>
  );
}
