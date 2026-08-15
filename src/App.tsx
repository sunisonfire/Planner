import React from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/layout/Sidebar';
import { Header } from './components/layout/Header';
import { BottomNav } from './components/layout/BottomNav';

// Pages
import { Onboarding } from './pages/Onboarding';
import { Dashboard } from './pages/Dashboard';
import { Pomodoro } from './pages/Pomodoro';
import { Tasks } from './pages/Tasks';
import { Calendar } from './pages/Calendar';
import { Goals } from './pages/Goals';
import { Grades } from './pages/Grades';
import { Subjects } from './pages/Subjects';
import { Profile } from './pages/Profile';

const AppContent: React.FC = () => {
  const { isOnboarded, activeTab } = useApp();

  // First-time onboarding view
  if (!isOnboarded) {
    return <Onboarding />;
  }

  const renderActivePage = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />;
      case 'pomodoro':
        return <Pomodoro />;
      case 'tasks':
        return <Tasks />;
      case 'calendar':
        return <Calendar />;
      case 'goals':
        return <Goals />;
      case 'grades':
        return <Grades />;
      case 'subjects':
        return <Subjects />;
      case 'profile':
        return <Profile />;
      default:
        return <Dashboard />;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 flex flex-col lg:flex-row transition-colors">
      {/* Desktop Left Sidebar */}
      <Sidebar />

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <Header />

        {/* Dynamic Page Content - Compact & Clean Spacing */}
        <main className="flex-1 px-3 sm:px-5 lg:px-6 pt-2.5 sm:pt-3.5 pb-20 md:pb-8 max-w-7xl w-full mx-auto">
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -6 }}
              transition={{ duration: 0.15, ease: 'easeOut' }}
            >
              {renderActivePage()}
            </motion.div>
          </AnimatePresence>
        </main>

        {/* Mobile Bottom Navigation Bar */}
        <BottomNav />
      </div>
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
