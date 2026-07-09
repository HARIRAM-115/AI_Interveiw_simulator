import { FormEvent, useState, useRef, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser, forgotPassword, verifyOtp, resetPassword } from '../services/api';
import {
  Sparkles, Mail, Lock, AlertCircle, Loader2, Brain, ArrowLeft,
  CheckCircle2, Eye, EyeOff, RefreshCw, ShieldCheck, KeyRound
} from 'lucide-react';
import bgImage from '../ai_interview_bg.png';

type Mode = 'login' | 'forgot' | 'otp' | 'reset';

const getPasswordStrength = (password: string) => {
  let score = 0;
  if (password.length >= 6) score++;
  if (password.length >= 10) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (score <= 1) return { label: 'Weak', color: '#ef4444', bars: 1 };
  if (score <= 3) return { label: 'Medium', color: '#f59e0b', bars: 3 };
  return { label: 'Strong', color: '#10b981', bars: 5 };
};

const LoginPage = () => {
  const [mode, setMode] = useState<Mode>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [otpValues, setOtpValues] = useState(['', '', '', '', '', '']);
  const [newPassword, setNewPassword] = useState('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);
  const [countdown, setCountdown] = useState(120);
  const [canResend, setCanResend] = useState(false);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);
  const navigate = useNavigate();
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const strength = getPasswordStrength(newPassword);

  useEffect(() => {
    if (mode === 'otp') {
      setCountdown(120);
      setCanResend(false);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timerRef.current!);
            setCanResend(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, [mode]);

  const goBack = () => {
    setError('');
    setSuccess('');
    if (mode === 'otp') setMode('forgot');
    else if (mode === 'forgot' || mode === 'reset') setMode('login');
  };

  const handleLogin = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err: any) {
      let msg = 'Invalid email or password.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        msg = 'Server is unreachable. Please make sure the backend is running on port 5050.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleForgot = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setOtpValues(['', '', '', '', '', '']);
      setMode('otp');
      setTimeout(() => otpRefs.current[0]?.focus(), 300);
    } catch (err: any) {
      let msg = 'Failed to send OTP. Please try again.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        msg = 'Server is unreachable. Please make sure the backend is running on port 5050.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (index: number, value: string) => {
    if (!/^[0-9]?$/.test(value)) return;
    const updated = [...otpValues];
    updated[index] = value;
    setOtpValues(updated);
    if (value && index < 5) otpRefs.current[index + 1]?.focus();
    if (updated.every((v) => v !== '') && updated.join('').length === 6) {
      handleVerifyOtp(updated.join(''));
    }
  };

  const handleOtpKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && !otpValues[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  };

  const handleVerifyOtp = async (otp?: string) => {
    const code = otp || otpValues.join('');
    if (code.length !== 6) { setError('Please enter all 6 digits.'); return; }
    setError('');
    setLoading(true);
    try {
      await verifyOtp({ email, otp: code });
      setMode('reset');
    } catch (err: any) {
      let msg = 'Invalid code. Please try again.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        msg = 'Server is unreachable. Please make sure the backend is running on port 5050.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
      setOtpValues(['', '', '', '', '', '']);
      setTimeout(() => otpRefs.current[0]?.focus(), 100);
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    setError('');
    setLoading(true);
    try {
      await forgotPassword({ email });
      setOtpValues(['', '', '', '', '', '']);
      setCountdown(120);
      setCanResend(false);
      timerRef.current = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) { clearInterval(timerRef.current!); setCanResend(true); return 0; }
          return prev - 1;
        });
      }, 1000);
      setSuccess('New code sent!');
      setTimeout(() => setSuccess(''), 3050);
      setTimeout(() => otpRefs.current[0]?.focus(), 200);
    } catch (err: any) {
      let msg = 'Failed to resend. Please try again.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        msg = 'Server is unreachable. Please make sure the backend is running on port 5050.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (newPassword.length < 6) { setError('Password must be at least 6 characters.'); return; }
    setError('');
    setLoading(true);
    try {
      await resetPassword({ email, otp: otpValues.join(''), newPassword });
      setMode('login');
      setPassword('');
      setNewPassword('');
      setOtpValues(['', '', '', '', '', '']);
      setSuccess('Password reset successfully! Please sign in with your new password.');
    } catch (err: any) {
      let msg = 'Failed to reset password. Please try again.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        msg = 'Server is unreachable. Please make sure the backend is running on port 5050.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const cardTitles: Record<Mode, { icon: React.ReactNode; title: string; subtitle: string }> = {
    login: {
      icon: <Brain className="h-8 w-8 text-white" />,
      title: 'Welcome Back',
      subtitle: 'Sign in to continue your AI Interview journey',
    },
    forgot: {
      icon: <KeyRound className="h-8 w-8 text-white" />,
      title: 'Forgot Password?',
      subtitle: 'Enter your email and we\'ll send you a verification code',
    },
    otp: {
      icon: <ShieldCheck className="h-8 w-8 text-white" />,
      title: 'Verify Your Identity',
      subtitle: `Enter the 6-digit code sent to ${email}`,
    },
    reset: {
      icon: <Lock className="h-8 w-8 text-white" />,
      title: 'Create New Password',
      subtitle: 'Choose a strong password for your account',
    },
  };

  const current = cardTitles[mode];

  return (
    <div
      className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden"
      style={{
        backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(13, 5, 32, 0.92) 0%, rgba(3, 0, 15, 0.98) 100%), url(${bgImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
      }}
    >
      {/* Soft overlay */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'radial-gradient(ellipse at 80% 20%, rgba(13, 5, 32, 0.92) 0%, rgba(3, 0, 15, 0.98) 100%)',
        backdropFilter: 'blur(4px)',
      }} />

      {/* Main Card */}
      <div className="relative z-10 w-full max-w-md" style={{ animation: 'fadeSlideUp 0.5s ease' }}>

        {/* Logo / Header */}
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="relative">
            <div style={{
              position: 'absolute', inset: '-4px', borderRadius: '20px',
              background: 'linear-gradient(135deg, #7c3aed, #2563eb)',
              filter: 'blur(12px)', opacity: 0.5,
            }} />
            <div style={{
              position: 'relative', display: 'flex', alignItems: 'center', justifyContent: 'center',
              width: '64px', height: '64px', borderRadius: '18px',
              background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)',
              boxShadow: '0 8px 32px rgba(124,58,237,0.35)',
            }}>
              {current.icon}
            </div>
          </div>
          <div>
            <h1 style={{
              fontSize: '2rem', fontWeight: 900, letterSpacing: '-0.03em',
              background: 'linear-gradient(135deg, #7c3aed 0%, #06b6d4 100%)',
              WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent',
              fontFamily: "'Outfit', 'Inter', sans-serif",
            }}>
              AI Interview
            </h1>
            <p style={{ color: '#94a3b8', fontSize: '0.85rem', marginTop: '4px', fontWeight: 500 }}>
              {current.subtitle}
            </p>
          </div>
        </div>

        {/* Glass Card */}
        <div style={{
          borderRadius: '28px',
          background: 'rgba(10, 5, 30, 0.75)',
          border: '1.5px solid rgba(124, 58, 237, 0.2)',
          backdropFilter: 'blur(24px)',
          boxShadow: '0 0 60px rgba(124, 58, 237, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)',
          padding: '36px',
        }}>

          {/* Back button */}
          {mode !== 'login' && (
            <button
              onClick={goBack}
              style={{
                display: 'flex', alignItems: 'center', gap: '6px',
                color: '#a78bfa', fontSize: '0.82rem', fontWeight: 600,
                background: 'none', border: 'none', cursor: 'pointer', marginBottom: '20px',
                padding: '4px 0',
              }}
            >
              <ArrowLeft className="h-4 w-4" /> Back
            </button>
          )}

          <h2 style={{
            fontSize: '1.25rem', fontWeight: 800, color: '#f8fafc',
            marginBottom: '22px', fontFamily: "'Outfit', 'Inter', sans-serif",
          }}>
            {current.title}
            {mode === 'otp' && (
              <span style={{
                display: 'block', fontSize: '0.8rem', color: '#a78bfa', fontWeight: 500, marginTop: '4px',
              }}>
                ⏱ {Math.floor(countdown / 60)}:{String(countdown % 60).padStart(2, '0')} remaining
              </span>
            )}
          </h2>

          {/* ──── LOGIN FORM ──── */}
          {mode === 'login' && (
            <form onSubmit={handleLogin} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ ...iconStyle, color: '#a78bfa' }} />
                  <input
                    id="login-email" type="email" value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    style={inputStyle} placeholder="you@example.com" required
                  />
                </div>
              </div>
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '6px' }}>
                  <label style={labelStyle}>Password</label>
                  <button type="button" onClick={() => setMode('forgot')} style={{
                    color: '#a78bfa', fontSize: '0.75rem', fontWeight: 600,
                    background: 'none', border: 'none', cursor: 'pointer', marginLeft: 'auto', display: 'block'
                  }}>Forgot Password?</button>
                </div>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ ...iconStyle, color: '#a78bfa' }} />
                  <input
                    id="login-password" type={showPassword ? 'text' : 'password'} value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    style={{ ...inputStyle, paddingRight: '44px' }} placeholder="••••••••" required
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa' }}>
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>
              {(error || success) && <AlertBox error={error} success={success} />}
              <button id="login-submit" type="submit" disabled={loading} style={submitBtnStyle}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Signing in...</> : <><Sparkles className="h-4 w-4" /> Sign In</>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.83rem', color: '#94a3b8', marginTop: '4px' }}>
                New here?{' '}
                <Link to="/register" style={{ color: '#a78bfa', fontWeight: 700, textDecoration: 'none' }}>
                  Create a free account →
                </Link>
              </p>
            </form>
          )}

          {/* ──── FORGOT PASSWORD FORM ──── */}
          {mode === 'forgot' && (
            <form onSubmit={handleForgot} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>Registered Email Address</label>
                <div style={{ position: 'relative' }}>
                  <Mail style={{ ...iconStyle, color: '#a78bfa' }} />
                  <input
                    type="email" value={email} onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    style={inputStyle} placeholder="you@example.com" required
                  />
                </div>
              </div>
              {(error || success) && <AlertBox error={error} success={success} />}
              <button type="submit" disabled={loading} style={submitBtnStyle}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Sending Code...</> : <><Mail className="h-4 w-4" /> Send Verification Code</>}
              </button>
            </form>
          )}

          {/* ──── OTP FORM ──── */}
          {mode === 'otp' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', gap: '10px', justifyContent: 'center' }}>
                {otpValues.map((val, idx) => (
                  <input
                    key={idx}
                    ref={(el) => { otpRefs.current[idx] = el; }}
                    type="text" inputMode="numeric" maxLength={1} value={val}
                    onChange={(e) => handleOtpChange(idx, e.target.value)}
                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#7c3aed';
                      e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.15)';
                      e.currentTarget.style.background = 'rgba(124,58,237,0.05)';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(124,58,237,0.25)';
                      e.currentTarget.style.boxShadow = 'none';
                      e.currentTarget.style.background = 'rgba(255,255,255,0.04)';
                    }}
                    style={{
                      width: '48px', height: '56px', textAlign: 'center', fontSize: '1.4rem',
                      fontWeight: 800, borderRadius: '14px', outline: 'none',
                      border: '2px solid rgba(124, 58, 237, 0.25)',
                      background: 'rgba(255,255,255,0.04)',
                      color: '#e2e8f0', transition: 'all 0.2s',
                      fontFamily: "'Outfit', monospace",
                    }}
                  />
                ))}
              </div>
              {(error || success) && <AlertBox error={error} success={success} />}
              <button
                type="button" disabled={loading || otpValues.some(v => !v)}
                onClick={() => handleVerifyOtp()}
                style={submitBtnStyle}
              >
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Verifying...</> : <><ShieldCheck className="h-4 w-4" /> Verify Code</>}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.82rem', color: '#94a3b8' }}>
                {canResend ? (
                  <button type="button" onClick={handleResendOtp} disabled={loading}
                    style={{ background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa', fontWeight: 700, display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                    <RefreshCw className="h-3.5 w-3.5" /> Resend Code
                  </button>
                ) : (
                  <span style={{ color: '#94a3b8' }}>Didn't receive a code? Resend in {countdown}s</span>
                )}
              </p>
            </div>
          )}

          {/* ──── RESET PASSWORD FORM ──── */}
          {mode === 'reset' && (
            <form onSubmit={handleResetPassword} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div>
                <label style={labelStyle}>New Password</label>
                <div style={{ position: 'relative' }}>
                  <Lock style={{ ...iconStyle, color: '#a78bfa' }} />
                  <input
                    type={showNewPassword ? 'text' : 'password'} value={newPassword}
                    onChange={(e) => setNewPassword(e.target.value)}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#7c3aed'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124,58,237,0.12)'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(124,58,237,0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                    style={{ ...inputStyle, paddingRight: '44px' }} placeholder="Enter new password" required
                  />
                  <button type="button" onClick={() => setShowNewPassword(!showNewPassword)}
                    style={{ position: 'absolute', right: '12px', top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: '#a78bfa' }}>
                    {showNewPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
                {/* Password Strength Meter */}
                {newPassword && (
                  <div style={{ marginTop: '10px' }}>
                    <div style={{ display: 'flex', gap: '5px', marginBottom: '6px' }}>
                      {[1, 2, 3, 4, 5].map((bar) => (
                        <div key={bar} style={{
                          flex: 1, height: '4px', borderRadius: '4px', transition: 'all 0.3s',
                          background: bar <= strength.bars ? strength.color : 'rgba(255,255,255,0.1)',
                        }} />
                      ))}
                    </div>
                    <p style={{ fontSize: '0.75rem', fontWeight: 600, color: strength.color }}>
                      {strength.label} Password
                    </p>
                  </div>
                )}
              </div>
              {(error || success) && <AlertBox error={error} success={success} />}
              <button type="submit" disabled={loading || newPassword.length < 6} style={submitBtnStyle}>
                {loading ? <><Loader2 className="h-4 w-4 animate-spin" /> Resetting...</> : <><CheckCircle2 className="h-4 w-4" /> Reset Password</>}
              </button>
            </form>
          )}
        </div>
      </div>

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Outfit:wght@400;500;600;700;800;900&family=Inter:wght@400;500;600;700&display=swap');
        @keyframes fadeSlideUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        .animate-spin { animation: spin 1s linear infinite; }
        @keyframes spin { to { transform: rotate(360deg); } }
      `}</style>
    </div>
  );
};

const labelStyle: React.CSSProperties = {
  display: 'block', fontSize: '0.72rem', fontWeight: 700,
  textTransform: 'uppercase', letterSpacing: '0.08em',
  color: '#94a3b8', marginBottom: '6px',
  fontFamily: "'Outfit', 'Inter', sans-serif",
};

const inputStyle: React.CSSProperties = {
  width: '100%', borderRadius: '12px', padding: '12px 14px 12px 40px',
  fontSize: '0.9rem', color: '#f8fafc', outline: 'none',
  background: 'rgba(255,255,255,0.04)',
  border: '1.5px solid rgba(124, 58, 237, 0.2)',
  transition: 'all 0.2s', boxSizing: 'border-box',
  fontFamily: "'Inter', sans-serif",
};

const iconStyle: React.CSSProperties = {
  position: 'absolute', left: '13px', top: '50%', transform: 'translateY(-50%)',
  width: '16px', height: '16px',
};

const submitBtnStyle: React.CSSProperties = {
  width: '100%', padding: '13px', borderRadius: '14px', border: 'none',
  cursor: 'pointer', fontWeight: 800, fontSize: '0.95rem', color: '#fff',
  display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px',
  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)',
  boxShadow: '0 6px 24px rgba(124,58,237,0.25)',
  transition: 'all 0.2s', fontFamily: "'Outfit', 'Inter', sans-serif",
};

const AlertBox = ({ error, success }: { error?: string; success?: string }) => {
  if (success) return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
      borderRadius: '10px', fontSize: '0.84rem', color: '#34d399',
      background: 'rgba(52,211,153,0.08)', border: '1px solid rgba(52,211,153,0.2)',
    }}>
      <CheckCircle2 style={{ width: '16px', height: '16px', flexShrink: 0 }} /> {success}
    </div>
  );
  if (error) return (
    <div style={{
      display: 'flex', alignItems: 'center', gap: '8px', padding: '10px 14px',
      borderRadius: '10px', fontSize: '0.84rem', color: '#fca5a5',
      background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)',
    }}>
      <AlertCircle style={{ width: '16px', height: '16px', flexShrink: 0 }} /> {error}
    </div>
  );
  return null;
};

export default LoginPage;
