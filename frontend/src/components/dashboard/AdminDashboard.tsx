import React from 'react';
import { Shield, Activity, RefreshCw, BarChart2, CheckCircle2 } from 'lucide-react';
import { ResponsiveContainer, BarChart, Bar, XAxis, YAxis, Tooltip } from 'recharts';

const AdminDashboard: React.FC = () => {
  const stats = [
    { label: 'System Users', val: '1,424 Registered' },
    { label: 'API Keys Consumption', val: '84,920 Tokens' },
    { label: 'Database Health', val: '99.98% uptime' },
    { label: 'Active Mock Sessions', val: '14 Active' },
  ];

  const logs = [
    { id: 1, time: '22:40:12', text: 'Candidate Hari Ram completed Google Fullstack Simulator. Score: 9.4/10.' },
    { id: 2, time: '22:38:05', text: 'New user registration: Vikram Singh (vikram@domain.com).' },
    { id: 3, time: '22:15:30', text: 'OpenAI API generated questions for Senior React dev mock in 8.2s.' },
    { id: 4, time: '21:50:11', text: 'ATS parser uploaded Hari_Ram_Fullstack_React_Developer.pdf successfully.' },
  ];

  const chartData = [
    { day: 'Mon', MockRuns: 34 },
    { day: 'Tue', MockRuns: 45 },
    { day: 'Wed', MockRuns: 56 },
    { day: 'Thu', MockRuns: 48 },
    { day: 'Fri', MockRuns: 65 },
    { day: 'Sat', MockRuns: 28 },
    { day: 'Sun', MockRuns: 32 },
  ];

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Shield className="h-6 w-6 text-indigo-400" /> Administrative Operations Console
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Monitor overall system usage telemetry, API credits, background tasks log history, and database metrics.
        </p>
      </div>

      {/* KPI stats */}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((st) => (
          <div key={st.label} className="rounded-2xl border border-slate-900 bg-slate-905/30 p-5 text-left flex items-center justify-between">
            <div>
              <span className="text-[10px] text-slate-500 font-bold uppercase block">{st.label}</span>
              <span className="text-sm font-extrabold text-slate-205 mt-1 block">{st.val}</span>
            </div>
            <div className="rounded-lg bg-indigo-950/40 p-2 text-indigo-400">
              <CheckCircle2 className="h-4.5 w-4.5" />
            </div>
          </div>
        ))}
      </div>

      <div className="grid gap-6 md:grid-cols-5">
        {/* Left Column: activity chart */}
        <div className="md:col-span-3 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-205 uppercase tracking-wider flex items-center gap-1.5">
              <BarChart2 className="h-4.5 w-4.5 text-indigo-400" /> Weekly Simulator Traffic
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Aggregated mock interviews completed by day</p>
          </div>
          <div className="h-60 w-full">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <XAxis dataKey="day" stroke="#475569" fontSize={10} tickLine={false} />
                <YAxis stroke="#475569" fontSize={10} tickLine={false} />
                <Tooltip contentStyle={{ backgroundColor: '#02010f', border: '1px solid #1e293b', borderRadius: '12px' }} />
                <Bar dataKey="MockRuns" fill="#6366f1" radius={[5, 5, 0, 0]} name="Mock Runs" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Right Column: audit logs list */}
        <div className="md:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-4">
          <div>
            <h3 className="text-sm font-bold text-slate-205 uppercase tracking-wider flex items-center gap-1.5">
              <Activity className="h-4.5 w-4.5 text-indigo-400" /> Real-time System Audit
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Telemetry logging feed traces</p>
          </div>

          <div className="space-y-3 max-h-[220px] overflow-y-auto pr-1 scrollbar-thin">
            {logs.map((log) => (
              <div key={log.id} className="rounded-xl bg-slate-950/60 border border-slate-900 p-3 text-[10px] space-y-1">
                <span className="text-indigo-400 font-bold font-mono">{log.time}</span>
                <p className="text-slate-400 leading-normal font-sans">{log.text}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
