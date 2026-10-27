import { expect, it } from 'vitest';
import { computeGaps, summarizeGaps } from './coverage';
import { COVERAGE_SNAPSHOTS } from '@/data/coverage';

it('labels the lowest coverage worst and highest best even with unsorted input', () => {
  const gaps = computeGaps(COVERAGE_SNAPSHOTS).reverse();
  const original = gaps.map((g) => g.district);
  const summary = summarizeGaps(gaps);
  expect(summary.worstDistrict?.district).toBe('Bijapur');
  expect(summary.bestDistrict?.district).toBe('Ranchi');
  expect(gaps.map((g) => g.district)).toEqual(original);
  expect(summary.totalUnreached).toBe(summary.totalEnrolled - summary.totalAvailing);
});
it('handles empty and single-district coverage', () => {
  expect(summarizeGaps([])).toMatchObject({ worstDistrict: undefined, bestDistrict: undefined, averageCoverageRate: 0 });
  const gaps = computeGaps([COVERAGE_SNAPSHOTS[0]]);
  expect(summarizeGaps(gaps).worstDistrict).toEqual(summarizeGaps(gaps).bestDistrict);
});
