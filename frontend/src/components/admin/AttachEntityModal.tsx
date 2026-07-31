import { Search } from "lucide-react";
import { useMemo, useState } from "react";

import Modal from "@/components/common/Modal";

export interface AttachableEntity {
  id: number;
  name: string;
  subtitle?: string | null;
}

interface AttachEntityModalProps {
  open: boolean;
  onClose: () => void;
  title: string;
  /** Items already linked are excluded by the caller before passing `items` in. */
  items: AttachableEntity[];
  onAttach: (id: number) => Promise<void>;
  emptyLabel: string;
}

export default function AttachEntityModal({ open, onClose, title, items, onAttach, emptyLabel }: AttachEntityModalProps) {
  const [search, setSearch] = useState("");
  const [attachingId, setAttachingId] = useState<number | null>(null);

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase();
    if (!term) return items;
    return items.filter(
      (item) => item.name.toLowerCase().includes(term) || item.subtitle?.toLowerCase().includes(term)
    );
  }, [items, search]);

  const handleAttach = async (id: number) => {
    setAttachingId(id);
    try {
      await onAttach(id);
    } finally {
      setAttachingId(null);
    }
  };

  return (
    <Modal open={open} onClose={onClose} title={title} maxWidthClassName="max-w-lg">
      <div className="relative mb-3">
        <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400" aria-hidden="true" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search..."
          className="form-input pl-9"
          autoFocus
        />
      </div>

      <div className="max-h-80 space-y-1 overflow-y-auto">
        {filtered.length === 0 && <p className="py-6 text-center text-sm text-slate-500">{emptyLabel}</p>}
        {filtered.map((item) => (
          <div
            key={item.id}
            className="flex items-center justify-between gap-3 rounded-lg px-3 py-2.5 hover:bg-slate-50"
          >
            <div className="min-w-0">
              <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
              {item.subtitle && <p className="truncate text-xs text-slate-500">{item.subtitle}</p>}
            </div>
            <button
              type="button"
              disabled={attachingId === item.id}
              onClick={() => handleAttach(item.id)}
              className="shrink-0 rounded-lg bg-primary-50 px-3 py-1.5 text-xs font-semibold text-primary-700 hover:bg-primary-100 disabled:opacity-50"
            >
              {attachingId === item.id ? "Adding..." : "Add"}
            </button>
          </div>
        ))}
      </div>
    </Modal>
  );
}
