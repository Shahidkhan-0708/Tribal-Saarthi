import type { PilotBaseline, PilotSnapshot } from './types';
import { csv } from './exports';
export interface PilotAnalytics {students:number;applications:number;beneficiaries:number;disbursedAmount:number;allApplications?:number;openDeficiencies?:number;simulatedPayments?:number;groupsTruncated?:boolean;funnel:{status:string;count:number}[];districts:{state:string;district:string;academicYear?:string;students:number;beneficiaries:number;pvtg:number;baseline?:PilotBaseline;comparable:boolean;coverageRate?:number;unreached?:number}[];pvtg:{tribe:string;district:string;count:number}[]}

export function analyticsCsv(snapshot: PilotSnapshot) {
  const a=computePilotAnalytics(snapshot);
  return csv(['state','district','academicYear','pilotStudents','beneficiaries','pvtg','comparable','coverageRate','unreached','sourceUrl','sourceYear','population','baselineEnrolled','synthetic','comparabilityReason'],a.districts.map(d=>[d.state,d.district,d.academicYear,d.students,d.beneficiaries,d.pvtg,d.comparable,d.coverageRate,d.unreached,d.baseline?.sourceUrl,d.baseline?.academicYear,d.baseline?.population,d.baseline?.enrolled,d.baseline?.synthetic,d.comparable?'Matching pilot cohort and year':'Missing or mismatched year, source population or cohort size; not district-wide']));
}

export function computePilotAnalytics(snapshot: PilotSnapshot):PilotAnalytics {
  if(snapshot.metrics)return snapshot.metrics;
  const years = [...new Set(snapshot.schemes.filter(s => s.data.active).map(s => s.data.academicYear))];
  const year = years.length === 1 ? years[0] : undefined;
  const applications = snapshot.applications.filter(a => !year || a.data.academicYear === year);
  const beneficiaries = new Set(applications.filter(a => a.data.status === 'disbursed').map(a => a.data.studentId));
  const students = snapshot.students;
  const districts = [...new Set(students.map(s => JSON.stringify([s.data.domicileState, s.data.domicileDistrict])))].map(key => {
    const [state, district] = JSON.parse(key) as [string, string];
    const cohort = students.filter(s => s.data.domicileState === state && s.data.domicileDistrict === district);
    const received = cohort.filter(s => beneficiaries.has(s.id)).length;
    const baseline = snapshot.baselines.filter(b => b.data.state === state && b.data.district === district && b.data.academicYear === year)
      .sort((a, b) => b.data.importedAt.localeCompare(a.data.importedAt))[0]?.data;
    // The operational pilot count cannot be compared with a district-wide enrollment denominator.
    const comparable = !!year && !!baseline && !baseline.synthetic && baseline.population === 'pilot enrolled ST students' && baseline.enrolled === cohort.length && baseline.enrolled > 0;
    return { state, district, academicYear: year, students: cohort.length, beneficiaries: received,
      pvtg: cohort.filter(s => s.data.isPVTG).length, baseline, comparable,
      coverageRate: comparable ? received / baseline!.enrolled : undefined,
      unreached: comparable ? Math.max(0, baseline!.enrolled - received) : undefined };
  });
  const pvtg = [...new Set(students.filter(s => s.data.isPVTG).map(s => JSON.stringify([s.data.tribe, s.data.domicileDistrict])))].map(key => {
    const [tribe, district] = JSON.parse(key) as [string, string];
    return { tribe, district, count: students.filter(s => s.data.isPVTG && s.data.tribe === tribe && s.data.domicileDistrict === district).length };
  });
  return { students: students.length, applications: applications.length, beneficiaries: beneficiaries.size,
    disbursedAmount: applications.filter(a => a.data.status === 'disbursed').reduce((sum, a) => sum + (a.data.disbursedAmount ?? 0), 0),
    funnel: ['draft', 'submitted', 'institute_stage', 'department_stage', 'deficiency', 'sanctioned', 'disbursed', 'rejected', 'withdrawn', 'appealed'].map(status => ({ status, count: applications.filter(a => a.data.status === status).length })),
    districts, pvtg };
}

