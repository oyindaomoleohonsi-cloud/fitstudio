import test from "node:test";
import assert from "node:assert/strict";
import { recommend } from "../index.mjs";

const SIZES = [
  { label: "S", intervals: { bust: { min: 86, max: 90 }, waist: { min: 68, max: 72 }, hips: { min: 92, max: 96 } } },
  { label: "M", intervals: { bust: { min: 90, max: 94 }, waist: { min: 72, max: 76 }, hips: { min: 96, max: 100 } } },
  { label: "M-L", intervals: { bust: { min: 90, max: 100 }, waist: { min: 72, max: 82 }, hips: { min: 96, max: 106 } } },
];

test("regular M user -> M", () => {
  const r = recommend({ bust: 92, waist: 74, hips: 98 }, SIZES, "woven", "regular");
  assert.equal(r.recommended, "M");
  assert.equal(r.engine_version, "v1.1-inclusive");
});

test("relaxed M user -> M-L overlap wins", () => {
  const r = recommend({ bust: 95, waist: 77, hips: 101 }, SIZES, "woven", "relaxed");
  assert.equal(r.recommended, "M-L");
});
