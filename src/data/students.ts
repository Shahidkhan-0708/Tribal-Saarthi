import type { Institution, Student, StudentProfile } from '@/types';

// ============================================================
// Seed institutions & demo students (SYNTHETIC individual
// records, realistic Indian tribal profiles for the demo).
// ============================================================

export const INSTITUTIONS: Institution[] = [
  { id: 'inst_bitmesra', name: 'Birla Institute of Technology, Mesra', type: 'premier', state: 'Jharkhand', district: 'Ranchi', inSchemeBasket: true },
  { id: 'inst_iitkgp', name: 'IIT Kharagpur', type: 'premier', state: 'West Bengal', district: 'Kharagpur', inSchemeBasket: true },
  { id: 'inst_gpgc', name: 'Govt. PG College, Mandla', type: 'govt_college', state: 'Madhya Pradesh', district: 'Mandla', inSchemeBasket: false },
];

export const STUDENTS: Student[] = [
  {
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
    apaarId: '9812-4029-1823',
    abcCredits: 44,
  },
  {
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
    apaarId: '4410-8912-3341',
    abcCredits: 62,
  },
  {
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
    apaarId: '7721-3094-8812',
    abcCredits: 18,
  },
];

export const DEMO_STUDENTS: Record<string, StudentProfile> = {
  // Profile 1: Green Path (Standard Clean Verification Journey)
  asha: {
    id: "STU-2026-ORAON01",
    aadhaarLast4: "3951",
    name: "Asha Kiran Ekka",
    dob: "2005-08-14",
    tribe: "Oraon",
    category: "ST",
    annualFamilyIncome: 180000, // Under the ₹2.5L limit
    domicileState: "Jharkhand",
    domicileDistrict: "Ranchi",
    institutionId: "INST_BIT_MESRA",
    courseLevel: "undergrad"
  },
  
  // Profile 2: Red Path (High-Priority PVTG with data mismatch)
  mohan: {
    id: "STU-2026-BAIGA09",
    aadhaarLast4: "8812",
    name: "Mohan Ram Rojat",
    dob: "2004-11-23",
    tribe: "Baiga",
    category: "PVTG", // Triggers PVTG Priority logic flags in the UI
    annualFamilyIncome: 95000,
    domicileState: "Madhya Pradesh",
    domicileDistrict: "Dindori",
    institutionId: "INST_GOVT_COLLEGE",
    courseLevel: "undergrad"
  }
};
