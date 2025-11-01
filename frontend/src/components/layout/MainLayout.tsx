import React from 'react';
import { Toast } from '../ui/Toast';
import { Header } from './Header';

interface MainLayoutProps {
  children: React.ReactNode;
  headerContent?: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children, headerContent }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Header>
        {headerContent || (
          <div className="flex items-center">
            <h1 className="text-xl font-semibold text-gray-900">リアルタイムTodo管理</h1>
          </div>
        )}
      </Header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {children}
      </main>
      {/* Toast通知 */}
      <Toast />
    </div>
  );
};