import React from 'react';

interface HeaderProps {
  children: React.ReactNode;
}

export const Header: React.FC<HeaderProps> = ({ children }) => {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          {children}
        </div>
      </div>
    </header>
  );
};