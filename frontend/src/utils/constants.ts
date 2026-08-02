export const APP_NAME = "ArogyaPlus";

export const CONTACT = {
  phone: "+971 58 580 2248",
  whatsapp: "+971 58 580 2248",
  whatsappLink: "https://wa.me/971585802248",
  email: "support@arogyaplus.com",
  address: "Al Wasl Road, Jumeirah, Dubai, United Arab Emirates",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Packages", href: "/packages" },
  { label: "Lab Tests", href: "/tests" },
];

export const SERVICES_LIST = [
  { label: "Health Package Bookings", href: "/packages" },
  { label: "Individual Lab Tests", href: "/tests" },
  { label: "Home Sample Collection", href: "/booking" },
  { label: "Lab Visit Appointments", href: "/booking" },
];

export { TIME_SLOTS } from "@/types/booking";

export const MIN_AGE = 1;
export const MAX_AGE = 99;

export const HOME_COLLECTION_FEE = 75;

export const PACKAGE_CATEGORIES = ["Essential", "Comprehensive", "Blood", "Specialized"] as const;
export const TEST_CATEGORIES = ["Blood", "Specialized", "Comprehensive", "Essential", "Diabetes", "Cardiac", "Kidney", "Liver", "Thyroid", "Vitamin"] as const;
