import React from 'react';

export default function About() {
  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="text-center">
        <h1 className="text-3xl font-bold text-neutral-900 dark:text-white mb-4">
          About Modern React Example
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300">
          A demonstration of modern micro-frontend architecture with qiankun
        </p>
      </div>

      <div className="grid md:grid-cols-2 gap-8">
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Technology Stack</h2>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              React 18 with concurrent features
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              TypeScript 5 with strict mode
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Vite 5 for fast development
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Tailwind CSS for styling
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              React Query for data fetching
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-blue-500"></span>
              Zustand for state management
            </li>
          </ul>
        </section>

        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-neutral-900 dark:text-white">Key Features</h2>
          <ul className="space-y-2 text-neutral-600 dark:text-neutral-300">
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Full TypeScript support
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Modern React patterns (hooks, suspense)
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Optimized build with code splitting
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Dark mode support
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Responsive design
            </li>
            <li className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              Accessible UI components
            </li>
          </ul>
        </section>
      </div>

      <div className="bg-neutral-100 dark:bg-neutral-800 rounded-xl p-6">
        <h2 className="text-lg font-semibold text-neutral-900 dark:text-white mb-4">Qiankun Integration</h2>
        <p className="text-neutral-600 dark:text-neutral-300 mb-4">
          This example demonstrates how to properly integrate a modern React application with qiankun micro-frontend framework.
          It includes proper lifecycle exports (bootstrap, mount, unmount) and handles both standalone and embedded modes.
        </p>
        <div className="flex gap-2">
          <code className="px-3 py-1 bg-neutral-200 dark:bg-neutral-700 rounded text-sm text-neutral-700 dark:text-neutral-300">
            window.__POWERED_BY_QIANKUN__
          </code>
          <span className="text-neutral-500 dark:text-neutral-400">detects embedded mode</span>
        </div>
      </div>
    </div>
  );
}
