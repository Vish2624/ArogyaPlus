import { ShoppingCart, X } from "lucide-react";
import { useEffect, useId, useRef } from "react";
import { FaWhatsapp } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

import CartList from "@/components/cart/CartList";
import { itemPrice, useCartStore, useCartTotal } from "@/store/cartStore";
import { CONTACT } from "@/utils/constants";
import { formatCurrency } from "@/utils/formatters";

const FOCUSABLE_SELECTOR =
  'a[href], button:not([disabled]), textarea:not([disabled]), input:not([disabled]), select:not([disabled]), [tabindex]:not([tabindex="-1"])';

export default function CartDrawer() {
  const open = useCartStore((s) => s.drawerOpen);
  const closeDrawer = useCartStore((s) => s.closeDrawer);
  const items = useCartStore((s) => s.items);
  const homeCollectionAdded = useCartStore((s) => s.homeCollectionAdded);
  const total = useCartTotal();
  const totalAmount = Number.isFinite(total)
    ? total.toLocaleString("en-AE", { minimumFractionDigits: 2, maximumFractionDigits: 2 })
    : "0.00";
  const navigate = useNavigate();
  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const previouslyFocused = useRef<HTMLElement | null>(null);

  useEffect(() => {
    if (!open) return;

    previouslyFocused.current = document.activeElement as HTMLElement | null;
    document.body.style.overflow = "hidden";
    panelRef.current?.focus();

    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        closeDrawer();
        return;
      }
      if (e.key !== "Tab") return;
      const focusable = panelRef.current?.querySelectorAll<HTMLElement>(FOCUSABLE_SELECTOR);
      if (!focusable || focusable.length === 0) return;
      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("keydown", onKeyDown);
      document.body.style.overflow = "";
      previouslyFocused.current?.focus();
    };
  }, [open, closeDrawer]);

  const handleProceed = () => {
    closeDrawer();
    navigate("/booking");
  };

  const whatsAppHref = () => {
    const lines = items.map(
      (item) => `- ${item.name} (${item.type === "package" ? "Package" : "Test"}) — ${formatCurrency(itemPrice(item))}`
    );
    if (homeCollectionAdded) {
      lines.push(`- Home Collection Fee — AED 75.00`);
    }
    const message = [
      "Hi ArogyaPlus! I'd like a quotation for:",
      "",
      ...lines,
      "",
      `Total: ${formatCurrency(total)}`,
    ].join("\n");
    return `${CONTACT.whatsappLink}?text=${encodeURIComponent(message)}`;
  };

  const handleBrowse = () => {
    closeDrawer();
    navigate("/packages");
  };

  return (
    <div className={`fixed inset-0 z-[60] ${open ? "" : "pointer-events-none"}`} aria-hidden={!open}>
      <div
        className={`absolute inset-0 bg-slate-900/50 transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0"}`}
        onClick={closeDrawer}
      />
      <div
        ref={panelRef}
        tabIndex={-1}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        className={`absolute inset-y-0 right-0 flex h-full w-full max-w-md flex-col bg-white shadow-2xl transition-transform duration-300 ease-in-out focus:outline-none ${
          open ? "translate-x-0" : "translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between border-b border-slate-100 px-5 py-4">
          <h2 id={titleId} className="text-base font-bold text-slate-900">
            Your Cart {items.length > 0 && `(${items.length})`}
          </h2>
          <button
            type="button"
            onClick={closeDrawer}
            className="rounded-full p-1.5 text-slate-500 hover:bg-slate-100 hover:text-slate-600 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
            aria-label="Close cart"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-5 py-4">
          {items.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-16 text-center">
              <span className="flex h-16 w-16 items-center justify-center rounded-full bg-slate-100 text-slate-400">
                <ShoppingCart className="h-7 w-7" aria-hidden="true" />
              </span>
              <p className="mt-4 text-sm font-semibold text-slate-700">Your cart is empty</p>
              <p className="mt-1 max-w-xs text-sm text-slate-500">
                Looks like you haven&apos;t added any test or package yet.
              </p>
              <button type="button" onClick={handleBrowse} className="btn-primary mt-6">
                Browse Packages &amp; Tests
              </button>
            </div>
          ) : (
            <CartList />
          )}
        </div>

        {items.length > 0 && (
          <div className="border-t border-slate-100 p-5">
            <div className="mb-4 flex items-center justify-between">
              <span className="text-sm font-semibold text-slate-700">Total</span>
              <span className="text-slate-900">
                <span className="text-sm font-semibold text-slate-500">AED</span>{" "}
                <span className="text-3xl font-extrabold text-primary-700">{totalAmount}</span>
              </span>
            </div>
            <button type="button" onClick={handleProceed} className="btn-primary w-full">
              Proceed to Booking
            </button>
            <a
              href={whatsAppHref()}
              target="_blank"
              rel="noreferrer"
              className="btn mt-2.5 w-full bg-[#25D366] text-white hover:-translate-y-0.5 hover:bg-[#1ebe5a] focus-visible:ring-[#25D366]"
            >
              <FaWhatsapp className="h-4 w-4" aria-hidden="true" />
              Proceed to WhatsApp
            </a>
          </div>
        )}
      </div>
    </div>
  );
}
