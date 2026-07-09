import React, { useState } from 'react';
import { Calendar, Eye, Search, Filter, HelpCircle, ArrowLeft, FileText, ChevronLeft } from 'lucide-react';

interface InterviewHistoryProps {
  interviews: any[];
  onViewDetails: (id: string) => void;
}

const InterviewHistory: React.FC<InterviewHistoryProps> = ({ interviews, onViewDetails }) => {
  const [search, setSearch] = useState('');
  const [difficultyFilter, setDifficultyFilter] = useState('All');
  const [typeFilter, setTypeFilter] = useState('All');

  // Filter logic
  const filtered = interviews.filter((int) => {
    const matchesSearch = int.role.toLowerCase().includes(search.toLowerCase()) || 
                          (int.company && int.company.toLowerCase().includes(search.toLowerCase()));
    const matchesDifficulty = difficultyFilter === 'All' || int.difficulty === difficultyFilter;
    const matchesType = typeFilter === 'All' || int.type === typeFilter;
    return matchesSearch && matchesDifficulty && matchesType;
  });

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Calendar className="h-6 w-6 text-indigo-400" /> Training Assessment History
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Browse, filter, and audit detailed feedback matrices for all past simulated interview evaluations.
        </p>
      </div>

      <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-6">
        {/* Search and filters controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by role or company..."
              className="w-full rounded-xl bg-slate-950 border border-slate-900 pl-9 pr-4 py-2.5 text-xs text-slate-205 outline-none focus:border-indigo-650"
            />
          </div>

          <div className="flex gap-3 w-full md:w-auto">
            <div className="flex-1 md:flex-none">
              <select
                value={difficultyFilter}
                onChange={(e) => setDifficultyFilter(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3 py-2.5 text-xs text-indigo-350 outline-none focus:border-indigo-650"
              >
                <option value="All">All Difficulties</option>
                <option value="Junior">Junior</option>
                <option value="Mid">Mid</option>
                <option value="Senior">Senior</option>
              </select>
            </div>
            <div className="flex-1 md:flex-none">
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3 py-2.5 text-xs text-indigo-355 outline-none focus:border-indigo-650"
              >
                <option value="All">All Formats</option>
                <option value="Mixed">Mixed</option>
                <option value="Technical">Technical</option>
                <option value="Behavioral">Behavioral</option>
              </select>
            </div>
          </div>
        </div>

        {/* List table */}
        {filtered.length > 0 ? (
          <div className="divide-y divide-slate-900 overflow-hidden">
            {filtered.map((int) => (
              <div
                key={int._id}
                className="flex items-center justify-between py-4 transition hover:bg-slate-900/10 px-2 rounded-xl"
              >
                <div className="flex items-center gap-3">
                  <div className="rounded-xl bg-slate-950 border border-slate-900 p-2.5 text-indigo-400">
                    <Calendar className="h-4.5 w-4.5" />
                  </div>
                  <div>
                    <h4 className="font-bold text-slate-200 text-sm">
                      {int.role} {int.company && int.company !== 'None' ? `@ ${int.company}` : ''}
                    </h4>
                    <div className="flex items-center gap-2.5 text-[10px] text-slate-500 mt-0.5 font-medium">
                      <span className="capitalize">{int.type || 'Mixed'} Mock</span>
                      <span>&bull;</span>
                      <span>{int.difficulty} Tier</span>
                      <span>&bull;</span>
                      <span>{new Date(int.createdAt).toLocaleDateString()}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  {int.completed ? (
                    <span className="font-black text-sm text-indigo-400">{int.overallScore}/10</span>
                  ) : (
                    <span className="rounded bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 text-[9px] text-amber-450 font-bold uppercase">
                      Incomplete
                    </span>
                  )}
                  <button
                    onClick={() => onViewDetails(int._id)}
                    className="flex items-center gap-1.5 rounded-lg border border-slate-800 bg-slate-900 px-3 py-1.5 text-xs text-slate-350 hover:bg-slate-850 hover:text-white"
                  >
                    <Eye className="h-3.5 w-3.5" /> Details
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="rounded-2xl border border-dashed border-slate-800 p-8 text-center text-slate-500">
            <HelpCircle className="mx-auto h-8 w-8 text-slate-655 mb-2" />
            <p className="text-sm font-semibold">No interview records match your filter constraints.</p>
            <p className="text-xs mt-1 text-slate-655">Try modifying your search or dropdown parameters.</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InterviewHistory;
