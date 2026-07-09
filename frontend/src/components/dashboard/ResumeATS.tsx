import React, { useState } from 'react';
import { FileText, Award, RefreshCw, CheckCircle, AlertTriangle, ArrowRight, Zap } from 'lucide-react';

interface ResumeATSProps {
  resumeSummary: any;
  onNavigateToUpload: () => void;
}

const ResumeATS: React.FC<ResumeATSProps> = ({ resumeSummary, onNavigateToUpload }) => {
  const [inputText, setInputText] = useState('');
  const [optimizedBullets, setOptimizedBullets] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  // Fallbacks if no resume uploaded
  const atsScore = resumeSummary?.atsScore || 76;
  const originalFileName = resumeSummary?.originalFileName || 'No resume uploaded yet';
  const extractedSkills = resumeSummary?.skills || ['React', 'Node.js', 'SQL', 'TypeScript'];
  
  const suggestedKeywords = [
    { word: 'Kubernetes', demand: 'High' },
    { word: 'System Architecture', demand: 'High' },
    { word: 'CI/CD Pipelines', demand: 'Medium' },
    { word: 'Unit Testing (Jest)', demand: 'Medium' },
    { word: 'GraphQL APIs', demand: 'Low' },
  ];

  const handleOptimizeBullet = () => {
    if (!inputText.trim()) return;
    setLoading(true);
    setOptimizedBullets(null);
    setTimeout(() => {
      // Mock AI rewrite using high impact action verbs and metrics
      setOptimizedBullets([
        `Spearheaded development of responsive React views, improving page load speed by 28% and user retention.`,
        `Architected and optimized core frontend layouts, reducing API request latency by 120ms across 4 key panels.`,
        `Collaborated with cross-functional teams to engineer interface assets, reducing production bug volume by 15%.`,
      ]);
      setLoading(false);
    }, 1200);
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <FileText className="h-6 w-6 text-indigo-400" /> AI Resume ATS Analyzer
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Compare your active resume format, phrasing, and target keywords against modern enterprise applicant tracking systems.
          </p>
        </div>
        
        <button
          onClick={onNavigateToUpload}
          className="flex items-center gap-1.5 rounded-xl border border-slate-800 bg-slate-900 px-4 py-2 text-xs font-bold text-slate-200 hover:bg-slate-850 transition"
        >
          <RefreshCw className="h-3.5 w-3.5 text-indigo-400" /> Upload New Version
        </button>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* ATS Score & Details */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 md:p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            
            {/* Score Ring */}
            <div className="relative h-32 w-32 shrink-0 flex items-center justify-center">
              <svg className="absolute inset-0 transform -rotate-90" viewBox="0 0 100 100">
                <circle cx="50" cy="50" r="40" stroke="#0f0830" strokeWidth="8" fill="transparent" />
                <circle cx="50" cy="50" r="40" stroke="#6366f1" strokeWidth="8" fill="transparent"
                  strokeDasharray="251.2"
                  strokeDashoffset={251.2 - (251.2 * atsScore) / 100}
                />
              </svg>
              <div className="text-center">
                <span className="text-2xl font-black text-white">{atsScore}%</span>
                <span className="text-[9px] text-slate-500 font-bold uppercase block tracking-wider">ATS Match</span>
              </div>
            </div>

            {/* Score rationale details */}
            <div className="space-y-3 flex-1 text-center md:text-left">
              <div>
                <h3 className="font-extrabold text-slate-100 text-base">{originalFileName}</h3>
                <span className="text-[10px] text-slate-500">Scan date: July 9, 2026</span>
              </div>
              <p className="text-xs text-slate-400 leading-relaxed font-sans">
                Your resume shows strong formatting alignment, but lacks critical cloud engineering terms and action verb metrics. Optimize the bullet points below to boost your compatibility score by 15-20%.
              </p>
            </div>
          </div>

          {/* Bullet Point Optimizer Playground */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
                <Zap className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500/20" /> Resume Bullet-Point Optimizer
              </h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Rewrite passive summaries into high-impact STAR statement achievements</p>
            </div>

            <div className="flex gap-2">
              <input
                type="text"
                value={inputText}
                onChange={(e) => setInputText(e.target.value)}
                placeholder="e.g. I made code layouts for React web app"
                className="flex-1 rounded-xl bg-slate-950 border border-slate-900 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-650"
              />
              <button
                onClick={handleOptimizeBullet}
                disabled={loading || !inputText.trim()}
                className="rounded-xl bg-indigo-650 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50"
              >
                Optimize
              </button>
            </div>

            {loading && (
              <div className="flex py-6 justify-center items-center text-slate-500 text-xs">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" /> AI generating action metrics formulations...
              </div>
            )}

            {optimizedBullets && (
              <div className="space-y-2.5 animate-fade-in">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">AI Recommended Formulations</span>
                {optimizedBullets.map((bullet, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl border border-indigo-950/40 bg-indigo-950/5 p-3 flex items-start justify-between cursor-pointer hover:border-indigo-800 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(bullet);
                      alert('Copied to clipboard!');
                    }}
                    title="Click to copy to clipboard"
                  >
                    <p className="text-xs text-slate-300 leading-relaxed font-sans flex-1">"{bullet}"</p>
                    <span className="text-[9px] font-black text-indigo-400 group-hover:underline uppercase shrink-0 ml-3">Copy</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Sidebar constraints check */}
        <div className="space-y-6">
          {/* File checks */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-5 space-y-4">
            <h3 className="text-xs font-black uppercase text-slate-350 tracking-wider">Format Auditing</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Single-column layout</span>
                <span className="text-emerald-450 font-bold flex items-center gap-1">Passed <CheckCircle className="h-3.5 w-3.5" /></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Standard sections header</span>
                <span className="text-emerald-450 font-bold flex items-center gap-1">Passed <CheckCircle className="h-3.5 w-3.5" /></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Font check (Sans-serif)</span>
                <span className="text-emerald-450 font-bold flex items-center gap-1">Passed <CheckCircle className="h-3.5 w-3.5" /></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">Contact Details present</span>
                <span className="text-emerald-450 font-bold flex items-center gap-1">Passed <CheckCircle className="h-3.5 w-3.5" /></span>
              </div>
              <div className="flex items-center justify-between text-xs">
                <span className="text-slate-400 font-semibold">No charts / images</span>
                <span className="text-red-400 font-bold flex items-center gap-1">Failed <AlertTriangle className="h-3.5 w-3.5" /></span>
              </div>
            </div>
          </div>

          {/* Missing Keywords list */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-5 space-y-3">
            <h3 className="text-xs font-black uppercase text-slate-350 tracking-wider">Keyword Recommendations</h3>
            <div className="space-y-2">
              {suggestedKeywords.map((kw) => (
                <div key={kw.word} className="flex justify-between items-center rounded-xl bg-slate-950/40 border border-slate-900 p-2.5 text-xs">
                  <span className="font-semibold text-slate-200">{kw.word}</span>
                  <span className={`rounded-lg px-2 py-0.5 text-[8px] font-black uppercase ${
                    kw.demand === 'High'
                      ? 'bg-red-950/40 text-red-400'
                      : kw.demand === 'Medium'
                      ? 'bg-amber-955/40 text-amber-450'
                      : 'bg-slate-900 text-slate-500'
                  }`}>
                    {kw.demand} demand
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeATS;
