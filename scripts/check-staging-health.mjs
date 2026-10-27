import assert from 'node:assert/strict';
import { staging, value, evidence, pilotTables } from './staging-helpers.mjs';

const { config, admin, transport, requests } = await staging();
const alerts = [];
try {
  assert.equal(config.name, 'tribe-saarthi-staging');
  const frontend = new URL(config.frontendUrl);
  assert.equal(frontend.protocol, 'https:');
  assert.ok(frontend.hostname.startsWith('tribe-saarthi-staging') && frontend.hostname.endsWith('.vercel.app'), 'Dedicated staging frontend required');
  const page = await transport(frontend);
  assert.ok(page.ok && (await page.text()).includes('id="root"'), 'Frontend is unavailable');
  await Promise.all(pilotTables.map(async table => {
    value(await admin.from(`pilot_${table}`).select('id').limit(1), `Database ${table}`);
  }));
  for (const name of ['pilot-workflow', 'pilot-invite', 'pilot-accounts', 'pilot-notifications', 'pilot-operations']) {
    const unauthorized = await transport(`${config.url}/functions/v1/${name}`, { method: 'POST', headers: { 'content-type': 'application/json', apikey: config.publishableKey }, body: '{}' });
    assert.equal(unauthorized.status, 401, `${name} must reject anonymous requests`);
    assert.ok(unauthorized.headers.get('x-request-id'), `${name} request correlation missing`);
  }
  for (const name of ['pilot-workflow', 'pilot-invite', 'pilot-receipt', 'pilot-accounts', 'pilot-notifications', 'pilot-operations']) {
    const origin = 'http://localhost:5173';
    const preflight = await transport(`${config.url}/functions/v1/${name}`, { method: 'OPTIONS', headers: { Origin: origin, 'Access-Control-Request-Method': 'POST' } });
    assert.equal(preflight.status, 204, `${name} local frontend preflight failed`);
    assert.equal(preflight.headers.get('access-control-allow-origin'), origin, `${name} must allow the local frontend`);
  }
  const receipt = await transport(`${config.url}/functions/v1/pilot-receipt`, { method: 'POST', headers: { 'content-type': 'application/json', apikey: config.publishableKey }, body: '{"token":"invalid"}' });
  assert.equal(receipt.status, 400, 'Public receipt validation unavailable');
  assert.ok(receipt.headers.get('x-request-id'), 'Function request correlation missing');
  const failed = await admin.from('pilot_applications').select('id', { count: 'exact', head: true }).eq('data->>dbtStatus', 'failed');
  value(failed, 'Failed payment review');
  if (failed.count) alerts.push(`${failed.count} unresolved simulated payments need operator review`);
} catch (error) {
  alerts.push(error instanceof assert.AssertionError ? error.message : 'Health request failed; use saved request IDs to inspect provider logs');
}
await evidence('health', { at: new Date().toISOString(), projectRef: config.projectRef, healthy: alerts.length === 0, alerts, requests });
if (alerts.length) { console.error(alerts.join('\n')); process.exitCode = 1; }
else console.log('PASS staging frontend, database and Edge health');
