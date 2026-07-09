import React from 'react';
import { Award, Download, Linkedin, ExternalLink, ShieldCheck } from 'lucide-react';

interface Certificate {
  id: string;
  name: string;
  category: string;
  dateEarned: string;
  score: string;
  credentialId: string;
}

const CertificateCenter: React.FC = () => {
  const certificates: Certificate[] = [
    {
      id: 'cert_001',
      name: 'Advanced React Mock Assessment Credential',
      category: 'Frontend Engineering',
      dateEarned: 'July 9, 2026',
      score: '9.4/10',
      credentialId: 'AI-INT-REC-28492048',
    },
    {
      id: 'cert_002',
      name: 'System Design Mock Evaluation Credential',
      category: 'Software Architecture',
      dateEarned: 'June 18, 2026',
      score: '8.5/10',
      credentialId: 'AI-INT-SYS-10395839',
    },
  ];

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Award className="h-6 w-6 text-indigo-400" /> Certificate Center
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Earn verified interview prep credentials upon completing mock simulator evaluations with overall scores above 7/10.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2">
        {certificates.map((cert) => (
          <div
            key={cert.id}
            className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden group"
          >
            {/* Background design glow */}
            <div className="absolute top-0 right-0 h-32 w-32 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <span className="text-[9px] font-black uppercase text-indigo-455 tracking-wider bg-indigo-950/40 border border-indigo-900 px-3 py-1 rounded-full">
                  {cert.category}
                </span>
                <span className="text-xs font-bold text-slate-350">Score: {cert.score}</span>
              </div>

              <div className="space-y-1">
                <h3 className="font-extrabold text-slate-100 text-base leading-snug">{cert.name}</h3>
                <span className="text-[10px] text-slate-500 block">Issued on {cert.dateEarned}</span>
              </div>

              <div className="flex items-center gap-1.5 text-[10px] text-emerald-450 font-bold font-mono">
                <ShieldCheck className="h-4 w-4 shrink-0" />
                <span>ID: {cert.credentialId} (Verified)</span>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-8 pt-4 border-t border-slate-900 flex justify-between items-center gap-2">
              <button className="flex items-center gap-1 text-[11px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400 hover:text-white transition">
                <Download className="h-3.5 w-3.5 text-indigo-400" /> PDF Report
              </button>
              <button className="flex items-center gap-1 text-[11px] rounded-lg border border-slate-800 bg-slate-950 px-3 py-1.5 text-slate-400 hover:text-white transition">
                <Linkedin className="h-3.5 w-3.5 text-indigo-400" /> Share on LinkedIn
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CertificateCenter;
