import { FlaskConical, Package as PackageIcon, Search } from "lucide-react";
import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import { useNavigate } from "react-router-dom";

import SearchAutocomplete from "@/components/common/SearchAutocomplete";
import type { AutocompleteSuggestion } from "@/components/common/SearchAutocomplete";
import { listPackages } from "@/services/packageService";
import { listTests } from "@/services/testService";

interface QuickSearchBarProps {
  compact?: boolean;
  /** Change this value (e.g. the active hero slide index) to force the results dropdown closed. */
  closeSignal?: number | string;
  /** Fires true while the search input is focused, false once it's blurred. */
  onActiveChange?: (active: boolean) => void;
}

interface CombinedSuggestion extends AutocompleteSuggestion {
  kind: "package" | "test";
}

export default function QuickSearchBar({ compact = false, closeSignal, onActiveChange }: QuickSearchBarProps) {
  const [query, setQuery] = useState("");
  const [items, setItems] = useState<CombinedSuggestion[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    Promise.all([listPackages().catch(() => []), listTests().catch(() => [])]).then(([packages, tests]) => {
      setItems([
        ...packages.map((p) => ({ id: `pkg-${p.id}`, label: p.name, subtitle: "Package", kind: "package" as const })),
        ...tests.map((t) => ({ id: `test-${t.id}`, label: t.name, subtitle: "Lab Test", kind: "test" as const })),
      ]);
    });
  }, []);

  const goTo = (path: "/packages" | "/tests") => {
    const trimmed = query.trim();
    navigate(trimmed ? `${path}?search=${encodeURIComponent(trimmed)}` : path);
  };

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    goTo("/packages");
  };

  const handleSelectSuggestion = (item: CombinedSuggestion) => {
    setQuery(item.label);
    navigate(`${item.kind === "package" ? "/packages" : "/tests"}?search=${encodeURIComponent(item.label)}`);
  };

  if (compact) {
    return (
      <form onSubmit={handleSubmit} className="relative w-full max-w-sm">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-500" aria-hidden="true" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search health packages, tests..."
          aria-label="Search for tests or checkups"
          className="w-full rounded-full border border-slate-200 bg-slate-50 py-2 pl-9 pr-3 text-sm text-slate-800 placeholder:text-slate-500 shadow-search focus:border-primary-500 focus:bg-white focus:outline-none focus:ring-1 focus:ring-primary-500"
        />
      </form>
    );
  }

  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-3 rounded-card border border-white/10 bg-white/5 p-3 shadow-glass backdrop-blur-2xl sm:flex-row sm:items-center sm:p-3.5"
    >
      <SearchAutocomplete
        value={query}
        onChange={setQuery}
        items={items}
        onSelect={handleSelectSuggestion}
        placeholder="Search health packages, tests..."
        className="flex-1"
        inputClassName="h-[58px] w-full rounded-input border border-white/40 bg-primary-950/40 pl-11 pr-3 text-sm text-white placeholder:text-white/60 shadow-lg shadow-black/10 backdrop-blur-md focus:border-white/70 focus:outline-none focus:ring-1 focus:ring-white/70"
        iconClassName="left-4 h-5 w-5 text-white/70"
        emptyLabel="No matches. Try a different spelling."
        closeSignal={closeSignal}
        onActiveChange={onActiveChange}
      />
      <div className="grid grid-cols-2 gap-3 sm:flex">
        <button
          type="button"
          onClick={() => goTo("/packages")}
          className="flex items-center justify-center gap-2 rounded-input border border-white bg-primary-700 px-5 text-sm font-bold text-white shadow-lg shadow-primary-900/30 transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 sm:h-[58px]"
        >
          <PackageIcon className="h-4 w-4" aria-hidden="true" />
          Packages
        </button>
        <button
          type="button"
          onClick={() => goTo("/tests")}
          className="flex items-center justify-center gap-2 rounded-input border border-white bg-primary-700 px-5 text-sm font-bold text-white shadow-lg shadow-primary-900/30 transition-all duration-[250ms] hover:-translate-y-0.5 hover:bg-primary-800 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-white/60 focus-visible:ring-offset-2 sm:h-[58px]"
        >
          <FlaskConical className="h-4 w-4" aria-hidden="true" />
          Lab Tests
        </button>
      </div>
    </form>
  );
}
