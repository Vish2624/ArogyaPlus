import { ChevronRight, Home } from "lucide-react";
import { Link } from "react-router-dom";

import type { BreadcrumbItem } from "@/utils/structuredData";

interface BreadcrumbsProps {
  /** Trail after Home, e.g. [{ name: "Packages", path: "/packages" }]. The current (last) item
   * renders as plain text, not a link, since it's the page the user is already on. */
  items: BreadcrumbItem[];
  className?: string;
}

export default function Breadcrumbs({ items, className = "" }: BreadcrumbsProps) {
  return (
    <nav aria-label="Breadcrumb" className={className}>
      <ol className="flex flex-wrap items-center gap-1.5 text-sm text-slate-500">
        <li className="flex items-center gap-1.5">
          <Link to="/" className="flex items-center gap-1 hover:text-primary-700" aria-label="Home">
            <Home className="h-3.5 w-3.5" aria-hidden="true" />
            Home
          </Link>
        </li>
        {items.map((item, index) => {
          const isLast = index === items.length - 1;
          return (
            <li key={item.path} className="flex items-center gap-1.5">
              <ChevronRight className="h-3.5 w-3.5 shrink-0 text-slate-300" aria-hidden="true" />
              {isLast ? (
                <span className="font-semibold text-slate-700" aria-current="page">
                  {item.name}
                </span>
              ) : (
                <Link to={item.path} className="hover:text-primary-700">
                  {item.name}
                </Link>
              )}
            </li>
          );
        })}
      </ol>
    </nav>
  );
}
