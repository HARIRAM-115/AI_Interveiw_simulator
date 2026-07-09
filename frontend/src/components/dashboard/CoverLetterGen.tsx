import React, { useState } from 'react';
import { Mail, FileText, CheckCircle, RefreshCw, Copy, Download } from 'lucide-react';

const CoverLetterGen: React.FC = () => {
  const [jobTitle, setJobTitle] = useState('');
  const [company, setCompany] = useState('');
  const [description, setDescription] = useState('');
  const [tone, setTone] = useState('Professional');
  const [loading, setLoading] = useState(false);
  const [letter, setLetter] = useState<string | null>(null);

  const handleGenerate = () => {
    if (!jobTitle.trim() || !company.trim()) return;
    setLoading(true);
    setLetter(null);

    setTimeout(() => {
      const generatedLetter = `Dear Hiring Team at ${company},

I am writing to express my enthusiastic interest in the ${jobTitle} position at ${company}. Having closely followed your company's recent work and technical growth, I am inspired by your commitment to engineering excellence and user-centric systems.

With a solid background in fullstack software engineering, I specialize in developing responsive, scalable web applications using React, TypeScript, and Node.js. In my past projects, I have focused on optimizing layout speeds, integrating clean REST/GraphQL APIs, and configuring CI/CD deployment pipelines. I believe these technical skills align perfectly with the target requirements of the ${jobTitle} role.

I am particularly excited about the prospect of bringing my structured problem-solving approach and collaborative mindset to ${company}. Thank you for your time, considerations, and reviews. I look forward to the possibility of discussing how my experience can contribute to your engineering objectives.

Sincerely,
[Your Name]`;
      setLetter(generatedLetter);
      setLoading(false);
    }, 1500);
  };

  const handleCopy = () => {
    if (letter) {
      navigator.clipboard.writeText(letter);
      alert('Cover letter copied to clipboard!');
    }
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Mail className="h-6 w-6 text-indigo-400" /> Cover Letter Generator
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Draft tailored, role-specific cover letters using your resume skills and company targets in seconds.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Col: Setup form */}
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleGenerate();
          }}
          className="lg:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/20 p-5 space-y-4 h-fit"
        >
          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Target Job Title</label>
            <input
              type="text"
              value={jobTitle}
              onChange={(e) => setJobTitle(e.target.value)}
              placeholder="e.g. Frontend Engineer"
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3.5 py-3 text-xs text-slate-205 outline-none focus:border-indigo-650"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Company Name</label>
            <input
              type="text"
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              placeholder="e.g. Acme Corporation"
              required
              className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3.5 py-3 text-xs text-slate-205 outline-none focus:border-indigo-650"
            />
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Tone Style</label>
            <select
              value={tone}
              onChange={(e) => setTone(e.target.value)}
              className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3 py-3 text-xs text-indigo-350 outline-none focus:border-indigo-650"
            >
              <option value="Professional">Professional & Corporate</option>
              <option value="Enthusiastic">Enthusiastic & High-Energy</option>
              <option value="Technical">Detailed & Technical-focused</option>
              <option value="Creative">Creative & Personal-brand</option>
            </select>
          </div>

          <div className="space-y-1">
            <label className="text-[10px] font-bold text-slate-400 uppercase">Job Description snippet (Optional)</label>
            <textarea
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Paste job description keywords here..."
              className="w-full rounded-xl bg-slate-950 border border-slate-900 p-3 text-xs text-slate-205 outline-none resize-none focus:border-indigo-650"
            />
          </div>

          <button
            type="submit"
            disabled={loading || !jobTitle.trim() || !company.trim()}
            className="w-full rounded-xl bg-gradient-to-r from-indigo-500 to-indigo-650 py-3 text-xs font-bold text-white shadow-lg transition hover:brightness-110 disabled:opacity-50"
          >
            Generate Cover Letter
          </button>
        </form>

        {/* Right Col: Output text workspace */}
        <div className="lg:col-span-3 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col min-h-[400px]">
          {loading && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs">
              <RefreshCw className="h-6 w-6 animate-spin mb-2 text-indigo-500" /> Designing customized cover letter paragraphs...
            </div>
          )}

          {!loading && !letter && (
            <div className="flex-1 flex flex-col items-center justify-center text-slate-500 text-xs text-center p-8">
              <FileText className="h-10 w-10 text-slate-655 mb-2" />
              <p className="font-semibold">Setup cover letter details</p>
              <p className="text-[11px] mt-1 text-slate-655 max-w-xs">Fill out target role details on the left, then click Generate to view draft recommendations.</p>
            </div>
          )}

          {!loading && letter && (
            <div className="flex-1 flex flex-col justify-between animate-fade-in">
              <div className="flex-1">
                <div className="flex items-center justify-between border-b border-slate-900 pb-3 mb-4 shrink-0">
                  <span className="text-[9px] font-black uppercase text-indigo-455 tracking-wider bg-indigo-950/40 border border-indigo-900 px-3 py-1 rounded-full">
                    Letter Workspace ({tone})
                  </span>
                  <div className="flex gap-2">
                    <button
                      onClick={handleCopy}
                      className="flex items-center gap-1 text-[11px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400 hover:text-white transition"
                    >
                      <Copy className="h-3.5 w-3.5 text-indigo-400" /> Copy
                    </button>
                  </div>
                </div>

                <textarea
                  value={letter}
                  onChange={(e) => setLetter(e.target.value)}
                  rows={14}
                  className="w-full bg-transparent p-2 text-xs text-slate-300 leading-relaxed font-sans outline-none resize-none"
                />
              </div>

              <div className="pt-4 border-t border-slate-900 flex justify-between items-center text-[10px] text-slate-500 shrink-0">
                <span>Tip: Edit text fields directly in workspace before copying</span>
                <span>~ 280 words</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default CoverLetterGen;
