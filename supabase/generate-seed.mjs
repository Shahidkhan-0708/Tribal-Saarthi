import fs from 'node:fs';
import ts from 'typescript';
const source = fs.readFileSync('src/data/schemes.ts', 'utf8');
const output = ts.transpileModule(source, { compilerOptions: { module: ts.ModuleKind.CommonJS } }).outputText;
const module = { exports: {} };
new Function('exports', 'module', output)(module.exports, module);
const quote = value => `'${String(value).replaceAll("'", "''")}'`;
const amounts = { pms_st: 30000, top_class: 36000, nfst: 444000, nos: 100000 };
const schemes = module.exports.SCHEMES.map(s => ({ ...s, academicYear: '2026-27', active: true, sanctionAmount: amounts[s.id], notes: `${s.notes} PILOT CONFIGURATION: confirm official rules/rates before live use.` }));
const institutions = [
  ['inst_bitmesra', { name: 'BIT Mesra', state: 'Jharkhand', district: 'Ranchi', inSchemeBasket: true }],
  ['inst_iitkgp', { name: 'IIT Kharagpur', state: 'West Bengal', district: 'Paschim Medinipur', inSchemeBasket: true }],
  ['inst_gpgc', { name: 'Government PG College', state: 'Madhya Pradesh', district: 'Dindori', inSchemeBasket: false }],
];
const rows = schemes.map(s => ['schemes', s.id, s]).concat(institutions.map(([id, data]) => ['institutions', id, data]));
fs.writeFileSync('supabase/seed.sql', '-- Pilot configuration only; no sample personal data.\n' + rows.map(([table, id, data]) => `insert into public.pilot_${table}(id,data) values(${quote(id)},${quote(JSON.stringify(data))}::jsonb) on conflict(id) do nothing;`).join('\n') + '\n');
