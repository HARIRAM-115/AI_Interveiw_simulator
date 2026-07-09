import React, { useState } from 'react';
import { Users, Search, Download, CheckCircle, XCircle, ShieldCheck, Mail } from 'lucide-react';

interface Applicant {
  id: number;
  name: string;
  role: string;
  score: string;
  ats: number;
  status: 'Under Review' | 'Hired' | 'Rejected';
  email: string;
}

const RecruiterDashboard: React.FC = () => {
  const [applicants, setApplicants] = useState<Applicant[]>([
    { id: 1, name: 'Hari Ram', role: 'React Engineer', score: '9.4/10', ats: 84, status: 'Under Review', email: 'hari@projects.com' },
    { id: 2, name: 'Vikram Singh', role: 'Node Developer', score: '8.2/10', ats: 76, status: 'Under Review', email: 'vikram@domain.com' },
    { id: 3, name: 'Priya Patel', role: 'System Architect', score: '9.0/10', ats: 88, status: 'Hired', email: 'priya@network.com' },
    { id: 4, name: 'Aarav Mehta', role: 'Fullstack Intern', score: '6.5/10', ats: 62, status: 'Rejected', email: 'aarav@interns.org' },
  ]);

  const [search, setSearch] = useState('');

  const handleUpdateStatus = (id: number, newStatus: 'Hired' | 'Rejected') => {
    setApplicants(
      applicants.map((app) => ({
        ...app,
        status: app.id === id ? newStatus : app.status,
      }))
    );
  };

  const filtered = applicants.filter((app) =>
    app.name.toLowerCase().includes(search.toLowerCase()) ||
    app.role.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Users className="h-6 w-6 text-indigo-400" /> Recruiter Evaluation Console
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Review placement pipeline metrics, audit applicant simulator records, and manage candidate offer updates.
        </p>
      </div>

      {/* Stats row */}
      <div className="grid gap-4 sm:grid-cols-3">
        <div className="rounded-2xl border border-slate-900 bg-slate-905/30 p-5 text-left">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Under Review</span>
          <span className="text-2xl font-black text-white mt-1 block">
            {applicants.filter((a) => a.status === 'Under Review').length} Candidates
          </span>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-905/30 p-5 text-left">
          <span className="text-[10px] text-slate-550 font-bold uppercase block text-emerald-450">Hired (Offers Issued)</span>
          <span className="text-2xl font-black text-emerald-450 mt-1 block">
            {applicants.filter((a) => a.status === 'Hired').length} Hires
          </span>
        </div>
        <div className="rounded-2xl border border-slate-900 bg-slate-905/30 p-5 text-left">
          <span className="text-[10px] text-slate-500 font-bold uppercase block">Total Pipeline</span>
          <span className="text-2xl font-black text-white mt-1 block">{applicants.length} Total</span>
        </div>
      </div>

      <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-5">
        <div className="flex justify-between items-center flex-wrap gap-4">
          <h3 className="text-sm font-bold text-slate-205 uppercase tracking-wider">Candidate Pipeline Table</h3>
          
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search candidate name or role..."
              className="w-full rounded-xl bg-slate-950 border border-slate-900 pl-9 pr-4 py-2 text-xs text-slate-205 outline-none focus:border-indigo-650"
            />
          </div>
        </div>

        {/* Table layout */}
        <div className="overflow-x-auto rounded-2xl border border-slate-900">
          <table className="w-full border-collapse text-left text-xs text-slate-400">
            <thead className="bg-slate-950 font-bold text-slate-350 border-b border-slate-900">
              <tr>
                <th className="p-4">Name</th>
                <th className="p-4">Target Role</th>
                <th className="p-4">Mock Score</th>
                <th className="p-4">ATS Match</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-900/40">
              {filtered.map((app) => (
                <tr key={app.id} className="hover:bg-slate-900/10 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-slate-200">{app.name}</div>
                    <div className="text-[10px] text-slate-500 mt-0.5">{app.email}</div>
                  </td>
                  <td className="p-4 font-semibold text-slate-300">{app.role}</td>
                  <td className="p-4 font-bold text-indigo-400">{app.score}</td>
                  <td className="p-4 font-bold text-slate-350">{app.ats}%</td>
                  <td className="p-4">
                    <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                      app.status === 'Hired'
                        ? 'bg-emerald-950/60 border border-emerald-900/30 text-emerald-450'
                        : app.status === 'Rejected'
                        ? 'bg-red-950/40 border border-red-900/40 text-red-400'
                        : 'bg-slate-900 border border-slate-800 text-slate-450'
                    }`}>
                      {app.status}
                    </span>
                  </td>
                  <td className="p-4 text-right flex justify-end gap-2.5">
                    {app.status === 'Under Review' && (
                      <>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Hired')}
                          className="rounded-lg border border-emerald-950 bg-emerald-950/10 p-1.5 text-emerald-400 hover:bg-emerald-600 hover:text-white transition"
                          title="Offer Position"
                        >
                          <CheckCircle className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleUpdateStatus(app.id, 'Rejected')}
                          className="rounded-lg border border-red-950 bg-red-950/10 p-1.5 text-red-400 hover:bg-red-600 hover:text-white transition"
                          title="Reject Candidate"
                        >
                          <XCircle className="h-4 w-4" />
                        </button>
                      </>
                    )}
                    <button className="rounded-lg border border-slate-800 bg-slate-950 p-1.5 text-slate-500 hover:text-white transition">
                      <Download className="h-4 w-4 text-indigo-400" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default RecruiterDashboard;
