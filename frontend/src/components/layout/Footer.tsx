import { Mail, MapPin, Phone } from "lucide-react";
import { Link } from "react-router-dom";

import Logo from "@/components/common/Logo";
import { CONTACT, SERVICES_LIST } from "@/utils/constants";

const CERTIFICATIONS = ["CAP Accredited", "ISO 15189", "NABL Accredited"];
const PAYMENT_METHODS = ["Visa", "Mastercard", "Apple Pay", "Cash"];
const SITE_NAME = "ArogyaPlus Healthcare";
const FOOTER_TEXT = "Your Health, Our Priority. Expert Home Care Services.";

export default function Footer() {
  return (
    <footer id="site-footer" className="border-t border-slate-100 bg-slate-50">
      <div className="container-page grid gap-8 py-12 sm:grid-cols-2 sm:gap-10 sm:py-14 lg:grid-cols-4">
        <div className="text-center sm:text-left">
          <Logo className="mx-auto h-12 w-auto sm:mx-0 sm:h-14" />
          <p className="mx-auto mt-4 max-w-xs text-sm leading-relaxed text-slate-500 sm:mx-0">{FOOTER_TEXT}</p>
        </div>

        <div className="text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-900">Contact Us</h4>
          <ul className="mt-3 space-y-3 text-sm text-slate-500">
            <li className="flex items-start justify-center gap-2 sm:justify-start">
              <MapPin className="mt-0.5 h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
              <span className="text-left">{CONTACT.address}</span>
            </li>
            <li className="flex items-center justify-center gap-2 sm:justify-start">
              <Phone className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
              <a href={`tel:${CONTACT.phone}`} className="inline-block rounded py-0.5 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{CONTACT.phone}</a>
            </li>
            <li className="flex items-center justify-center gap-2 sm:justify-start">
              <Mail className="h-4 w-4 shrink-0 text-primary-600" aria-hidden="true" />
              <a href={`mailto:${CONTACT.email}`} className="inline-block rounded py-0.5 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">{CONTACT.email}</a>
            </li>
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-900">Services</h4>
          <ul className="mt-3 space-y-3 text-sm text-slate-500">
            {SERVICES_LIST.map((service) => (
              <li key={service}>{service}</li>
            ))}
          </ul>
        </div>

        <div className="text-center sm:text-left">
          <h4 className="text-sm font-semibold text-slate-900">Company</h4>
          <ul className="mt-3 space-y-3 text-sm text-slate-500">
            <li>
              <Link to="/privacy-policy" className="inline-block rounded py-0.5 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">Privacy Policy</Link>
            </li>
            <li>
              <Link to="/terms" className="inline-block rounded py-0.5 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">Terms of Use</Link>
            </li>
            <li>
              <a href={`mailto:${CONTACT.email}`} className="inline-block rounded py-0.5 hover:text-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500">Contact Us</a>
            </li>
          </ul>
        </div>
      </div>

      <div className="border-t border-slate-200 py-5 sm:py-6">
        <div className="container-page flex flex-col items-center gap-3 sm:flex-row sm:justify-between sm:gap-4">
          <div className="flex flex-wrap items-center justify-center gap-2">
            {CERTIFICATIONS.map((cert) => (
              <span key={cert} className="badge bg-slate-100 text-slate-600">
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
