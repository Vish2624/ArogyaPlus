import { ChevronDown } from "lucide-react";
import { useState } from "react";

import { FAQ_ITEMS } from "@/content/faqItems";

const TITLE = "Frequently Asked Questions";

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
          {FAQ_ITEMS.map((item, index) => {
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
