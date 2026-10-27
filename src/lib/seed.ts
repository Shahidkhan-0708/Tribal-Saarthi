// ============================================================
// Seed initialization helper for Adimool / Tribe Saarthi
// Re-hydrates seed datasets into mock database / local storage.
// ============================================================

import { SCHEMES } from '@/data/schemes';
import { STUDENTS, INSTITUTIONS } from '@/data/students';
import { APPLICATIONS, DOCUMENTS, VERIFICATION_LOGS } from '@/data/applications';
import { COVERAGE_SNAPSHOTS } from '@/data/coverage';
import { dbWrite, dbRead, dbResetAll } from './db';
import { useData } from '@/store/data';

export const initialSchemes = SCHEMES;
export const initialStudents = STUDENTS;
export const initialInstitutions = INSTITUTIONS;
export const initialApplications = APPLICATIONS;
export const initialDocuments = DOCUMENTS;
export const initialCoverage = COVERAGE_SNAPSHOTS;

/** Seeds mock database with default data if empty. */
export function seedDatabase(): void {
  const existingStudents = dbRead('students', null);
  if (!existingStudents) {
    dbWrite('students', STUDENTS);
    dbWrite('documents', DOCUMENTS);
    dbWrite('applications', APPLICATIONS);
    dbWrite('vlogs', VERIFICATION_LOGS);
    dbWrite('coverage', COVERAGE_SNAPSHOTS);
    dbWrite('institutions', INSTITUTIONS);
    console.log('[Adimool Seed] Database seeded with initial demo data.');
  } else {
    console.log('[Adimool Seed] Database already initialized.');
  }
}

/** Resets all stored data back to pristine seed state. */
export function resetToSeedData(): void {
  dbResetAll();
  useData.getState().resetDemo();
  seedDatabase();
}
