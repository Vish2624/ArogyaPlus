import { useEffect, useState } from "react";

import SearchAutocomplete from "@/components/common/SearchAutocomplete";
import { listPackages } from "@/services/packageService";
import type { Package } from "@/types/package";

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
  const [allPackages, setAllPackages] = useState<Package[]>([]);

  useEffect(() => {
    listPackages()
      .then(setAllPackages)
      .catch(() => setAllPackages([]));
  }, []);

  const items = allPackages.map((p) => ({ id: p.id, label: p.name, subtitle: p.category ?? undefined }));

  return (
    <SearchAutocomplete
      value={value}
      onChange={onChange}
      items={items}
      placeholder={placeholder}
      className={className}
      emptyLabel="No matching packages. Try a different spelling."
    />
  );
}
