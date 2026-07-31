import { ChevronDown, ChevronUp, GripVertical, Trash2 } from "lucide-react";
import { useState } from "react";

export interface ReorderableItem {
  id: number;
  name: string;
  subtitle?: string | null;
}

interface ReorderableListProps {
  items: ReorderableItem[];
  onReorder: (orderedIds: number[]) => void;
  onRemove: (id: number) => void;
  removingId?: number | null;
  emptyLabel?: string;
}

export default function ReorderableList({
  items,
  onReorder,
  onRemove,
  removingId,
  emptyLabel = "Nothing linked yet.",
}: ReorderableListProps) {
  const [dragId, setDragId] = useState<number | null>(null);

  const move = (index: number, direction: -1 | 1) => {
    const target = index + direction;
    if (target < 0 || target >= items.length) return;
    const next = [...items];
    [next[index], next[target]] = [next[target], next[index]];
    onReorder(next.map((i) => i.id));
  };

  const handleDrop = (targetId: number) => {
    if (dragId === null || dragId === targetId) {
      setDragId(null);
      return;
    }
    const next = [...items];
    const fromIndex = next.findIndex((i) => i.id === dragId);
    const toIndex = next.findIndex((i) => i.id === targetId);
    if (fromIndex === -1 || toIndex === -1) return;
    const [moved] = next.splice(fromIndex, 1);
    next.splice(toIndex, 0, moved);
    onReorder(next.map((i) => i.id));
    setDragId(null);
  };

  if (items.length === 0) {
    return <p className="py-6 text-center text-sm text-slate-500">{emptyLabel}</p>;
  }

  return (
    <ul className="space-y-1.5">
      {items.map((item, index) => (
        <li
          key={item.id}
          draggable
          onDragStart={() => setDragId(item.id)}
          onDragOver={(e) => e.preventDefault()}
          onDrop={() => handleDrop(item.id)}
          className="flex items-center gap-2 rounded-lg border border-slate-200 bg-white px-3 py-2.5"
        >
          <span className="cursor-grab text-slate-300 hover:text-slate-400" aria-hidden="true">
            <GripVertical className="h-4 w-4" />
          </span>
          <div className="min-w-0 flex-1">
            <p className="truncate text-sm font-medium text-slate-800">{item.name}</p>
            {item.subtitle && <p className="truncate text-xs text-slate-500">{item.subtitle}</p>}
          </div>
          <div className="flex items-center gap-0.5">
            <button
              type="button"
              onClick={() => move(index, -1)}
              disabled={index === 0}
              aria-label={`Move ${item.name} up`}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronUp className="h-4 w-4" />
            </button>
            <button
              type="button"
              onClick={() => move(index, 1)}
              disabled={index === items.length - 1}
              aria-label={`Move ${item.name} down`}
              className="rounded p-1 text-slate-400 hover:bg-slate-100 hover:text-slate-600 disabled:opacity-30"
            >
              <ChevronDown className="h-4 w-4" />
            </button>
            <button
              type="button"
              disabled={removingId === item.id}
              onClick={() => onRemove(item.id)}
              aria-label={`Remove ${item.name}`}
              className="rounded p-1.5 text-slate-400 hover:bg-red-50 hover:text-red-600 disabled:opacity-50"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        </li>
      ))}
    </ul>
  );
}
