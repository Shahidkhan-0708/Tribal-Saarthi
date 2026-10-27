import fs from 'node:fs';

// 1. Fix src/pilot/offline.ts for indexedDB undefined in Node
let offlineCode = fs.readFileSync('src/pilot/offline.ts', 'utf8');
if (!offlineCode.includes("if (typeof indexedDB === 'undefined') return;")) {
  offlineCode = offlineCode.replace(
    'export async function clearOfflineData() {',
    "export async function clearOfflineData() {\n  if (typeof indexedDB === 'undefined') return;"
  );
  fs.writeFileSync('src/pilot/offline.ts', offlineCode, 'utf8');
  console.log('src/pilot/offline.ts updated.');
}

// 2. Fix src/pilot/api.ts
let apiCode = fs.readFileSync('src/pilot/api.ts', 'utf8');
apiCode = apiCode.replace(
  /export const isPilotMode = env\.VITE_APP_MODE === 'pilot' \|\| isConfigured;/,
  "export const isPilotMode = env.VITE_APP_MODE === 'pilot';"
);
apiCode = apiCode.replace(
  /if \(!isPilotMode \|\| !isConfigured\) throw new ApiError\('Pilot connection is not configured\.', 'CONFIG'\);/,
  "if (!isConfigured) throw new ApiError('Pilot connection is not configured.', 'CONFIG');"
);
apiCode = apiCode.replace(
  /if \(!isPilotMode \|\| !isConfigured \|\| localSignedOut\) return null;/,
  "if (!isConfigured || localSignedOut) return null;\n  if (!isPilotMode && !authStorage.getItem(authStorageKey)) return null;"
);
fs.writeFileSync('src/pilot/api.ts', apiCode, 'utf8');
console.log('src/pilot/api.ts updated.');

// 3. Fix src/pages/Auth/Login.tsx to default authTab to 'aadhaar'
let loginCode = fs.readFileSync('src/pages/Auth/Login.tsx', 'utf8');
loginCode = loginCode.replace(
  "const [authTab, setAuthTab] = useState<'password' | 'persona' | 'aadhaar'>('password');",
  "const [authTab, setAuthTab] = useState<'password' | 'persona' | 'aadhaar'>('aadhaar');"
);
fs.writeFileSync('src/pages/Auth/Login.tsx', loginCode, 'utf8');
console.log('src/pages/Auth/Login.tsx updated.');

// 4. Fix src/components/layout/index.tsx for syncbox text
let layoutCode = fs.readFileSync('src/components/layout/index.tsx', 'utf8');
layoutCode = layoutCode.replace(
  '<span>In-memory browser state</span>',
  '<span>Local demo - no offline sync</span>'
);
fs.writeFileSync('src/components/layout/index.tsx', layoutCode, 'utf8');
console.log('src/components/layout/index.tsx updated.');
