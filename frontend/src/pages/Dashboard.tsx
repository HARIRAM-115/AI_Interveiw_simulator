import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile, getInterviews, getInterviewDetails } from '../services/api';
import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  Tooltip as RechartsTooltip,
  BarChart,
  Bar,
} from 'recharts';
import {
  Briefcase,
  Layers,
  Sparkles,
  TrendingUp,
  Award,
  Calendar,
  User,
  Mail,
  FileText,
  LogOut,
  Plus,
  BarChart2,
  PieChart,
  ChevronLeft,
  Eye,
  AlertCircle,
  HelpCircle,
  Upload,
} from 'lucide-react';

const Dashboard = () => {
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [resumeSummary, setResumeSummary] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadDashboardData = async () => {
      try {
        setLoading(true);
        // Load Profile
        const profileRes = await getProfile();
        setProfile(profileRes.data.data);

        // Load Past Interviews
        const interviewsRes = await getInterviews();
        setInterviews(interviewsRes.data.data || []);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to sync dashboard analytics');
      } finally {
        setLoading(false);
      }
    };

    loadDashboardData();

    // Check localStorage for latest resume parsing
    const storedResume = localStorage.getItem('latestResume');
    if (storedResume) {
      try {
        setResumeSummary(JSON.parse(storedResume));
      } catch {
        setResumeSummary(null);
      }
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  const handleViewDetails = async (id: string) => {
    try {
      setLoading(true);
      const res = await getInterviewDetails(id);
      setSelectedInterview(res.data.data);
    } catch (err: any) {
      setError('Could not fetch interview logs.');
    } finally {
      setLoading(false);
    }
  };

  // Compute stat metrics
  const completedInterviews = interviews.filter((i) => i.completed);
  const totalInterviewsCount = completedInterviews.length;
  const avgScore = totalInterviewsCount
    ? Math.round((completedInterviews.reduce((sum, i) => sum + (i.overallScore || 0), 0) / totalInterviewsCount) * 10) / 10
    : 0;
  const bestScore = totalInterviewsCount
    ? Math.max(...completedInterviews.map((i) => i.overallScore || 0))
    : 0;

  // Chart data formatting
  const trendData = completedInterviews
    .slice()
    .reverse()
    .map((int) => ({
      date: new Date(int.createdAt).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }),
      Score: int.overallScore,
      Role: int.role,
    }));

  // Skill category analysis data
  const roleScoreMap: { [key: string]: { total: number; count: number } } = {};
  completedInterviews.forEach((int) => {
    const roleName = int.role.split(' ')[0] || 'Engineer';
    if (!roleScoreMap[roleName]) {
      roleScoreMap[roleName] = { total: 0, count: 0 };
    }
    roleScoreMap[roleName].total += int.overallScore || 0;
    roleScoreMap[roleName].count += 1;
  });

  const categoryData = Object.keys(roleScoreMap).map((roleName) => ({
    name: roleName,
    AverageScore: Math.round((roleScoreMap[roleName].total / roleScoreMap[roleName].count) * 10) / 10,
  }));

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 selection:bg-indigo-500 selection:text-white">
      {/* Top Banner Navigation */}
      <nav className="border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-50 px-4 md:px-8 py-4">
        <div className="mx-auto flex max-w-7xl items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-gradient-to-tr from-indigo-500 to-violet-600 p-2.5">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <div>
              <span className="font-bold tracking-tight text-white text-lg">AI Interview</span>
              <span className="ml-2 rounded bg-slate-900 border border-slate-800 px-1.5 py-0.5 text-[10px] text-slate-400 font-semibold uppercase">Simulator</span>
            </div>
          </div>

          <div className="flex items-center gap-4">
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-4 py-2 text-sm font-semibold text-slate-400 hover:bg-slate-850 hover:text-white transition-all"
            >
              <LogOut className="h-4 w-4" /> Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Container */}
      <main className="mx-auto max-w-7xl px-4 md:px-8 py-10 space-y-8">
        {error && (
          <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-red-300">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
            <p className="text-sm">{error}</p>
          </div>
        )}

        {/* Dashboard Grid Header */}
        <div className="flex flex-col gap-6 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-extrabold tracking-tight bg-gradient-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent">
              Welcome Back{profile ? `, ${profile.name}` : ''}
            </h1>
            <p className="mt-1 text-slate-400 text-sm">
              Assess your performance trends, review feedback, and start simulated training sessions.
            </p>
          </div>

          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/resume-upload')}
              className="flex items-center gap-2 rounded-full border border-slate-800 bg-slate-900 px-5 py-3 text-sm font-bold text-slate-250 transition hover:bg-slate-850 hover:text-white"
            >
              <Upload className="h-4 w-4 text-indigo-400" /> Upload Resume
            </button>
            <button
              onClick={() => navigate('/interview')}
              className="flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 to-violet-600 px-6 py-3 text-sm font-bold text-white shadow-lg shadow-indigo-900/20 transition hover:brightness-115 active:scale-[0.98]"
            >
              <Plus className="h-4.5 w-4.5" /> Start AI Interview
            </button>
          </div>
        </div>

        {/* PERSISTED STAT CARDS */}
        <div className="grid gap-5 sm:grid-cols-3">
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Total Interviews</span>
              <p className="text-3xl font-black text-white mt-1.5">{totalInterviewsCount}</p>
            </div>
            <div className="rounded-2xl bg-indigo-950/40 border border-indigo-900/30 p-3.5">
              <Briefcase className="h-6 w-6 text-indigo-400" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Average AI Score</span>
              <p className="text-3xl font-black text-white mt-1.5">{avgScore}/10</p>
            </div>
            <div className="rounded-2xl bg-violet-950/40 border border-violet-900/30 p-3.5">
              <Award className="h-6 w-6 text-violet-400" />
            </div>
          </div>

          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 flex items-center justify-between shadow-sm">
            <div>
              <span className="text-xs font-bold uppercase tracking-wider text-slate-400">Top Evaluation Score</span>
              <p className="text-3xl font-black text-white mt-1.5">{bestScore}/10</p>
            </div>
            <div className="rounded-2xl bg-emerald-950/40 border border-emerald-900/30 p-3.5">
              <TrendingUp className="h-6 w-6 text-emerald-400" />
            </div>
          </div>
        </div>

        {/* DETAILED RESULTS DRAWER (IF SELECTED) */}
        {selectedInterview && (
          <div className="rounded-3xl border border-slate-800 bg-slate-900/50 p-6 md:p-8 space-y-6 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <button
                onClick={() => setSelectedInterview(null)}
                className="flex items-center gap-1 text-xs text-indigo-400 font-bold hover:underline"
              >
                <ChevronLeft className="h-3.5 w-3.5" /> Back to History
              </button>
              <div className="rounded-full bg-indigo-950/60 border border-indigo-900 px-3.5 py-1 text-xs font-bold text-indigo-350">
                Score {selectedInterview.overallScore}/10
              </div>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              <div className="md:col-span-2 space-y-4">
                <h3 className="text-xl font-bold text-white flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" /> Interview Report Details
                </h3>
                <div className="text-slate-350 bg-slate-950/30 border border-slate-900 p-4 rounded-2xl text-sm leading-relaxed">
                  <span className="font-bold text-slate-200 block mb-1">Overall Summary Assessment:</span>
                  {selectedInterview.overallFeedback}
                </div>

                <div className="space-y-4">
                  {selectedInterview.questions.map((q: string, idx: number) => {
                    const evaluation = selectedInterview.evaluations.find((e: any) => e.questionIndex === idx) || {};
                    return (
                      <div key={idx} className="bg-slate-900/20 border border-slate-900/80 rounded-2xl p-4 space-y-3">
                        <div className="flex items-center justify-between text-xs font-bold border-b border-slate-900 pb-2">
                          <span className="text-indigo-400">Question {idx + 1}</span>
                          <span className="text-slate-300">Score: {evaluation.score || 0}/10</span>
                        </div>
                        <p className="text-slate-200 font-semibold text-sm">{q}</p>
                        <p className="text-slate-400 text-sm italic">
                          "{(selectedInterview.answers && selectedInterview.answers[idx]) || 'No answer provided.'}"
                        </p>
                        <p className="text-slate-350 text-sm">{evaluation.feedback}</p>
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Sidebar metadata */}
              <div className="space-y-6">
                <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4">
                  <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300 border-b border-slate-950 pb-2">Session Audit</h4>
                  <div className="space-y-3 text-sm">
                    <p className="flex justify-between">
                      <span className="text-slate-500">Role:</span>
                      <span className="font-semibold text-slate-200">{selectedInterview.role}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Difficulty:</span>
                      <span className="font-semibold text-slate-200">{selectedInterview.difficulty}</span>
                    </p>
                    <p className="flex justify-between">
                      <span className="text-slate-500">Date Completed:</span>
                      <span className="font-semibold text-slate-200">
                        {new Date(selectedInterview.createdAt).toLocaleDateString()}
                      </span>
                    </p>
                  </div>
                </div>

                {resumeSummary && (
                  <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-3">
                    <h4 className="text-sm font-bold uppercase tracking-wider text-slate-300">Related Skills</h4>
                    <div className="flex flex-wrap gap-1.5">
                      {selectedInterview.skills?.map((sk: string) => (
                        <span key={sk} className="rounded-lg bg-indigo-950/20 border border-indigo-900/30 px-2.5 py-1 text-xs text-indigo-300">
                          {sk}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* ANALYTICS CHARTS SECTION */}
        {totalInterviewsCount > 0 && !selectedInterview && (
          <div className="grid gap-6 md:grid-cols-2">
            {/* Performance Trend chart */}
            <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
                <BarChart2 className="h-5 w-5 text-indigo-400" /> Score Progression
              </h3>
              <div className="h-64 w-full">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={trendData}>
                    <defs>
                      <linearGradient id="scoreColor" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#6366f1" stopOpacity={0.4} />
                        <stop offset="95%" stopColor="#6366f1" stopOpacity={0} />
                      </linearGradient>
                    </defs>
                    <XAxis dataKey="date" stroke="#64748b" fontSize={11} tickLine={false} />
                    <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                    />
                    <Area type="monotone" dataKey="Score" stroke="#818cf8" strokeWidth={2.5} fillOpacity={1} fill="url(#scoreColor)" />
                  </AreaChart>
                </ResponsiveContainer>
              </div>
            </div>

            {/* Category strengths chart */}
            <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
              <h3 className="text-base font-bold text-slate-300 flex items-center gap-2">
                <PieChart className="h-5 w-5 text-indigo-400" /> Topic Category Breakdown
              </h3>
              <div className="h-64 w-full">
                {categoryData.length > 0 ? (
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={categoryData}>
                      <XAxis dataKey="name" stroke="#64748b" fontSize={11} tickLine={false} />
                      <YAxis domain={[0, 10]} stroke="#64748b" fontSize={11} tickLine={false} />
                      <RechartsTooltip
                        contentStyle={{ backgroundColor: '#0f172a', border: '1px solid #1e293b', borderRadius: '12px' }}
                      />
                      <Bar dataKey="AverageScore" fill="#a78bfa" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                ) : (
                  <div className="flex h-full items-center justify-center text-slate-500 text-sm">
                    Gathering category statistics...
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* DASHBOARD BOTTOM SECTION: LISTINGS & PROFILE */}
        <div className="grid gap-6 md:grid-cols-3">
          {/* Past Interviews List */}
          <div className="md:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
            <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
              <Calendar className="h-5 w-5 text-indigo-400" /> Training History
            </h3>
            {interviews.length > 0 ? (
              <div className="divide-y divide-slate-900 overflow-hidden">
                {interviews.map((int) => (
                  <div
                    key={int._id}
                    className="flex items-center justify-between py-4 transition hover:bg-slate-900/30 px-2 rounded-xl"
                  >
                    <div className="flex items-center gap-3">
                      <div className="rounded-xl bg-slate-900 border border-slate-800 p-2.5">
                        <Briefcase className="h-4.5 w-4.5 text-indigo-400" />
                      </div>
                      <div>
                        <p className="font-bold text-slate-200 text-sm">{int.role}</p>
                        <p className="text-slate-450 text-xs flex items-center gap-1.5 mt-0.5">
                          <span>{int.difficulty}</span>
                          <span>&bull;</span>
                          <span>{new Date(int.createdAt).toLocaleDateString()}</span>
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4">
                      {int.completed ? (
                        <span className="font-black text-sm text-indigo-400">{int.overallScore}/10</span>
                      ) : (
                        <span className="rounded bg-amber-950/40 border border-amber-900/30 px-2 py-0.5 text-[10px] text-amber-450 font-bold uppercase">
                          Incomplete
                        </span>
                      )}
                      <button
                        onClick={() => int.completed ? handleViewDetails(int._id) : navigate('/interview')}
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
                <HelpCircle className="mx-auto h-8 w-8 text-slate-600 mb-2" />
                <p className="text-sm font-semibold">No interviews completed yet.</p>
                <p className="text-xs mt-1 text-slate-650">Start your first simulated assessment from the top button.</p>
              </div>
            )}
          </div>

          {/* User profile & Resume Summary sidebar */}
          <div className="space-y-6">
            <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
              <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                <User className="h-5 w-5 text-indigo-400" /> Profile Details
              </h3>
              {profile ? (
                <div className="space-y-3.5 text-slate-350 text-sm">
                  <div className="flex items-center gap-2">
                    <User className="h-4 w-4 text-slate-555" />
                    <span>{profile.name}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Mail className="h-4 w-4 text-slate-555" />
                    <span>{profile.email}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <Layers className="h-4 w-4 text-slate-555" />
                    <span className="capitalize">{profile.role} Candidate</span>
                  </div>
                </div>
              ) : (
                <p className="text-slate-500 text-sm">Loading user account profile...</p>
              )}
            </div>

            {resumeSummary && (
              <div className="rounded-3xl border border-slate-900 bg-slate-900/20 p-6 space-y-4">
                <h3 className="text-lg font-bold text-slate-200 flex items-center gap-2">
                  <FileText className="h-5 w-5 text-indigo-400" /> Extracted Resume
                </h3>
                <div>
                  <p className="text-slate-250 font-bold text-xs truncate">{resumeSummary.originalFileName}</p>
                  <p className="text-[10px] text-slate-500 mt-0.5">Uploaded {new Date(resumeSummary.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="flex flex-wrap gap-1">
                  {resumeSummary.skills?.slice(0, 10).map((skill: string) => (
                    <span key={skill} className="rounded bg-indigo-950/20 border border-indigo-900/20 px-2 py-0.5 text-[10px] text-indigo-350">
                      {skill}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
