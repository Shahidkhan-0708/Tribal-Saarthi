import fs from 'node:fs';

let code = fs.readFileSync('src/pages/Student/Application.tsx', 'utf8');

const target = `          <button
            className="btn btn-ghost btn-sm text-[10px]"
            type="button"
            onClick={() => data.setSourceHealth('income', false)}
          >
            Sabotage e-District API
          </button>
          <SafeLink className="btn btn-secondary" to="/receipt">
            <Icon name="download" className="i" />
            Receipt PDF
          </SafeLink>
          <SafeLink className="btn btn-secondary" to="/officer/audit">
            Decision history
          </SafeLink>`;

const replacement = `          <SafeLink className="btn btn-secondary" to="/receipt">
            <Icon name="download" className="i-sm" />
            Official Receipt PDF
          </SafeLink>`;

code = code.replace(target, replacement);
if (!code.includes('Official Receipt PDF')) {
  code = code.replace(target.replace(/\n/g, '\r\n'), replacement.replace(/\n/g, '\r\n'));
}

fs.writeFileSync('src/pages/Student/Application.tsx', code, 'utf8');
console.log('src/pages/Student/Application.tsx cleaned successfully.');
