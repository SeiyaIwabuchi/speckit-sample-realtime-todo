import React from 'react';
import { Link } from 'react-router-dom';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
      <nav className="flex items-center gap-4">
        <Link to="/" className="text-blue-500 font-medium hover:underline">Todo管理</Link>
        <Link to="/tags" className="text-blue-500 font-medium hover:underline">タグ管理</Link>
      </nav>
          {children}
        </div>
      </div>
    </header>
  );
};