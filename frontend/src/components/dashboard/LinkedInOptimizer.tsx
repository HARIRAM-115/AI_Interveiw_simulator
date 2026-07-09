import React, { useState } from 'react';
import { Linkedin, CheckCircle, RefreshCw, Sparkles, BookOpen } from 'lucide-react';

const LinkedInOptimizer: React.FC = () => {
  const [headline, setHeadline] = useState('');
  const [suggestions, setSuggestions] = useState<string[] | null>(null);
  const [loading, setLoading] = useState(false);

  const handleOptimize = () => {
    if (!headline.trim()) return;
    setLoading(true);
    setSuggestions(null);

    setTimeout(() => {
      setSuggestions([
        `${headline} | Frontend Architect | Specialized in React & TS | Building High-Performance Web Applications`,
        `Software Engineer @ Tech & Systems | Scaling UI Pipelines | React, Node.js, GraphQL`,
        `Fullstack Developer | Solving Complex Problems with Clean Code | JavaScript & Cloud Infrastructure Specialist`,
      ]);
      setLoading(false);
    }, 1200);
  };

  const checklistItems = [
    { title: 'Headline Optimization', status: true, desc: 'Avoid generic titles like "Student". Use role titles separated by vertical pipes.' },
    { title: 'Detailed "About" Summary', status: true, desc: 'Include personal background, core stack keywords, and call to action details.' },
    { title: 'Action-oriented Experience', status: false, desc: 'Ensure past employment descriptions list quantitative business metrics.' },
    { title: 'Skills & Endorsements', status: false, desc: 'List at least 15 technical skills, pin the top 3 corresponding to target roles.' },
    { title: 'Custom URL Configured', status: true, desc: 'Customize clean handle URL profile links instead of system default IDs.' },
  ];

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Linkedin className="h-6 w-6 text-indigo-400" /> LinkedIn Profile Optimizer
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Increase recruiter search impressions by aligning profile metadata, summaries, and headlines with current hiring trends.
          </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Col: Checklist */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/20 p-5 space-y-4 h-fit">
          <h3 className="text-xs font-black uppercase text-slate-350 tracking-wider">Profile completeness audit</h3>
          <div className="divide-y divide-slate-900 space-y-4">
            {checklistItems.map((item, idx) => (
              <div key={idx} className="pt-4 first:pt-0 flex items-start gap-3">
                <div className={`mt-1 h-4 w-4 rounded-full flex items-center justify-center shrink-0 border ${
                  item.status ? 'border-emerald-500 bg-emerald-500/20 text-emerald-450' : 'border-slate-800 bg-slate-900 text-slate-600'
                }`}>
                  {item.status && <CheckCircle className="h-3.5 w-3.5" />}
                </div>
                <div>
                  <p className="text-xs font-bold text-slate-200">{item.title}</p>
                  <p className="text-[10px] text-slate-450 mt-0.5 leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Right Col: Interactive Headline Builder */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-6">
          <div className="space-y-1">
            <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500/10" /> AI Headline Optimizer
            </h3>
            <p className="text-[10px] text-slate-500">Insert your current tagline to generate highly indexed recruiter keywords</p>
          </div>

          <div className="space-y-4">
            <div className="flex gap-2">
              <input
                type="text"
                value={headline}
                onChange={(e) => setHeadline(e.target.value)}
                placeholder="e.g. React developer"
                className="flex-1 rounded-xl bg-slate-950 border border-slate-900 px-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-650"
              />
              <button
                onClick={handleOptimize}
                disabled={loading || !headline.trim()}
                className="rounded-xl bg-indigo-650 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50"
              >
                Optimize
              </button>
            </div>

            {loading && (
              <div className="flex py-6 justify-center items-center text-slate-500 text-xs">
                <RefreshCw className="h-4 w-4 animate-spin mr-2" /> AI generating variations...
              </div>
            )}

            {suggestions && (
              <div className="space-y-3 animate-fade-in">
                <span className="text-[9px] font-black uppercase tracking-wider text-slate-500 block">Suggested Headlines</span>
                {suggestions.map((s, idx) => (
                  <div
                    key={idx}
                    className="group rounded-xl border border-indigo-950/40 bg-indigo-950/5 p-3 flex items-start justify-between cursor-pointer hover:border-indigo-850 transition-colors"
                    onClick={() => {
                      navigator.clipboard.writeText(s);
                      alert('Copied headline to clipboard!');
                    }}
                    title="Click to copy"
                  >
                    <p className="text-xs text-slate-350 leading-relaxed font-sans flex-1">"{s}"</p>
                    <span className="text-[9px] font-black text-indigo-400 group-hover:underline uppercase shrink-0 ml-3">Copy</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="rounded-xl bg-slate-950 border border-slate-900 p-4 space-y-2">
            <span className="text-[10px] font-bold text-indigo-400 block uppercase">SEO Optimization Tip</span>
            <p className="text-xs text-slate-450 leading-relaxed font-sans">
              LinkedIn matches candidate rankings by matching the exact keywords in search parameters. Pinning your target stack items (e.g. `TypeScript`, `Next.js`, `Docker`) inside your headline results in up to 3x higher profile search hits.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LinkedInOptimizer;
