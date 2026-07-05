import { Routes, Route, Navigate } from 'react-router-dom';
import LoginPage from './pages/Login';
import RegisterPage from './pages/Register';
import Dashboard from './pages/Dashboard';
import ResumeUploadPage from './pages/ResumeUpload';
import InterviewPage from './pages/Interview';
import ProtectedRoute from './components/ProtectedRoute';

const App = () => {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <Dashboard />
            </ProtectedRoute>
          }
        />
        <Route
          path="/resume-upload"
          element={
            <ProtectedRoute>
              <ResumeUploadPage />
            </ProtectedRoute>
          }
        />
        <Route
          path="/interview"
          element={
            <ProtectedRoute>
              <InterviewPage />
            </ProtectedRoute>
          }
        />
        <Route path="/*" element={<Navigate to="/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;
