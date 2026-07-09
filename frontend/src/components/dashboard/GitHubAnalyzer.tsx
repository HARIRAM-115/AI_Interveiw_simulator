import React, { useState } from 'react';
import { Github, Search, CheckCircle, AlertTriangle, ArrowUpRight, Loader2 } from 'lucide-react';

const GitHubAnalyzer: React.FC = () => {
  const [username, setUsername] = useState('');
  const [loading, setLoading] = useState(false);
  const [data, setData] = useState<any | null>(null);

  const handleAnalyze = () => {
    if (!username.trim()) return;
    setLoading(true);
    setData(null);

    setTimeout(() => {
      setData({
        username: username,
        profileScore: 84,
        reposCount: 34,
        starsCount: 142,
        contributionsYear: 842,
        primaryLanguages: [
          { name: 'TypeScript', pct: 45, color: '#3178c6' },
          { name: 'JavaScript', pct: 30, color: '#f1e05a' },
          { name: 'HTML/CSS', pct: 15, color: '#e34c26' },
          { name: 'Shell', pct: 10, color: '#89e051' },
        ],
        audits: [
          { status: 'passed', name: 'Profile Bio & Contact Info', desc: 'Social handles and links are set up.' },
          { status: 'passed', name: 'Active Repository READMEs', desc: 'Major repositories contain descriptive readmes.' },
          { status: 'failed', name: 'Repository License check', desc: '12 public repositories lack an open source license file.' },
          { status: 'failed', name: 'Credential Leaks Mock check', desc: 'Detected 1 .env configuration file pushed to public branch!' },
        ],
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Github className="h-6 w-6 text-indigo-400" /> GitHub Profile Portfolio Analyzer
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Scan your GitHub contribution graphs and repository structures for recruiters and tech compliance scoring.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 md:p-8 space-y-6 max-w-4xl mx-auto">
        <div className="flex gap-2 max-w-md mx-auto">
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter GitHub username (e.g. torvalds)"
              className="w-full rounded-xl bg-slate-950 border border-slate-900 pl-10 pr-4 py-3 text-xs text-slate-200 outline-none focus:border-indigo-650"
            />
          </div>
          <button
            onClick={handleAnalyze}
            disabled={loading || !username.trim()}
            className="rounded-xl bg-indigo-650 px-5 py-3 text-xs font-bold text-white transition hover:bg-indigo-600 disabled:opacity-50 flex items-center gap-1.5"
          >
            {loading && <Loader2 className="h-3.5 w-3.5 animate-spin" />} Analyze
          </button>
        </div>

        {loading && (
          <div className="flex flex-col py-12 items-center justify-center text-slate-500 text-xs">
            <Loader2 className="h-6 w-6 animate-spin mb-2 text-indigo-500" /> Scanning contribution trees, readmes, and licenses...
          </div>
        )}

        {data && (
          <div className="grid gap-6 md:grid-cols-5 animate-fade-in">
            {/* Left Col: User statistics */}
            <div className="md:col-span-2 space-y-6">
              <div className="rounded-2xl bg-slate-950/60 border border-slate-900 p-5 space-y-4">
                <div className="flex justify-between items-center">
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base">@{data.username}</h3>
                    <span className="text-[9px] text-indigo-400 font-bold">Portfolio Status: Strong</span>
                  </div>
                  <div className="text-right">
                    <span className="text-xl font-black text-white">{data.profileScore}/100</span>
                    <span className="text-[8px] text-slate-500 block uppercase">Portfolio Score</span>
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 text-center text-xs">
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[9px] text-slate-500 block">Repos</span>
                    <span className="font-bold text-slate-250">{data.reposCount}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[9px] text-slate-500 block">Stars</span>
                    <span className="font-bold text-slate-250">{data.starsCount}</span>
                  </div>
                  <div className="bg-slate-900 border border-slate-800 p-2.5 rounded-xl">
                    <span className="text-[9px] text-slate-500 block">Contribs</span>
                    <span className="font-bold text-slate-250">{data.contributionsYear}</span>
                  </div>
                </div>
              </div>

              {/* Language split */}
              <div className="rounded-2xl bg-slate-950/60 border border-slate-900 p-5 space-y-3">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Language Distribution</h4>
                <div className="space-y-2.5">
                  {data.primaryLanguages.map((lang: any) => (
                    <div key={lang.name} className="space-y-1">
                      <div className="flex justify-between text-xs font-semibold">
                        <span className="text-slate-350">{lang.name}</span>
                        <span className="text-slate-400">{lang.pct}%</span>
                      </div>
                      <div className="h-1.5 w-full bg-slate-900 rounded-full overflow-hidden">
                        <div className="h-full rounded-full" style={{ width: `${lang.pct}%`, backgroundColor: lang.color }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Col: Audits checklist */}
            <div className="md:col-span-3 space-y-6">
              <div className="rounded-2xl bg-slate-950/60 border border-slate-900 p-5 space-y-4">
                <h4 className="text-[10px] font-black uppercase text-slate-500 tracking-wider">Compliance & Security Checklist</h4>
                <div className="divide-y divide-slate-900 space-y-4">
                  {data.audits.map((item: any, idx: number) => {
                    const isPass = item.status === 'passed';
                    return (
                      <div key={idx} className="pt-4 first:pt-0 flex items-start gap-3">
                        {isPass ? (
                          <CheckCircle className="h-4.5 w-4.5 text-emerald-450 shrink-0 mt-0.5" />
                        ) : (
                          <AlertTriangle className="h-4.5 w-4.5 text-red-400 shrink-0 mt-0.5" />
                        )}
                        <div>
                          <p className="text-xs font-bold text-slate-200">{item.name}</p>
                          <p className="text-[10px] text-slate-450 mt-0.5">{item.desc}</p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Action plan */}
              <div className="rounded-2xl border border-indigo-950/50 bg-indigo-950/5 p-4 border-l-4 border-l-indigo-500">
                <span className="text-[10px] font-bold text-indigo-400 block uppercase mb-1">Portfolio Optimization Plan</span>
                <p className="text-xs text-slate-400 leading-relaxed font-sans">
                  Immediate action: remove the `.env` configuration file from public history logs using `git-filter-repo` and configure a license (preferably MIT) to increase your open-source evaluation score.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default GitHubAnalyzer;
