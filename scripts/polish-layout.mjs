import fs from 'node:fs';

let code = fs.readFileSync('src/components/layout/index.tsx', 'utf8');

// Update evaluation sandbox area
const oldEvalArea = `            <div className="mt-3 flex flex-col gap-1.5 pt-2 border-t border-[var(--line)]">
              <button
                className="btn btn-secondary btn-sm w-full"
                type="button"
                onClick={() => setShowTour(true)}
              >
                Tour
              </button>
              <button
                className="btn btn-secondary btn-sm w-full text-emerald-800"
                type="button"
                onClick={() => setShowTestSuite(true)}
              >
                Edge Case Suite
              </button>
              <button
                className="btn btn-ghost btn-sm w-full text-slate-500"
                type="button"
                onClick={() => {
                  resetDemo();
                  navigate('/login');
                }}
              >
                Reset demo
              </button>
              <button
                className="btn btn-ghost btn-sm w-full text-rose-600"
                type="button"
                onClick={logout}
              >
                Sign out
              </button>
            </div>`;

const newEvalArea = `            <div className="eval-sandbox-box mt-3 p-2.5 bg-slate-100/80 rounded-lg border border-slate-200/90 text-xs">
              <div className="text-[10px] font-bold uppercase tracking-wider text-slate-500 mb-1.5 flex items-center justify-between">
                <span>Evaluator Sandbox</span>
                <span className="text-[9px] bg-slate-200/80 text-slate-600 px-1.5 py-0.5 rounded font-mono">TEST &amp; TOUR</span>
              </div>
              <div className="flex flex-col gap-1.5">
                <button
                  className="btn btn-secondary btn-sm w-full font-semibold"
                  type="button"
                  onClick={() => setShowTour(true)}
                >
                  Tour
                </button>
                <button
                  className="btn btn-secondary btn-sm w-full text-emerald-800 font-semibold"
                  type="button"
                  onClick={() => setShowTestSuite(true)}
                >
                  Edge Case Suite
                </button>
                <button
                  className="btn btn-ghost btn-sm w-full text-slate-500 hover:text-slate-800"
                  type="button"
                  onClick={() => {
                    resetDemo();
                    navigate('/login');
                  }}
                >
                  Reset demo
                </button>
              </div>
            </div>

            <div className="mt-2 pt-2 border-t border-[var(--line)]">
              <button
                className="btn btn-ghost btn-sm w-full text-rose-600 hover:bg-rose-50"
                type="button"
                onClick={logout}
              >
                Sign out
              </button>
            </div>`;

code = code.replace(oldEvalArea, newEvalArea);
if (!code.includes('Evaluator Sandbox')) {
  code = code.replace(oldEvalArea.replace(/\n/g, '\r\n'), newEvalArea.replace(/\n/g, '\r\n'));
}

// Update mobile bar links for student
const oldMobileBar = `<nav className="mobilebar" aria-label="Mobile bottom navigation">
        {isStudent ? (
          <>
            <Link to="/student" className={current('/student') ? 'active' : ''}>
              <Icon name="home" />
              <span>Home</span>
            </Link>
            <Link to="/student/discovery" className={current('/student/discovery') ? 'active' : ''}>
              <Icon name="bookOpen" />
              <span>Schemes</span>
            </Link>
            <Link to="/student/wallet" className={current('/student/wallet') ? 'active' : ''}>
              <Icon name="file" />
              <span>Documents</span>
            </Link>
            <Link to="/student/profile" className={current('/student/profile') ? 'active' : ''}>
              <Icon name="user" />
              <span>Profile</span>
            </Link>
          </>`;

const newMobileBar = `<nav className="mobilebar" aria-label="Mobile bottom navigation">
        {isStudent ? (
          <>
            <Link to="/student" className={current('/student') ? 'active' : ''}>
              <Icon name="home" />
              <span>Home</span>
            </Link>
            <Link to="/student/application" className={current('/student/application') ? 'active' : ''}>
              <Icon name="layers" />
              <span>Status</span>
            </Link>
            <Link to="/student/wallet" className={current('/student/wallet') ? 'active' : ''}>
              <Icon name="file" />
              <span>Documents</span>
            </Link>
            <Link to="/student/grievance" className={location.pathname.includes('grievance') ? 'active' : ''}>
              <Icon name="help" />
              <span>Saarthi AI</span>
            </Link>
          </>`;

code = code.replace(oldMobileBar, newMobileBar);
if (!code.includes('Saarthi AI</span>')) {
  code = code.replace(oldMobileBar.replace(/\n/g, '\r\n'), newMobileBar.replace(/\n/g, '\r\n'));
}

fs.writeFileSync('src/components/layout/index.tsx', code, 'utf8');
console.log('src/components/layout/index.tsx updated.');
