import type { EligibilityRule, RuleFieldPreview, Scheme, Student } from '@/types';

// ============================================================
// Explainable Eligibility Engine
//
// Evaluates a student profile against a scheme's declarative
// rules and returns a PER-RULE audit trail: PASS/FAIL with a
// human-readable reason. This is NOT AI: it's a deterministic,
// configurable, auditable rules engine (and we say so in the
// pitch: honesty is the differentiator).
// ============================================================

export interface RuleResult {
  ruleId: string;
  label: string;
  param: string;
  passed: boolean;
  /** Evidence value pulled from the student profile or derived docs. */
  actual: string;
}

export interface EligibilityResult {
  schemeId: string;
  eligible: boolean;
  rules: RuleResult[];
  passedCount: number;
  totalCount: number;
}

/** Extra contextual facts derived from documents/academics. */
export interface StudentEvidence {
  marks?: number; // percentage in qualifying exam
  attendance?: number;
  admission?: 'yes' | 'no';
  noOtherFellowship?: 'yes' | 'no';
}

const INSTITUTION_BASKET = ['inst_bitmesra', 'inst_iitkgp'];

function fieldValue(
  field: RuleFieldPreview,
  student: Student,
  evidence: StudentEvidence,
): string | number | undefined {
  switch (field) {
    case 'category':
      return student.category;
    case 'tribe':
      return student.tribe;
    case 'isPVTG':
      return student.isPVTG ? 'yes' : 'no';
    case 'familyIncome':
      return student.familyIncome;
    case 'courseLevel':
      return student.courseLevel;
    case 'course':
      return student.course;
    case 'institutionId':
      return student.institutionId;
    case 'domicileState':
      return student.domicileState;
    case 'marks':
      return evidence.marks;
    case 'attendance':
      return evidence.attendance;
    case 'admission':
      return evidence.admission;
    case 'noOtherFellowship':
      return evidence.noOtherFellowship;
    default:
      return undefined;
  }
}

function evaluateRule(
  rule: EligibilityRule,
  student: Student,
  evidence: StudentEvidence,
): RuleResult {
  const value = fieldValue(rule.field, student, evidence);
  let passed = false;
  let actual = '—';

  if (value === undefined || value === '') {
    actual = 'not provided';
  } else if (rule.op === 'max' && typeof value === 'number') {
    passed = value <= (rule.threshold ?? Infinity);
    actual = `₹${value.toLocaleString('en-IN')}`;
  } else if (rule.op === 'min' && typeof value === 'number') {
    passed = value >= (rule.threshold ?? -Infinity);
    actual = `${value}%`;
  } else if (rule.op === 'eq') {
    passed = rule.allowedValues?.includes(String(value)) ?? false;
    actual = String(value);
  } else if (rule.op === 'in') {
    passed = rule.allowedValues?.includes(String(value)) ?? false;
    if (rule.field === 'institutionId') {
      actual = INSTITUTION_BASKET.includes(String(value)) ? `${value} (basket)` : `${value} (not in basket)`;
    } else if (rule.field === 'courseLevel') {
      actual = String(value);
    } else {
      actual = String(value);
    }
  }

  return {
    ruleId: rule.id,
    label: rule.label,
    param: rule.param,
    passed,
    actual,
  };
}

export function evaluateEligibility(
  student: Student,
  scheme: Scheme,
  evidence: StudentEvidence = {},
): EligibilityResult {
  const rules = scheme.rules.map((r) => evaluateRule(r, student, evidence));
  const passedCount = rules.filter((r) => r.passed).length;
  return {
    schemeId: scheme.id,
    eligible: passedCount === rules.length,
    rules,
    passedCount,
    totalCount: rules.length,
  };
}

/** Evaluate one student against all schemes at once. */
export function evaluateAllSchemes(
  student: Student,
  schemes: Scheme[],
  evidence: StudentEvidence = {},
): EligibilityResult[] {
  return schemes.map((s) => evaluateEligibility(student, s, evidence));
}
