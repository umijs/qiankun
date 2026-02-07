import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
  return (
    <div className="space-y-8">
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-neutral-900 dark:text-white mb-4">
          Welcome to Modern React
        </h1>
        <p className="text-lg text-neutral-600 dark:text-neutral-300 max-w-2xl mx-auto">
          A modern micro-frontend example built with React 18, TypeScript, Vite 5, and Tailwind CSS.
          This demonstrates best practices for building qiankun micro-apps.
        </p>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <FeatureCard
          icon="⚡"
          title="Lightning Fast"
          description="Built with Vite 5 for instant HMR and optimized production builds"
        />
        <FeatureCard
          icon="🎨"
          title="Modern Design"
          description="Beautiful UI with Tailwind CSS, dark mode support, and responsive layout"
        />
        <FeatureCard
          icon="🔧"
          title="Type Safe"
          description="Full TypeScript support with strict type checking and modern patterns"
        />
      </div>

      <div className="flex justify-center gap-4 pt-8">
        <Link
          to="/dashboard"
          className="inline-flex items-center px-6 py-3 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors"
        >
          View Dashboard
        </Link>
        <Link
          to="/about"
          className="inline-flex items-center px-6 py-3 bg-neutral-200 text-neutral-800 font-medium rounded-lg hover:bg-neutral-300 transition-colors dark:bg-neutral-700 dark:text-white dark:hover:bg-neutral-600"
        >
          Learn More
        </Link>
      </div>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: string; title: string; description: string }) {
  return (
    <div className="p-6 bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 hover:shadow-md transition-shadow">
      <div className="text-3xl mb-4">{icon}</div>
      <h3 className="text-lg font-semibold text-neutral-900 dark:text-white mb-2">{title}</h3>
      <p className="text-neutral-600 dark:text-neutral-400">{description}</p>
    </div>
  );
}
