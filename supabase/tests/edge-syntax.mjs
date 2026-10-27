import fs from 'node:fs';
import ts from 'typescript';
for (const path of ['_shared/http', '_shared/notifications', 'pilot-workflow/index', 'pilot-invite/index', 'pilot-receipt/index', 'pilot-accounts/index', 'pilot-notifications/index']) {
  const result = ts.transpileModule(fs.readFileSync(`supabase/functions/${path}.ts`, 'utf8'), {
    reportDiagnostics: true,
    compilerOptions: { target: ts.ScriptTarget.ES2022, module: ts.ModuleKind.ESNext },
  });
  if (result.diagnostics?.length) throw new Error(`Edge syntax failed: ${path}`);
}
console.log('All seven Edge sources parse. Runtime integration requires Supabase/Deno.');
