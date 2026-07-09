import React, { useState } from 'react';
import { TrendingUp, Briefcase, MapPin, DollarSign, CheckCircle2, ArrowUpRight } from 'lucide-react';

interface Job {
  id: number;
  role: string;
  company: string;
  location: string;
  type: 'Remote' | 'Hybrid' | 'On-site';
  salary: string;
  matchPct: number;
  matchingSkills: string[];
  missingSkills: string[];
}

const JobRecommendations: React.FC = () => {
  const jobs: Job[] = [
    {
      id: 1,
      role: 'Frontend Engineer (React)',
      company: 'Acme Technologies',
      location: 'San Francisco, CA',
      type: 'Remote',
      salary: '$120,000 - $140,000',
      matchPct: 94,
      matchingSkills: ['React', 'TypeScript', 'JavaScript', 'CSS Modules'],
      missingSkills: ['Kubernetes'],
    },
    {
      id: 2,
      role: 'Fullstack Software Developer',
      company: 'Cyberdyne Systems',
      location: 'Austin, TX',
      type: 'Hybrid',
      salary: '$130,000 - $155,000',
      matchPct: 86,
      matchingSkills: ['Node.js', 'React', 'SQL', 'TypeScript'],
      missingSkills: ['System Design', 'CI/CD Pipelines'],
    },
    {
      id: 3,
      role: 'Software Architect (Node.js)',
      company: 'Globex Corporation',
      location: 'New York, NY',
      type: 'On-site',
      salary: '$160,000 - $190,000',
      matchPct: 72,
      matchingSkills: ['Node.js', 'SQL', 'JavaScript'],
      missingSkills: ['System Architecture', 'AWS Solutions'],
    },
  ];

  const [appliedJobs, setAppliedJobs] = useState<{ [key: number]: boolean }>({});

  const handleApply = (id: number) => {
    setAppliedJobs({
      ...appliedJobs,
      [id]: !appliedJobs[id],
    });
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <TrendingUp className="h-6 w-6 text-indigo-400" /> AI Job Recommendations
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Explore customized career matches selected dynamically based on your parsed skills, experience, and interview performance metrics.
        </p>
      </div>

      <div className="space-y-4">
        {jobs.map((job) => {
          const isApplied = appliedJobs[job.id];
          return (
            <div
              key={job.id}
              className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col md:flex-row justify-between items-start md:items-center gap-6 hover:border-slate-800 transition-all relative overflow-hidden"
            >
              {/* Left Column: Job Info */}
              <div className="space-y-3.5 flex-1">
                <div className="flex items-center gap-3 flex-wrap">
                  <div className="rounded-xl bg-indigo-950/50 border border-indigo-900/50 p-2.5 text-indigo-400 shrink-0">
                    <Briefcase className="h-5 w-5" />
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base flex items-center gap-2">
                      {job.role}
                      <span className="text-slate-500 font-normal">at {job.company}</span>
                    </h3>
                    
                    <div className="flex items-center gap-4 text-xs text-slate-500 mt-1 flex-wrap font-medium">
                      <span className="flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {job.location} ({job.type})</span>
                      <span className="flex items-center gap-1"><DollarSign className="h-3.5 w-3.5" /> {job.salary}</span>
                    </div>
                  </div>
                </div>

                <div className="space-y-1.5 pt-1.5">
                  <div className="flex flex-wrap gap-1.5">
                    {job.matchingSkills.map((s) => (
                      <span key={s} className="rounded bg-emerald-950/20 border border-emerald-900/35 px-2 py-0.5 text-[10px] text-emerald-450 font-bold">
                        {s}
                      </span>
                    ))}
                    {job.missingSkills.map((s) => (
                      <span key={s} className="rounded bg-slate-950 border border-slate-900 px-2 py-0.5 text-[10px] text-slate-500">
                        Missing: {s}
                      </span>
                    ))}
                  </div>
                </div>
              </div>

              {/* Right Column: Compatibility score & Apply trigger */}
              <div className="flex items-center gap-6 shrink-0 w-full md:w-auto justify-between md:justify-end border-t border-slate-900 pt-4 md:pt-0 md:border-0">
                <div className="text-right">
                  <span className={`text-base font-black ${
                    job.matchPct >= 90 ? 'text-emerald-450' : job.matchPct >= 80 ? 'text-indigo-400' : 'text-slate-550'
                  }`}>
                    {job.matchPct}% Compatibility
                  </span>
                  <span className="text-[9px] text-slate-500 block uppercase font-bold mt-0.5">AI Suitability Match</span>
                </div>

                <button
                  onClick={() => handleApply(job.id)}
                  className={`rounded-xl px-5 py-2.5 text-xs font-bold transition flex items-center gap-1.5 ${
                    isApplied
                      ? 'bg-slate-950 border border-slate-900 text-slate-400'
                      : 'bg-indigo-650 text-white hover:bg-indigo-600 shadow-md hover:shadow-indigo-900/10'
                  }`}
                >
                  {isApplied ? (
                    <>
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-450 shrink-0" /> Applied
                    </>
                  ) : (
                    <>
                      Apply Now <ArrowUpRight className="h-3.5 w-3.5" />
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default JobRecommendations;
