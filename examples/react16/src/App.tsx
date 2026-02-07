import React, { Suspense, lazy } from 'react';
import { Routes, Route, Link, useLocation } from 'react-router-dom';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Home = lazy(() => import('./pages/Home'));
const About = lazy(() => import('./pages/About'));
const Dashboard = lazy(() => import('./pages/Dashboard'));

function NavLink({ to, children }: { to: string; children: React.ReactNode }) {
  const location = useLocation();
  const isActive = location.pathname === to;

  return (
    <Link
      to={to}
      className={cn(
        'inline-flex items-center px-4 py-2 text-sm font-medium rounded-lg transition-colors duration-200',
        isActive
          ? 'bg-primary-100 text-primary-700 dark:bg-primary-900 dark:text-primary-100'
          : 'text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900 dark:text-neutral-400 dark:hover:bg-neutral-800 dark:hover:text-neutral-100'
      )}
    >
      {children}
    </Link>
  );
}

function LoadingSpinner() {
  return (
    <div className="flex items-center justify-center min-h-[50vh]">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-primary-200 border-t-primary-600"></div>
    </div>
  );
}

export default function App() {
  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-900 transition-colors duration-200">
      <header className="sticky top-0 z-50 bg-white/80 dark:bg-neutral-900/80 backdrop-blur-md border-b border-neutral-200 dark:border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary-500 to-primary-700 flex items-center justify-center text-white font-bold text-lg">
                ⚛️
              </div>
              <span className="text-xl font-bold bg-gradient-to-r from-neutral-900 to-neutral-600 dark:from-white dark:to-neutral-300 bg-clip-text text-transparent">
                React 18 Example
              </span>
            </div>
            <nav className="flex items-center gap-2">
              <NavLink to="/">Home</NavLink>
              <NavLink to="/dashboard">Dashboard</NavLink>
              <NavLink to="/about">About</NavLink>
            </nav>
          </div>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/about" element={<About />} />
          </Routes>
        </Suspense>
      </main>

      <footer className="border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-900 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <p className="text-sm text-neutral-500 dark:text-neutral-400">
              © 2024 Modern React Example. Built with React 18 + Vite 5 + Tailwind CSS
            </p>
            <div className="flex items-center gap-4">
              <span className="inline-flex items-center gap-1.5 text-xs text-neutral-500">
                <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></span>
                Running
              </span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
