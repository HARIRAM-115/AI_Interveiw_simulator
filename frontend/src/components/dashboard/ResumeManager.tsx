import React, { useState } from 'react';
import { Upload, FileText, CheckCircle, Trash2, ShieldCheck, AlertCircle } from 'lucide-react';

interface ResumeVersion {
  id: number;
  fileName: string;
  size: string;
  uploadDate: string;
  isActive: boolean;
  atsScore: number;
}

const ResumeManager: React.FC = () => {
  const [resumes, setResumes] = useState<ResumeVersion[]>([
    { id: 1, fileName: 'Hari_Ram_Fullstack_React_Developer.pdf', size: '242 KB', uploadDate: 'July 9, 2026', isActive: true, atsScore: 84 },
    { id: 2, fileName: 'Hari_Ram_Resume_Backend_Focused.pdf', size: '235 KB', uploadDate: 'June 20, 2026', isActive: false, atsScore: 76 },
    { id: 3, fileName: 'Hari_Ram_Resume_General.docx', size: '180 KB', uploadDate: 'May 12, 2026', isActive: false, atsScore: 68 },
  ]);

  const handleSetActive = (id: number) => {
    setResumes(
      resumes.map((r) => ({
        ...r,
        isActive: r.id === id,
      }))
    );
  };

  const handleDelete = (id: number) => {
    if (resumes.find((r) => r.id === id)?.isActive) {
      alert("Cannot delete the active resume version. Select another active version first.");
      return;
    }
    setResumes(resumes.filter((r) => r.id !== id));
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Upload className="h-6 w-6 text-indigo-400" /> Resume Version Manager
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Maintain multiple versions of your resume tailored for different job profiles, and switch the active evaluation file.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Column: List resumes */}
        <div className="lg:col-span-2 space-y-4">
          {resumes.map((res) => (
            <div
              key={res.id}
              className={`rounded-3xl border p-5 flex items-center justify-between transition-all ${
                res.isActive
                  ? 'bg-indigo-950/40 border-indigo-900 text-indigo-250 shadow-inner'
                  : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:border-slate-800'
              }`}
            >
              <div className="flex items-center gap-3.5 min-w-0">
                <div className={`rounded-xl p-2.5 shrink-0 ${res.isActive ? 'bg-indigo-900/60 text-indigo-300' : 'bg-slate-950/60 text-slate-500'}`}>
                  <FileText className="h-5 w-5" />
                </div>
                <div className="min-w-0">
                  <h3 className="font-extrabold text-slate-200 text-xs sm:text-sm truncate">{res.fileName}</h3>
                  <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1">
                    <span>{res.size}</span>
                    <span>&bull;</span>
                    <span>Uploaded {res.uploadDate}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-4 shrink-0">
                <div className="text-right">
                  <span className="text-xs font-black text-slate-350">{res.atsScore}% ATS</span>
                </div>

                <div className="flex items-center gap-2">
                  {!res.isActive ? (
                    <button
                      onClick={() => handleSetActive(res.id)}
                      className="rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-[10px] font-bold text-slate-450 hover:bg-slate-800 hover:text-white transition"
                    >
                      Set Active
                    </button>
                  ) : (
                    <span className="rounded-lg bg-emerald-950/60 border border-emerald-900/30 px-3 py-1.5 text-[10px] font-extrabold text-emerald-450 uppercase flex items-center gap-1">
                      <ShieldCheck className="h-3 w-3" /> Active
                    </span>
                  )}

                  <button
                    onClick={() => handleDelete(res.id)}
                    className="rounded-lg border border-slate-900 bg-slate-950/40 p-2 text-slate-500 hover:text-red-400 hover:border-red-950 transition"
                    title="Delete resume"
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: Upload info dropzone mock */}
        <div className="space-y-6">
          <div className="rounded-3xl border border-dashed border-slate-800 p-8 text-center text-slate-550 flex flex-col justify-center items-center bg-slate-900/10">
            <Upload className="h-10 w-10 text-indigo-400 mb-3 animate-pulse" />
            <h3 className="text-xs font-extrabold text-slate-200">Drag & Drop new resume files</h3>
            <p className="text-[10px] text-slate-550 mt-1 max-w-[180px] leading-relaxed">
              Supports PDF, DOCX files. Files are encrypted and scanned using AI parser.
            </p>
            <button className="mt-4 rounded-xl bg-indigo-650 px-4 py-2 text-xs font-bold text-white transition hover:bg-indigo-600">
              Browse Files
            </button>
          </div>

          <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-5 space-y-2 flex items-start gap-2.5">
            <AlertCircle className="h-4.5 w-4.5 text-indigo-400 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
              Switching the **Active Resume** updates all AI profile recommendations, missing skills audits, and interview generators instantly based on the selected file contents.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResumeManager;
