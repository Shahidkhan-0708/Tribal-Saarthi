import type { CoverageSnapshot } from '@/types';

// ============================================================
// Beneficiary Coverage-Gap Engine
//
// Computes "enrolled but NOT availing" per district using
// PUBLIC aggregate baselines (Census ST population, UDISE+
// enrollment): the source is always shown on screen. The
// individual beneficiary records in the prototype are
// synthetic; the calculation method is what's being shown.
// ============================================================

export interface DistrictGap {
  district: string;
  state: string;
  stPopulation: number;
  stEnrolled: number;
  availing: number;
  notAvailing: number;
  coverageRate: number; // availing / enrolled
  source: string;
  year: string;
}

export function computeGaps(snapshots: CoverageSnapshot[]): DistrictGap[] {
  return snapshots
    .map((s) => {
      const notAvailing = Math.max(0, s.stEnrolled - s.availing);
      const coverageRate = s.stEnrolled > 0 ? s.availing / s.stEnrolled : 0;
      return {
        district: s.district,
        state: s.state,
        stPopulation: s.stPopulation,
        stEnrolled: s.stEnrolled,
        availing: s.availing,
        notAvailing,
        coverageRate,
        source: s.source,
        year: s.year,
      };
    })
    .sort((a, b) => a.coverageRate - b.coverageRate);
}

export interface GapSummary {
  totalEnrolled: number;
  totalAvailing: number;
  totalUnreached: number;
  worstDistrict: DistrictGap | undefined;
  bestDistrict: DistrictGap | undefined;
  averageCoverageRate: number;
}

export function summarizeGaps(gaps: DistrictGap[]): GapSummary {
  const sorted = [...gaps].sort((a, b) => a.coverageRate - b.coverageRate);
  const totalEnrolled = gaps.reduce((a, g) => a + g.stEnrolled, 0);
  const totalAvailing = gaps.reduce((a, g) => a + g.availing, 0);
  return {
    totalEnrolled,
    totalAvailing,
    totalUnreached: gaps.reduce((a, g) => a + g.notAvailing, 0),
    worstDistrict: sorted[0],
    bestDistrict: sorted[sorted.length - 1],
    averageCoverageRate:
      gaps.length > 0 ? gaps.reduce((a, g) => a + g.coverageRate, 0) / gaps.length : 0,
  };
}

export function formatIN(n: number): string {
  if (n >= 10000000) return `${(n / 10000000).toFixed(2)} Cr`;
  if (n >= 100000) return `${(n / 100000).toFixed(2)} L`;
  return n.toLocaleString('en-IN');
}
