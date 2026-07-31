import { useEffect, useState } from "react";

import SearchAutocomplete from "@/components/common/SearchAutocomplete";
import { listTests } from "@/services/testService";
import type { Test } from "@/types/test";

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
  const [allTests, setAllTests] = useState<Test[]>([]);

  useEffect(() => {
    listTests()
      .then(setAllTests)
      .catch(() => setAllTests([]));
  }, []);

  const items = allTests.map((t) => ({ id: t.id, label: t.name, subtitle: t.category ?? undefined }));

  return (
    <SearchAutocomplete
      value={value}
      onChange={onChange}
      items={items}
      placeholder={placeholder}
      className={className}
      emptyLabel="No matching tests. Try a different spelling."
    />
  );
}
