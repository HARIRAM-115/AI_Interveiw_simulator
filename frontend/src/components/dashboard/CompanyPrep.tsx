import React from 'react';
import { Briefcase, ArrowRight, ShieldCheck, Sparkles, Star } from 'lucide-react';

interface CompanyPrepProps {
  onStartCompanyInterview: (companyName: string) => void;
}

interface CompanyItem {
  name: string;
  logoColor: string;
  difficulty: 'Hard' | 'Medium' | 'Easy';
  format: string;
  focusSkills: string[];
  successRating: number;
  description: string;
}

const CompanyPrep: React.FC<CompanyPrepProps> = ({ onStartCompanyInterview }) => {
  const companies: CompanyItem[] = [
    {
      name: 'Google',
      logoColor: 'from-blue-500 via-red-500 to-yellow-500',
      difficulty: 'Hard',
      format: 'Algorithmic + System Design',
      focusSkills: ['Graphs', 'Dynamic Programming', 'Scalability', 'Go/C++'],
      successRating: 94,
      description: 'Focuses heavily on raw problem solving, complex data structures, and distributed systems architecture.',
    },
    {
      name: 'Amazon',
      logoColor: 'from-amber-500 to-orange-600',
      difficulty: 'Hard',
      format: 'STAR behavioral + DSA',
      focusSkills: ['Leadership Principles', 'Object Oriented Design', 'Trees', 'System Design'],
      successRating: 88,
      description: 'Split 50/50 between technical expertise and showing alignment with the 16 Leadership Principles.',
    },
    {
      name: 'Zoho',
      logoColor: 'from-red-500 via-green-500 to-blue-500',
      difficulty: 'Medium',
      format: 'Technical Round + Logic Builder',
      focusSkills: ['Java/C', 'DBMS', 'OOP concepts', 'Data Structures'],
      successRating: 82,
      description: 'Evaluates your logical coding capabilities, clean syntax, database normalization, and algorithms.',
    },
    {
      name: 'TCS',
      logoColor: 'from-blue-600 to-indigo-850',
      difficulty: 'Easy',
      format: 'NQT Aptitude + Technical Basic',
      focusSkills: ['Python/Java', 'C basics', 'SQL Queries', 'Software Engineering'],
      successRating: 75,
      description: 'Tests foundation parameters, fundamental programming syntax, OOPS, and relational database skills.',
    },
    {
      name: 'Infosys',
      logoColor: 'from-blue-500 to-cyan-500',
      difficulty: 'Easy',
      format: 'HackWithInfy Coding + Technical',
      focusSkills: ['Java', 'SQL', 'Algorithms', 'Web Basics'],
      successRating: 77,
      description: 'Focuses on structured programming, logical flow, data structures basics, and database systems.',
    },
    {
      name: 'Accenture',
      logoColor: 'from-purple-600 to-pink-600',
      difficulty: 'Medium',
      format: 'Cognitive Assessment + Technical Mock',
      focusSkills: ['Cloud Services', 'Agile Principles', 'Java/JS', 'Scenario Solving'],
      successRating: 80,
      description: 'Tests behavioral scenarios, basic cloud infrastructure patterns, general technical logic, and communication.',
    },
  ];

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Briefcase className="h-6 w-6 text-indigo-400" /> Company-Specific Interview Prep
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Simulate official hiring interviews modeled after real assessment structures from top tech enterprises.
        </p>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {companies.map((company) => (
          <div
            key={company.name}
            className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex flex-col justify-between hover:border-slate-800 transition-all relative overflow-hidden group"
          >
            {/* Top row */}
            <div className="space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-3">
                  <div className={`h-10 w-10 rounded-xl bg-gradient-to-tr ${company.logoColor} p-0.5 shrink-0 flex items-center justify-center`}>
                    <div className="h-full w-full bg-slate-950 rounded-[10px] flex items-center justify-center font-extrabold text-white text-sm">
                      {company.name[0]}
                    </div>
                  </div>
                  <div>
                    <h3 className="font-extrabold text-slate-100 text-base">{company.name}</h3>
                    <span className="text-[10px] text-slate-500 font-semibold">{company.format}</span>
                  </div>
                </div>

                <span className={`rounded-full px-2 py-0.5 text-[9px] font-black uppercase tracking-wider ${
                  company.difficulty === 'Hard'
                    ? 'bg-red-950/40 border border-red-900/40 text-red-400'
                    : company.difficulty === 'Medium'
                    ? 'bg-amber-955/40 border border-amber-900/40 text-amber-450'
                    : 'bg-emerald-950/40 border border-emerald-900/40 text-emerald-450'
                }`}>
                  {company.difficulty}
                </span>
              </div>

              <p className="text-xs text-slate-400 leading-relaxed font-medium">
                {company.description}
              </p>

              <div className="space-y-1.5">
                <span className="text-[9px] font-black uppercase tracking-widest text-slate-500 block">Focus Topics</span>
                <div className="flex flex-wrap gap-1.5">
                  {company.focusSkills.map((s) => (
                    <span key={s} className="rounded bg-slate-950/60 border border-slate-900 px-2 py-0.5 text-[10px] text-slate-350">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Row */}
            <div className="mt-6 pt-4 border-t border-slate-900 flex justify-between items-center">
              <div className="flex items-center gap-1">
                <Star className="h-3.5 w-3.5 text-amber-500 fill-amber-500 shrink-0" />
                <span className="text-xs font-bold text-slate-200">{company.successRating}% compatibility</span>
              </div>
              
              <button
                onClick={() => onStartCompanyInterview(company.name)}
                className="flex items-center gap-1 rounded-xl bg-indigo-950/60 border border-indigo-900/50 px-3 py-1.5 text-xs text-indigo-300 hover:bg-indigo-600 hover:text-white transition-all font-semibold group-hover:translate-x-0.5"
              >
                Start Practice <ArrowRight className="h-3.5 w-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default CompanyPrep;
