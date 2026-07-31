import { ShoppingCart } from "lucide-react";
import { useEffect, useState } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useLocation } from "react-router-dom";

import CartBadge from "@/components/common/CartBadge";
import { useCartStore } from "@/store/cartStore";
import { CONTACT } from "@/utils/constants";

export default function QuickAccessButtons() {
  const cartCount = useCartStore((s) => s.items.length);
  const openDrawer = useCartStore((s) => s.openDrawer);
  const location = useLocation();
  const [pastHero, setPastHero] = useState(true);
  const [footerInView, setFooterInView] = useState(false);

  useEffect(() => {
    const heroEl = document.getElementById("hero-section");
    if (!heroEl) {
      setPastHero(true);
      return;
    }
    setPastHero(false);
    const observer = new IntersectionObserver(([entry]) => setPastHero(!entry.isIntersecting), { threshold: 0 });
    observer.observe(heroEl);
    return () => observer.disconnect();
  }, [location.pathname]);

  // Hide once the footer scrolls into view — otherwise these fixed buttons sit on top of
  // footer links/text, which is especially cramped on mobile where the footer is tall.
  useEffect(() => {
    const footerEl = document.getElementById("site-footer");
    if (!footerEl) {
      setFooterInView(false);
      return;
    }
    setFooterInView(false);
    const observer = new IntersectionObserver(([entry]) => setFooterInView(entry.isIntersecting), {
      threshold: 0,
      rootMargin: "0px 0px -10% 0px",
    });
    observer.observe(footerEl);
    return () => observer.disconnect();
  }, [location.pathname]);

  const visible = pastHero && !footerInView;

  return (
    <div
      className={`fixed right-5 top-[62%] z-40 flex -translate-y-1/2 flex-col items-center gap-2 rounded-[20px] bg-white/92 p-2 shadow-glass ring-1 ring-slate-100 backdrop-blur-md transition-opacity duration-300 ${
        visible ? "opacity-100" : "pointer-events-none opacity-0"
      }`}
      aria-hidden={!visible}
    >
      <a
        href={CONTACT.whatsappLink}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat with us on WhatsApp"
        className="flex h-12 w-12 items-center justify-center rounded-full bg-[#25D366] text-white transition-all duration-[250ms] hover:-translate-y-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-[#25D366]"
      >
        <FaWhatsapp className="h-6 w-6" aria-hidden="true" />
      </a>

      <button
        type="button"
        onClick={openDrawer}
        aria-label="View cart"
        className="relative flex h-12 w-12 items-center justify-center rounded-full bg-primary-600 text-white transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-primary-700 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-primary-500"
      >
        <ShoppingCart className="h-5 w-5" aria-hidden="true" />
        <CartBadge
          count={cartCount}
          className="absolute -right-1 -top-1 flex h-6 w-6 items-center justify-center rounded-full bg-accent-600 text-xs font-bold text-white ring-2 ring-white"
        />
      </button>
    </div>
  );
}
