import { ReactNode } from 'react';
import { Navigate } from 'react-router-dom';

const isAuthenticated = () => !!localStorage.getItem('token');

const ProtectedRoute = ({ children }: { children: ReactNode }) => {
  return isAuthenticated() ? <>{children}</> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;
