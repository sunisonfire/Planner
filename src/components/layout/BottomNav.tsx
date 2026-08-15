import React, { useState } from 'react';
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  Calendar,
  Target,
  MoreHorizontal,
  Calculator,
  BookOpen,
  User,
  X,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import { AnimatePresence, motion } from 'motion/react';
import { THEME_PALETTES } from '../../utils/themes';

export const BottomNav: React.FC = () => {
  const { activeTab, setActiveTab, tasks, settings } = useApp();
  const [isMoreOpen, setIsMoreOpen] = useState(false);
  const currentPalette = THEME_PALETTES[settings.themeColor] || THEME_PALETTES.indigo;

  const pendingTasks = tasks.filter((t) => !t.completed).length;

  const mainItems: { id: TabType; label: string; icon: React.ElementType; badge?: number }[] = [
    { id: 'dashboard', label: 'Inicio', icon: LayoutDashboard },
    { id: 'pomodoro', label: 'Pomodoro', icon: Timer },
    { id: 'tasks', label: 'Tareas', icon: CheckSquare, badge: pendingTasks > 0 ? pendingTasks : undefined },
    { id: 'calendar', label: 'Calendario', icon: Calendar },
  ];

  const moreItems: { id: TabType; label: string; icon: React.ElementType; desc: string }[] = [
    { id: 'goals', label: 'Mis metas y objetivos', icon: Target, desc: 'Seguimiento de progreso y hábitos' },
    { id: 'grades', label: 'Calculadora de notas', icon: Calculator, desc: 'Calcula cuánto necesitas para pasar' },
    { id: 'subjects', label: 'Mis materias', icon: BookOpen, desc: 'Gestiona tus cursos y profesores' },
    { id: 'profile', label: 'Mi perfil y ajustes', icon: User, desc: 'Copias de seguridad y preferencias' },
  ];

  const isMoreActive = ['goals', 'grades', 'subjects', 'profile'].includes(activeTab);

  const handleSelectMore = (tab: TabType) => {
    setActiveTab(tab);
    setIsMoreOpen(false);
  };

  return (
    <>
      {/* Mobile More Sheet */}
      <AnimatePresence>
        {isMoreOpen && (
          <div
            className="fixed inset-0 z-50 bg-slate-900/60 backdrop-blur-xs flex flex-col justify-end lg:hidden"
            onClick={() => setIsMoreOpen(false)}
          >
            <motion.div
              initial={{ y: '100%' }}
              animate={{ y: 0 }}
              exit={{ y: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-slate-900 rounded-t-3xl p-5 border-t border-slate-200 dark:border-slate-800 shadow-2xl space-y-3"
            >
              <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                <h4 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Más secciones
                </h4>
                <button
                  type="button"
                  onClick={() => setIsMoreOpen(false)}
                  className="p-1 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="space-y-1.5">
                {moreItems.map((item) => {
                  const Icon = item.icon;
                  const isActive = activeTab === item.id;
                  return (
                    <button
                      key={item.id}
                      type="button"
                      onClick={() => handleSelectMore(item.id)}
                      style={
                        isActive
                          ? {
                              backgroundColor: currentPalette.lightBg,
                              color: currentPalette.text,
                            }
                          : undefined
                      }
                      className={`w-full flex items-center gap-3 p-2.5 rounded-2xl text-left transition-all ${
                        isActive
                          ? 'font-semibold'
                          : 'hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-200'
                      }`}
                    >
                      <div
                        className="w-9 h-9 rounded-xl flex items-center justify-center"
                        style={
                          isActive
                            ? { backgroundColor: currentPalette.primary, color: '#ffffff' }
                            : undefined
                        }
                      >
                        <Icon className="w-4 h-4" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-semibold truncate">{item.label}</p>
                        <p className="text-[11px] text-slate-400 dark:text-slate-500 font-normal truncate">
                          {item.desc}
                        </p>
                      </div>
                    </button>
                  );
                })}
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Persistent Bottom Bar */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200/80 dark:border-slate-800 px-2 py-1 safe-area-bottom">
        <div className="flex items-center justify-around max-w-md mx-auto">
          {mainItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                id={`bottom-nav-${item.id}`}
                type="button"
                onClick={() => setActiveTab(item.id)}
                style={isActive ? { color: currentPalette.primary } : undefined}
                className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'font-bold'
                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
                }`}
              >
                <div className="relative">
                  <Icon className="w-5 h-5" />
                  {item.badge !== undefined && (
                    <span
                      className="absolute -top-1 -right-2 w-4 h-4 text-white rounded-full text-[9px] font-extrabold flex items-center justify-center"
                      style={{ backgroundColor: currentPalette.primary }}
                    >
                      {item.badge}
                    </span>
                  )}
                </div>
                <span className="text-[10px] mt-0.5 tracking-tight">
                  {item.label}
                </span>
                {isActive && (
                  <motion.div
                    layoutId="active-indicator-bottom"
                    className="absolute -top-1 w-5 h-0.5 rounded-full"
                    style={{ backgroundColor: currentPalette.primary }}
                  />
                )}
              </button>
            );
          })}

          {/* More button */}
          <button
            id="bottom-nav-more"
            type="button"
            onClick={() => setIsMoreOpen(true)}
            style={isMoreActive ? { color: currentPalette.primary } : undefined}
            className={`relative flex flex-col items-center justify-center py-1 px-2.5 rounded-xl transition-all ${
              isMoreActive
                ? 'font-bold'
                : 'text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200'
            }`}
          >
            <MoreHorizontal className="w-5 h-5" />
            <span className="text-[10px] mt-0.5 tracking-tight">Más</span>
            {isMoreActive && (
              <div
                className="absolute -top-1 w-5 h-0.5 rounded-full"
                style={{ backgroundColor: currentPalette.primary }}
              />
            )}
          </button>
        </div>
      </nav>
    </>
  );
};
