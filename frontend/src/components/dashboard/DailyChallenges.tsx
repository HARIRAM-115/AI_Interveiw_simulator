import React, { useState } from 'react';
import { Trophy, CheckCircle, Clock, Zap, Star } from 'lucide-react';

interface Quest {
  id: number;
  task: string;
  xpReward: number;
  completed: boolean;
  type: string;
}

const DailyChallenges: React.FC = () => {
  const [quests, setQuests] = useState<Quest[]>([
    { id: 1, task: 'Complete 1 simulated AI technical mock interview', xpReward: 200, completed: false, type: 'Interview' },
    { id: 2, task: 'Solve 1 algorithmic code challenge', xpReward: 100, completed: true, type: 'Coding' },
    { id: 3, task: 'Audit keywords matching in Resume ATS analyzer', xpReward: 50, completed: true, type: 'Resume' },
    { id: 4, task: 'Ask 1 career query to AI Career Coach chatbot', xpReward: 50, completed: false, type: 'Coach' },
  ]);

  const toggleQuest = (id: number) => {
    setQuests(
      quests.map((q) => ({
        ...q,
        completed: q.id === id ? !q.completed : q.completed,
      }))
    );
  };

  // Calculations
  const completedCount = quests.filter((q) => q.completed).length;
  const progressPercent = Math.round((completedCount / quests.length) * 100);
  const totalXPEarned = quests.reduce((acc, q) => acc + (q.completed ? q.xpReward : 0), 0);

  return (
    <div className="space-y-6 fade-slide-up">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-2">
            <Trophy className="h-6 w-6 text-indigo-400" /> Daily Quests & Challenges
          </h1>
          <p className="text-slate-400 text-xs mt-1">
            Complete daily activities to earn additional experience points (XP) and secure leaderboards rankings.
          </p>
        </div>

        {/* Streak card */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-4 shrink-0 flex items-center gap-3">
          <Zap className="h-5 w-5 text-yellow-500 fill-yellow-500/20 animate-pulse shrink-0" />
          <div className="text-left">
            <p className="text-[10px] text-slate-550 font-bold uppercase">Active Streak</p>
            <p className="text-xs font-extrabold text-slate-100">12 Days Running</p>
          </div>
        </div>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Column: list of quests */}
        <div className="lg:col-span-3 space-y-4">
          {quests.map((q) => (
            <div
              key={q.id}
              onClick={() => toggleQuest(q.id)}
              className={`rounded-3xl border p-5 flex items-center justify-between cursor-pointer transition-all ${
                q.completed
                  ? 'bg-indigo-950/20 border-indigo-950/40 text-indigo-300'
                  : 'bg-slate-900/30 border-slate-900 text-slate-400 hover:border-slate-805'
              }`}
            >
              <div className="flex items-center gap-3.5">
                <button
                  className={`h-5 w-5 rounded-md border flex items-center justify-center transition-all ${
                    q.completed
                      ? 'bg-indigo-500 border-indigo-400 text-white'
                      : 'border-slate-800 bg-slate-900 hover:border-slate-600'
                  }`}
                >
                  {q.completed && <CheckCircle className="h-4 w-4 text-white fill-indigo-500" />}
                </button>
                <div>
                  <p className={`text-xs font-bold ${q.completed ? 'line-through text-slate-500' : 'text-slate-205'}`}>{q.task}</p>
                  <span className="text-[9px] text-slate-550 font-bold uppercase block mt-1">{q.type} quest</span>
                </div>
              </div>

              <div className="text-right shrink-0 ml-3">
                <span className={`text-xs font-black ${q.completed ? 'text-indigo-400' : 'text-slate-400'}`}>+{q.xpReward} XP</span>
              </div>
            </div>
          ))}
        </div>

        {/* Right Column: summary statistics */}
        <div className="lg:col-span-2 space-y-6">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-5">
            <div>
              <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider">Quest Progression</h3>
              <p className="text-[10px] text-slate-500 mt-0.5">Progress resets daily at midnight UTC</p>
            </div>

            <div className="space-y-4">
              <div className="flex justify-between items-center text-xs">
                <span className="text-slate-400 font-semibold">Quests Finished</span>
                <span className="font-bold text-slate-200">{completedCount} of {quests.length}</span>
              </div>

              <div className="w-full bg-slate-950 border border-slate-900 rounded-full h-2 overflow-hidden">
                <div className="bg-indigo-500 h-full rounded-full transition-all duration-300" style={{ width: `${progressPercent}%` }} />
              </div>

              <div className="flex justify-between items-center text-xs pt-2 border-t border-slate-905">
                <span className="text-slate-400 font-semibold">XP Earned Today</span>
                <span className="font-extrabold text-indigo-400">+{totalXPEarned} XP</span>
              </div>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-5 flex items-start gap-2.5">
            <Star className="h-4.5 w-4.5 text-yellow-500 fill-yellow-500/10 shrink-0 mt-0.5" />
            <p className="text-[10px] text-slate-450 leading-relaxed font-sans">
              Keep your streak alive! Reaching a 15-day streak unlocks the **"Consistent Achiever"** profile badge and increases daily XP bonus multiplier metrics.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DailyChallenges;
