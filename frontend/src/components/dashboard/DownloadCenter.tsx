import React from 'react';
import { Download, FileText, Award, Calendar, CheckSquare } from 'lucide-react';

interface Report {
  id: string;
  name: string;
  type: 'PDF' | 'DOCX' | 'CSV';
  size: string;
  date: string;
  icon: React.ComponentType<any>;
}

const DownloadCenter: React.FC = () => {
  const reports: Report[] = [
    { id: 'dl_001', name: 'Google Mock Interview transcript and AI Review.pdf', type: 'PDF', size: '1.2 MB', date: 'July 9, 2026', icon: FileText },
    { id: 'dl_002', name: 'ATS Resume keyword compatibility checklist report.pdf', type: 'PDF', size: '342 KB', date: 'July 9, 2026', icon: CheckSquare },
    { id: 'dl_003', name: 'Advanced React Mock Assessment Certification.pdf', type: 'PDF', size: '2.1 MB', date: 'July 9, 2026', icon: Award },
    { id: 'dl_004', name: 'System Design Mock transcript.pdf', type: 'PDF', size: '840 KB', date: 'June 18, 2026', icon: FileText },
  ];

  const handleDownload = (name: string) => {
    alert(`Starting download for: ${name}`);
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Download className="h-6 w-6 text-indigo-400" /> Download Center
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Export and download high-resolution PDF mock transcripts, ATS keyword audits, and certification credentials.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-4 max-w-4xl mx-auto">
        <h3 className="text-xs font-black uppercase text-slate-350 tracking-wider mb-2">Available downloads</h3>
        <div className="divide-y divide-slate-900 overflow-hidden">
          {reports.map((rep) => {
            const Icon = rep.icon;
            return (
              <div
                key={rep.id}
                className="flex items-center justify-between py-4 transition hover:bg-slate-900/10 px-2 rounded-xl"
              >
                <div className="flex items-center gap-3.5 min-w-0">
                  <div className="rounded-xl bg-slate-950 border border-slate-900 p-2.5 text-indigo-400 shrink-0">
                    <Icon className="h-4.5 w-4.5" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-bold text-slate-205 text-xs sm:text-sm truncate">{rep.name}</h4>
                    <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-1 font-medium">
                      <span>{rep.type}</span>
                      <span>&bull;</span>
                      <span>{rep.size}</span>
                      <span>&bull;</span>
                      <span>Generated {rep.date}</span>
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => handleDownload(rep.name)}
                  className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 hover:bg-slate-850 px-3 py-2 text-xs font-bold text-slate-300 hover:text-white transition shrink-0 ml-4"
                >
                  <Download className="h-3.5 w-3.5 text-indigo-400" /> Export
                </button>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DownloadCenter;
