import { FormEvent, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { registerUser } from '../services/api';
import { Brain, User, Mail, Lock, AlertCircle, Loader2, Sparkles, ShieldCheck, BarChart2, Mic } from 'lucide-react';
import bgImage from '../ai_interview_bg.png';

const RegisterPage = () => {
  const [name, setName] = useState('');
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
      const response = await registerUser({ name, email, password, role: 'candidate' });
      const { token } = response.data.data;
      localStorage.setItem('token', token);
      navigate('/dashboard');
    } catch (err: any) {
      let msg = 'Registration failed. Please try again.';
      if (err.response?.data?.message) {
        msg = err.response.data.message;
      } else if (err.message === 'Network Error') {
        const isLocal = err.config?.baseURL?.includes('localhost');
        msg = isLocal 
          ? 'Server is unreachable. Please make sure the local backend is running on port 5050.'
          : 'Server is unreachable. Please ensure MONGODB_URI and GROQ_API_KEY environment variables are configured on your Vercel backend.';
      } else if (err.message) {
        msg = err.message;
      }
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const features = [
    { icon: <Brain className="h-5 w-5" />, title: 'AI-Generated Questions', desc: 'Tailored from your resume', color: '#a78bfa' },
    { icon: <Mic className="h-5 w-5" />, title: 'Voice-to-Text', desc: 'Speak your answers naturally', color: '#34d399' },
    { icon: <ShieldCheck className="h-5 w-5" />, title: 'Smart Evaluation', desc: 'Instant Groq AI feedback', color: '#60a5fa' },
    { icon: <BarChart2 className="h-5 w-5" />, title: 'Progress Analytics', desc: 'Track scores over time', color: '#f472b6' },
  ];

  return (
    <div className="relative flex min-h-screen items-center justify-center px-4 py-10 overflow-hidden"
         style={{ 
           backgroundImage: `radial-gradient(ellipse at 80% 20%, rgba(13, 5, 32, 0.92) 0%, rgba(3, 0, 15, 0.98) 100%), url(${bgImage})`,
           backgroundSize: 'cover',
           backgroundPosition: 'center',
         }}>

      {/* Aurora background */}
      <div className="aurora-bg">
        <div className="aurora-orb-pink" />
      </div>
      <div className="grid-pattern" />

      <div className="relative z-10 flex w-full max-w-5xl items-center gap-12">

        {/* Left panel: Feature highlights */}
        <div className="hidden lg:flex flex-col gap-6 w-1/2">
          <div className="mb-4">
            <div className="flex items-center gap-3 mb-4">
              <div className="relative">
                <div className="absolute inset-0 rounded-xl blur-lg opacity-60"
                     style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
                <div className="relative flex h-12 w-12 items-center justify-center rounded-xl"
                     style={{ background: 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                  <Brain className="h-6 w-6 text-white" />
                </div>
              </div>
              <div>
                <h2 className="text-2xl font-black gradient-text-aurora">AI Interview</h2>
                <p className="text-xs text-slate-500 uppercase tracking-wider">Simulator Platform</p>
              </div>
            </div>
            <h1 className="text-4xl font-black text-white leading-tight">
              Ace your next<br />
              <span className="gradient-text-primary">tech interview</span>
            </h1>
            <p className="mt-3 text-slate-400 leading-relaxed">
              Practice with real AI-generated questions based on your resume. Get instant feedback and track your progress.
            </p>
          </div>

          <div className="grid gap-3">
            {features.map((f) => (
              <div key={f.title}
                   className="flex items-center gap-4 rounded-2xl p-4"
                   style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex h-10 w-10 items-center justify-center rounded-xl shrink-0"
                     style={{ background: `${f.color}15`, color: f.color }}>
                  {f.icon}
                </div>
                <div>
                  <p className="font-semibold text-white text-sm">{f.title}</p>
                  <p className="text-xs text-slate-500">{f.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right panel: Register form */}
        <div className="w-full lg:w-1/2">
          <div className="mb-6 text-center lg:hidden">
            <h1 className="text-3xl font-black gradient-text-aurora">Create Account</h1>
            <p className="mt-1 text-sm text-slate-400">Join the AI Interview Simulator</p>
          </div>

          <div className="rounded-3xl border p-8 shadow-2xl"
               style={{
                 background: 'rgba(10, 5, 30, 0.75)',
                 borderColor: 'rgba(124, 58, 237, 0.2)',
                 backdropFilter: 'blur(24px)',
                 boxShadow: '0 0 60px rgba(124, 58, 237, 0.1), inset 0 1px 0 rgba(255,255,255,0.05)'
               }}>

            <h2 className="mb-6 text-xl font-bold text-white hidden lg:block">Get started free 🚀</h2>

            <form onSubmit={handleSubmit} className="space-y-4">
              {[
                { id: 'register-name', label: 'Full Name', type: 'text', value: name, setter: setName, icon: <User className="h-4 w-4 text-violet-400" />, placeholder: 'Your full name' },
                { id: 'register-email', label: 'Email Address', type: 'email', value: email, setter: setEmail, icon: <Mail className="h-4 w-4 text-cyan-400" />, placeholder: 'you@example.com' },
                { id: 'register-password', label: 'Password', type: 'password', value: password, setter: setPassword, icon: <Lock className="h-4 w-4 text-pink-400" />, placeholder: 'Min. 6 characters' },
              ].map((field) => (
                <div key={field.id} className="space-y-1.5">
                  <label className="block text-xs font-bold uppercase tracking-wider text-slate-400">{field.label}</label>
                  <div className="relative">
                    <span className="absolute left-3.5 top-1/2 -translate-y-1/2">{field.icon}</span>
                    <input
                      id={field.id}
                      type={field.type}
                      value={field.value}
                      onChange={(e) => field.setter(e.target.value)}
                      className="w-full rounded-xl py-3.5 pl-10 pr-4 text-slate-200 placeholder:text-slate-600 outline-none"
                      style={{
                        background: 'rgba(255,255,255,0.04)',
                        border: '1px solid rgba(124, 58, 237, 0.2)',
                      }}
                      onFocus={(e) => { e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.6)'; e.currentTarget.style.boxShadow = '0 0 0 3px rgba(124, 58, 237, 0.1)'; }}
                      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(124, 58, 237, 0.2)'; e.currentTarget.style.boxShadow = 'none'; }}
                      placeholder={field.placeholder}
                      minLength={field.id === 'register-password' ? 6 : undefined}
                      required
                    />
                  </div>
                </div>
              ))}

              {error && (
                <div className="flex items-center gap-2.5 rounded-xl px-4 py-3 text-sm text-red-300"
                     style={{ background: 'rgba(239, 68, 68, 0.08)', border: '1px solid rgba(239, 68, 68, 0.2)' }}>
                  <AlertCircle className="h-4 w-4 shrink-0 text-red-400" />
                  {error}
                </div>
              )}

              <button
                id="register-submit"
                type="submit"
                disabled={loading}
                className="flex w-full items-center justify-center gap-2 rounded-xl py-4 font-bold text-white disabled:opacity-60"
                style={{
                  background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)',
                  boxShadow: '0 4px 30px rgba(124, 58, 237, 0.4)',
                }}
              >
                {loading ? (
                  <><Loader2 className="h-5 w-5 animate-spin" /> Creating account...</>
                ) : (
                  <><Sparkles className="h-5 w-5" /> Create free account</>
                )}
              </button>
            </form>

            <p className="mt-6 text-center text-sm text-slate-500">
              Already have an account?{' '}
              <Link className="font-bold text-violet-400 hover:text-violet-300" to="/login">
                Sign in →
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RegisterPage;
