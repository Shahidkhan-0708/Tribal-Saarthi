import { useEffect, useState } from 'react';
import QRCode from 'qrcode';
import { AuthLayout } from './Casefile';

export function Receipt({ reference, issuedAt, hash, valid, local = false }: { reference: string; issuedAt?: string; hash?: string; valid?: boolean; local?: boolean }) {
  const [qr, setQr] = useState('');
  useEffect(()=>{let active=true;if(!local && hash) void QRCode.toDataURL(location.href,{width:160,margin:1}).then(url=>{if(active)setQr(url);}).catch(()=>{});return()=>{active=false;};},[local,hash]);
  return <div className="case-receipt-page"><AuthLayout recovery><h1>Scholarship approval receipt</h1><p>{local?'Local demo acknowledgement':'Public receipt verification'}</p><div className={`case-notice ${valid===false?'neutral':''}`}><h3>{local?'Demo record':valid===false?'Revoked or expired receipt':'Verified decision record'}</h3><p>{local?'This local acknowledgement has no public verification or digital seal.':valid===false?'This receipt is no longer valid.':'The receipt reference and recorded decision digest were returned by the pilot.'}</p></div><div className="case-receipt-grid"><dl className="case-profile-details"><div><dt>Receipt reference</dt><dd>{reference}</dd></div>{issuedAt && <div><dt>Issued</dt><dd>{new Date(issuedAt).toLocaleString('en-IN')}</dd></div>}{hash && <div><dt>SHA-256 decision digest</dt><dd className="case-receipt-hash">{hash}</dd></div>}</dl>{qr && <section><h2>Receipt link</h2><img src={qr} alt="QR code for this receipt verification page" width={160} height={160}/><p>No student profile is included in the link.</p></section>}</div><button className="case-button" onClick={()=>window.print()}>Print / Save PDF</button></AuthLayout></div>;
}