function csvRows(text: string): string[][] {
  const rows: string[][] = []; let row: string[] = [], cell = '', quoted = false, closed = false;
  const input = text.replace(/^\uFEFF/, '');
  for (let i = 0; i < input.length; i++) {
    const ch = input[i];
    if (quoted) {
      if (ch === '"' && input[i + 1] === '"') { cell += '"'; i++; }
      else if (ch === '"') { quoted = false; closed = true; }
      else cell += ch;
    } else if (ch === '"') {
      if (cell || closed) throw new Error('Invalid CSV quote.');
      quoted = true;
    } else if (ch === ',' || ch === '\n' || ch === '\r') {
      row.push(cell.trim()); cell = ''; closed = false;
      if (ch !== ',') {
        if (row.some(value => value !== '')) rows.push(row);
        row = [];
        if (ch === '\r' && input[i + 1] === '\n') i++;
      }
    } else {
      if (closed && ch.trim()) throw new Error('Unexpected text after a CSV quote.');
      if (!closed) cell += ch;
    }
  }
  if (quoted) throw new Error('Unclosed CSV quote.');
  row.push(cell.trim());
  if (row.some(value => value !== '')) rows.push(row);
  return rows;
}

export function parseBaselineCsv(text: string): PilotBaseline[] {
  if (text.length > 1_000_000) throw new Error('CSV must be smaller than 1 MB.');
  const [header, ...rows] = csvRows(text);
  const expected = ['state', 'district', 'academicYear', 'population', 'enrolled', 'beneficiaries', 'sourceUrl'];
  if (!header || header.join(',') !== expected.join(',')) throw new Error(`Required CSV headers: ${expected.join(',')}`);
  if (!rows.length || rows.length > 1000) throw new Error('CSV must contain 1–1000 rows.');
  const seen = new Set<string>();
  return rows.map((row, index) => {
    const fail = (message: string): never => { throw new Error(`CSV row ${index + 2}: ${message}`); };
    if (row.length !== expected.length) fail('incorrect column count');
    if (row.some(cell => /^[=+@\-]/.test(cell))) fail('formula-like cells are not allowed');
    const [state, district, academicYear, population, enrolledText, beneficiariesText, sourceUrl] = row;
    if (!state || !district || !population || [state, district, population].some(v => v.length > 200)) fail('state, district and population are required (maximum 200 characters)');
    if (!/^\d{4}-\d{2}$/.test(academicYear) || (Number(academicYear.slice(0, 4)) + 1) % 100 !== Number(academicYear.slice(5))) fail('academicYear must be consecutive, such as 2026-27');
    if (!/^\d+$/.test(enrolledText) || !Number.isSafeInteger(Number(enrolledText))) fail('enrolled must be a nonnegative integer');
    const enrolled = Number(enrolledText);
    let beneficiaries: number | undefined;
    if (beneficiariesText !== '') {
      if (!/^\d+$/.test(beneficiariesText) || !Number.isSafeInteger(Number(beneficiariesText))) fail('beneficiaries must be a nonnegative integer');
      beneficiaries = Number(beneficiariesText);
      if (beneficiaries > enrolled) fail('beneficiaries cannot exceed enrolled');
    }
    try { const url = new URL(sourceUrl); if (url.protocol !== 'https:' || url.username || url.password) fail('sourceUrl must be a public HTTPS URL'); } catch { fail('sourceUrl must be a public HTTPS URL'); }
    const key = JSON.stringify([state, district, academicYear, population]);
    if (seen.has(key)) fail('duplicate cohort'); seen.add(key);
    return { state, district, academicYear, population, enrolled, beneficiaries, sourceUrl, importedAt: new Date().toISOString(), synthetic: false };
  });
}
