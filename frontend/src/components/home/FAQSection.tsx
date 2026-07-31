import { ChevronDown } from "lucide-react";
import { useState } from "react";

const TITLE = "Frequently Asked Questions";

const ITEMS = [
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

export default function FAQSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  return (
    <section className="section bg-white">
      <div className="container-page max-w-3xl">
        <div className="text-center">
          <p className="eyebrow text-primary-600">FAQ</p>
          <h2 className="mt-2 text-page-title font-bold text-slate-900">{TITLE}</h2>
        </div>

        <div className="mt-10 space-y-3">
          {ITEMS.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div key={`${item.question}-${index}`} className="card overflow-hidden">
                <button
                  type="button"
                  onClick={() => setOpenIndex(isOpen ? null : index)}
                  aria-expanded={isOpen}
                  className="flex w-full items-center justify-between gap-4 p-6 text-left text-base font-semibold text-slate-900 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary-500"
                >
                  {item.question}
                  <ChevronDown
                    className={`h-5 w-5 shrink-0 text-slate-500 transition-transform duration-[250ms] ${isOpen ? "rotate-180" : ""}`}
                    aria-hidden="true"
                  />
                </button>
                {isOpen && <p className="px-6 pb-6 text-base leading-7 text-slate-500">{item.answer}</p>}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
