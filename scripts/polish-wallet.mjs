import fs from 'node:fs';

let code = fs.readFileSync('src/pages/Student/Wallet.tsx', 'utf8');

// Replace Consent token in metric strip with friendly status
code = code.replace(
  `<div className="m-lab">Consent token</div>
          <div className="m-val mono" style={{ fontSize: '11px' }}>
            TKN-MOTA-2026-90412
          </div>`,
  `<div className="m-lab">DigiLocker Vault</div>
          <div className="m-val font-semibold text-emerald-800">
            Active &amp; Linked ✓
          </div>`
);
if (!code.includes('Active &amp; Linked ✓')) {
  code = code.replace(
    `<div className="m-lab">Consent token</div>\r\n          <div className="m-val mono" style={{ fontSize: '11px' }}>\r\n            TKN-MOTA-2026-90412\r\n          </div>`,
    `<div className="m-lab">DigiLocker Vault</div>\r\n          <div className="m-val font-semibold text-emerald-800">\r\n            Active &amp; Linked ✓\r\n          </div>`
  );
}

// Polish subtitle
code = code.replace(
  'Keep certificates ready and reuse them when you apply. Each seal is checked against the issuing registry.',
  'Your verified certificates are kept safe here. Once verified, you never need to run to government offices again.'
);

fs.writeFileSync('src/pages/Student/Wallet.tsx', code, 'utf8');
console.log('src/pages/Student/Wallet.tsx polished.');
