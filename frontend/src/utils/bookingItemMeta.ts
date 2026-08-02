import type { BookingItem } from "@/types/booking";
import type { Package } from "@/types/package";
import type { Test } from "@/types/test";

export interface ItemMetaLookup {
  testsById: Map<number, Test>;
  packagesById: Map<number, Package>;
}

export function buildItemMetaLookup(tests: Test[], packages: Package[]): ItemMetaLookup {
  return {
    testsById: new Map(tests.map((t) => [t.id, t])),
    packagesById: new Map(packages.map((p) => [p.id, p])),
  };
}

export interface ItemMeta {
  category: string | null;
  sampleType: string | null;
  tat: string | null;
}

export function getItemMeta(item: BookingItem, lookup: ItemMetaLookup): ItemMeta {
  if (item.item_type === "test") {
    const test = lookup.testsById.get(item.item_id);
    return {
      category: test?.category ?? null,
      sampleType: test?.sample_type ?? null,
      tat: test?.tat ?? null,
    };
  }
  const pkg = lookup.packagesById.get(item.item_id);
  const sampleTypes = [...new Set((pkg?.tests ?? []).map((t) => t.sample_type).filter((s): s is string => Boolean(s)))];
  return {
    category: pkg?.category ?? null,
    sampleType: sampleTypes.length > 0 ? sampleTypes.join(", ") : null,
    tat: pkg?.tat ?? null,
  };
}
