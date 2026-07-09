import { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { getProfile, getInterviews, getInterviewDetails, getLeaderboard } from '../services/api';
import {
  Sparkles,
  ChevronLeft,
  FileText,
  AlertCircle,
  X,
  BookOpen,
} from 'lucide-react';

// Import newly created dashboard sub-modules
import Sidebar from '../components/dashboard/Sidebar';
import Overview from '../components/dashboard/Overview';
import CompanyPrep from '../components/dashboard/CompanyPrep';
import CodingChallenges from '../components/dashboard/CodingChallenges';
import AptitudePractice from '../components/dashboard/AptitudePractice';
import ResumeATS from '../components/dashboard/ResumeATS';
import CareerCoach from '../components/dashboard/CareerCoach';
import LearningRoadmap from '../components/dashboard/LearningRoadmap';
import GitHubAnalyzer from '../components/dashboard/GitHubAnalyzer';
import LinkedInOptimizer from '../components/dashboard/LinkedInOptimizer';
import CoverLetterGen from '../components/dashboard/CoverLetterGen';
import JobRecommendations from '../components/dashboard/JobRecommendations';
import ResumeManager from '../components/dashboard/ResumeManager';
import CertificateCenter from '../components/dashboard/CertificateCenter';
import DailyChallenges from '../components/dashboard/DailyChallenges';
import Achievements from '../components/dashboard/Achievements';
import InterviewHistory from '../components/dashboard/InterviewHistory';
import CommunityDiscussion from '../components/dashboard/CommunityDiscussion';
import RecruiterDashboard from '../components/dashboard/RecruiterDashboard';
import AdminDashboard from '../components/dashboard/AdminDashboard';
import SettingsPage from '../components/dashboard/SettingsPage';
import DownloadCenter from '../components/dashboard/DownloadCenter';
import VoiceEmotionBeta from '../components/dashboard/VoiceEmotionBeta';

const Dashboard = () => {
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [resumeSummary, setResumeSummary] = useState<any>(null);
  const [interviews, setInterviews] = useState<any[]>([]);
  const [selectedInterview, setSelectedInterview] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  
  // Navigation layouts
  const [activeTab, setActiveTab] = useState('overview');
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);

  // Skill Tutor Modal
  const [activeTutorSkill, setActiveTutorSkill] = useState<string | null>(null);
  const [tutorData, setTutorData] = useState<any | null>(null);
  const [tutorLoading, setTutorLoading] = useState(false);
  
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (location.state && (location.state as any).tab) {
      setActiveTab((location.state as any).tab);
    }
  }, [location]);

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

  // Render the appropriate main workspace panel based on activeTab
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <Overview profile={profile} resumeSummary={resumeSummary} interviews={interviews} />;
      case 'interview':
        // Clicking "interview" in the sidebar can render setup choices or redirect to the dedicated interview workspace page
        return (
          <div className="rounded-3xl border border-slate-900 bg-slate-905/30 p-8 max-w-xl mx-auto space-y-6 text-center fade-slide-up">
            <Sparkles className="h-12 w-12 text-indigo-400 mx-auto animate-bounce" />
            <div className="space-y-2">
              <h2 className="text-xl font-bold text-slate-100">AI Simulator Setup</h2>
              <p className="text-xs text-slate-400 max-w-sm mx-auto leading-relaxed">
                Configure your difficulty tier, focus topics, target companies, and start speaking or typing your solutions.
              </p>
            </div>
            <button
              onClick={() => navigate('/interview')}
              className="rounded-xl bg-gradient-to-r from-indigo-500 to-violet-650 px-6 py-3 text-xs font-bold text-white shadow-lg transition hover:brightness-110"
            >
              Configure & Start Interview
            </button>
          </div>
        );
      case 'history':
        return <InterviewHistory interviews={interviews} onViewDetails={handleViewDetails} />;
      case 'company-prep':
        return (
          <CompanyPrep
            onStartCompanyInterview={(companyName) => {
              navigate('/interview', { state: { targetCompany: companyName } });
            }}
          />
        );
      case 'coding-challenges':
        return <CodingChallenges />;
      case 'aptitude':
        return <AptitudePractice />;
      case 'ats-analysis':
        return (
          <ResumeATS
            resumeSummary={resumeSummary}
            onNavigateToUpload={() => navigate('/resume-upload')}
          />
        );
      case 'career-coach':
        return <CareerCoach />;
      case 'roadmap':
        return <LearningRoadmap />;
      case 'github-analyzer':
        return <GitHubAnalyzer />;
      case 'linkedin-optimizer':
        return <LinkedInOptimizer />;
      case 'cover-letter':
        return <CoverLetterGen />;
      case 'job-recommendations':
        return <JobRecommendations />;
      case 'resume-manager':
        return <ResumeManager />;
      case 'certificates':
        return <CertificateCenter />;
      case 'daily-challenges':
        return <DailyChallenges />;
      case 'achievements':
        return <Achievements />;
      case 'discussions':
        return <CommunityDiscussion />;
      case 'recruiter':
        return <RecruiterDashboard />;
      case 'admin':
        return <AdminDashboard />;
      case 'settings':
        return (
          <SettingsPage
            profile={profile}
            onUpdateProfile={(newName, newRole) => {
              setProfile((prev) => (prev ? { ...prev, name: newName, role: newRole } : null));
            }}
          />
        );
      case 'download-center':
        return <DownloadCenter />;
      case 'voice-emotion':
        return <VoiceEmotionBeta />;
      default:
        return <Overview profile={profile} resumeSummary={resumeSummary} interviews={interviews} />;
    }
  };

  return (
    <div className="min-h-screen bg-[#04010f] text-slate-100 selection:bg-indigo-500 selection:text-white flex">
      {/* Sidebar Navigation */}
      <Sidebar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setSelectedInterview(null); // Reset detail view on tab switch
          setActiveTab(tab);
        }}
        collapsed={sidebarCollapsed}
        setCollapsed={setSidebarCollapsed}
        userRole={profile?.role || 'software'}
        onLogout={handleLogout}
      />

      {/* Main Content Pane */}
      <div
        className={`flex-1 min-h-screen flex flex-col transition-all duration-350 ${
          sidebarCollapsed ? 'pl-20' : 'pl-64'
        }`}
      >
        {/* Top Navbar */}
        <header className="h-16 border-b border-slate-900 bg-slate-950/80 backdrop-blur sticky top-0 z-30 px-6 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Workspace</span>
            <span className="text-xs font-black text-indigo-400 capitalize">/ {activeTab.replace('-', ' ')}</span>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs text-slate-450 font-bold bg-slate-900 border border-slate-800 px-3 py-1.5 rounded-xl capitalize">
              Role: {profile?.role || 'candidate'}
            </span>
          </div>
        </header>

        {/* Workspace content area */}
        <main className="flex-1 p-6 md:p-8 space-y-8 max-w-7xl w-full mx-auto relative z-10">
          {error && (
            <div className="flex items-start gap-3 rounded-2xl border border-red-500/20 bg-red-950/20 p-4 text-red-300">
              <AlertCircle className="mt-0.5 h-5 w-5 shrink-0" />
              <p className="text-sm">{error}</p>
            </div>
          )}

          {/* DETAILED RESULTS DRAWER (IF SELECTED) */}
          {selectedInterview ? (
            <div className="rounded-3xl border border-slate-800 bg-slate-909/50 p-6 md:p-8 space-y-6 relative overflow-hidden fade-slide-up">
              <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
              <div className="flex items-center justify-between pb-4 border-b border-slate-800">
                <button
                  onClick={() => setSelectedInterview(null)}
                  className="flex items-center gap-1 text-xs text-indigo-400 font-bold hover:underline"
                >
                  <ChevronLeft className="h-3.5 w-3.5" /> Back to History
                </button>
                <div className="rounded-full bg-indigo-955/60 border border-indigo-900 px-3.5 py-1 text-xs font-bold text-indigo-350">
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
                        <div key={idx} className="bg-slate-900/20 border border-slate-900/80 rounded-2xl p-5 space-y-3.5">
                          <div className="flex items-center justify-between text-xs font-bold border-b border-slate-900 pb-2 flex-wrap gap-2">
                            <span className="text-indigo-400">Question {idx + 1}</span>
                            <div className="flex items-center gap-2">
                              <span className="rounded bg-emerald-950/60 border border-emerald-900 px-2 py-0.5 text-emerald-400 text-[10px]">
                                Clarity: {evaluation.communicationScore || 100}%
                              </span>
                              {evaluation.codeComplexity && evaluation.codeComplexity !== 'N/A' && (
                                <span className="rounded bg-indigo-950 border border-indigo-900 px-2 py-0.5 text-indigo-350 font-mono text-[10px]">
                                  {evaluation.codeComplexity} (Q: {evaluation.codeQualityScore}/10)
                                </span>
                              )}
                              <span className="text-slate-350">Score: {evaluation.score || 0}/10</span>
                            </div>
                          </div>
                          <p className="text-slate-200 font-semibold text-sm">{q}</p>
                          <p className="text-slate-450 text-sm italic font-mono bg-slate-950/40 p-2.5 rounded-lg border border-slate-909/50">
                            "{(selectedInterview.answers && selectedInterview.answers[idx]) || 'No answer provided.'}"
                          </p>
                          
                          <div className="space-y-2 text-xs sm:text-sm pt-1">
                            <p className="text-slate-350"><span className="font-bold text-slate-300 block mb-0.5 text-xs uppercase tracking-wide">AI Review:</span> {evaluation.feedback}</p>
                            {evaluation.detailedExplanation && (
                              <p className="text-slate-350 border-t border-slate-900 pt-2"><span className="font-bold text-slate-300 block mb-0.5 text-xs uppercase tracking-wide">Concept Explanation:</span> {evaluation.detailedExplanation}</p>
                            )}
                            {evaluation.modelAnswer && (
                              <div className="border-t border-slate-909 pt-2">
                                <span className="font-bold text-slate-300 block mb-1 text-xs uppercase tracking-wide">Model Answer Example:</span>
                                <p className="bg-indigo-950/10 p-3 rounded-lg border border-indigo-900/10 text-slate-400 leading-relaxed font-sans text-xs">
                                  {evaluation.modelAnswer}
                                </p>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Sidebar metadata */}
                <div className="space-y-6">
                  <div className="bg-slate-900/40 border border-slate-900 rounded-3xl p-5 space-y-4">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-slate-300 border-b border-slate-950 pb-2">Session Audit</h4>
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
                        <span className="font-semibold text-slate-202">
                          {new Date(selectedInterview.createdAt).toLocaleDateString()}
                        </span>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            renderTabContent()
          )}

          {/* AI SKILL TUTOR CRASH COURSE MODAL */}
          {activeTutorSkill && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-950/80 backdrop-blur-md p-4 animate-fade-in">
              <div className="relative w-full max-w-2xl rounded-3xl border border-slate-805 bg-[#0c081e] p-6 md:p-8 shadow-2xl flex flex-col max-h-[85vh] overflow-hidden">
                <div className="absolute top-0 right-0 h-40 w-40 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />
                
                {/* Modal Header */}
                <div className="flex items-center justify-between pb-4 border-b border-slate-900 shrink-0">
                  <div className="flex items-center gap-2.5">
                    <div className="rounded-xl bg-indigo-950/50 border border-indigo-900/50 p-2.5">
                      <BookOpen className="h-5 w-5 text-indigo-400" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black text-indigo-455 uppercase tracking-widest">AI Skill Tutor Academy</span>
                      <h3 className="text-xl font-bold text-white mt-0.5">5-Step Crash Course: {activeTutorSkill}</h3>
                    </div>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTutorSkill(null);
                      setTutorData(null);
                    }}
                    className="rounded-lg bg-slate-909 border border-slate-850 p-1.5 text-slate-400 hover:text-white transition-colors"
                  >
                    <X className="h-4.5 w-4.5" />
                  </button>
                </div>

                {/* Modal Body */}
                <div className="flex-1 overflow-y-auto py-6 space-y-6 scrollbar-thin">
                  {tutorLoading ? (
                    <div className="flex flex-col py-16 items-center justify-center text-slate-500 text-sm">
                      <span className="animate-spin h-6 w-6 border-2 border-indigo-500 border-t-transparent rounded-full mb-3"></span>
                      AI generating custom step-by-step masterclass crash course...
                    </div>
                  ) : tutorData ? (
                    <div className="space-y-6">
                      {tutorData.steps?.map((step: any, sIdx: number) => (
                        <div key={sIdx} className="relative pl-8 border-l border-slate-900 last:border-0 pb-4 last:pb-0">
                          <div className="absolute left-0 top-0 -translate-x-1/2 flex h-6 w-6 items-center justify-center rounded-full bg-indigo-950 border border-indigo-900 font-bold text-xs text-indigo-400">
                            {sIdx + 1}
                          </div>
                          <h4 className="text-sm font-bold text-slate-202">{step.title}</h4>
                          <p className="text-xs sm:text-sm text-slate-450 mt-2 leading-relaxed bg-slate-950/20 border border-slate-909/60 p-4 rounded-xl font-sans whitespace-pre-wrap">
                            {step.content}
                          </p>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-10 text-slate-550">
                      Failed to generate crash course content. Please try again.
                    </div>
                  )}
                </div>

                {/* Modal Footer */}
                <div className="pt-4 border-t border-slate-900 flex justify-end shrink-0">
                  <button
                    onClick={() => {
                      setActiveTutorSkill(null);
                      setTutorData(null);
                    }}
                    className="rounded-xl bg-gradient-to-r from-indigo-650 to-indigo-700 px-6 py-3 font-bold text-white shadow-lg transition hover:brightness-110"
                  >
                    Done Learning
                  </button>
                </div>
              </div>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;
