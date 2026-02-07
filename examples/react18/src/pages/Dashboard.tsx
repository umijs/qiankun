import React from 'react';
import { useQuery } from '@tanstack/react-query';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  status: 'active' | 'inactive';
  lastLogin: string;
}

async function fetchUsers(): Promise<User[]> {
  await new Promise(resolve => setTimeout(resolve, 1000));
  return [
    { id: 1, name: 'John Doe', email: 'john@example.com', role: 'Admin', status: 'active', lastLogin: '2024-01-15' },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', role: 'Editor', status: 'active', lastLogin: '2024-01-14' },
    { id: 3, name: 'Bob Johnson', email: 'bob@example.com', role: 'Viewer', status: 'inactive', lastLogin: '2024-01-10' },
    { id: 4, name: 'Alice Williams', email: 'alice@example.com', role: 'Editor', status: 'active', lastLogin: '2024-01-15' },
    { id: 5, name: 'Charlie Brown', email: 'charlie@example.com', role: 'Viewer', status: 'active', lastLogin: '2024-01-13' },
  ];
}

export default function Dashboard() {
  const { data: users, isLoading, error } = useQuery({
    queryKey: ['users'],
    queryFn: fetchUsers,
  });

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 dark:text-white">Dashboard</h1>
          <p className="text-neutral-600 dark:text-neutral-400 mt-1">
            Manage your users and view system status
          </p>
        </div>
        <button className="inline-flex items-center px-4 py-2 bg-primary-600 text-white font-medium rounded-lg hover:bg-primary-700 transition-colors">
          <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add User
        </button>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        <StatCard title="Total Users" value="1,234" change="+12%" trend="up" />
        <StatCard title="Active Users" value="892" change="+5%" trend="up" />
        <StatCard title="Revenue" value="$12,345" change="-2%" trend="down" />
      </div>

      <div className="bg-white dark:bg-neutral-800 rounded-xl shadow-sm border border-neutral-200 dark:border-neutral-700 overflow-hidden">
        <div className="px-6 py-4 border-b border-neutral-200 dark:border-neutral-700">
          <h2 className="text-lg font-semibold text-neutral-900 dark:text-white">Recent Users</h2>
        </div>

        {isLoading ? (
          <div className="p-8 text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-4 border-primary-200 border-t-primary-600 mx-auto"></div>
            <p className="mt-4 text-neutral-600 dark:text-neutral-400">Loading users...</p>
          </div>
        ) : error ? (
          <div className="p-8 text-center">
            <p className="text-red-600">Error loading users</p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-neutral-50 dark:bg-neutral-900/50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    User
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Role
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-neutral-500 dark:text-neutral-400 uppercase tracking-wider">
                    Last Login
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-200 dark:divide-neutral-700">
                {users?.map((user) => (
                  <tr key={user.id} className="hover:bg-neutral-50 dark:hover:bg-neutral-800/50 transition-colors">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary-400 to-primary-600 flex items-center justify-center text-white font-semibold">
                          {user.name.charAt(0)}
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-neutral-900 dark:text-white">{user.name}</div>
                          <div className="text-sm text-neutral-500 dark:text-neutral-400">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-200">
                        {user.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span
                        className={cn(
                          'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium',
                          user.status === 'active'
                            ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                            : 'bg-neutral-100 text-neutral-800 dark:bg-neutral-700 dark:text-neutral-300'
                        )}
                      >
                        {user.status === 'active' ? (
                          <>
                            <span className="w-1.5 h-1.5 rounded-full bg-green-500 mr-1.5"></span>
                            Active
                          </>
                        ) : (
                          'Inactive'
                        )}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-neutral-500 dark:text-neutral-400">
                      {user.lastLogin}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}

function cn(...inputs: (string | undefined | false)[]) {
  return inputs.filter(Boolean).join(' ');
}

interface StatCardProps {
  title: string;
  value: string;
  change: string;
  trend: 'up' | 'down';
}

function StatCard({ title, value, change, trend }: StatCardProps) {
  return (
    <div className="bg-white dark:bg-neutral-800 rounded-xl p-6 shadow-sm border border-neutral-200 dark:border-neutral-700">
      <p className="text-sm font-medium text-neutral-600 dark:text-neutral-400">{title}</p>
      <div className="flex items-baseline gap-2 mt-2">
        <p className="text-2xl font-bold text-neutral-900 dark:text-white">{value}</p>
        <span
          className={cn(
            'text-sm font-medium',
            trend === 'up' ? 'text-green-600 dark:text-green-400' : 'text-red-600 dark:text-red-400'
          )}
        >
          {change}
        </span>
      </div>
    </div>
  );
}
