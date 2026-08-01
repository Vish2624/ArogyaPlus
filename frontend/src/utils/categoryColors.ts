interface CategoryStyle {
  bg: string;
  text: string;
}

const RULES: [RegExp, CategoryStyle][] = [
  [/diabetes|sugar|hba1c/i, { bg: "bg-blue-50", text: "text-blue-700" }],
  [/hormone|thyroid/i, { bg: "bg-purple-50", text: "text-purple-700" }],
  [/biochemistry/i, { bg: "bg-violet-50", text: "text-violet-700" }],
  [/heart|cardio|essential/i, { bg: "bg-red-50", text: "text-red-700" }],
  [/vitamin|nutrition/i, { bg: "bg-amber-50", text: "text-amber-700" }],
  [/kidney|renal/i, { bg: "bg-primary-50", text: "text-primary-700" }],
  [/blood|hemat|hemogram/i, { bg: "bg-rose-50", text: "text-rose-700" }],
  [/bone|ortho/i, { bg: "bg-orange-50", text: "text-orange-700" }],
  [/neuro|brain/i, { bg: "bg-indigo-50", text: "text-indigo-700" }],
  [/immun|comprehensive/i, { bg: "bg-teal-50", text: "text-teal-700" }],
  [/specialized|screening/i, { bg: "bg-cyan-50", text: "text-cyan-700" }],
];

const DEFAULT_STYLE: CategoryStyle = { bg: "bg-slate-100", text: "text-slate-600" };

export function categoryStyle(category: string | null | undefined): CategoryStyle {
  if (category) {
    const match = RULES.find(([pattern]) => pattern.test(category));
    if (match) return match[1];
  }
  return DEFAULT_STYLE;
}
