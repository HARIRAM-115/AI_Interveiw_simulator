import React from 'react';
import { Medal, ShieldCheck, Zap, Code, FileText, MessageSquare, Star } from 'lucide-react';

interface Badge {
  id: number;
  title: string;
  desc: string;
  icon: React.ComponentType<any>;
  unlocked: boolean;
  dateEarned?: string;
  color: string;
}

const Achievements: React.FC = () => {
  const badges: Badge[] = [
    { id: 1, title: 'Consistent Achiever', desc: 'Secure a 10-day practice streak.', icon: Zap, unlocked: true, dateEarned: 'July 8, 2026', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20' },
    { id: 2, title: 'Algorithmic Master', desc: 'Solve 10 Medium or Hard coding challenges.', icon: Code, unlocked: true, dateEarned: 'July 5, 2026', color: 'text-cyan-400 bg-cyan-500/10 border-cyan-500/20' },
    { id: 3, title: 'ATS Approved', desc: 'Optimize resume ATS match score above 80%.', icon: FileText, unlocked: true, dateEarned: 'July 9, 2026', color: 'text-indigo-400 bg-indigo-500/10 border-indigo-500/20' },
    { id: 4, title: 'Perfect mock Score', desc: 'Secure a 10/10 rating in any simulated mock.', icon: Star, unlocked: false, color: 'text-pink-400 bg-pink-500/10 border-pink-500/20' },
    { id: 5, title: 'Eloquence Expert', desc: 'Attain 90%+ in communication rating tests.', icon: MessageSquare, unlocked: true, dateEarned: 'June 28, 2026', color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/20' },
    { id: 6, title: 'Verified Candidate', desc: 'Complete 3 company-specific prep evaluations.', icon: ShieldCheck, unlocked: false, color: 'text-violet-400 bg-violet-500/10 border-violet-500/20' },
  ];

  const unlockedCount = badges.filter((b) => b.unlocked).length;

  return (
    <div className="space-y-6 fade-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Medal className="h-6 w-6 text-indigo-400" /> Achievements & Badges
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Display your verified mock accomplishments and visual badges on public placement portfolios.
          </p>
        </div>

        {/* Progress summary card */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-4 shrink-0 flex items-center gap-4 shadow-md w-full sm:w-auto">
          <div>
            <p className="text-[10px] text-slate-550 font-bold uppercase">Badges Unlocked</p>
            <p className="text-xs font-extrabold text-slate-100">{unlockedCount} of {badges.length} Unlocked</p>
          </div>
          <div className="w-20 bg-slate-950 border border-slate-900 rounded-full h-2 overflow-hidden shrink-0">
            <div className="bg-indigo-500 h-full rounded-full" style={{ width: `${(unlockedCount / badges.length) * 100}%` }} />
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {badges.map((badge) => {
          const Icon = badge.icon;
          return (
            <div
              key={badge.id}
              className={`rounded-3xl border p-6 flex items-start gap-4 transition-all relative overflow-hidden ${
                badge.unlocked
                  ? 'bg-slate-900/30 border-slate-900 hover:border-slate-800'
                  : 'bg-slate-950/20 border-slate-950 opacity-55'
              }`}
            >
              {/* Badge Icon container */}
              <div className={`rounded-2xl p-3 border shrink-0 ${badge.unlocked ? badge.color : 'text-slate-650 bg-slate-900/40 border-slate-900'}`}>
                <Icon className="h-6 w-6" />
              </div>

              <div className="space-y-1.5 min-w-0">
                <h3 className="font-extrabold text-slate-205 text-sm sm:text-base leading-snug truncate">{badge.title}</h3>
                <p className="text-xs text-slate-450 leading-relaxed font-sans">{badge.desc}</p>
                {badge.unlocked && badge.dateEarned ? (
                  <span className="text-[9px] text-emerald-450 font-bold uppercase tracking-wider block mt-1.5">Unlocked {badge.dateEarned}</span>
                ) : (
                  <span className="text-[9px] text-slate-550 font-bold uppercase tracking-wider block mt-1.5">Locked</span>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Achievements;
