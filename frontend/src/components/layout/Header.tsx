import { Mail, Menu, Phone, ShoppingCart, X } from "lucide-react";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { Link, NavLink } from "react-router-dom";

import QuickSearchBar from "@/components/home/QuickSearchBar";
import CartBadge from "@/components/common/CartBadge";
import Logo from "@/components/common/Logo";
import { useCartStore } from "@/store/cartStore";
import { CONTACT, NAV_LINKS } from "@/utils/constants";

const SCROLL_THRESHOLD = 150;
const OFFER_TEXT = "Home Collection Available";

export default function Header() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const cartCount = useCartStore((s) => s.items.length);
  const openCartDrawer = useCartStore((s) => s.openDrawer);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > SCROLL_THRESHOLD);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="sticky top-0 z-40 bg-white/90 backdrop-blur-lg border-b border-slate-100">
      <div className="bg-primary-800 text-white">
        <div className="container-page flex h-12 items-center justify-between gap-4 text-[12.5px] font-medium">
          <div className="flex items-center gap-6">
            <a
              href={`tel:${CONTACT.phone.replace(/\s+/g, "")}`}
              // Below `sm`, the visible text is hidden and the icon is aria-hidden, so without
              // this the link has no accessible name at all on mobile viewports.
              aria-label={CONTACT.phone}
              className="flex items-center gap-2 rounded text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <Phone className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              <span className="hidden sm:inline">{CONTACT.phone}</span>
            </a>
            <span className="hidden h-4 w-px bg-white/15 sm:block" aria-hidden="true" />
            <a
              href={CONTACT.whatsappLink}
              target="_blank"
              rel="noreferrer"
              className="flex items-center gap-2 rounded text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70"
            >
              <FaWhatsapp className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {CONTACT.whatsapp}
            </a>
            <span className="hidden h-4 w-px bg-white/15 md:block" aria-hidden="true" />
            <a
              href={`mailto:${CONTACT.email}`}
              className="hidden items-center gap-2 rounded text-white/80 transition-colors hover:text-white focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/70 md:flex"
            >
              <Mail className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />
              {CONTACT.email}
            </a>
          </div>

          <div className="hidden items-center gap-2 rounded-full bg-white/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-wide ring-1 ring-inset ring-white/20 sm:flex">
            <span className="h-1.5 w-1.5 shrink-0 animate-pulse rounded-full bg-accent-400" aria-hidden="true" />
            <span className="truncate">{OFFER_TEXT}</span>
          </div>
        </div>
      </div>

      <div className="container-page flex h-20 items-center justify-between gap-4">
        <Link
          to="/"
          className="flex items-center gap-2 rounded-lg focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
        >
          <Logo className="h-12 w-auto" />
        </Link>

        {scrolled ? (
          <div className="hidden flex-1 justify-center px-8 lg:flex">
            <QuickSearchBar compact />
          </div>
        ) : (
          <nav className="hidden items-center gap-10 text-[13px] font-bold tracking-wide text-slate-600 lg:flex">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                className={({ isActive }) =>
                  `flex flex-col items-center gap-1.5 rounded py-1 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2 ${
                    isActive ? "text-primary-700" : "text-slate-600 hover:text-primary-700"
                  }`
                }
              >
                {({ isActive }) => (
                  <>
                    {link.label}
                    <span
                      className={`h-[3px] w-full rounded-full transition-colors duration-200 ${
                        isActive ? "bg-primary-600" : "bg-transparent"
                      }`}
                      aria-hidden="true"
                    />
                  </>
                )}
              </NavLink>
            ))}
          </nav>
        )}

        <div className="hidden items-center gap-3 lg:flex">
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <CartBadge
              count={cartCount}
              className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white"
            />
          </button>
          <Link to="/booking" className="btn-primary">
            Book Now
          </Link>
        </div>

        <div className="flex items-center gap-2 lg:hidden">
          <button
            type="button"
            onClick={openCartDrawer}
            className="relative rounded-full p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            aria-label="View cart"
          >
            <ShoppingCart className="h-5 w-5" />
            <CartBadge
              count={cartCount}
              className="absolute -right-0.5 -top-0.5 flex h-[18px] min-w-[18px] items-center justify-center rounded-full bg-accent-600 px-1 text-[10px] font-bold text-white"
            />
          </button>
          <Link to="/booking" className="btn-primary !px-3.5 !py-2 !text-xs">
            Book Now
          </Link>
          <button
            type="button"
            className="rounded-lg p-2 text-slate-600 hover:bg-slate-100 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500 focus-visible:ring-offset-2"
            onClick={() => setMobileOpen((v) => !v)}
            aria-label="Toggle menu"
            aria-expanded={mobileOpen}
          >
            {mobileOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {mobileOpen && (
        <div className="border-t border-slate-100 bg-white lg:hidden">
          <nav className="container-page flex flex-col gap-1 py-3">
            {NAV_LINKS.map((link) => (
              <NavLink
                key={link.href}
                to={link.href}
                onClick={() => setMobileOpen(false)}
                className="rounded-lg px-3 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
              >
                {link.label}
              </NavLink>
            ))}
          </nav>
        </div>
      )}
    </header>
  );
}
