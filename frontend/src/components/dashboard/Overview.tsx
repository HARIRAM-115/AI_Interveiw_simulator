import React from 'react';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from 'recharts';
import {
  FileText,
  Video,
  Code,
  CheckCircle,
  MessageSquare,
  Zap,
  Award,
  Calendar,
  ArrowUpRight,
  Sparkles,
} from 'lucide-react';

interface OverviewProps {
  profile: { name: string; email: string; role: string } | null;
  resumeSummary: any;
  interviews: any[];
}

const Overview: React.FC<OverviewProps> = ({ profile, resumeSummary, interviews }) => {
  // 1. Calculate KPI Metrics
  const resumeScore = resumeSummary?.atsScore || 78;
  const completedInterviews = interviews.filter((i) => i.completed);
  const interviewScoreCount = completedInterviews.length;
  const avgInterviewScore = interviewScoreCount
    ? Math.round((completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / interviewScoreCount) * 10)
    : 65;
  const codingScore = 82;
  const atsScore = resumeSummary?.atsScore || 74;
  const communicationScore = 88;
  const streak = 12;
  const xp = 2450;
  const weeklyProgress = 70;

  // 2. Format Charts Data (Unified Indigo Palettes)
  const lineData = completedInterviews.length > 0 
    ? completedInterviews.slice().reverse().map((int, index) => ({
        name: `Mock ${index + 1}`,
        Score: int.overallScore * 10,
        ATS: resumeScore,
      }))
    : [
        { name: 'Week 1', Score: 60, ATS: 70 },
        { name: 'Week 2', Score: 68, ATS: 70 },
        { name: 'Week 3', Score: 72, ATS: 75 },
        { name: 'Week 4', Score: 75, ATS: 78 },
        { name: 'Week 5', Score: 85, ATS: 82 },
      ];

  const barData = [
    { name: 'Arrays', Score: 88 },
    { name: 'Strings', Score: 92 },
    { name: 'Linked List', Score: 75 },
    { name: 'Trees', Score: 68 },
    { name: 'Dynamic Prog', Score: 58 },
    { name: 'Graphs', Score: 65 },
  ];

  const pieData = [
    { name: 'React', value: 35 },
    { name: 'Node.js', value: 25 },
    { name: 'System Design', value: 20 },
    { name: 'Behavioral', value: 20 },
  ];
  const COLORS = ['#6366f1', '#4f46e5', '#818cf8', '#312e81'];

  const radarData = [
    { subject: 'Technical skills', A: 85, fullMark: 100 },
    { subject: 'Communication', A: 90, fullMark: 100 },
    { subject: 'Coding Speed', A: 75, fullMark: 100 },
    { subject: 'System Design', A: 68, fullMark: 100 },
    { subject: 'Problem Solving', A: 82, fullMark: 100 },
    { subject: 'Leadership', A: 80, fullMark: 100 },
  ];

  const daysInYear = 53 * 7;
  const activityData = Array.from({ length: daysInYear }).map((_, i) => {
    const level = i % 13 === 0 || i % 29 === 0 
      ? 3 
      : i % 7 === 0 || i % 17 === 0 
      ? 2 
      : i % 4 === 0 
      ? 1 
      : 0;
    return level;
  });

  return (
    <div className="space-y-8 fade-slide-up">
      {/* Welcome Banner */}
      <div className="rounded-3xl border border-slate-900 bg-gradient-to-r from-slate-900/30 via-indigo-950/20 to-indigo-900/10 p-6 md:p-8 relative overflow-hidden">
        <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <span className="text-xs font-bold uppercase tracking-wider text-indigo-400 flex items-center gap-1.5 mb-1.5">
              <Sparkles className="h-3.5 w-3.5" /> Candidate Hub
            </span>
            <h1 className="text-3xl font-extrabold tracking-tight text-white">
              Welcome back, {profile?.name || 'Candidate'}!
            </h1>
            <p className="mt-1 text-slate-400 text-sm max-w-xl leading-relaxed">
              Your preparation status is **Strong**. Focus on dynamic programming and system design to optimize your suitability match.
            </p>
          </div>
          <div className="flex items-center gap-3 bg-slate-900/60 border border-slate-800 rounded-2xl p-4 shrink-0 shadow-lg">
            <Zap className="h-6 w-6 text-indigo-400 animate-pulse shrink-0" />
            <div>
              <p className="text-xs text-slate-550 font-bold uppercase">Daily Goal Status</p>
              <p className="text-sm font-extrabold text-slate-100 font-mono">80% Done &bull; +200 XP</p>
            </div>
          </div>
        </div>
      </div>

      {/* Unified Classic KPI Cards Grid */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {/* KPI 1: Resume Score */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex items-center justify-between shadow-sm relative group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505 block">Resume Score</span>
            <p className="text-2xl font-black text-white font-mono">{resumeScore}/100</p>
            <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-0.5">
              Good status <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-900/40 p-3 text-indigo-400">
            <FileText className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 2: Interview Score */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex items-center justify-between shadow-sm relative group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505 block">Interview Score</span>
            <p className="text-2xl font-black text-white font-mono">
              {avgInterviewScore >= 10 ? `${(avgInterviewScore/10).toFixed(1)}/10` : '8.2/10'}
            </p>
            <span className="text-[10px] text-indigo-400 font-bold flex items-center gap-0.5">
              Target active <ArrowUpRight className="h-3 w-3" />
            </span>
          </div>
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-900/40 p-3 text-indigo-400">
            <Video className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 3: Coding Score */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex items-center justify-between shadow-sm relative group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505 block">Coding Score</span>
            <p className="text-2xl font-black text-white font-mono">{codingScore}%</p>
            <span className="text-[10px] text-indigo-450 font-bold">Top 15% rank</span>
          </div>
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-900/40 p-3 text-indigo-400">
            <Code className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 4: ATS Score */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex items-center justify-between shadow-sm relative group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505 block">ATS Score</span>
            <p className="text-2xl font-black text-white font-mono">{atsScore}/100</p>
            <span className="text-[10px] text-indigo-400 font-bold">Tech Optimized</span>
          </div>
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-900/40 p-3 text-indigo-450">
            <CheckCircle className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 5: Communication Score */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex items-center justify-between shadow-sm relative group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505 block">Communication Score</span>
            <p className="text-2xl font-black text-white font-mono">{communicationScore}%</p>
            <span className="text-[10px] text-indigo-400 font-bold">Fluent & structured</span>
          </div>
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-900/40 p-3 text-indigo-400">
            <MessageSquare className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 6: Daily Streak */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex items-center justify-between shadow-sm relative group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505 block">Daily Streak</span>
            <p className="text-2xl font-black text-white font-mono">{streak} Days</p>
            <span className="text-[10px] text-indigo-400 font-bold">Keep active!</span>
          </div>
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-900/40 p-3 text-indigo-400">
            <Calendar className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 7: XP Points */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex items-center justify-between shadow-sm relative group">
          <div className="space-y-1">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505 block">XP Points</span>
            <p className="text-2xl font-black text-white font-mono">{xp}</p>
            <span className="text-[10px] text-indigo-400 font-bold">Level 12 Architect</span>
          </div>
          <div className="rounded-xl bg-indigo-950/40 border border-indigo-900/40 p-3 text-indigo-400">
            <Award className="h-5 w-5" />
          </div>
        </div>

        {/* KPI 8: Weekly Progress */}
        <div className="rounded-2xl border border-slate-900 bg-slate-900/30 p-5 hover:border-slate-800 transition-all flex flex-col justify-between shadow-sm relative group">
          <div className="flex items-center justify-between w-full">
            <span className="text-[10px] font-black uppercase tracking-wider text-slate-505">Weekly Progress</span>
            <span className="text-xs font-bold text-slate-350 font-mono">{weeklyProgress}%</span>
          </div>
          <div className="mt-3 w-full bg-slate-900 border border-slate-800 rounded-full h-2 overflow-hidden">
            <div
              className="bg-indigo-500 h-full rounded-full transition-all duration-300"
              style={{ width: `${weeklyProgress}%` }}
            />
          </div>
          <span className="text-[10px] text-slate-550 mt-1">Goal: 5 challenges / week</span>
        </div>
      </div>

      {/* Main Charts Row */}
      <div className="grid gap-6 md:grid-cols-2">
        {/* Chart 1: Performance Trend */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-202 uppercase tracking-wider">Score Progression Trend</h3>
            <p className="text-[10px] text-slate-500">Compare Interview scores alongside ATS matching scores</p>
          </div>
          <div className="h-64 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={lineData}>
                <defs>
                  <linearGradient id="scoreColorOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#6366f1" stopOpacity={0.25} />
                    <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                  </linearGradient>
                  <linearGradient id="atsColorOverview" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#818cf8" stopOpacity={0.15} />
                    <stop offset="95%" stopColor="#818cf8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#02010f', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Area type="monotone" dataKey="Score" stroke="#6366f1" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColorOverview)" name="Interview Score %" />
                <Area type="monotone" dataKey="ATS" stroke="#818cf8" strokeWidth={2} fillOpacity={1} fill="url(#atsColorOverview)" name="ATS Score %" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 2: Skill Competencies Radar */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-202 uppercase tracking-wider">Evaluation Dimensions</h3>
            <p className="text-[10px] text-slate-500">Comprehensive view across key interview parameters</p>
          </div>
          <div className="h-64 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart cx="50%" cy="50%" outerRadius="70%" data={radarData}>
                <PolarGrid stroke="#1e293b" />
                <PolarAngleAxis dataKey="subject" stroke="#94a3b8" fontSize={9} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} stroke="#475569" fontSize={9} />
                <Radar name="Candidate" dataKey="A" stroke="#6366f1" fill="#6366f1" fillOpacity={0.15} />
                <Tooltip contentStyle={{ backgroundColor: '#02010f', border: '1px solid #1e293b', borderRadius: '12px' }} />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Sub Charts Row */}
      <div className="grid gap-6 md:grid-cols-3">
        {/* Chart 3: Coding Category Strength */}
        <div className="md:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-202 uppercase tracking-wider">Coding Categories Accuracy</h3>
            <p className="text-[10px] text-slate-500">Success ratings on DSA challenges by topics</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={barData}>
                <XAxis dataKey="name" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis domain={[0, 100]} stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip
                  contentStyle={{ backgroundColor: '#02010f', border: '1px solid #1e293b', borderRadius: '12px' }}
                />
                <Bar dataKey="Score" fill="#6366f1" radius={[6, 6, 0, 0]} name="Accuracy %" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Chart 4: Time Allocation */}
        <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-202 uppercase tracking-wider">Training Balance</h3>
            <p className="text-[10px] text-slate-500">Preparation time breakdown by domain</p>
          </div>
          <div className="h-60 w-full flex items-center justify-center">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={pieData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={80}
                  paddingAngle={5}
                  dataKey="value"
                >
                  {pieData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip contentStyle={{ backgroundColor: '#02010f', border: '1px solid #1e293b', borderRadius: '12px' }} />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Chart 5: Calendar Activity Heatmap */}
      <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
        <div className="flex justify-between items-center">
          <div>
            <h3 className="text-sm font-bold text-slate-202 uppercase tracking-wider">Practice Consistency Activity</h3>
            <p className="text-[10px] text-slate-500">Your mock interview and coding activity tracking grid</p>
          </div>
          <div className="flex items-center gap-1.5 text-[9px] text-slate-555">
            <span>Less</span>
            <div className="h-2 w-2 rounded-sm bg-slate-900 border border-slate-800" />
            <div className="h-2 w-2 rounded-sm bg-indigo-950/60" />
            <div className="h-2 w-2 rounded-sm bg-indigo-805" />
            <div className="h-2 w-2 rounded-sm bg-indigo-500" />
            <span>More</span>
          </div>
        </div>

        <div className="w-full overflow-x-auto pb-2 scrollbar-thin">
          <div className="grid grid-flow-col grid-rows-7 gap-[3px] min-w-[700px]">
            {activityData.map((level, idx) => {
              const colorsMap = [
                'bg-slate-900/50 border border-slate-900/80',
                'bg-indigo-955/40 border border-indigo-900/30',
                'bg-indigo-800/80 border border-indigo-705/30',
                'bg-indigo-500 border border-indigo-400/30',
              ];
              return (
                <div
                  key={idx}
                  className={`h-2.5 w-2.5 rounded-[2px] transition-colors hover:scale-125 ${colorsMap[level]}`}
                  title={`Activity Level ${level}`}
                />
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Overview;
