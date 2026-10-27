import { expect, it } from 'vitest';
import { answerQuestion } from './saarthi';
import { STUDENTS } from '@/data/students';
import { APPLICATIONS, DOCUMENTS } from '@/data/applications';
import { SCHEMES } from '@/data/schemes';

const ctx = { student: STUDENTS[0], applications: APPLICATIONS, documents: DOCUMENTS, schemes: SCHEMES, notifications: [] };
it.each(['मेरे आवेदन की स्थिति', 'दस्तावेज़ में कमी', 'भुगतान कब आएगा?', 'दस्तावेज़ वॉलेट', 'कौन सी योजनाएं उपलब्ध हैं?'])('answers %s in Hindi from the selected student data', (question) => {
  const reply = answerQuestion(ctx, question, 'hi');
  expect(reply.text).toMatch(/[\u0900-\u097f]/);
  expect(reply.text).not.toContain('Mohan');
  expect(reply.groundedOn.join(',')).not.toContain('mohan');
});
it('explains source pending in English without leaking another student’s documents', () => {
  const reply = answerQuestion({ ...ctx, applications: [{ ...APPLICATIONS[2], status: 'pending_verification' }] }, 'status');
  expect(reply.text).toContain('source is unavailable');
  expect(answerQuestion(ctx, 'wallet').text).not.toContain('Baiga');
});
