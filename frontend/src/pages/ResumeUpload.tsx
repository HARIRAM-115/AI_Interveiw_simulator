import { useState, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { uploadResume } from '../services/api';
import {
  ArrowLeft, Upload, FileText, AlertCircle, CheckCircle,
  Sparkles, Loader2, Code, BookOpen, Briefcase, FileBadge,
} from 'lucide-react';

const ResumeUploadPage = () => {
  const [file, setFile] = useState<File | null>(null);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');
  const [result, setResult] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const inputRef = useRef<HTMLInputElement | null>(null);
  const navigate = useNavigate();

  const handleFileChange = (selected: File | null) => {
    setError(''); setResult(null); setProgress(0);
    if (selected && selected.type !== 'application/pdf') {
      setError('Only PDF files are supported.'); return;
    }
    setFile(selected);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault(); setDragging(false);
    handleFileChange(e.dataTransfer.files[0] ?? null);
  };

  const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    if (!file) { setError('Please select a PDF resume.'); return; }
    setLoading(true); setError(''); setProgress(0); setResult(null);
    try {
      const formData = new FormData();
      formData.append('resume', file);
      const response = await uploadResume(formData, (ev) => {
        if (!ev.total) return;
        setProgress(Math.round((ev.loaded * 100) / ev.total));
      });
      setResult(response.data.data);
      localStorage.setItem('latestResume', JSON.stringify(response.data.data));
    } catch (err: any) {
      setError(err?.response?.data?.message || 'Upload failed. Please try again.');
    } finally { setLoading(false); }
  };

  return (
    <div className="relative min-h-screen overflow-hidden px-4 py-8 md:py-14"
         style={{ background: 'radial-gradient(ellipse at 30% 0%, #0f0524 0%, #03000f 70%)' }}>

      {/* Aurora bg */}
      <div className="aurora-bg"><div className="aurora-orb-pink" /></div>
      <div className="grid-pattern" />

      <div className="relative z-10 mx-auto max-w-4xl">
        {/* Top nav */}
        <div className="mb-10 flex items-center justify-between">
          <button onClick={() => navigate('/dashboard')}
                  className="flex items-center gap-2 rounded-full px-4 py-2.5 text-sm font-semibold text-slate-300 transition hover:text-white"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <ArrowLeft className="h-4 w-4" /> Back to Dashboard
          </button>
          <div className="flex items-center gap-2">
            <span className="relative flex h-2.5 w-2.5">
              <span className="ping-slow absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
              <span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-cyan-400" />
            </span>
            <span className="text-xs font-bold uppercase tracking-widest text-cyan-500">Resume Parser AI</span>
          </div>
        </div>

        {/* Heading */}
        <div className="mb-10">
          <h1 className="text-4xl font-black tracking-tight gradient-text-aurora">Upload Your Resume</h1>
          <p className="mt-2 text-slate-400 max-w-xl">
            Upload a PDF and our AI automatically extracts your skills, education, and experience to personalize every interview question.
          </p>
        </div>

        {error && (
          <div className="mb-6 flex items-start gap-3 rounded-2xl px-5 py-4 text-red-300"
               style={{ background: 'rgba(239,68,68,0.07)', border: '1px solid rgba(239,68,68,0.2)' }}>
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-red-400" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Drop zone */}
          <div
            onDragOver={(e) => { e.preventDefault(); setDragging(true); }}
            onDragLeave={() => setDragging(false)}
            onDrop={handleDrop}
            onClick={() => inputRef.current?.click()}
            className="mb-6 flex flex-col items-center justify-center gap-5 rounded-3xl p-16 cursor-pointer transition-all duration-300"
            style={{
              background: dragging
                ? 'rgba(124, 58, 237, 0.08)'
                : 'rgba(255, 255, 255, 0.02)',
              border: dragging
                ? '2px dashed rgba(124, 58, 237, 0.7)'
                : '2px dashed rgba(255,255,255,0.08)',
              boxShadow: dragging ? '0 0 40px rgba(124, 58, 237, 0.15) inset' : 'none',
            }}
          >
            <div className="relative">
              <div className="absolute inset-0 rounded-2xl blur-xl opacity-50"
                   style={{ background: file ? 'linear-gradient(135deg, #10b981, #06b6d4)' : 'linear-gradient(135deg, #7c3aed, #06b6d4)' }} />
              <div className="relative flex h-20 w-20 items-center justify-center rounded-2xl"
                   style={{ background: file ? 'linear-gradient(135deg, #059669, #0891b2)' : 'linear-gradient(135deg, #7c3aed, #2563eb)' }}>
                {file ? <FileText className="h-10 w-10 text-white" /> : <Upload className="h-10 w-10 text-white" />}
              </div>
            </div>

            <div className="text-center">
              <p className="text-lg font-bold text-white">
                {file ? file.name : 'Drag & drop your PDF resume'}
              </p>
              <p className="mt-1 text-sm text-slate-500">
                {file ? `${(file.size / 1024).toFixed(1)} KB · PDF Document` : 'or click to browse — PDF only'}
              </p>
            </div>

            {file && (
              <div className="flex items-center gap-2 rounded-full px-4 py-2 text-sm font-bold text-emerald-300"
                   style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)' }}>
                <CheckCircle className="h-4 w-4" /> Ready to upload
              </div>
            )}
            <input ref={inputRef} type="file" accept="application/pdf"
                   onChange={(e) => handleFileChange(e.target.files?.[0] ?? null)} className="hidden" />
          </div>

          {/* Progress */}
          {progress > 0 && progress < 100 && (
            <div className="mb-5 space-y-2">
              <div className="flex justify-between text-xs font-bold text-slate-400">
                <span>Uploading...</span><span>{progress}%</span>
              </div>
              <div className="h-2 w-full overflow-hidden rounded-full" style={{ background: 'rgba(255,255,255,0.06)' }}>
                <div className="h-full rounded-full transition-all duration-200"
                     style={{ width: `${progress}%`, background: 'linear-gradient(90deg, #7c3aed, #06b6d4)' }} />
              </div>
            </div>
          )}

          <button type="submit" disabled={loading || !file}
                  className="flex w-full items-center justify-center gap-2.5 rounded-2xl py-4 font-bold text-white disabled:opacity-50"
                  style={{
                    background: 'linear-gradient(135deg, #7c3aed 0%, #2563eb 50%, #06b6d4 100%)',
                    boxShadow: '0 4px 30px rgba(124, 58, 237, 0.35)',
                  }}>
            {loading
              ? <><Loader2 className="h-5 w-5 animate-spin" /> Parsing with AI...</>
              : <><Sparkles className="h-5 w-5" /> Parse Resume</>}
          </button>
        </form>

        {/* Results */}
        {result && (
          <div className="mt-10 space-y-6">
            <div className="flex items-center gap-3 rounded-2xl px-5 py-4"
                 style={{ background: 'rgba(16, 185, 129, 0.07)', border: '1px solid rgba(16, 185, 129, 0.25)' }}>
              <CheckCircle className="h-5 w-5 text-emerald-400 shrink-0" />
              <div>
                <p className="font-bold text-emerald-300">Resume parsed successfully!</p>
                <p className="text-xs text-emerald-600 mt-0.5 flex items-center gap-1.5">
                  <FileBadge className="h-3.5 w-3.5" /> {result.originalFileName}
                </p>
              </div>
            </div>

            <div className="grid gap-5 md:grid-cols-3">
              {[
                {
                  icon: <Code className="h-5 w-5" />, title: 'Skills Detected',
                  color: '#a78bfa', items: result.skills, badge: true,
                  empty: 'No skills detected.',
                },
                {
                  icon: <BookOpen className="h-5 w-5" />, title: 'Education',
                  color: '#60a5fa', items: result.education, badge: false,
                  empty: 'No education section found.',
                },
                {
                  icon: <Briefcase className="h-5 w-5" />, title: 'Experience',
                  color: '#f472b6', items: result.experience, badge: false,
                  empty: 'No experience section found.',
                },
              ].map((section) => (
                <div key={section.title} className="rounded-3xl p-6"
                     style={{ background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.06)' }}>
                  <h3 className="mb-4 flex items-center gap-2 text-sm font-bold uppercase tracking-wide"
                      style={{ color: section.color }}>
                    <span style={{ color: section.color }}>{section.icon}</span> {section.title}
                  </h3>
                  {section.items.length > 0 ? (
                    section.badge ? (
                      <div className="flex flex-wrap gap-1.5">
                        {section.items.map((item: string) => (
                          <span key={item} className="rounded-lg px-2.5 py-1 text-xs font-semibold"
                                style={{ background: `${section.color}12`, color: section.color, border: `1px solid ${section.color}25` }}>
                            {item}
                          </span>
                        ))}
                      </div>
                    ) : (
                      <ul className="space-y-2">
                        {section.items.map((item: string, i: number) => (
                          <li key={i} className="rounded-xl px-3 py-2.5 text-sm text-slate-300"
                              style={{ background: 'rgba(255,255,255,0.03)' }}>
                            {item}
                          </li>
                        ))}
                      </ul>
                    )
                  ) : (
                    <p className="text-sm text-slate-600">{section.empty}</p>
                  )}
                </div>
              ))}
            </div>

            {/* CTA */}
            <div className="flex flex-col md:flex-row items-center justify-between gap-4 rounded-3xl p-6"
                 style={{
                   background: 'linear-gradient(135deg, rgba(124,58,237,0.12) 0%, rgba(6,182,212,0.08) 100%)',
                   border: '1px solid rgba(124,58,237,0.25)',
                 }}>
              <div>
                <p className="font-bold text-white">Resume ready! 🎯</p>
                <p className="text-sm text-slate-400 mt-0.5">Start a personalized AI interview based on your parsed profile.</p>
              </div>
              <button onClick={() => navigate('/interview')}
                      className="shrink-0 flex items-center gap-2 rounded-xl px-6 py-3 font-bold text-white"
                      style={{ background: 'linear-gradient(135deg, #7c3aed, #06b6d4)', boxShadow: '0 4px 20px rgba(124,58,237,0.3)' }}>
                <Sparkles className="h-4 w-4" /> Start Interview
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumeUploadPage;
