import type { OcrFields, Student, StudentDocument } from '@/types';

// ============================================================
// Simulated OCR / Document Intelligence
//
// In production this would be an OCR + field-extraction model.
// In the prototype, "OCR text" is seeded alongside each
// document; this engine parses it the same way an extraction
// pipeline would and CROSS-CHECKS the extracted fields against
// the student profile. Discrepancies are flagged for HUMAN
// review — never auto-rejected.
// ============================================================

export interface OcrCheckResult {
  documentId: string;
  extracted: OcrFields;
  discrepancies: string[];
  verdict: 'match' | 'mismatch';
}

/** Parse the seeded certificate text into structured fields. */
export function parseCertificateText(text: string): OcrFields {
  const fields: OcrFields = {};
  const grab = (re: RegExp): string | undefined => {
    const m = text.match(re);
    return m?.[1]?.trim();
  };

  fields.name = grab(/(?:Name|Applicant|Student|holder)\s*[:\-]\s*([^\n]+)/i);
  const dob = grab(/DOB\s*[:\-]\s*(\d{2}\/\d{2}\/\d{4})/i);
  fields.dob = dob;
  fields.tribe = grab(/Tribe\s*[:\-]\s*([^\n]+)/i);
  const income = grab(/income\s*[:\-]?\s*Rs\.?\s*([\d,]+)/i);
  if (income) fields.income = Number(income.replace(/,/g, ''));
  fields.certificateNo = grab(/Certificate No\s*[:\-]\s*([A-Z0-9/]+)/i);
  const pct = text.match(/(\d+(?:\.\d+)?)\s*%/);
  if (pct) {
    const num = Number(pct[1]);
    if (pct[0].includes('Attendance')) fields['attendance%'] = num;
    else fields.marks = num;
  }
  fields.institution = grab(/(?:College|Institute|University)\s*[,:\-]\s*([^\n]+)/i);
  fields.issueDate = grab(/(?:Issue Date|Issued On|Date of Issue|Date)\s*[:\-]\s*(\d{2}\/\d{2}\/\d{4}|\d{4}-\d{2}-\d{2})/i);
  const hasSeal = /(?:Tehsildar|Executive Magistrate|Sub-Divisional Officer|SDO|District Magistrate|Revenue Officer|Seal\s*:\s*Affixed|Seal\s*:\s*Verified)/i.test(text);
  if (hasSeal) {
    fields.tehsildarSeal = true;
  }
  return fields;
}

/** Convert extracted 08/04/2005 → ISO 2005-04-08 for comparison. */
function ddmmyyyyToIso(s?: string): string | undefined {
  if (!s) return undefined;
  const m = s.match(/^(\d{2})\/(\d{2})\/(\d{4})$/);
  if (!m) return undefined;
  return `${m[3]}-${m[2]}-${m[1]}`;
}

/**
 * The demo's seeded OCR pipeline: extract → compare → flag.
 * A mismatch means the document is flagged for manual review;
 * the pipeline never infers "fraud" — it just surfaces facts.
 */
export function crossCheckDocument(doc: StudentDocument, student: Student): OcrCheckResult {
  const extracted = doc.ocrFields ?? parseCertificateText(doc.ocrText ?? '');
  const discrepancies: string[] = [];

  // Name check (case/whitespace tolerant)
  if (extracted.name) {
    const norm = (s: string) => s.toLowerCase().replace(/\s+/g, ' ').trim();
    if (!norm(extracted.name).includes(norm(student.name).split(' ')[0])) {
      discrepancies.push(`Name on document ("${extracted.name}") differs from profile ("${student.name}")`);
    }
  }

  // DOB check
  const isoDoc = ddmmyyyyToIso(extracted.dob);
  if (isoDoc && isoDoc !== student.dob) {
    discrepancies.push(
      `DOB on document (${extracted.dob}) does not match profile (${student.dob})`,
    );
  }

  // Tribe check
  if (extracted.tribe && extracted.tribe.toLowerCase() !== student.tribe.toLowerCase()) {
    discrepancies.push(`Tribe on document ("${extracted.tribe}") differs from profile ("${student.tribe}")`);
  }

  // Income check
  if (typeof extracted.income === 'number' && Math.abs(extracted.income - student.familyIncome) > 1000) {
    discrepancies.push(
      `Income on document (₹${extracted.income.toLocaleString('en-IN')}) differs from profile (₹${student.familyIncome.toLocaleString('en-IN')})`,
    );
  }

  return {
    documentId: doc.id,
    extracted,
    discrepancies,
    verdict: discrepancies.length > 0 ? 'mismatch' : 'match',
  };
}
