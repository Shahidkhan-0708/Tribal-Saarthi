import { expect, it } from 'vitest';
import { applicationPresentation } from './Casefile';

it.each([['draft',0],['institute_stage',1],['department_stage',2],['sanctioned',3],['disbursed',4],['deficiency',1]] as const)('shows the actual %s application stage', (status,step)=>{
  expect(applicationPresentation(status).step).toBe(step);
});
it('does not present an unconfirmed payment or a missing application as complete',()=>{
  expect(applicationPresentation('sanctioned').detail).toContain('not been confirmed');
  expect(applicationPresentation().title).toBe('Start your scholarship application');
  expect(applicationPresentation('deficiency').title).toContain('attention');
});
