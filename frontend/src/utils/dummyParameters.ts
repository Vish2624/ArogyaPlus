import type { Parameter } from "@/types/parameter";

/**
 * The live backend doesn't have the Parameters/sample_type feature yet — these endpoints
 * are planned (see AdminParametersPage, AdminTestDetailPage, TestDetailModal) but return
 * 404 until a matching backend ships. This dummy catalogue lets the UI be reviewed and
 * exercised end-to-end today; it's swapped out automatically the moment the real
 * `/api/admin/parameters` and `/api/admin/tests/{id}/parameters` endpoints respond.
 */
const now = "2026-01-01T00:00:00Z";

function param(id: number, name: string, unit: string, reference_range: string, method: string, description: string): Parameter {
  return { id, name, unit, reference_range, method, description, is_active: true, created_at: now, updated_at: now };
}

export const DUMMY_PARAMETERS: Parameter[] = [
  param(9001, "Hemoglobin (HGB)", "g/dL", "13.0 - 17.0 (M), 12.0 - 15.5 (F)", "Spectrophotometry", "Measures the oxygen-carrying protein in red blood cells."),
  param(9002, "WBC Count", "x10^3/uL", "4.0 - 11.0", "Automated Cell Counter", "Total white blood cell count, indicates immune/infection status."),
  param(9003, "RBC Count", "x10^6/uL", "4.5 - 5.9", "Automated Cell Counter", "Total red blood cell count."),
  param(9004, "Platelet Count", "x10^3/uL", "150 - 450", "Automated Cell Counter", "Measures clotting-cell levels."),
  param(9005, "HbA1c", "%", "< 5.7 Normal", "HPLC", "Average blood glucose over the past 2-3 months."),
  param(9006, "Fasting Blood Glucose", "mg/dL", "70 - 100", "Hexokinase", "Blood sugar level after an 8-hour fast."),
  param(9007, "Total Cholesterol", "mg/dL", "< 200", "Enzymatic", "Total cholesterol carried in the blood."),
  param(9008, "HDL Cholesterol", "mg/dL", "> 40", "Enzymatic", "\"Good\" cholesterol that clears excess cholesterol."),
  param(9009, "LDL Cholesterol", "mg/dL", "< 100", "Calculated (Friedewald)", "\"Bad\" cholesterol linked to plaque buildup."),
  param(9010, "Triglycerides", "mg/dL", "< 150", "Enzymatic", "Fat levels in the blood."),
  param(9011, "Creatinine", "mg/dL", "0.6 - 1.3", "Jaffe Method", "Waste product filtered by the kidneys."),
  param(9012, "Blood Urea Nitrogen (BUN)", "mg/dL", "7 - 20", "Enzymatic UV", "Measures kidney filtering efficiency."),
  param(9013, "ALT (SGPT)", "U/L", "7 - 56", "IFCC", "Liver enzyme that signals liver cell damage."),
  param(9014, "AST (SGOT)", "U/L", "10 - 40", "IFCC", "Liver/muscle enzyme, elevated in liver injury."),
  param(9015, "TSH", "uIU/mL", "0.4 - 4.0", "CLIA", "Thyroid-stimulating hormone, screens thyroid function."),
  param(9016, "Vitamin D (25-OH)", "ng/mL", "30 - 100", "CLIA", "Measures vitamin D stores in the body."),
];

const CATEGORY_PARAMETER_IDS: [RegExp, number[]][] = [
  [/hematology|hemogram|cbc|blood count/i, [9001, 9002, 9003, 9004]],
  [/diabetes|glucose|sugar/i, [9005, 9006]],
  [/lipid|cholesterol/i, [9007, 9008, 9009, 9010]],
  [/kidney|renal/i, [9011, 9012]],
  [/liver|hepatic/i, [9013, 9014]],
  [/thyroid|hormone/i, [9015]],
  [/vitamin/i, [9016]],
];

const DEFAULT_PARAMETER_IDS = [9001, 9006, 9011];

export function dummyParametersForCategory(category: string | null): Parameter[] {
  const ids = category
    ? CATEGORY_PARAMETER_IDS.find(([pattern]) => pattern.test(category))?.[1] ?? DEFAULT_PARAMETER_IDS
    : DEFAULT_PARAMETER_IDS;
  return ids.map((id) => DUMMY_PARAMETERS.find((p) => p.id === id)!).filter(Boolean);
}

const CATEGORY_SAMPLE_TYPES: [RegExp, string][] = [
  [/hematology|hemogram|cbc|blood count/i, "EDTA Whole Blood"],
  [/diabetes|glucose|sugar/i, "Fasting Venous Blood"],
  [/lipid|cholesterol/i, "Fasting Serum"],
  [/kidney|renal/i, "Serum"],
  [/liver|hepatic/i, "Serum"],
  [/thyroid|hormone/i, "Serum"],
  [/vitamin/i, "Serum"],
];

export function dummySampleTypeForCategory(category: string | null): string {
  const match = category && CATEGORY_SAMPLE_TYPES.find(([pattern]) => pattern.test(category));
  return match ? match[1] : "Venous Blood";
}
