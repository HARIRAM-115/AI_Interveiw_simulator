import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { loginUser } from '../services/api';
import { Sparkles, Mail, Lock, AlertCircle, Loader2, Zap, Brain, TrendingUp } from 'lucide-react';
import bgImage from '../ai_interview_bg.png';

const LoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError('');
    setLoading(true);
    try {
      const response = await loginUser({ email, password });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Invalid email or password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 overflow-hidden"
         style={{ 
           backgroundImage: `radial-gradient(ellipse at 20% 50%, rgba(13, 5, 32, 0.92) 0%, rgba(3, 0, 15, 0.98) 100%), url(${bgImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>

      {/* Aurora background layer */}
      <div className="aurora-bg">
        <div className="aurora-orb-pink" />
      </div>
      <div className="grid-pattern" />

      {/* Floating decorative elements */}
      <div className="pointer-events-none absolute top-1/4 left-8 opacity-20 float-anim" style={{ animationDelay: '0s' }}>
        <div className="h-2 w-2 rounded-full bg-violet-400" />
      </div>
      <div className="pointer-events-none absolute top-3/4 right-12 opacity-20 float-anim" style={{ animationDelay: '1.5s' }}>
        <div className="h-3 w-3 rounded-full bg-cyan-400" />
      </div>
      <div className="pointer-events-none absolute top-1/2 left-1/4 opacity-10 float-anim" style={{ animationDelay: '3s' }}>
        <div className="h-1.5 w-1.5 rounded-full bg-pink-400" />
      </div>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-md">
        {/* Logo / Hero */}
        <div className="mb-10 flex flex-col items-center gap-4 text-center">
          <div className="relative">
            <div className="absolute inset-0 rounded-2xl blur-xl opacity-60"
                 style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
            <div className="relative flex h-16 w-16 items-center justify-center rounded-2xl"
                 style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
              <Brain className="h-8 w-8 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-4xl font-black tracking-tight gradient-text-aurora">
              AI Interview
            </h1>
            <p className="mt-2 text-sm text-slate-400">Sign in to continue your training journey</p>
          </div>
        </div>

        {/* Feature highlights */}
        <div className="mb-6 grid grid-cols-3 gap-2">
          {[
            { icon: <Zap className="h-3.5 w-3.5" />, label: 'AI-Powered', color: 'text-violet-400' },
            { icon: <Brain className="h-3.5 w-3.5" />, label: 'Smart Eval', color: 'text-cyan-400' },
            { icon: <TrendingUp className="h-3.5 w-3.5" />, label: 'Track Growth', color: 'text-pink-400' },
          ].map((f) => (
            <div key={f.label}
                 className="flex flex-col items-center gap-1.5 rounded-2xl border px-3 py-3"
                 style={{ background: 'rgba(255,255,255,0.02)', borderColor: 'rgba(255,255,255,0.06)' }}>
              <span className={f.color}>{f.icon}</span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{f.label}</span>
            </div>
          ))}
        </div>

        {/* Glass Card */}
        <div className="rounded-3xl border p-8 shadow-2xl"
             style={{
               background: 'rgba(10, 5, 30, 0.7)',
               borderColor: 'rgba(124, 58, 237, 0.2)',
               backdropFilter: 'blur(24px)',
               boxShadow: '0 0 60px rgba(124, 58, 237, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
             }}>

          <h2 className="mb-6 text-xl font-bold text-white">Welcome back 👋</h2>

          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Email Address</label>
              <div className="relative">
                <Mail className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400" />
                <input
                  id="login-email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-xl py-3.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="you@example.com"
                  required
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">Password</label>
              <div className="relative">
                <Lock className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-violet-400" />
                <input
                  id="login-password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-xl py-3.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 outline-none"
                  style={{
                    background: 'rgba(255,255,255,0.04)',
                    border: '1px solid rgba(124, 58, 237, 0.2)',
                  }}
                  onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                  onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            {error && (
              <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-red-300"
                   style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                {error}
              </div>
            )}

            <button
              id="login-submit"
              type="submit"
              disabled={loading}
              className="relative mt-2 flex w-full items-center justify-center gap-2 overflow-hidden rounded-xl py-4 font-bold text-white disabled:opacity-60"
              style={{
                background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 60%, #06b6d4 100%)',
                boxShadow: '0 4px 30px rgba(124, 58, 237, 0.4)',
              }}
            >
              <span className="relative z-10 flex items-center gap-2">
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Signing in...</>
                ) : (
                  <><Sparkles className="h-5 w-5" /> Sign in</>
                )}
              </span>
            </button>
          </form>

          <p className="mt-6 text-center text-sm text-slate-500">
            New to the platform?{' '}
            <Link className="font-bold text-violet-400 hover:text-violet-300" to="/register">
              Create a free account →
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
