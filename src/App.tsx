import React, { useState } from 'react';
import Sidebar from './components/Sidebar';
import KPICard from './components/KPICard';
import TasksChart from './components/TasksChart';
import ThemeToggle from './components/ThemeToggle';
import ShiftManagement from './components/ShiftManagement';
import { Bell, User } from 'lucide-react';
import TaskManagement from './components/TaskManagement';

function App() {
  const [activeView, setActiveView] = useState('Dashboard');

  const renderContent = () => {
    switch (activeView) {
      case 'Shift Management':
        return <ShiftManagement />;
      case 'Task Management':
        return <TaskManagement />;
      default:
        return (
          <main className="p-8">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <KPICard
                title="OFFICERS"
                value="12/15"
                description="Currently on duty"
                className="bg-white dark:bg-gray-800 dark:text-white"
              />
              <KPICard
                title="COMPLETED TASKS"
                value="18"
                description="Out of 25 total tasks"
                className="bg-white dark:bg-gray-800 dark:text-white"
              />
              <KPICard
                title="IN PROGRESS"
                value="9"
                description="Tasks currently in progress"
                className="bg-white dark:bg-gray-800 dark:text-white"
              />
              <KPICard
                title="PENDING"
                value="5"
                description="Tasks awaiting assignment"
                className="bg-white dark:bg-gray-800 dark:text-white"
              />
            </div>

            {/* Charts */}
            <div className="mt-8">
              <TasksChart />
            </div>

            {/* Task List */}
            <div className="mt-8 bg-white dark:bg-gray-800 rounded-lg shadow">
              <div className="p-6">
                <h2 className="text-lg font-semibold mb-4 dark:text-white">Recent Tasks</h2>
                <table className="w-full">
                  <thead>
                    <tr className="text-left text-gray-500 dark:text-gray-400 border-b dark:border-gray-700">
                      <th className="pb-3">Title</th>
                      <th className="pb-3">Priority</th>
                      <th className="pb-3">Assigned To</th>
                      <th className="pb-3">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3 dark:text-gray-200">Patrol North Kingston Area</td>
                      <td><span className="px-2 py-1 bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200 rounded">Medium</span></td>
                      <td className="dark:text-gray-200">Robert Brown</td>
                      <td><span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">In Progress</span></td>
                    </tr>
                    <tr className="border-b dark:border-gray-700">
                      <td className="py-3 dark:text-gray-200">Investigate Reported Theft</td>
                      <td><span className="px-2 py-1 bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200 rounded">High</span></td>
                      <td className="dark:text-gray-200">Sarah Williams</td>
                      <td><span className="px-2 py-1 bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200 rounded">In Progress</span></td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </main>
        );
    }
  };

  return (
    <div className="flex min-h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar onViewChange={setActiveView} />
      
      <div className="flex-1">
        {/* Header */}
        <header className="bg-white dark:bg-gray-800 shadow-sm">
          <div className="flex justify-between items-center px-8 py-4">
            <h1 className="text-2xl font-semibold text-gray-800 dark:text-white">
              {activeView}
            </h1>
            <div className="flex items-center space-x-4">
              <ThemeToggle />
              <button className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <Bell size={20} className="dark:text-gray-200" />
              </button>
              <button className="flex items-center space-x-2 p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full">
                <User size={20} className="dark:text-gray-200" />
              </button>
              <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-indigo-700 rounded-full flex items-center justify-center text-white">
                    <span>MJ</span>
                  </div>
                  <span className="text-gray-700 dark:text-white">Maria Johnson</span>
                </div>
            </div>
          </div>
        </header>

        {renderContent()}
      </div>
    </div>
  );
}

export default App;