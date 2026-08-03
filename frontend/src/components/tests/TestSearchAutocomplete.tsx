import { useEffect, useState } from "react";

import SearchAutocomplete, { type AutocompleteSuggestion } from "@/components/common/SearchAutocomplete";
import { listTestsPaginated } from "@/services/testService";

interface TestSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function TestSearchAutocomplete({
  value,
  onChange,
  placeholder = "Search tests...",
  className,
}: TestSearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

  useEffect(() => {
    const query = value.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(() => {
      listTestsPaginated({ search: query, page: 1, page_size: 8 })
        .then((data) => {
          setSuggestions(data.items.map((t) => ({ id: t.id, label: t.name, subtitle: t.category ?? undefined })));
        })
        .catch(() => setSuggestions([]));
    }, 250);
    return () => clearTimeout(timeout);
  }, [value]);

  return (
    <SearchAutocomplete
      value={value}
      onChange={onChange}
      items={suggestions}
      filterLocally={false}
      placeholder={placeholder}
      className={className}
      emptyLabel="No matching tests. Try a different spelling."
    />
  );
}
