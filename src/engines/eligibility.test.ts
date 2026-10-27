import { describe, it, expect } from 'vitest';
import { evaluateEligibility, evaluateAllSchemes, type StudentEvidence } from './eligibility';
import type { Student, Scheme } from '@/types';

// Test student profiles
const asha: Student = {
  id: 'stu_asha',
  name: 'Asha Kiran Ekka',
  gender: 'F',
  dob: '2006-05-12',
  aadhaarLast4: '4821',
  tribe: 'Oraon',
  isPVTG: false,
  category: 'ST',
  familyIncome: 180000,
  fatherName: 'Sundar Ekka',
  domicileState: 'Jharkhand',
  domicileDistrict: 'Ranchi',
  homeVillage: 'Bariatu, Ranchi',
  language: 'en',
  courseLevel: 'undergrad',
  course: 'B.Tech Computer Science',
  institutionId: 'inst_bitmesra',
  year: '2nd Year',
  parentId: 'usr_parent_sundar',
  familyViewConsent: true,
};

const mohan: Student = {
  id: 'stu_mohan',
  name: 'Mohan Ram Rojat',
  gender: 'M',
  dob: '2004-08-25',
  aadhaarLast4: '9137',
  tribe: 'Baiga',
  isPVTG: true,
  category: 'ST',
  familyIncome: 92000,
  fatherName: 'Ram Prasad Rojat',
  domicileState: 'Madhya Pradesh',
  domicileDistrict: 'Mandla',
  homeVillage: 'Bijhera, Mandla',
  language: 'hi',
  courseLevel: 'undergrad',
  course: 'B.A. Political Science',
  institutionId: 'inst_gpgc',
  year: '3rd Year',
  parentId: 'usr_parent_rampasad',
  familyViewConsent: false,
};

const sunita: Student = {
  id: 'stu_sunita',
  name: 'Sunita Murmu',
  gender: 'F',
  dob: '2008-01-19',
  aadhaarLast4: '2260',
  tribe: 'Santal',
  isPVTG: false,
  category: 'ST',
  familyIncome: 120000,
  fatherName: 'Lakhan Murmu',
  domicileState: 'Odisha',
  domicileDistrict: 'Mayurbhanj',
  homeVillage: 'Badamundi, Mayurbhanj',
  language: 'sant',
  courseLevel: 'post-matric',
  course: 'Class 11 (Science)',
  institutionId: 'inst_gpgc',
  year: 'Class 11',
  parentId: 'usr_parent_lakhan',
  familyViewConsent: true,
};

