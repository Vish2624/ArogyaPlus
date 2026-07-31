import { Outlet } from "react-router-dom";

import CartDrawer from "@/components/cart/CartDrawer";
import ScrollToHash from "@/components/common/ScrollToHash";
import Toast from "@/components/common/Toast";
import Footer from "@/components/layout/Footer";
import Header from "@/components/layout/Header";
import QuickAccessButtons from "@/components/layout/QuickAccessButtons";

export default function PublicLayout() {
  return (
    <div className="flex min-h-screen flex-col">
      <a
        href="#main-content"
        className="sr-only z-[100] rounded-lg bg-primary-700 px-4 py-2.5 text-sm font-semibold text-white focus:not-sr-only focus:fixed focus:left-4 focus:top-4"
      >
        Skip to main content
      </a>
      <ScrollToHash />
      <Header />
      <main id="main-content" className="flex-1">
        <Outlet />
      </main>
      <Footer />
      <CartDrawer />
      <QuickAccessButtons />
      <Toast />
    </div>
  );
}
