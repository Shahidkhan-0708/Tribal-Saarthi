import { useState } from 'react';
import { useData } from '@/store/data';
import { useSession } from '@/store/session';
import { Icon } from '@/components/common/Icon';

export function Wallet() {
  const data = useData();
  const user = useSession((s) => s.user);
  const student = data.students.find((s) => s.id === user?.studentId) ?? data.students[0];
  const [toastMsg, setToastMsg] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [fetching, setFetching] = useState(false);
  const [fileError, setFileError] = useState('');
  const [missingDocError, setMissingDocError] = useState('');

  const studentDocs = data.documents.filter((d) => d.studentId === student.id);
  const baselineIds = ['doc_caste', 'doc_income', 'doc_bonafide', 'doc_marksheet'];
  const additionalDocs = studentDocs.filter((d) => !baselineIds.includes(d.id));
  const verifiedCount = studentDocs.filter((d) => d.status === 'verified').length;

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(''), 2500);
  };

  const copyHash = (hash: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(hash).catch(() => {});
    }
    showToast('Digest hash copied to clipboard');
  };

  return (
    <div data-demo="document-wallet" data-od-id="document-wallet-main" className="space-y-6 relative">
      {/* Toast Notification */}
      {toastMsg && (
        <div className="toast show" role="status">
          <Icon name="check" className="i-sm" />
          <span>{toastMsg}</span>
        </div>
      )}

      {/* Page Header */}
      <div className="page-head">
        <div>
          <div className="crumb">
            <span>Scholar workspace</span>
            <Icon name="chevronRight" className="i-sm" />
            <span>My documents</span>
          </div>
          <h1 className="page-title" data-od-id="document-wallet-title">
            My documents
          </h1>
          <p className="page-sub">
            Your verified certificates are kept safe here. Once verified, you never need to run to government offices again.
          </p>
        </div>
        <div className="page-actions">
          <button
            className="btn btn-secondary"
            type="button"
            onClick={() => showToast('All four DigiLocker seals are current')}
          >
            <Icon name="refresh" className="i" />
            Refresh documents
          </button>
        </div>
      </div>

      {/* Metric Strip */}
      <div className="metric-strip" style={{ marginBottom: '16px' }}>
        <div>
          <div className="m-lab">Documents in wallet</div>
          <div className="m-val num">{studentDocs.length} records</div>
        </div>
        <div>
          <div className="m-lab">DigiLocker verified</div>
          <div className="m-val">{verifiedCount} of {studentDocs.length}</div>
        </div>
        <div>
          <div className="m-lab">Last vault sync</div>
          <div className="m-val">18 Oct 2026 · 15:45</div>
        </div>
        <div>
          <div className="m-lab">DigiLocker Vault</div>
          <div className="m-val font-semibold text-emerald-800">
            Active &amp; Linked ✓
          </div>
        </div>
      </div>

      {/* Certificates & Aside */}
      <div className="grid g-main" style={{ alignItems: 'start' }}>
        <section className="card" aria-labelledby="cert-title">
          <div className="card-h">
            <div>
              <h2 className="h3" id="cert-title">
                Certificates and records
              </h2>
              <p className="micro" style={{ marginTop: '3px' }}>
                Check the issuer, details, and review status for each document.
              </p>
            </div>
            <span className="badge badge-green">
              <Icon name="shield" className="i-sm" style={{ width: '10px', height: '10px' }} />
              Vault verified
            </span>
          </div>

          {/* Certificate 1: ST Certificate */}
          <div className="p-5 border-b border-[var(--line)]">
            <div className="flex items-start gap-3">
              <div className="doc-ico">
                <Icon name="file" className="i" />
              </div>
              <div className="grow">
                <div className="text-sm font-semibold text-[var(--ink)]">
                  Scheduled Tribe Caste Certificate
                </div>
                <div className="micro" style={{ marginTop: '3px' }}>
                  Community: {student.tribe} ({student.isPVTG ? 'PVTG Tier-1' : 'ST'}) · Lifetime validity
                </div>
              </div>
              <span className="badge badge-green">
                <span className="bdot" />
                Sealed
              </span>
            </div>
            <div className="grid g3 mt-3 p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg text-xs gap-3">
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Issuing authority</div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">SDO Mahuadanr, Latehar, Jharkhand</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Certificate number</div>
                <div className="font-mono text-[var(--ink)] mt-0.5">JH/ST/2023/88194</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Issued</div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">14 Aug 2023</div>
              </div>
            </div>
            <details className="mt-2.5 group">
              <summary className="text-[11px] text-emerald-800 font-medium cursor-pointer hover:underline list-none flex items-center gap-1.5">
                <Icon name="lock" className="i-sm text-emerald-700" />
                <span>View NIC Seal &amp; Cryptographic Hash</span>
              </summary>
              <div className="flex items-center gap-2 mt-2 p-2 bg-[var(--canvas)] rounded border border-[var(--line)] text-[10px] text-[var(--meta)]">
                <code className="font-mono truncate">
                  SHA-256 e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855
                </code>
                <button
                  className="btn btn-ghost btn-xs ml-auto"
                  type="button"
                  onClick={() => copyHash('e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855')}
                >
                  Copy
                </button>
                <button
                  className="btn btn-secondary btn-xs"
                  type="button"
                  onClick={() => showToast('Opening NIC seal certificate verification')}
                >
                  View NIC seal
                </button>
              </div>
            </details>
          </div>

          {/* Certificate 2: Income Certificate */}
          <div className="p-5 border-b border-[var(--line)]">
            <div className="flex items-start gap-3">
              <div className="doc-ico">
                <Icon name="file" className="i" />
              </div>
              <div className="grow">
                <div className="text-sm font-semibold text-[var(--ink)]">
                  Annual Family Income Certificate
                </div>
                <div className="micro" style={{ marginTop: '3px' }}>
                  Certified gross income: ₹1,20,000 / year · Within the ₹2.50 lakh limit
                </div>
              </div>
              <span className="badge badge-green">
                <span className="bdot" />
                Sealed
              </span>
            </div>
            <div className="grid g3 mt-3 p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg text-xs gap-3">
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Issuing authority</div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">Revenue Circle Office, Latehar</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Certificate number</div>
                <div className="font-mono text-[var(--ink)] mt-0.5">JH/INC/2026/0192</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Validity</div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">March 2027</div>
              </div>
            </div>
            <details className="mt-2.5 group">
              <summary className="text-[11px] text-emerald-800 font-medium cursor-pointer hover:underline list-none flex items-center gap-1.5">
                <Icon name="lock" className="i-sm text-emerald-700" />
                <span>View NIC Seal &amp; Cryptographic Hash</span>
              </summary>
              <div className="flex items-center gap-2 mt-2 p-2 bg-[var(--canvas)] rounded border border-[var(--line)] text-[10px] text-[var(--meta)]">
                <code className="font-mono truncate">
                  SHA-256 f482a014948a901ba8472910c0194821a810f821ba091482910948210f948201
                </code>
                <button
                  className="btn btn-ghost btn-xs ml-auto"
                  type="button"
                  onClick={() => copyHash('f482a014948a901ba8472910c0194821a810f821ba091482910948210f948201')}
                >
                  Copy
                </button>
                <button
                  className="btn btn-secondary btn-xs"
                  type="button"
                  onClick={() => showToast('Opening NIC seal certificate verification')}
                >
                  View NIC seal
                </button>
              </div>
            </details>
          </div>

          {/* Certificate 3: Academic Bonafide */}
          <div className="p-5 border-b border-[var(--line)]">
            <div className="flex items-start gap-3">
              <div className="doc-ico">
                <Icon name="file" className="i" />
              </div>
              <div className="grow">
                <div className="text-sm font-semibold text-[var(--ink)]">
                  Academic Bonafide &amp; Enrolment Certificate
                </div>
                <div className="micro" style={{ marginTop: '3px' }}>
                  Birla Institute of Technology (BIT Mesra) · B.Tech CSE, 2nd Year
                </div>
              </div>
              <span className="badge badge-green">
                <span className="bdot" />
                Sealed
              </span>
            </div>
            <div className="grid g3 mt-3 p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg text-xs gap-3">
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Issuing authority</div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">Academic Section, BIT Mesra</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Certificate number</div>
                <div className="font-mono text-[var(--ink)] mt-0.5">BIT/ACAD/2026/104</div>
              </div>
              <div>
                <div className="text-[10px] font-bold text-[var(--meta)] uppercase">Academic Cycle</div>
                <div className="font-semibold text-[var(--ink)] mt-0.5">2026-2027</div>
              </div>
            </div>
          </div>

          {/* Certificate 4: Secondary Marksheet */}
          <div className="p-5">
            <div className="flex items-start gap-3">
              <div className="doc-ico">
                <Icon name="file" className="i" />
              </div>
              <div className="grow">
                <div className="text-sm font-semibold text-[var(--ink)]">
                  Secondary School Examination Marksheet
                </div>
                <div className="micro" style={{ marginTop: '3px' }}>
                  Jharkhand Academic Council (JAC Ranchi) · 84.4% aggregate
                </div>
              </div>
              <span className="badge badge-green">
                <span className="bdot" />
                Sealed
              </span>
            </div>
          </div>

          {/* Dynamic & Additional Uploaded Documents */}
          {additionalDocs.map((doc) => {
            const pseudoHash = `e${doc.id.replace(/[^a-f0-9]/gi, '')}9b7852b855`.padEnd(32, 'a').slice(0, 32);
            return (
              <div key={doc.id} className="p-5 border-t border-[var(--line)]">
                <div className="flex items-start gap-3">
                  <div className="doc-ico">
                    <Icon name="file" className="i" />
                  </div>
                  <div className="grow">
                    <div className="text-sm font-semibold text-[var(--ink)]">
                      {doc.title}
                    </div>
                    <div className="micro" style={{ marginTop: '3px' }}>
                      {doc.ocrText || (doc.ocrFields?.institution ?? 'Self-uploaded document')} · Version {doc.version}
                    </div>
                  </div>
                  <span className={`badge ${doc.status === 'verified' ? 'badge-green' : 'badge-amber'}`}>
                    <span className="bdot" />
                    {doc.status === 'verified' ? 'Sealed' : 'Unverified upload'}
                  </span>
                </div>
                <details className="mt-2 text-[10px] text-[var(--meta)]">
                  <summary className="text-[11px] text-emerald-800 font-medium cursor-pointer hover:underline list-none flex items-center gap-1.5">
                    <Icon name="lock" className="i-sm text-emerald-700" />
                    <span>View Cryptographic Hash</span>
                  </summary>
                  <div className="flex items-center gap-2 mt-1.5 p-2 bg-[var(--canvas)] rounded border border-[var(--line)]">
                    <code className="font-mono truncate">
                      SHA-256 {pseudoHash}
                    </code>
                    <button
                      className="btn btn-ghost btn-xs ml-auto"
                      type="button"
                      onClick={() => copyHash(pseudoHash)}
                    >
                      Copy
                    </button>
                  </div>
                </details>
              </div>
            );
          })}
        </section>

        {/* Right Aside */}
        <aside className="stack">
          <section className="card">
            <div className="card-b p-5">
              <div className="eyebrow">Vault status</div>
              <h3 className="h3 mt-2">DigiLocker Active</h3>
              <p className="micro text-[var(--muted)] mt-1">
                Your DigiLocker account is synced. All documents are fetched directly from state issuing authorities with cryptographic seals.
              </p>
              <button
                className="btn btn-secondary btn-block mt-4"
                type="button"
                disabled={fetching}
                onClick={() => {
                  setFetching(true);
                  showToast('DigiLocker vault connection healthy and synchronized');
                  setTimeout(() => setFetching(false), 1500);
                }}
              >
                {fetching ? 'Fetch from DigiLocker (in-flight...)' : 'Fetch from DigiLocker'}
              </button>

              <button
                type="button"
                className="btn btn-ghost btn-block mt-2 text-[10px]"
                onClick={() => {
                  setMissingDocError('DigiLocker Error 404: Document doc_404_deleted not found in citizen repository. Safely handled with fallback notice.');
                }}
              >
                Simulate 404 Missing Document Pull
              </button>

              {missingDocError && (
                <div role="alert" className="callout warn mt-2">
                  <Icon name="alert" size={14} />
                  <div>{missingDocError}</div>
                </div>
              )}
            </div>
          </section>

          <section className="card">
            <div className="card-b p-5">
              <div className="eyebrow">Upload document</div>
              <h3 className="h3 mt-2">Need to attach another record?</h3>
              <p className="micro text-[var(--muted)] mt-1">
                Attach fee receipts or income certificates in PDF or PNG format up to 10 MB.
              </p>
              <button
                className="btn btn-primary btn-block mt-4"
                type="button"
                onClick={() => setUploadOpen(!uploadOpen)}
              >
                <Icon name="upload" className="i" />
                Upload document
              </button>

              <input
                type="file"
                className="hidden"
                id="wallet-file-input"
                accept=".pdf,image/png,image/jpeg"
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) {
                    if (!['application/pdf', 'image/png', 'image/jpeg'].includes(file.type)) {
                      setFileError(`Unsupported file format: ${file.name}. Only application/pdf, image/png, and image/jpeg files are accepted. File was safely discarded.`);
                    } else {
                      setFileError('');
                      data.uploadDocument(
                        student.id,
                        'admission_proof',
                        file.name,
                        `Self-uploaded file · ${(file.size / 1024).toFixed(1)} KB`
                      );
                      showToast(`Document "${file.name}" added to wallet`);
                      setUploadOpen(false);
                    }
                  }
                }}
              />

              {fileError && (
                <div role="alert" className="callout warn mt-2">
                  <Icon name="alert" size={14} />
                  <div>{fileError}</div>
                </div>
              )}

              {uploadOpen && (
                <div className="mt-3 p-3 bg-[var(--surface-2)] border border-[var(--line)] rounded-lg space-y-2">
                  <div className="text-xs font-semibold text-[var(--ink)]">Select certificate to upload:</div>
                  <div className="flex flex-col gap-1.5">
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm text-left flex items-center justify-between"
                      onClick={() => document.getElementById('wallet-file-input')?.click()}
                    >
                      <span>Upload local PDF / image</span>
                      <Icon name="upload" className="i-sm" />
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm text-left"
                      onClick={() => {
                        data.uploadDocument(student.id, 'income_certificate', 'Income Certificate (v2)', 'Name: Asha Kiran Ekka · Updated revenue seal');
                        showToast('Uploaded unverified Income Certificate');
                        setUploadOpen(false);
                      }}
                    >
                      Income Certificate
                    </button>
                    <button
                      type="button"
                      className="btn btn-secondary btn-sm text-left"
                      onClick={() => {
                        data.uploadDocument(student.id, 'st_certificate', 'ST Certificate (v2)', 'Name: Asha Kiran Ekka · Updated community seal');
                        showToast('Uploaded unverified ST Certificate');
                        setUploadOpen(false);
                      }}
                    >
                      ST Certificate
                    </button>
                  </div>
                </div>
              )}
            </div>
          </section>
        </aside>
      </div>
    </div>
  );
}
