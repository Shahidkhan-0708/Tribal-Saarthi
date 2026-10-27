import fs from 'node:fs';

let code = fs.readFileSync('src/components/layout/index.tsx', 'utf8');

if (!code.includes('const isBackendConnected = useSession')) {
  code = code.replace(
    'const markRead = useData((s) => s.markRead);',
    `const markRead = useData((s) => s.markRead);
  const isBackendConnected = useSession((s) => s.isBackendConnected);
  const isBackendSyncing = useSession((s) => s.isBackendSyncing);
  const lastSyncTime = useSession((s) => s.lastSyncTime);
  const isDataSyncing = useData((s) => s.isSyncing);
  const syncWithBackend = useData((s) => s.syncWithBackend);`
  );
}

const oldSyncBox = `          <div className="rail-foot">
            <div className="syncbox">
              <div className="row">
                <span className="pulse" />
                <span>{isOfficer ? 'Desk synced' : 'Work saved'}</span>
              </div>
              <p>
                Last sync 18 Oct, 15:45
                <br />
                <span>Local demo - no offline sync</span>
              </p>
            </div>`;

const newSyncBox = `          <div className="rail-foot">
            <div className="syncbox" data-od-id="sync-status-box">
              <div className="row" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span className={\`pulse \${isBackendConnected ? 'bg-emerald-500' : ''}\`} />
                  <span style={{ fontWeight: 600 }}>{isBackendConnected ? 'Supabase live' : (isOfficer ? 'Desk synced' : 'Work saved')}</span>
                </div>
                {isBackendConnected && (
                  <button
                    type="button"
                    onClick={() => syncWithBackend()}
                    disabled={isBackendSyncing || isDataSyncing}
                    style={{ background: 'none', border: 'none', color: '#047857', fontSize: '10px', textDecoration: 'underline', cursor: 'pointer', padding: 0 }}
                    title="Refresh data from Supabase"
                  >
                    {isBackendSyncing || isDataSyncing ? 'Syncing…' : 'Sync'}
                  </button>
                )}
              </div>
              <p>
                {isBackendConnected ? (
                  <>
                    <span>axegexiaofxdmmizilri</span>
                    <br />
                    <span>Last sync: {lastSyncTime || 'Just now'}</span>
                  </>
                ) : (
                  <>
                    <span>Local offline store</span>
                    <br />
                    <span>In-memory browser state</span>
                  </>
                )}
              </p>
            </div>`;

code = code.replace(oldSyncBox, newSyncBox);
if (!code.includes('data-od-id="sync-status-box"')) {
  // Try CRLF replace
  code = code.replace(oldSyncBox.replace(/\n/g, '\r\n'), newSyncBox.replace(/\n/g, '\r\n'));
}

fs.writeFileSync('src/components/layout/index.tsx', code, 'utf8');
console.log('src/components/layout/index.tsx updated successfully.');
