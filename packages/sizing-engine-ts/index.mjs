// Pure sizing v1.1-inclusive (no DB deps). Mirrors apps/web/lib/size-system.ts.
export function distanceToInterval(v, iv, allow = 0) {
  if (v >= iv.min - allow && v <= iv.max + allow) return 0;
  return v < iv.min ? iv.min - allow - v : v - (iv.max + allow);
}
const STRETCH = { woven: 0, low: 1, medium: 2.5, high: 4 };
const PREF = { fitted: -2, regular: 0, relaxed: 3, oversized: 6 };
export function recommend(user, sizes, fabric = "woven", pref = "regular") {
  const allow = STRETCH[fabric] + PREF[pref];
  const scored = sizes.map((s) => ({
    label: s.label,
    score: ["bust", "waist", "hips"].reduce((a, k) => a + Math.abs(distanceToInterval(user[k], s.intervals[k], allow)), 0),
  })).sort((a, b) => a.score - b.score);
  return { recommended: scored[0]?.label, alternative: scored[1]?.label, scored, engine_version: "v1.1-inclusive" };
}
