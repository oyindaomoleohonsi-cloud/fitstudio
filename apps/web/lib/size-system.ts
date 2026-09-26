// Canonical inclusive sizing: overlap ladder + 2-40 + world regions.
// Mirrors DB tables size_systems / size_labels / size_intervals / region_mappings.

export const OVERLAP_LADDER = [
  "XXS-XS", "XS", "S", "S-M", "M", "M-L", "L",
  "L-XL", "XL-XXL", "XXL", "XXL-XXXL", "XXXL", "XXXL-XXXXL",
] as const;

export type Area = "bust" | "waist" | "hips" | "length";

export interface Interval { min: number; max: number } // cm

// Seed intervals (illustrative canonical cm). Real values come from DB.
export const SEED_INTERVALS: Record<string, Record<Area, Interval>> = {
  "S":   { bust: { min: 86, max: 90 }, waist: { min: 68, max: 72 }, hips: { min: 92, max: 96 }, length: { min: 100, max: 104 } },
  "S-M": { bust: { min: 86, max: 94 }, waist: { min: 68, max: 76 }, hips: { min: 92, max: 100 }, length: { min: 100, max: 106 } },
  "M":   { bust: { min: 90, max: 94 }, waist: { min: 72, max: 76 }, hips: { min: 96, max: 100 }, length: { min: 102, max: 106 } },
  "M-L": { bust: { min: 90, max: 100 }, waist: { min: 72, max: 82 }, hips: { min: 96, max: 106 }, length: { min: 102, max: 108 } },
  "L":   { bust: { min: 94, max: 100 }, waist: { min: 76, max: 82 }, hips: { min: 100, max: 106 }, length: { min: 104, max: 108 } },
};

const STRETCH = { woven: 0, low: 1, medium: 2.5, high: 4 } as const;
const PREF = { fitted: -2, regular: 0, relaxed: 3, oversized: 6 } as const;

export function distanceToInterval(v: number, iv: Interval, allowance = 0) {
  if (v >= iv.min - allowance && v <= iv.max + allowance) return 0;
  return v < iv.min ? iv.min - allowance - v : v - (iv.max + allowance);
}

export function recommend(
  user: Record<Area, number>,
  sizes: { label: string; intervals: Record<Area, Interval> }[],
  fabric: keyof typeof STRETCH = "woven",
  pref: keyof typeof PREF = "regular",
) {
  const allow = STRETCH[fabric] + PREF[pref];
  const scored = sizes.map((s) => {
    const d = (["bust", "waist", "hips"] as Area[]).reduce(
      (a, area) => a + Math.abs(distanceToInterval(user[area], s.intervals[area], allow)), 0);
    return { label: s.label, score: d };
  }).sort((a, b) => a.score - b.score);
  return { recommended: scored[0]?.label, alternative: scored[1]?.label, scored, engine_version: "v1.1-inclusive" };
}

// Minimal US 2-40 -> region display map (illustrative).
export const NUMERIC_2_40 = Array.from({ length: 20 }, (_, i) => String(2 + i * 2));
const US_TO_UK = (n: number) => n + 2;
const US_TO_EU = (n: number) => n + 30;
export function convertNumeric(usSize: number, to: "US" | "UK" | "EU") {
  if (to === "US") return usSize;
  if (to === "UK") return US_TO_UK(usSize);
  return US_TO_EU(usSize);
}
