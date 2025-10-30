import React, { useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { LoginPage } from './pages/LoginPage';
import { TodoPage } from './pages/TodoPage';
import { MainLayout } from './components/layout/MainLayout';
import { Toast } from './components/ui/Toast';

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();

  useEffect(() => {
    if (!loading) {
      if (user) {
        console.log('User authenticated, navigating to /');
        navigate('/', { replace: true });
      } else {
        console.log('User not authenticated, navigating to /login');
        navigate('/login', { replace: true });
      }
    }
  }, [user, loading, navigate]);

  if (loading) {
    return (
      <MainLayout headerContent={<div />}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">読み込み中...</p>
          </div>
        </div>
      </MainLayout>
    );
  }

  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/"
        element={
          user ? (
            <TodoPage />
          ) : (
            <Navigate to="/login" replace />
          )
        }
      />
    </Routes>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
        <Toast />
      </Router>
    </AuthProvider>
  );
};

export default App;