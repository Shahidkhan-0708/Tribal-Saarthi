import type { Scheme } from '@/types';

// ============================================================
// Real MoTA schemes with real, configurable rule structures.
// Every rule is a declarative object: the eligibility engine
// evaluates them and produces an explainable per-rule audit trail.
// ============================================================

const INCOME_CAP_PMS = 250000;
const INCOME_CAP_HIGH = 600000;
const INCOME_CAP_NOS = 680000;

export const SCHEMES: Scheme[] = [
  {
    id: 'pms_st',
    name: 'Post-Matric Scholarship for ST Students',
    shortName: 'PMS-ST',
    portal: 'NSP',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['post-matric', 'undergrad', 'postgrad', 'research'],
    amount: '₹5,000 – ₹30,000 / yr (course-level dependent)',
    benefits: [
      'Full course-fee reimbursement at sanctioned rates',
      'Monthly maintenance allowance',
      'Renewable every academic year',
    ],
    deadline: '2026-11-15',
    requiredDocs: ['st_certificate', 'income_certificate', 'domicile', 'marksheet', 'bank_passbook'],
    rules: [
      { id: 'pms_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'pms_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹2,50,000 / yr', op: 'max', threshold: INCOME_CAP_PMS },
      { id: 'pms_domicile', label: 'Domicile in a notified state', field: 'domicileState', param: 'any Indian state', op: 'in', allowedValues: ['Jharkhand', 'Madhya Pradesh', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Telangana'] },
      { id: 'pms_enrolment', label: 'Enrolled in a recognized post-matric course', field: 'courseLevel', param: 'Class 11 → PhD', op: 'in', allowedValues: ['post-matric', 'undergrad', 'postgrad', 'research'] },
    ],
    notes: 'Implemented through NSP. The prototype orchestrates the application through a simulated NSP connector.',
  },
  {
    id: 'top_class',
    name: 'National Top-Class ST Scholarship',
    shortName: 'Top-Class',
    portal: 'NSP',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['undergrad', 'postgrad'],
    amount: 'Full tuition + ₹3,000 / month maintenance',
    benefits: [
      'Full tuition reimbursement at premier institutes (IITs, NITs, IIMs, etc.)',
      'Monthly living allowance',
      'Book & equipment grant',
    ],
    deadline: '2026-10-31',
    requiredDocs: ['st_certificate', 'income_certificate', 'marksheet', 'admission_proof', 'bank_passbook'],
    rules: [
      { id: 'tc_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'tc_institute', label: 'Admitted to a notified premier institute', field: 'institutionId', param: 'Top-Class institute basket', op: 'in', allowedValues: ['inst_bitmesra', 'inst_iitkgp'] },
      { id: 'tc_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹6,00,000 / yr', op: 'max', threshold: INCOME_CAP_HIGH },
      { id: 'tc_marks', label: 'Minimum marks in qualifying exam', field: 'marks', param: '≥ 50% (UG) / 60% (PG)', op: 'min', threshold: 50 },
      { id: 'tc_level', label: 'Course level eligible', field: 'courseLevel', param: 'UG / PG', op: 'in', allowedValues: ['undergrad', 'postgrad'] },
    ],
    notes: 'Institute basket and marks thresholds notified annually by MoTA.',
  },
  {
    id: 'nfst',
    name: 'National Fellowship for ST Students',
    shortName: 'NFST',
    portal: 'SFMP',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['research'],
    amount: '₹37,000 / month (JRF) · ₹42,000 (SRF)',
    benefits: [
      'Monthly fellowship for M.Phil / Ph.D research',
      'Contingency grant per year',
      'Escorts & reader allowance for/divyangjan scholars',
    ],
    deadline: '2026-12-01',
    requiredDocs: ['st_certificate', 'income_certificate', 'marksheet', 'research_proposal', 'bank_passbook'],
    rules: [
      { id: 'nf_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'nf_level', label: 'Registered M.Phil / Ph.D scholar', field: 'courseLevel', param: 'research (M.Phil/Ph.D)', op: 'eq', allowedValues: ['research'] },
      { id: 'nf_university', label: 'Registered in a recognized university', field: 'institutionId', param: 'recognized university', op: 'in', allowedValues: ['inst_bitmesra', 'inst_iitkgp', 'inst_gpgc'] },
      { id: 'nf_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹6,00,000 / yr', op: 'max', threshold: INCOME_CAP_HIGH },
      { id: 'nf_nofellow', label: 'Not holding another fellowship', field: 'noOtherFellowship', param: 'no other central fellowship', op: 'eq', allowedValues: ['yes'] },
    ],
    notes: 'Fellowship is disbursed through the Scholarship & Fellowship Management Portal (Canara Bank).',
  },
  {
    id: 'nos',
    name: 'National Overseas Scholarship for ST Students',
    shortName: 'NOS',
    portal: 'NOS',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['postgrad', 'research'],
    amount: 'Up to ₹1.6 crore / student (tuition + living + airfare)',
    benefits: [
      'Full tuition support for Master\u2019s / Ph.D abroad',
      'Annual living stipend & one-way airfare',
      'Partial family support for a dependent spouse',
    ],
    deadline: '2026-11-30',
    requiredDocs: ['st_certificate', 'income_certificate', 'marksheet', 'admission_proof', 'bank_passbook'],
    rules: [
      { id: 'nos_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'nos_marks', label: 'Minimum marks — 60% PG / 55% UG', field: 'marks', param: '≥ 55% (UG) / 60% (PG)', op: 'min', threshold: 55 },
      { id: 'nos_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹6,80,000 / yr', op: 'max', threshold: INCOME_CAP_NOS },
      { id: 'nos_level', label: 'Course level eligible', field: 'courseLevel', param: 'PG / research abroad', op: 'in', allowedValues: ['postgrad', 'research'] },
      { id: 'nos_admission', label: 'Unconditional admission letter abroad', field: 'admission', param: 'unconditional admit', op: 'eq', allowedValues: ['yes'] },
    ],
    notes: 'Applications through the dedicated NOS portal: the third of the three disconnected systems the PS targets.',
  },
];

export const MOTA_SCHEMES = SCHEMES;
