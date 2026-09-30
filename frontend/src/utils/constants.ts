export const APP_NAME = "ArogyaPlus";

/** Canonical production origin - used to build absolute canonical/OG URLs. No trailing slash. */
export const SITE_URL = "https://arogyaplus.com";

export const CONTACT = {
  phone: "+971 50 886 0612",
  whatsapp: "+971 50 886 0612",
  whatsappLink: "https://wa.me/971508860612",
  email: "support@arogyaplus.com",
  company: "Wallet Edge Global FZC LLC & Wallet Edge Technologies LLC",
  companies: ["Wallet Edge Global FZC LLC", "Wallet Edge Technologies LLC"],
  // Display-friendly breakdown of `address` for the footer.
  addressLines: [
    "Office 307, 3rd Floor",
    "Al Hamsa Building (Office Tower)",
    "Breeze Business Center, Office #13",
    "Next to Ansar Gallery, Al Karama",
    "Dubai, United Arab Emirates",
  ],
  streetAddress:
    "Office #13, Breeze Business Center, Al Hamsa Building (Office Tower), 3rd Floor, Office 307, Next to Ansar Gallery, Al Karama",
  address:
    "Office #13, Breeze Business Center, Al Hamsa Building (Office Tower), 3rd Floor, Office 307, Next to Ansar Gallery, Al Karama, Dubai, United Arab Emirates",
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

/** Minimum cart subtotal required to book — applies to packages and tests alike. */
export const MIN_ORDER_VALUE = 299;

export const PACKAGE_CATEGORIES = ["Essential", "Comprehensive", "Blood", "Specialized"] as const;
export const TEST_CATEGORIES = ["Blood", "Specialized", "Comprehensive", "Essential", "Diabetes", "Cardiac", "Kidney", "Liver", "Thyroid", "Vitamin"] as const;
