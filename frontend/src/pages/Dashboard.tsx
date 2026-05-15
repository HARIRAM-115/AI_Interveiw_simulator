import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getProfile } from '../services/api';

const Dashboard = () => {
  const [profile, setProfile] = useState<{ name: string; email: string; role: string } | null>(null);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const loadProfile = async () => {
      try {
        const response = await getProfile();
        setProfile(response.data.data);
      } catch (err: any) {
        setError(err?.response?.data?.message || 'Failed to load profile');
      }
    };

    loadProfile();
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <div className="mx-auto flex min-h-screen max-w-3xl flex-col gap-6 px-4 py-10">
      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <h1 className="text-3xl font-semibold">Dashboard</h1>
            <p className="mt-2 text-slate-600">Welcome back! Your profile is protected with JWT.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <button
              onClick={() => navigate('/resume-upload')}
              className="rounded-full bg-indigo-600 px-5 py-3 text-white transition hover:bg-indigo-700"
            >
              Upload Resume
            </button>
            <button
              onClick={handleLogout}
              className="rounded-full bg-red-600 px-5 py-3 text-white transition hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </div>

      {error && <div className="rounded-3xl bg-red-50 p-6 text-red-700">{error}</div>}

      <div className="rounded-3xl bg-white p-8 shadow-lg shadow-slate-200">
        <h2 className="text-2xl font-semibold">Profile</h2>
        {profile ? (
          <div className="mt-4 space-y-3 text-slate-700">
            <p>
              <span className="font-semibold">Name:</span> {profile.name}
            </p>
            <p>
              <span className="font-semibold">Email:</span> {profile.email}
            </p>
            <p>
              <span className="font-semibold">Role:</span> {profile.role}
            </p>
          </div>
        ) : (
          <p className="mt-4 text-slate-500">Loading profile...</p>
        )}
      </div>
    </div>
  );
};

export default Dashboard;
