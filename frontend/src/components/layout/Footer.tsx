import { CheckCircle2, Mail, MapPin, Phone, ShieldCheck } from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "@/components/common/Logo";
import { CONTACT, SERVICES_LIST } from "@/utils/constants";

const CERTIFICATIONS = ["CAP Accredited", "ISO 15189", "NABL Accredited"];
const PAYMENT_METHODS = ["Visa", "Mastercard", "Apple Pay", "Cash"];
const SITE_NAME = "ArogyaPlus Healthcare";
const FOOTER_TEXT = "Your Health, Our Priority. Expert Home Care Services.";

const LINK_CLASS =
  "inline-block rounded py-0.5 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500";

function SectionHeading({ children }: { children: string }) {
  return (
    <h4 className="inline-flex flex-col items-center sm:items-start">
      <span className="text-sm font-semibold text-slate-900">{children}</span>
      <span className="mt-1.5 h-0.5 w-8 rounded-full bg-primary-500" aria-hidden="true" />
    </h4>
  );
}

export default function Footer() {
  return (
    <footer id="site-footer" className="relative overflow-hidden border-t border-slate-100 bg-slate-50">
      <div
        className="pointer-events-none absolute -bottom-24 -right-24 h-72 w-72 rounded-full bg-gradient-to-br from-primary-100/60 to-transparent blur-3xl"
        aria-hidden="true"
      />

      <div className="container-page relative grid gap-8 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4">
        <div className="text-center sm:text-left">
          <Logo className="mx-auto h-12 w-auto sm:mx-0 sm:h-14" />
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-slate-500 sm:mx-0">{FOOTER_TEXT}</p>
        </div>

        <div className="text-center sm:text-left">
          <SectionHeading>Contact Us</SectionHeading>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li className="flex items-start justify-center gap-2.5 sm:justify-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <MapPin className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <span className="pt-1 text-left">{CONTACT.address}</span>
            </li>
            <li className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Phone className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <a href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`} className={LINK_CLASS}>{CONTACT.phone}</a>
            </li>
            <li className="flex items-center justify-center gap-2.5 sm:justify-start">
              <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary-50 text-primary-600">
                <Mail className="h-3.5 w-3.5" aria-hidden="true" />
              </span>
              <a href={`mailto:${CONTACT.email}`} className={LINK_CLASS}>{CONTACT.email}</a>
            </li>
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <SectionHeading>Services</SectionHeading>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            {SERVICES_LIST.map((service) => (
              <li key={service} className="flex items-center justify-center gap-2 sm:justify-start">
                <CheckCircle2 className="h-3.5 w-3.5 shrink-0 text-accent-500" aria-hidden="true" />
                {service}
              </li>
            ))}
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <SectionHeading>Company</SectionHeading>
          <ul className="mt-4 space-y-3 text-sm text-slate-500">
            <li>
              <Link to="/privacy-policy" className={LINK_CLASS}>Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className={LINK_CLASS}>Terms of Use</Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className={LINK_CLASS}>Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="relative border-t border-slate-200 py-5 sm:py-6">
        <div className="container-page flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CERTIFICATIONS.map((cert) => (
              <span key={cert} className="badge gap-1 bg-primary-50 text-primary-700">
                <ShieldCheck className="h-3 w-3" aria-hidden="true" />
                {cert}
              </span>
            ))}
          </div>
          <div className="flex flex-wrap items-center justify-center gap-2">
            {PAYMENT_METHODS.map((method) => (
              <span key={method} className="badge bg-slate-100 text-slate-600">
                {method}
              </span>
            ))}
          </div>
        </div>
        <p className="container-page mt-4 text-center text-xs text-slate-500">
          &copy; {new Date().getFullYear()} {SITE_NAME}. All rights reserved.
        </p>
      </div>
    </footer>
  );
}
