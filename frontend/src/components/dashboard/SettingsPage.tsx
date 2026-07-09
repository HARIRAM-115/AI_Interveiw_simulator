import React, { useState } from 'react';
import { Settings, Save, Sparkles, User, Key, Palette } from 'lucide-react';

interface SettingsPageProps {
  profile: { name: string; email: string; role: string } | null;
  onUpdateProfile: (name: string, role: string) => void;
}

const SettingsPage: React.FC<SettingsPageProps> = ({ profile, onUpdateProfile }) => {
  const [name, setName] = useState(profile?.name || 'Hari Ram');
  const [role, setRole] = useState(profile?.role || 'software');
  const [apiKey, setApiKey] = useState('sk-proj-....................');
  const [activeTheme, setActiveTheme] = useState('violet');

  const themes = [
    { id: 'violet', name: 'Deep Space Violet', color: 'bg-violet-600', hover: 'hover:border-violet-650' },
    { id: 'emerald', name: 'Emerald Cyber', color: 'bg-emerald-500', hover: 'hover:border-emerald-555' },
    { id: 'pink', name: 'Cyberpunk Pink', color: 'bg-pink-500', hover: 'hover:border-pink-555' },
    { id: 'blue', name: 'Midnight Blue', color: 'bg-blue-600', hover: 'hover:border-blue-650' },
  ];

  const handleThemeChange = (themeId: string) => {
    setActiveTheme(themeId);
    
    // Inject root CSS variable modifications
    const root = document.documentElement;
    if (themeId === 'violet') {
      root.style.setProperty('--color-primary', '#7c3aed');
      root.style.setProperty('--color-primary-light', '#a78bfa');
      root.style.setProperty('--card-border', 'rgba(124,58,237,0.15)');
      root.style.setProperty('--card-hover-border', 'rgba(124,58,237,0.35)');
    } else if (themeId === 'emerald') {
      root.style.setProperty('--color-primary', '#10b981');
      root.style.setProperty('--color-primary-light', '#34d399');
      root.style.setProperty('--card-border', 'rgba(16,185,129,0.15)');
      root.style.setProperty('--card-hover-border', 'rgba(16,185,129,0.35)');
    } else if (themeId === 'pink') {
      root.style.setProperty('--color-primary', '#ec4899');
      root.style.setProperty('--color-primary-light', '#f472b6');
      root.style.setProperty('--card-border', 'rgba(236,72,153,0.15)');
      root.style.setProperty('--card-hover-border', 'rgba(236,72,153,0.35)');
    } else if (themeId === 'blue') {
      root.style.setProperty('--color-primary', '#2563eb');
      root.style.setProperty('--color-primary-light', '#60a5fa');
      root.style.setProperty('--card-border', 'rgba(37,99,235,0.15)');
      root.style.setProperty('--card-hover-border', 'rgba(37,99,235,0.35)');
    }
    localStorage.setItem('themeAccent', themeId);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateProfile(name, role);
    alert('Settings successfully updated!');
  };

  return (
    <div className="space-y-6 fade-slide-up">
      <div>
        <h1 className="text-2xl font-bold text-white flex items-center gap-2">
          <Settings className="h-6 w-6 text-indigo-400" /> Account Settings
        </h1>
        <p className="text-slate-400 text-xs mt-1">
          Update your profile target fields, customize dashboard styling themes, or override standard API configurations.
        </p>
      </div>

      <div className="grid gap-6 lg:grid-cols-5">
        {/* Left Side: forms */}
        <form onSubmit={handleSave} className="lg:col-span-3 space-y-6">
          {/* Profile details */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-205 uppercase tracking-wider flex items-center gap-1.5">
              <User className="h-4.5 w-4.5 text-indigo-400" /> Profile Information
            </h3>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-650"
                />
              </div>

              <div className="space-y-1">
                <label className="text-[10px] font-bold text-slate-500 uppercase">Candidate Role</label>
                <select
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                  className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3 py-2.5 text-xs text-indigo-350 outline-none focus:border-indigo-650"
                >
                  <option value="software">Software Engineer</option>
                  <option value="product">Product Manager</option>
                  <option value="designer">UI/UX Designer</option>
                  <option value="admin">System Administrator</option>
                </select>
              </div>
            </div>
          </div>

          {/* API keys */}
          <div className="rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-4">
            <h3 className="text-sm font-bold text-slate-205 uppercase tracking-wider flex items-center gap-1.5">
              <Key className="h-4.5 w-4.5 text-indigo-400" /> API Keys (OpenAI)
            </h3>

            <div className="space-y-1">
              <label className="text-[10px] font-bold text-slate-500 uppercase">OpenAI Key Override (Optional)</label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                className="w-full rounded-xl bg-slate-950 border border-slate-900 px-3.5 py-2.5 text-xs text-slate-200 outline-none focus:border-indigo-650"
              />
              <span className="text-[9px] text-slate-550 mt-1 block">API tokens are stored locally in secure browser credentials storage.</span>
            </div>
          </div>

          <button
            type="submit"
            className="flex items-center gap-1.5 rounded-xl bg-indigo-650 px-6 py-3 text-xs font-bold text-white shadow-lg transition hover:bg-indigo-600"
          >
            <Save className="h-4 w-4" /> Save Account Changes
          </button>
        </form>

        {/* Right Side: Theme customization */}
        <div className="lg:col-span-2 rounded-3xl border border-slate-900 bg-slate-900/30 p-6 space-y-5 h-fit">
          <div>
            <h3 className="text-sm font-bold text-slate-202 uppercase tracking-wider flex items-center gap-1.5">
              <Palette className="h-4.5 w-4.5 text-indigo-400" /> UI Theme Selection
            </h3>
            <p className="text-[10px] text-slate-500 mt-0.5">Toggle overall accent themes immediately</p>
          </div>

          <div className="grid gap-3 grid-cols-2">
            {themes.map((t) => {
              const isSelected = activeTheme === t.id;
              return (
                <button
                  key={t.id}
                  onClick={() => handleThemeChange(t.id)}
                  className={`rounded-2xl border p-4 text-xs font-bold text-left flex flex-col justify-between gap-4 transition-all ${
                    isSelected
                      ? 'bg-indigo-950/40 border-indigo-900 text-indigo-250 shadow-inner'
                      : 'bg-slate-950/50 border-slate-900 text-slate-400 hover:border-slate-800'
                  }`}
                >
                  <div className={`h-8 w-8 rounded-lg ${t.color}`} />
                  <span>{t.name}</span>
                </button>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SettingsPage;