// Mock schemes matching the real data structure
const mockSchemes: Scheme[] = [
  {
    id: 'pms_st',
    name: 'Post-Matric Scholarship for ST Students',
    shortName: 'PMS-ST',
    portal: 'NSP',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['post-matric', 'undergrad', 'postgrad', 'research'],
    amount: '₹5,000 – ₹30,000 / yr',
    benefits: [],
    deadline: '2026-11-15',
    requiredDocs: ['st_certificate', 'income_certificate', 'domicile', 'marksheet', 'bank_passbook'],
    rules: [
      { id: 'pms_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'pms_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹2,50,000 / yr', op: 'max', threshold: 250000 },
      { id: 'pms_domicile', label: 'Domicile in a notified state', field: 'domicileState', param: 'any Indian state', op: 'in', allowedValues: ['Jharkhand', 'Madhya Pradesh', 'Odisha', 'Chhattisgarh', 'Maharashtra', 'Gujarat', 'Rajasthan', 'Andhra Pradesh', 'Telangana'] },
      { id: 'pms_enrolment', label: 'Enrolled in a recognized post-matric course', field: 'courseLevel', param: 'Class 11 → PhD', op: 'in', allowedValues: ['post-matric', 'undergrad', 'postgrad', 'research'] },
    ],
    notes: '',
  },
  {
    id: 'top_class',
    name: 'National Top-Class ST Scholarship',
    shortName: 'Top-Class',
    portal: 'NSP',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['undergrad', 'postgrad'],
    amount: 'Full tuition + ₹3,000 / month',
    benefits: [],
    deadline: '2026-10-31',
    requiredDocs: ['st_certificate', 'income_certificate', 'marksheet', 'admission_proof', 'bank_passbook'],
    rules: [
      { id: 'tc_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'tc_institute', label: 'Admitted to a notified premier institute', field: 'institutionId', param: 'Top-Class institute basket', op: 'in', allowedValues: ['inst_bitmesra', 'inst_iitkgp'] },
      { id: 'tc_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹6,00,000 / yr', op: 'max', threshold: 600000 },
      { id: 'tc_marks', label: 'Minimum marks in qualifying exam', field: 'marks', param: '≥ 50% (UG) / 60% (PG)', op: 'min', threshold: 50 },
      { id: 'tc_level', label: 'Course level eligible', field: 'courseLevel', param: 'UG / PG', op: 'in', allowedValues: ['undergrad', 'postgrad'] },
    ],
    notes: '',
  },
  {
    id: 'nfst',
    name: 'National Fellowship for ST Students',
    shortName: 'NFST',
    portal: 'SFMP',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['research'],
    amount: '₹37,000 / month (JRF)',
    benefits: [],
    deadline: '2026-12-01',
    requiredDocs: ['st_certificate', 'income_certificate', 'marksheet', 'research_proposal', 'bank_passbook'],
    rules: [
      { id: 'nf_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'nf_level', label: 'Registered M.Phil / Ph.D scholar', field: 'courseLevel', param: 'research (M.Phil/Ph.D)', op: 'eq', allowedValues: ['research'] },
      { id: 'nf_university', label: 'Registered in a recognized university', field: 'institutionId', param: 'recognized university', op: 'in', allowedValues: ['inst_bitmesra', 'inst_iitkgp', 'inst_gpgc'] },
      { id: 'nf_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹6,00,000 / yr', op: 'max', threshold: 600000 },
      { id: 'nf_nofellow', label: 'Not holding another fellowship', field: 'noOtherFellowship', param: 'no other central fellowship', op: 'eq', allowedValues: ['yes'] },
    ],
    notes: '',
  },
  {
    id: 'nos',
    name: 'National Overseas Scholarship for ST Students',
    shortName: 'NOS',
    portal: 'NOS',
    ministry: 'Ministry of Tribal Affairs',
    courseLevels: ['postgrad', 'research'],
    amount: 'Up to ₹1.6 crore / student',
    benefits: [],
    deadline: '2026-11-30',
    requiredDocs: ['st_certificate', 'income_certificate', 'marksheet', 'admission_proof', 'bank_passbook'],
    rules: [
      { id: 'nos_category', label: 'Category is Scheduled Tribe', field: 'category', param: 'ST', op: 'eq', allowedValues: ['ST'] },
      { id: 'nos_marks', label: 'Minimum marks — 60% PG / 55% UG', field: 'marks', param: '≥ 55% (UG) / 60% (PG)', op: 'min', threshold: 55 },
      { id: 'nos_income', label: 'Family income within cap', field: 'familyIncome', param: '≤ ₹6,80,000 / yr', op: 'max', threshold: 680000 },
      { id: 'nos_level', label: 'Course level eligible', field: 'courseLevel', param: 'PG / research abroad', op: 'in', allowedValues: ['postgrad', 'research'] },
      { id: 'nos_admission', label: 'Unconditional admission letter abroad', field: 'admission', param: 'unconditional admit', op: 'eq', allowedValues: ['yes'] },
    ],
    notes: '',
  },
];

describe('Eligibility Engine', () => {
  describe('evaluateEligibility', () => {
    it('should pass all rules for Asha on PMS-ST', () => {
      const result = evaluateEligibility(asha, mockSchemes[0], { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      expect(result.eligible).toBe(true);
      expect(result.passedCount).toBe(4);
      expect(result.totalCount).toBe(4);
      expect(result.rules.every(r => r.passed)).toBe(true);
    });

    it('should pass all rules for Asha on Top-Class', () => {
      const result = evaluateEligibility(asha, mockSchemes[1], { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      expect(result.eligible).toBe(true);
      expect(result.passedCount).toBe(5);
      expect(result.totalCount).toBe(5);
      expect(result.rules.every(r => r.passed)).toBe(true);
    });

    it('should fail Top-Class for Mohan (not in premier institute)', () => {
      const result = evaluateEligibility(mohan, mockSchemes[1], { marks: 64, attendance: 75, admission: 'yes', noOtherFellowship: 'yes' });
      
      expect(result.eligible).toBe(false);
      const instituteRule = result.rules.find(r => r.ruleId === 'tc_institute');
      expect(instituteRule?.passed).toBe(false);
      expect(instituteRule?.actual).toContain('not in basket');
    });

    it('should fail NFST for Asha (not research level)', () => {
      const result = evaluateEligibility(asha, mockSchemes[2], { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      expect(result.eligible).toBe(false);
      const levelRule = result.rules.find(r => r.ruleId === 'nf_level');
      expect(levelRule?.passed).toBe(false);
    });

    it('should fail NOS for Sunita (not postgrad/research level)', () => {
      const result = evaluateEligibility(sunita, mockSchemes[3], { marks: 71, attendance: 80, admission: 'yes', noOtherFellowship: 'yes' });
      
      expect(result.eligible).toBe(false);
      const levelRule = result.rules.find(r => r.ruleId === 'nos_level');
      expect(levelRule?.passed).toBe(false);
    });

    it('should fail income rule when income exceeds cap', () => {
      const highIncomeStudent: Student = { ...asha, familyIncome: 300000 };
      const result = evaluateEligibility(highIncomeStudent, mockSchemes[0], { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      expect(result.eligible).toBe(false);
      const incomeRule = result.rules.find(r => r.ruleId === 'pms_income');
      expect(incomeRule?.passed).toBe(false);
      expect(incomeRule?.actual).toBe('₹3,00,000');
    });

    it('should return actual values in rule results for audit trail', () => {
      const result = evaluateEligibility(asha, mockSchemes[0], { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      const categoryRule = result.rules.find(r => r.ruleId === 'pms_category');
      expect(categoryRule?.actual).toBe('ST');
      expect(categoryRule?.passed).toBe(true);
      
      const incomeRule = result.rules.find(r => r.ruleId === 'pms_income');
      expect(incomeRule?.actual).toBe('₹1,80,000');
      expect(incomeRule?.passed).toBe(true);
    });

    it('should handle missing evidence gracefully', () => {
      const result = evaluateEligibility(asha, mockSchemes[1], {}); // no evidence provided
      
      const marksRule = result.rules.find(r => r.ruleId === 'tc_marks');
      expect(marksRule?.passed).toBe(false);
      expect(marksRule?.actual).toBe('not provided');
    });
  });

  describe('evaluateAllSchemes', () => {
    it('should evaluate all schemes for a student', () => {
      const results = evaluateAllSchemes(asha, mockSchemes, { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      expect(results.length).toBe(4);
      expect(results.map(r => r.schemeId)).toEqual(['pms_st', 'top_class', 'nfst', 'nos']);
    });

    it('should correctly identify eligible vs ineligible schemes', () => {
      const results = evaluateAllSchemes(asha, mockSchemes, { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      const pmsResult = results.find(r => r.schemeId === 'pms_st');
      const tcResult = results.find(r => r.schemeId === 'top_class');
      const nfstResult = results.find(r => r.schemeId === 'nfst');
      const nosResult = results.find(r => r.schemeId === 'nos');
      
      expect(pmsResult?.eligible).toBe(true);
      expect(tcResult?.eligible).toBe(true);
      expect(nfstResult?.eligible).toBe(false); // not research level
      expect(nosResult?.eligible).toBe(false); // not postgrad/research level
    });
  });

  describe('Rule evaluation edge cases', () => {
    it('should handle "in" operator for courseLevel correctly', () => {
      const result = evaluateEligibility(sunita, mockSchemes[0], { marks: 71, attendance: 80, admission: 'yes', noOtherFellowship: 'yes' });
      
      const enrolmentRule = result.rules.find(r => r.ruleId === 'pms_enrolment');
      expect(enrolmentRule?.passed).toBe(true);
      expect(enrolmentRule?.actual).toBe('post-matric');
    });

    it('should handle "eq" operator for category correctly', () => {
      const nonSTStudent = { ...asha, category: 'General' } as unknown as Student;
      const result = evaluateEligibility(nonSTStudent, mockSchemes[0], { marks: 87, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      const categoryRule = result.rules.find(r => r.ruleId === 'pms_category');
      expect(categoryRule?.passed).toBe(false);
      expect(categoryRule?.actual).toBe('General');
    });

    it('should handle "min" operator for marks correctly', () => {
      const lowMarksStudent: Student = { ...asha };
      const result = evaluateEligibility(lowMarksStudent, mockSchemes[1], { marks: 40, attendance: 83, admission: 'yes', noOtherFellowship: 'yes' });
      
      const marksRule = result.rules.find(r => r.ruleId === 'tc_marks');
      expect(marksRule?.passed).toBe(false);
      expect(marksRule?.actual).toBe('40%');
    });
  });
});