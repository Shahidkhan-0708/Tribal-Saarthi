import { describe, expect, it } from 'vitest';
import { analyticsCsv, computePilotAnalytics, parseBaselineCsv } from './analytics';
import type { PilotSnapshot } from './types';

const headers = 'state,district,academicYear,population,enrolled,beneficiaries,sourceUrl';
const csv = `${headers}\nJharkhand,Ranchi,2026-27,pilot enrolled ST students,2,1,https://example.org/data`;

describe('baseline CSV trust boundary', () => {
  it('exports the displayed scoped counts, source year, population and comparability flags',()=>{
    const text=analyticsCsv(snapshot());expect(text).toContain('"sourceYear"');expect(text).toContain('"https://example.org/data"');expect(text).toContain('"true","0.5"');expect(text).toContain('"pilot enrolled ST students"');
  });
  it('accepts quoted commas, CRLF, BOM, and optional beneficiary counts', () => {
    const rows = parseBaselineCsv(`\uFEFF${headers}\r\nJharkhand,"Ranchi, urban",2026-27,pilot enrolled ST students,2,,https://example.org/data\r\n`);
    expect(rows[0].district).toBe('Ranchi, urban');
    expect(rows[0].beneficiaries).toBeUndefined();
    expect(rows[0].synthetic).toBe(false);
  });
  it('rejects formulas, invalid years, malformed quotes, unsafe source URLs and impossible counts', () => {
    for (const invalid of [csv.replace('Ranchi', '=cmd()'), csv.replace('2026-27', '2026-28'), csv.replace('2,1,', '2,3,'), csv.replace('https:', 'javascript:'), `${headers}\n"unclosed`]) {
      expect(() => parseBaselineCsv(invalid)).toThrow();
    }
    expect(() => parseBaselineCsv(`${csv}\n${csv.split('\n')[1]}`)).toThrow(/duplicate/);
  });
});

function snapshot(): PilotSnapshot {
  return {
    account: { id: 'admin', email: 'admin@example.org', name: 'Admin', role: 'admin', active: true }, accounts: [],
    students: ['one', 'two'].map(id => ({ id, version: 1, data: { id, name: id, gender: 'F', dob: '2004-01-01', aadhaarLast4: '1234', tribe: 'Baiga', isPVTG: true, category: 'ST', familyIncome: 100000, fatherName: '', domicileState: 'Jharkhand', domicileDistrict: 'Ranchi', homeVillage: '', language: 'en', courseLevel: 'undergrad', course: 'BA', institutionId: 'college', year: '1', familyViewConsent: false } })),
    schemes: [{ id: 'scheme', version: 1, data: { id: 'scheme', name: 'Pilot', shortName: 'Pilot', portal: 'NSP', ministry: 'Pilot', courseLevels: ['undergrad'], amount: '100', benefits: [], deadline: '2026-12-31', requiredDocs: [], rules: [], notes: '', academicYear: '2026-27', active: true, sanctionAmount: 100 } }],
    applications: [{ id: 'a', version: 1, data: { studentId: 'one', schemeId: 'scheme', academicYear: '2026-27', status: 'disbursed', documentIds: [], disbursedAmount: 100 } }, { id: 'b', version: 1, data: { studentId: 'one', schemeId: 'other', academicYear: '2026-27', status: 'disbursed', documentIds: [], disbursedAmount: 50 } }],
    baselines: [{ id: 'baseline', version: 1, data: parseBaselineCsv(csv)[0] }],
    documents: [], deficiencies: [], verifications: [], grievances: [], notifications: [], familyGrants: [], payments: [], institutions: [], audit: [], notes: [],
  };
}

describe('pilot analytics', () => {
  it('counts each beneficiary once and sums only confirmed disbursements', () => {
    const result = computePilotAnalytics(snapshot());
    expect(result.beneficiaries).toBe(1);
    expect(result.disbursedAmount).toBe(150);
    expect(result.districts[0]).toMatchObject({ comparable: true, coverageRate: 0.5, unreached: 1, pvtg: 2 });
  });
  it('does not infer coverage from district-wide, synthetic, historical, or mismatched cohorts', () => {
    for (const patch of [{ population: 'district ST enrollment' }, { enrolled: 10000 }, { academicYear: '2025-26' }, { synthetic: true }]) {
      const data = snapshot(); Object.assign(data.baselines[0].data, patch);
      expect(computePilotAnalytics(data).districts[0].coverageRate).toBeUndefined();
    }
  });
  it('handles an empty pilot without invented defaults', () => {
    const data = snapshot(); data.students = []; data.applications = []; data.baselines = [];
    expect(computePilotAnalytics(data)).toMatchObject({ students: 0, beneficiaries: 0, disbursedAmount: 0, districts: [] });
  });
});
