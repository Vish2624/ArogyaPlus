// Single source of truth for FAQ content, shared by FAQSection (the visible UI) and
// HomePage's FAQPage JSON-LD (via structuredData.faqSchema). Kept in its own file rather than
// exported alongside FAQSection's component so that file can stay component-only - React Fast
// Refresh can't hot-reload a file that mixes a component default export with other exports.
export const FAQ_ITEMS = [
  {
    question: "How does home sample collection work?",
    answer:
      "Choose the Home Visit option at checkout, pick a convenient time slot, and a certified phlebotomist will collect your sample at your doorstep.",
  },
  {
    question: "How long does it take to get my report?",
    answer: "Most reports are delivered digitally within 24-48 hours of sample collection, depending on the tests booked.",
  },
  {
    question: "Do I need to fast before my test?",
    answer:
      "Some tests (like fasting blood sugar or lipid profile) require 8-12 hours of fasting. Any preparation instructions are shown on the package or test details.",
  },
  {
    question: "Can I reschedule or cancel my booking?",
    answer: "Yes, you can reschedule or cancel from your booking confirmation email up to 12 hours before your slot.",
  },
];
