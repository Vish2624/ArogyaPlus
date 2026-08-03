import { useEffect, useState } from "react";

import SearchAutocomplete, { type AutocompleteSuggestion } from "@/components/common/SearchAutocomplete";
import { listPackagesPaginated } from "@/services/packageService";

interface PackageSearchAutocompleteProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export default function PackageSearchAutocomplete({
  value,
  onChange,
  placeholder = "Search packages...",
  className,
}: PackageSearchAutocompleteProps) {
  const [suggestions, setSuggestions] = useState<AutocompleteSuggestion[]>([]);

  useEffect(() => {
    const query = value.trim();
    if (!query) {
      setSuggestions([]);
      return;
    }
    const timeout = setTimeout(() => {
      listPackagesPaginated({ search: query, page: 1, page_size: 8 })
        .then((data) => {
          setSuggestions(data.items.map((p) => ({ id: p.id, label: p.name, subtitle: p.category ?? undefined })));
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
      emptyLabel="No matching packages. Try a different spelling."
    />
  );
}
