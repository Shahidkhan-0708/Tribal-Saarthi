import { useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { Icon } from '@/components/common/Icon';
import { getReceipt } from '@/pilot/api';

export function DemoReceipt() {
  const [params] = useSearchParams();
  const initialId = params.get('receipt') || params.get('application') || 'TS-2026-88194';

  const [receiptId, setReceiptId] = useState(initialId);
  const [isVerifying, setIsVerifying] = useState(false);
  const [statusText, setStatusText] = useState('Last verified 18 Oct, 15:45');
  const [copied, setCopied] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [liveReceipt, setLiveReceipt] = useState<{ reference: string; issuedAt: string; hash: string; valid?: boolean } | null>(null);

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    const token = receiptId.trim();
    if (!token) return;
    setIsVerifying(true);
    setStatusText('Querying statutory cryptographic ledger…');

    try {
      const res = await getReceipt(token);
      if (res && res.hash) {
        setLiveReceipt(res);
        setStatusText(`Verified live · SHA-256 Merkle root sealed (${res.reference})`);
      } else {
        setLiveReceipt(null);
        setStatusText('Verified with mock proof · demo receipt');
      }
    } catch {
      setLiveReceipt(null);
      setStatusText('Verified with mock proof · demo receipt');
    } finally {
      setIsVerifying(false);
    }
  };

  const currentHash = liveReceipt?.hash ? `0x${liveReceipt.hash.slice(0, 8)}…${liveReceipt.hash.slice(-4)}` : '0x7c49…a420';

  const handleCopyHash = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(liveReceipt?.hash || '0x7c49a420').catch(() => {});
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = () => {
    setDownloaded(true);
    setTimeout(() => setDownloaded(false), 2000);
  };

  return (
    <div>
      <div className="publicbar">
        <Link className="brand" to="/mockups">
          <span className="brand-mark">TS</span>
          <span>
            <span className="brand-name">Tribe Saarthi</span>
            <span className="brand-sub">Public receipt verification</span>
          </span>
        </Link>
        <div className="flex center gap12">
          <span className="badge badge-green">
            <Icon name="lock" size={10} style={{ display: 'inline', marginRight: '4px' }} />
            Public record · Supabase Edge
          </span>
          <Link className="btn btn-ghost btn-sm" to="/login">Portal sign in</Link>
        </div>
      </div>

      <main className="publicwrap" id="main" data-od-id="receipt-verification-main">
        <div className="verify-hero">
          <div className="eyebrow">Statutory scholarship receipt · Public verification</div>
          <h1 style={{ marginTop: '12px' }} data-od-id="receipt-verification-title">Verify a sanction receipt</h1>
          <p>Enter a sanction receipt ID or scan the QR code on a scholarship order to confirm that it was issued through the Ministry of Tribal Affairs and paid to the named scholar.</p>
        </div>

        <form className="searchcard" onSubmit={handleVerify}>
          <div className="field">
            <label htmlFor="receiptId">Sanction receipt ID or Supabase Token</label>
            <input
              className="input mono"
              id="receiptId"
              value={receiptId}
              onChange={(e) => setReceiptId(e.target.value)}
              spellCheck={false}
              aria-describedby="receiptHint"
            />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '6px' }}>
              <span className="hint" id="receiptHint">Format: TS-YYYY-NNNNN or 48-char token</span>
              <button
                type="button"
                onClick={() => setReceiptId('709afdba31407d1e9e91b89f820a6fa73690d18680fc9f2b')}
                style={{ background: 'none', border: 'none', color: '#047857', fontSize: '11px', fontWeight: 600, cursor: 'pointer', padding: 0 }}
              >
                ⚡ Try live token (709afdba…)
              </button>
            </div>
          </div>
          <button className="btn btn-primary btn-lg" type="submit" data-od-id="receipt-verification-primary-cta" disabled={isVerifying}>
            <Icon name="shield" size={14} />
            {isVerifying ? 'Verifying with Supabase…' : 'Verify receipt'}
          </button>
          <div className="verify-status" style={{ paddingBottom: '14px', color: isVerifying ? 'var(--muted)' : 'var(--green)' }}>
            <Icon name={isVerifying ? 'refresh' : 'check'} size={12} style={{ stroke: isVerifying ? 'var(--muted)' : 'var(--green)' }} />
            {statusText}
          </div>
        </form>

        <div className="grid verify-grid" style={{ opacity: isVerifying ? 0.5 : 1, transition: 'opacity 0.2s ease' }}>
          <section className="card" data-od-id="verified-receipt-card">
            <div className="card-h">
              <div className="flex center gap12">
                <span style={{ width: '38px', height: '38px', borderRadius: '8px', background: 'var(--green-soft)', border: '1px solid var(--green-border)', display: 'grid', placeItems: 'center', flex: 'none' }}>
                  <Icon name="check" size={18} style={{ stroke: 'var(--green)' }} />
                </span>
                <div>
                  <h2 className="h2" style={{ fontSize: '17px' }}>Authentic &amp; sealed</h2>
                  <p className="micro" style={{ marginTop: '2px' }}>
                    {liveReceipt ? `Live statutory receipt · Reference ${liveReceipt.reference}` : 'Sample receipt · Reference MOTA/2026/88194'}
                  </p>
                </div>
              </div>
              <span className="badge badge-green"><span className="bdot"></span>Valid hash</span>
            </div>

            <div className="card-b">
              <div className="flex between center wrap gap12" style={{ paddingBottom: '16px', borderBottom: '1px solid var(--line)' }}>
                <div>
                  <div className="eyebrow">Scholarship approval receipt</div>
                  <div className="h2" style={{ marginTop: '6px' }}>Post-Matric Scholarship for ST Students</div>
                  <div className="micro" style={{ marginTop: '3px' }}>
                    {liveReceipt ? `Issued ${new Date(liveReceipt.issuedAt).toLocaleDateString()} · MoTA Staging` : 'Scholarship cycle 2026-2027 · Latehar district, Jharkhand'}
                  </div>
                </div>
                <div className="right">
                  <div className="eyebrow">Total sanction</div>
                  <div className="price" style={{ fontSize: '22px', marginTop: '4px' }}>₹1,32,000</div>
                </div>
              </div>

              <div className="keyline" style={{ padding: '12px 0' }}>
                <span className="k" style={{ width: '150px' }}>Scholar name</span>
                <span className="v">Mohan Birhor (PVTG Tier-1 Birhor Tribe)</span>
              </div>
              <div className="keyline" style={{ padding: '12px 0' }}>
                <span className="k" style={{ width: '150px' }}>Domicile residence</span>
                <span className="v" style={{ fontWeight: 500, color: 'var(--muted)' }}>Village Belta, Block Mahuadanr, District Latehar, Jharkhand</span>
              </div>
              <div className="keyline" style={{ padding: '12px 0' }}>
                <span className="k" style={{ width: '150px' }}>Institution &amp; roll</span>
                <span className="v" style={{ fontWeight: 500, color: 'var(--muted)' }}>BIT Mesra, Ranchi · Roll #2024-CSE-104 (B.Tech CSE)</span>
              </div>
              <div className="keyline" style={{ padding: '12px 0' }}>
                <span className="k" style={{ width: '150px' }}>Grant components</span>
                <span className="v" style={{ fontWeight: 500, color: 'var(--muted)' }}>Tuition ₹98,000 · Maintenance ₹24,000 · Book ₹10,000</span>
              </div>
              <div className="keyline" style={{ padding: '12px 0' }}>
                <span className="k" style={{ width: '150px' }}>Target DBT account</span>
                <span className="v mono" style={{ fontSize: '11px' }}>Bank of India · ••••9012 · Aadhaar seeded</span>
              </div>
              <div className="keyline" style={{ padding: '12px 0' }}>
                <span className="k" style={{ width: '150px' }}>Signing authority</span>
                <div className="v">Dr. K. Soren, DWO Latehar</div>
                <span className="micro mono" style={{ marginLeft: 'auto', color: 'var(--meta)' }}>DSC 0x7F82A091</span>
              </div>

              <div className="trust" style={{ marginTop: '18px' }}>
                <div>
                  <div className="tn"><Icon name="check" size={10} style={{ display: 'inline', marginRight: '4px' }} />College</div>
                  <div className="tv">BIT Mesra</div>
                  <div className="td">Nodal desk verified</div>
                </div>
                <div>
                  <div className="tn"><Icon name="check" size={10} style={{ display: 'inline', marginRight: '4px' }} />District</div>
                  <div className="tv">Latehar DWO</div>
                  <div className="td">DSC signed</div>
                </div>
                <div>
                  <div className="tn"><Icon name="check" size={10} style={{ display: 'inline', marginRight: '4px' }} />Central</div>
                  <div className="tv">MoTA treasury</div>
                  <div className="td">Sanction sealed</div>
                </div>
                <div>
                  <div className="tn"><Icon name="check" size={10} style={{ display: 'inline', marginRight: '4px' }} />Payment</div>
                  <div className="tv">Bank of India</div>
                  <div className="td">PFMS direct credit</div>
                </div>
              </div>
            </div>

            <div className="card-ft">
              <span className="micro" style={{ color: 'var(--meta)' }}>
                {liveReceipt ? `Ledger block verified · ${new Date(liveReceipt.issuedAt).toLocaleString()}` : 'Block #1842 verified · 14 Oct 2026, 14:32 IST'}
              </span>
              <div className="flex gap8">
                <button className="btn btn-secondary btn-sm" type="button" onClick={handleCopyHash}>
                  <Icon name={copied ? 'check' : 'copy'} size={12} />
                  {copied ? 'Copied' : 'Copy hash'}
                </button>
                <button className="btn btn-secondary btn-sm" type="button" onClick={handleDownload}>
                  <Icon name={downloaded ? 'check' : 'download'} size={12} />
                  {downloaded ? 'Sample only' : 'Download PDF'}
                </button>
              </div>
            </div>
          </section>

          <div className="stack">
            <section className="card">
              <div className="card-b" style={{ textAlign: 'center', padding: '22px' }}>
                <div className="qr-box" style={{ margin: '0 auto' }}>
                  <Icon name="qr" size={34} />
                  <span>Sample QR · opens the NIC validator</span>
                </div>
                <h2 className="h4" style={{ marginTop: '14px' }}>Receipt reference</h2>
                <div className="mono" style={{ fontSize: '12px', fontWeight: 560, marginTop: '4px' }}>
                  {liveReceipt?.reference || receiptId}
                </div>
                <p className="micro" style={{ marginTop: '8px', lineHeight: 1.55 }}>Scan with any smartphone to open the live validator ledger.</p>
              </div>
            </section>

            <section className="card">
              <div className="card-h">
                <h2 className="h3">Cryptographic evidence</h2>
                <span className="badge badge-gray">{liveReceipt ? 'Live Merkle' : 'Merkle'}</span>
              </div>
              <div className="card-b">
                <div className="keyline"><span className="k">Algorithm</span><span className="v mono" style={{ fontSize: '10.5px' }}>SHA-256</span></div>
                <div className="keyline"><span className="k">Hash</span><span className="v mono" style={{ fontSize: '10.5px' }}>{currentHash}</span></div>
                <div className="keyline"><span className="k">Merkle root</span><span className="v mono" style={{ fontSize: '10.5px' }}>{liveReceipt ? currentHash : '0x19a0…33bd'}</span></div>
                <div className="keyline"><span className="k">Validators</span><span className="v">4 of 4 nodes</span></div>
                <div className="callout ok mt16">
                  <Icon name="shield" size={16} />
                  <div><b>Public evidence guarantee.</b> Any change to this record would break the hash and fail verification.</div>
                </div>
              </div>
            </section>
          </div>
        </div>

        <p className="micro" style={{ marginTop: '24px', color: 'var(--meta)', maxWidth: '70ch', lineHeight: 1.65 }}>
          Statutory verification endpoint connected to Supabase Edge Function (<code>pilot-receipt</code>). Proofs are verified against cryptographic state hashes in the Ministry database.
        </p>
      </main>
    </div>
  );
}
