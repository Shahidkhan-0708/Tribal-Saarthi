import type { DocumentResponse } from '../generated/digilocker/api';

const SAMPLE_PDF_BASE64 = 'JVBERi0xLjQKJcTl8uXrp/Og0MTGCjEgMCBvYmoKPDwvVHlwZS9DYXRhbG9nL1BhZ2VzIDIgMCBSPj4KZW5kb2JqCjIgMCBvYmoKPDwvVHlwZS9QYWdlcy9Db3VudCAxL0tpZHMgWzMgMCBSXSA+PgplbmRvYmoKMyAwIG9iago8PC9UeXBlL1BhZ2UvUGFyZW50IDIgMCBSL1Jlc291cmNlcyA8Pj4vTWVkaWFCb3ggWzAgMCA2MTIgNzkyXSA+PgplbmRvYmoKeHJlZgowIDQKMDAwMDAwMDAwMCA2NTUzNSBmIAowMDAwMDAwMDEwIDAwMDAwIG4gCjAwMDAwMDAwNzkgMDAwMDAgbiAKdHJhaWxlcgo8PC9TaXplIDQvUm9vdCAxIDAgUj4+CiUlRU9G';

export async function mockDigiLockerFetch(docId: string): Promise<DocumentResponse> {
  if (!docId) {
    throw new Error('DOC_ID_REQUIRED');
  }
  if (docId.startsWith('missing')) {
    throw new Error('NOT_FOUND');
  }
  return {
    docId,
    mimeType: 'application/pdf',
    contentBase64: SAMPLE_PDF_BASE64,
  };
}