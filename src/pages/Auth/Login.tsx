import { useState } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useSession } from '@/store/session';
import { USERS } from '@/data/coverage';
import { AadhaarOtpModal } from '@/components/common/AadhaarOtpModal';
import { Icon } from '@/components/common/Icon';

export function Login() {
  const { login, loginWithBackend, isBackendSyncing, isBackendConnected } = useSession();
  const navigate = useNavigate();
  const location = useLocation();

  const [isRecovery, setIsRecovery] = useState(location.pathname === '/recover');
  const [resetSent, setResetSent] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [email, setEmail] = useState('shahidkhan07191@gmail.com');
  const [password, setPassword] = useState('password123');
  const [resetEmail, setResetEmail] = useState('shahidkhan07191@gmail.com');
  const [selectedPersona, setSelectedPersona] = useState('usr_asha');
  const [authTab, setAuthTab] = useState<'password' | 'persona' | 'aadhaar'>('aadhaar');
  const [authError, setAuthError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  // Aadhaar states
  const [aadhaarInput, setAadhaarInput] = useState('');
  const [aadhaarError, setAadhaarError] = useState('');
  const [otpOpen, setOtpOpen] = useState(false);

  const isAadhaarValid = /^\d{12}$/.test(aadhaarInput.replace(/\s+/g, ''));

  const handlePersonaSignIn = (e: React.FormEvent) => {
    e.preventDefault();
    const u = USERS.find((p) => p.id === selectedPersona);
    login(selectedPersona);
    navigate(u?.role === 'student' ? '/student' : '/officer');
  };

  const handlePasswordSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setAuthError(null);
    setLoading(true);
    const result = await loginWithBackend(email.trim(), password);
    setLoading(false);
    if (result.success) {
      const u = useSession.getState().user;
      navigate(u?.role === 'student' ? '/student' : '/officer');
    } else {
      setAuthError(result.error || 'Authentication failed. Please verify your credentials.');
    }
  };

  const validateAadhaar = (val: string) => {
    const raw = val.replace(/\s+/g, '');
    if (!raw) {
      setAadhaarError('Aadhaar number is required.');
      return false;
    }
    if (!/^\d+$/.test(raw)) {
      setAadhaarError('Invalid characters detected. Must contain numeric digits only.');
      return false;
    }
    if (raw.length !== 12) {
      setAadhaarError(`Invalid Aadhaar length. Must match format rule ^\\d{12}$ (exactly 12 digits).`);
      return false;
    }
    setAadhaarError('');
    return true;
  };

  const handleAadhaarSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (validateAadhaar(aadhaarInput)) {
      setOtpOpen(true);
    }
  };

  const handleRecoverySubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const { recoverPassword } = await import('@/pilot/api');
      await recoverPassword(resetEmail.trim());
    } catch {
      // Intentionally silent for email enumeration security
    }
    setResetSent(true);
  };

  return (
    <div>
      <div className="govstrip" role="region" aria-label="Official government website banner">
        <div className="l">
          <Icon name="shield" size={13} style={{ stroke: '#A7F3D0' }} />
          <span className="font-semibold text-white">भारत सरकार · Government of India</span>
          <span style={{ color: '#047857' }}>|</span>
          <b>जनजातीय कार्य मंत्रालय · Ministry of Tribal Affairs</b>
        </div>
        <div className="r">
          <span className="tag">
            <Icon name="lock" size={12} style={{ stroke: '#A7F3D0' }} />
            Secure Session · 256-Bit TLS 1.3
          </span>
          <span className="hide-sm text-emerald-200">MoTA Direct Benefit Transfer (DBT)</span>
        </div>
      </div>

      <div className="authwrap">
        <aside className="authaside">
          <div style={{ position: 'relative', zIndex: 1 }}>
            <div className="aside-mark">TS</div>
            <div className="eyebrow" style={{ color: '#94A3B8' }}>Tribe Saarthi · Scholar portal</div>
            <h1 className="display" style={{ marginTop: '14px' }}>A clearer path to your scholarship.</h1>
            <p className="sub">Apply, keep your documents together, and follow each decision from your college to your bank.</p>

            <ul className="authpoints">
              <li>
                <Icon name="bookOpen" size={18} />
                <div>
                  <b>Find the right scheme</b>
                  Understand the requirements before you apply.
                </div>
              </li>
              <li>
                <Icon name="file" size={18} />
                <div>
                  <b>Use your documents again</b>
                  Keep them ready for your next application.
                </div>
              </li>
              <li>
                <Icon name="eye" size={18} />
                <div>
                  <b>Know what happens next</b>
                  See who is reviewing your application, and when payment begins.
                </div>
              </li>
            </ul>
          </div>

          <div className="aside-foot" style={{ position: 'relative', zIndex: 1 }}>
            <Icon name="lock" size={12} style={{ stroke: '#94A3B8' }} />
            <span>Connected to Supabase · axegexiaofxdmmizilri</span>
          </div>
        </aside>

        <main className="authmain">
          <div className="authcard" data-od-id="auth-card">
            <div className="auth-brand">
              <span className="brand-mark">TS</span>
              <span>
                <span className="bn">Tribe Saarthi</span>
                <span className="bs">Scholarship support · MoTA</span>
              </span>
            </div>

            {!isRecovery ? (
              <div id="signinView">
                <div style={{ display: 'inline-flex', alignItems: 'center', gap: '6px', fontSize: '11px', color: '#047857', background: '#ECFDF5', border: '1px solid #A7F3D0', padding: '3px 8px', borderRadius: '12px', marginBottom: '12px' }}>
                  <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#059669', display: 'inline-block' }} />
                  <span>Supabase Live Connected (axegexiaofxdmmizilri)</span>
                </div>

                <h1>Sign in to your account</h1>
                <p className="lede">Sign in with official credentials or select a demo persona below.</p>

                {/* Mode selector tab */}
                <div style={{ display: 'flex', gap: '6px', margin: '18px 0 14px', borderBottom: '1px solid var(--line)', paddingBottom: '8px' }}>
                  <button
                    type="button"
                    onClick={() => { setAuthTab('password'); setAuthError(null); }}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      background: authTab === 'password' ? 'var(--ink)' : 'transparent',
                      color: authTab === 'password' ? '#fff' : 'var(--muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Email &amp; Password
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthTab('persona'); setAuthError(null); }}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      background: authTab === 'persona' ? 'var(--ink)' : 'transparent',
                      color: authTab === 'persona' ? '#fff' : 'var(--muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Demo Persona
                  </button>
                  <button
                    type="button"
                    onClick={() => { setAuthTab('aadhaar'); setAuthError(null); }}
                    style={{
                      fontSize: '11px',
                      fontWeight: 600,
                      padding: '4px 10px',
                      borderRadius: '4px',
                      border: 'none',
                      background: authTab === 'aadhaar' ? 'var(--ink)' : 'transparent',
                      color: authTab === 'aadhaar' ? '#fff' : 'var(--muted)',
                      cursor: 'pointer'
                    }}
                  >
                    Aadhaar e-KYC
                  </button>
                </div>

                {authTab === 'password' && (
                  <form onSubmit={handlePasswordSignIn} style={{ marginTop: '16px' }} className="stack-sm" data-od-id="signin-form">
                    {authError && (
                      <div
                        role="alert"
                        style={{
                          background: '#FEE2E2',
                          border: '1px solid #DC2626',
                          borderRadius: '6px',
                          padding: '10px 12px',
                          color: '#991B1B',
                          fontSize: '12px',
                          lineHeight: '1.4',
                          display: 'flex',
                          alignItems: 'flex-start',
                          gap: '8px',
                          marginBottom: '8px'
                        }}
                      >
                        <Icon name="alert" size={16} />
                        <div>
                          <strong>Authentication note:</strong> {authError}
                        </div>
                      </div>
                    )}

                    <div className="field">
                      <label htmlFor="email">Official Email address</label>
                      <input
                        className="input"
                        type="email"
                        id="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        autoComplete="email"
                        required
                        disabled={loading || isBackendSyncing}
                      />
                    </div>
                    <div className="field">
                      <label htmlFor="password">Password</label>
                      <div className="pw">
                        <input
                          className="input"
                          type={showPassword ? 'text' : 'password'}
                          id="password"
                          value={password}
                          onChange={(e) => setPassword(e.target.value)}
                          autoComplete="current-password"
                          required
                          disabled={loading || isBackendSyncing}
                        />
                        <button
                          type="button"
                          id="togglePw"
                          onClick={() => setShowPassword(!showPassword)}
                          aria-label={showPassword ? 'Hide password' : 'Show password'}
                        >
                          <Icon name="eye" size={16} />
                        </button>
                      </div>
                      <div className="auth-links">
                        <span className="micro" style={{ color: 'var(--meta)' }}>Supabase Auth (TLS 1.3)</span>
                        <a
                          href="#"
                          id="forgotLink"
                          style={{ fontWeight: 560 }}
                          onClick={(e) => {
                            e.preventDefault();
                            setIsRecovery(true);
                            setResetSent(false);
                          }}
                        >
                          Forgot password?
                        </a>
                      </div>
                    </div>

                    <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', fontSize: '11px', margin: '4px 0' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('shahidkhan07191@gmail.com');
                          setPassword('password123');
                          setAuthError(null);
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontWeight: 600, padding: 0 }}
                      >
                        ⚡ Autofill Supabase Admin (shahidkhan07191@gmail.com)
                      </button>
                    </div>

                    <button
                      className="btn btn-primary btn-block btn-lg"
                      type="submit"
                      disabled={loading || isBackendSyncing}
                      style={{ marginTop: '8px' }}
                    >
                      {loading || isBackendSyncing ? (
                        <>
                          <span className="pulse" />
                          Authenticating &amp; Syncing…
                        </>
                      ) : (
                        <>
                          Sign in with Supabase
                          <Icon name="arrowRight" size={14} />
                        </>
                      )}
                    </button>
                  </form>
                )}

                {authTab === 'persona' && (
                  <form onSubmit={handlePersonaSignIn} style={{ marginTop: '16px' }} className="stack-sm" data-od-id="signin-form">
                    <div className="field">
                      <label htmlFor="personaSelect">Select demo role / persona</label>
                      <select
                        id="personaSelect"
                        className="input"
                        value={selectedPersona}
                        onChange={(e) => setSelectedPersona(e.target.value)}
                        style={{ height: '42px' }}
                      >
                        {USERS.map((u) => (
                          <option key={u.id} value={u.id}>
                            {u.name} · {u.role === 'student' ? 'Scholar' : 'Officer'} {('designation' in u && u.designation) ? `(${u.designation})` : ''}
                          </option>
                        ))}
                      </select>
                      <span className="hint">No password needed. Pre-configured demo dataset with local offline store.</span>
                    </div>

                    <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ marginTop: '8px' }}>
                      Sign in as {USERS.find((u) => u.id === selectedPersona)?.name.split(' ')[0]}
                      <Icon name="arrowRight" size={14} />
                    </button>
                  </form>
                )}

                {authTab === 'aadhaar' && (
                  <form onSubmit={handleAadhaarSubmit} style={{ marginTop: '16px' }} className="stack-sm">
                    <div className="field">
                      <label htmlFor="aadhaar">12-Digit Aadhaar / Virtual ID (UIDAI)</label>
                      <input
                        className="input mono"
                        type="text"
                        id="aadhaar"
                        placeholder="5412 8890 4821"
                        value={aadhaarInput}
                        onChange={(e) => {
                          setAadhaarInput(e.target.value);
                          if (e.target.value) validateAadhaar(e.target.value);
                          else setAadhaarError('');
                        }}
                        style={{ height: '42px', fontSize: '13px' }}
                      />
                      {aadhaarError && (
                        <div role="alert" style={{ color: 'var(--red)', fontSize: '11px', marginTop: '4px' }}>
                          {aadhaarError}
                        </div>
                      )}
                    </div>

                    <div style={{ display: 'flex', gap: '8px', fontSize: '11px' }}>
                      <button
                        type="button"
                        onClick={() => {
                          setAadhaarInput('5412 8890 4821');
                          setAadhaarError('');
                        }}
                        style={{ background: 'none', border: 'none', color: 'var(--green)', cursor: 'pointer', fontWeight: 600 }}
                      >
                        ⚡ Autofill sample (4821)
                      </button>
                    </div>

                    <button
                      className="btn btn-primary btn-block btn-lg"
                      type="submit"
                      disabled={!isAadhaarValid}
                      style={{ marginTop: '8px' }}
                    >
                      <Icon name="shield" size={14} />
                      Get Aadhaar OTP
                    </button>
                  </form>
                )}

                <p className="authfoot">
                  Don't have an invitation? Ask your institution's scholarship officer.<br />
                  <Link to="/student/grievance" style={{ fontWeight: 560 }}>Get help signing in</Link>
                </p>
              </div>
            ) : (
              <div id="recoveryView">
                <div className="flex center gap10" style={{ marginBottom: '14px' }}>
                  <button
                    className="iconlink"
                    type="button"
                    id="backLink"
                    aria-label="Back to sign in"
                    style={{ marginLeft: '-8px' }}
                    onClick={() => {
                      setIsRecovery(false);
                      setResetSent(false);
                    }}
                  >
                    <Icon name="arrowLeft" size={14} />
                  </button>
                  <span className="eyebrow">Account recovery</span>
                </div>
                <h1>Reset your password</h1>
                <p className="lede">Enter the email you use to sign in. We'll send you a link to choose a new password.</p>

                {resetSent && (
                  <div className="recovery-ok" id="recoveryOk">
                    <Icon name="check" size={15} />
                    <div>
                      <b style={{ fontWeight: 560 }}>Check your inbox.</b> If an account uses this email, a reset link will be sent within a few minutes.
                    </div>
                  </div>
                )}

                <form
                  id="recoveryForm"
                  style={{ marginTop: '22px' }}
                  className="stack-sm"
                  data-od-id="recovery-form"
                  onSubmit={handleRecoverySubmit}
                >
                  <div className="field">
                    <label htmlFor="resetEmail">Email address</label>
                    <input
                      className="input"
                      type="email"
                      id="resetEmail"
                      value={resetEmail}
                      onChange={(e) => setResetEmail(e.target.value)}
                      autoComplete="email"
                      required
                    />
                  </div>
                  <button className="btn btn-primary btn-block btn-lg" type="submit" style={{ marginTop: '8px' }}>
                    {resetSent ? 'Reset link sent' : 'Send reset link'}
                  </button>
                  <button
                    className="btn btn-ghost btn-block"
                    type="button"
                    id="backBtn"
                    onClick={() => {
                      setIsRecovery(false);
                      setResetSent(false);
                    }}
                  >
                    Back to sign in
                  </button>
                </form>

                <div className="callout mt20">
                  <Icon name="help" size={16} />
                  <div><b>Can't access your email?</b> Ask your institution's scholarship officer for help.</div>
                </div>
              </div>
            )}

            <p className="authfoot" style={{ borderTop: '1px solid var(--line)', paddingTop: '14px' }}>
              Ministry of Tribal Affairs · Official Scholar &amp; Officer Verification Gateway
            </p>
          </div>
        </main>
      </div>

      <AadhaarOtpModal
        open={otpOpen}
        onClose={() => setOtpOpen(false)}
        onSuccess={() => {
          setOtpOpen(false);
          login('usr_asha');
          navigate('/student');
        }}
        aadhaarLast4={aadhaarInput.replace(/\s+/g, '').slice(-4) || '4821'}
        purpose="UIDAI Aadhaar Student Authentication"
      />
    </div>
  );
}
