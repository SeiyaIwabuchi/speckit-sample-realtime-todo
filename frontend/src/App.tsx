import React, { useEffect, Suspense, lazy } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate, useLocation } from 'react-router-dom';
import { AuthProvider, useAuthContext } from './contexts/AuthContext';
import { analyticsService } from './services/analyticsService';
import { MainLayout } from './components/layout/MainLayout';

// Lazy load pages for code splitting
const LoginPage = lazy(() => import('./pages/LoginPage').then(module => ({ default: module.LoginPage })));
const TodoPage = lazy(() => import('./pages/TodoPage'));
const TagManagementPage = lazy(() => import('./pages/TagManagementPage'));

const AppRoutes: React.FC = () => {
  const { user, loading } = useAuthContext();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!loading) {
      if (user) {
        // ログイン済みで /login にいる場合のみ / へ遷移
        if (location.pathname === '/login') {
          navigate('/', { replace: true });
        }
        // /tags など他ページは遷移しない
      } else {
        // 未ログインなら /login 以外は /login へ遷移
        if (location.pathname !== '/login') {
          navigate('/login', { replace: true });
        }
      }
    }
  }, [user, loading, navigate, location.pathname]);

  // Track page views
  useEffect(() => {
    const pageName = location.pathname === '/' ? 'Todo List' :
                     location.pathname === '/login' ? 'Login' :
                     location.pathname === '/tags' ? 'Tag Management' : 'Unknown';
    analyticsService.trackPageView(pageName);
  }, [location.pathname]);

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
    <Suspense fallback={
      <MainLayout headerContent={<div />}>
        <div className="flex items-center justify-center min-h-screen">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
            <p className="mt-4 text-gray-600">ページを読み込み中...</p>
          </div>
        </div>
      </MainLayout>
    }>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route
          path="/"
          element={
            user ? (
              <MainLayout>
                <TodoPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
        <Route
          path="/tags"
          element={
            user ? (
              <MainLayout>
                <TagManagementPage />
              </MainLayout>
            ) : (
              <Navigate to="/login" replace />
            )
          }
        />
      </Routes>
    </Suspense>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <Router>
        <AppRoutes />
      </Router>
    </AuthProvider>
  );
};

export default App;