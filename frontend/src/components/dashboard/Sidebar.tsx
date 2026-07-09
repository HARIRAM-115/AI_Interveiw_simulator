import React from 'react';
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
  ChevronRight,
  Eye,
  AlertCircle,
  HelpCircle,
  Upload,
  Trophy,
  Medal,
  BookOpen,
  Settings,
  Download,
  Bell,
  Code,
  CheckSquare,
  Compass,
  Github,
  Linkedin,
  MessageSquare,
  Users,
  Shield,
  Activity,
  Volume2,
} from 'lucide-react';

interface SidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  collapsed: boolean;
  setCollapsed: (collapsed: boolean) => void;
  userRole: string;
  onLogout: () => void;
}

export interface MenuItem {
  id: string;
  label: string;
  icon: React.ComponentType<any>;
  badge?: string;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

const Sidebar: React.FC<SidebarProps> = ({
  activeTab,
  setActiveTab,
  collapsed,
  setCollapsed,
  userRole,
  onLogout,
}) => {
  const sections: MenuSection[] = [
    {
      title: 'Core Dashboard',
      items: [
        { id: 'overview', label: 'Overview', icon: BarChart2 },
        { id: 'interview', label: 'Start Interview', icon: Plus, badge: 'AI' },
        { id: 'history', label: 'Interview History', icon: Calendar },
      ],
    },
    {
      title: 'Skills & Practice',
      items: [
        { id: 'company-prep', label: 'Company Prep', icon: Briefcase, badge: 'Hot' },
        { id: 'coding-challenges', label: 'Coding Practice', icon: Code },
        { id: 'aptitude', label: 'Aptitude & MCQs', icon: CheckSquare },
        { id: 'roadmap', label: 'AI Roadmap', icon: Compass },
      ],
    },
    {
      title: 'AI Career Tools',
      items: [
        { id: 'ats-analysis', label: 'Resume ATS', icon: FileText, badge: 'New' },
        { id: 'career-coach', label: 'Career Coach', icon: Sparkles },
        { id: 'cover-letter', label: 'Cover Letter Gen', icon: Mail },
        { id: 'github-analyzer', label: 'GitHub Analyzer', icon: Github },
        { id: 'linkedin-optimizer', label: 'LinkedIn Optimizer', icon: Linkedin },
      ],
    },
    {
      title: 'Career Hub',
      items: [
        { id: 'job-recommendations', label: 'Job Matches', icon: TrendingUp },
        { id: 'resume-manager', label: 'Resume Manager', icon: Upload },
        { id: 'certificates', label: 'Certifications', icon: Award },
      ],
    },
    {
      title: 'Gamification & Social',
      items: [
        { id: 'daily-challenges', label: 'Daily Quests', icon: Trophy, badge: 'XP' },
        { id: 'achievements', label: 'Achievements', icon: Medal },
        { id: 'discussions', label: 'Community Forum', icon: MessageSquare },
      ],
    },
    {
      title: 'Portals',
      items: [
        { id: 'recruiter', label: 'Recruiter View', icon: Users },
        { id: 'admin', label: 'Admin Panel', icon: Shield },
      ],
    },
    {
      title: 'System & Reports',
      items: [
        { id: 'settings', label: 'Settings', icon: Settings },
        { id: 'download-center', label: 'Download Center', icon: Download },
        { id: 'voice-emotion', label: 'Voice & Emotion', icon: Volume2, badge: 'Beta' },
      ],
    },
  ];

  return (
    <aside
      className={`fixed top-0 bottom-0 left-0 z-40 flex flex-col bg-slate-950 border-r border-slate-900 transition-all duration-350 ${
        collapsed ? 'w-20' : 'w-64'
      }`}
    >
      {/* Sidebar Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-900">
        {!collapsed && (
          <div className="flex items-center gap-2.5">
            <div className="rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-650 p-2 text-white">
              <Sparkles className="h-4 w-4" />
            </div>
            <div>
              <span className="font-extrabold tracking-tight text-white text-sm">INTERVIEW</span>
              <span className="ml-1 rounded bg-slate-900 border border-slate-800 px-1 py-0.5 text-[8px] text-indigo-400 font-bold uppercase tracking-wider">
                SaaS
              </span>
            </div>
          </div>
        )}
        {collapsed && (
          <div className="mx-auto rounded-lg bg-gradient-to-tr from-indigo-500 to-indigo-650 p-2 text-white">
            <Sparkles className="h-4 w-4" />
          </div>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg bg-slate-900/60 border border-slate-800 p-1.5 text-slate-400 hover:text-white transition-colors hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="h-4.5 w-4.5" /> : <ChevronLeft className="h-4.5 w-4.5" />}
        </button>
      </div>

      {/* Menu Sections */}
      <div className="flex-1 overflow-y-auto py-4 px-3 space-y-6 scrollbar-thin">
        {sections.map((section, sIdx) => (
          <div key={sIdx} className="space-y-1.5">
            {!collapsed && (
              <h3 className="px-3 text-[10px] font-black text-slate-500 uppercase tracking-widest">
                {section.title}
              </h3>
            )}
            {collapsed && <div className="h-px bg-slate-900 mx-2 my-2" />}
            <ul className="space-y-1">
              {section.items.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                
                // Restrict dashboard views for admin/recruiter if role doesn't fit
                if (item.id === 'recruiter' && userRole !== 'recruiter' && userRole !== 'admin') return null;
                if (item.id === 'admin' && userRole !== 'admin') return null;

                return (
                  <li key={item.id}>
                    <button
                      onClick={() => setActiveTab(item.id)}
                      className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-xs font-semibold transition-all relative group ${
                        isActive
                          ? 'bg-indigo-955/80 text-indigo-200 border border-indigo-900/50 shadow-inner'
                          : 'text-slate-400 hover:bg-slate-900/40 hover:text-slate-100 border border-transparent'
                      }`}
                    >
                      <Icon className={`h-4.5 w-4.5 shrink-0 ${isActive ? 'text-indigo-400' : 'text-slate-500 group-hover:text-indigo-400 transition-colors'}`} />
                      {!collapsed && (
                        <span className="truncate">{item.label}</span>
                      )}
                      
                      {/* Unified Classic Badge */}
                      {!collapsed && item.badge && (
                        <span className="ml-auto rounded-full px-1.5 py-0.5 text-[8px] font-black tracking-wider uppercase bg-slate-900 border border-slate-800 text-indigo-400">
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip for collapsed view */}
                      {collapsed && (
                        <div className="absolute left-16 top-1/2 -translate-y-1/2 invisible group-hover:visible bg-slate-950 border border-slate-800 text-slate-200 text-xs px-2.5 py-1.5 rounded-lg shadow-xl whitespace-nowrap z-50">
                          {item.label}
                          {item.badge && (
                            <span className="ml-1.5 rounded bg-slate-900 border border-slate-850 text-indigo-400 px-1 py-0.2 text-[8px] font-bold">
                              {item.badge}
                            </span>
                          )}
                        </div>
                      )}
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        ))}
      </div>

      {/* Sidebar Footer */}
      <div className="p-3 border-t border-slate-900 shrink-0">
        <button
          onClick={onLogout}
          className="flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-xs font-semibold text-red-400 border border-transparent hover:bg-red-950/20 hover:border-red-900/20 transition-all"
        >
          <LogOut className="h-4.5 w-4.5 shrink-0" />
          {!collapsed && <span>Sign Out</span>}
        </button>
      </div>
    </aside>
  );
};

export default Sidebar;
