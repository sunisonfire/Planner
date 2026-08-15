import React from 'react';
import {
  LayoutDashboard,
  Timer,
  CheckSquare,
  Calendar,
  Target,
  Calculator,
  BookOpen,
  User,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';
import { THEME_PALETTES } from '../../utils/themes';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, tasks, subjects, goals, settings } = useApp();
  const currentPalette = THEME_PALETTES[settings.themeColor] || THEME_PALETTES.indigo;

  const pendingTasksCount = tasks.filter((t) => !t.completed).length;
  const activeGoalsCount = goals.filter((g) => !g.completed && g.progress < 100).length;

  const navItems: {
    id: TabType;
    label: string;
    icon: React.ElementType;
    badge?: number;
    badgeColor?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Inicio',
      icon: LayoutDashboard,
    },
    {
      id: 'pomodoro',
      label: 'Temporizador Pomodoro',
      icon: Timer,
    },
    {
      id: 'tasks',
      label: 'Mis tareas',
      icon: CheckSquare,
      badge: pendingTasksCount > 0 ? pendingTasksCount : undefined,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'calendar',
      label: 'Calendario',
      icon: Calendar,
    },
    {
      id: 'goals',
      label: 'Mis metas',
      icon: Target,
      badge: activeGoalsCount > 0 ? activeGoalsCount : undefined,
      badgeColor: 'bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300',
    },
    {
      id: 'grades',
      label: 'Calculadora de notas',
      icon: Calculator,
    },
    {
      id: 'subjects',
      label: 'Mis materias',
      icon: BookOpen,
      badge: subjects.length > 0 ? subjects.length : undefined,
      badgeColor: 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400',
    },
    {
      id: 'profile',
      label: 'Mi perfil & Ajustes',
      icon: User,
    },
  ];

  return (
    <aside className="hidden lg:flex flex-col w-60 shrink-0 bg-white dark:bg-slate-900 border-r border-slate-200/80 dark:border-slate-800 min-h-[calc(100vh-3.5rem)] p-3 select-none">
      <div className="space-y-1">
        <p className="px-3 text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-2">
          Navegación
        </p>
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;

          return (
            <button
              key={item.id}
              id={`sidebar-nav-${item.id}`}
              type="button"
              onClick={() => setActiveTab(item.id)}
              style={
                isActive
                  ? {
                      backgroundColor: currentPalette.primary,
                      color: '#ffffff',
                    }
                  : undefined
              }
              className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all ${
                isActive
                  ? 'shadow-xs font-semibold'
                  : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <div className="flex items-center gap-2.5">
                <Icon
                  className={`w-4 h-4 ${
                    isActive
                      ? 'text-white'
                      : 'text-slate-400 dark:text-slate-400'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== undefined && (
                <span
                  className={`px-1.5 py-0.5 rounded-full text-[10px] font-bold ${
                    isActive
                      ? 'bg-white/25 text-white'
                      : item.badgeColor || 'bg-slate-100 text-slate-600'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Mini Motivational Card in Sidebar */}
      <div className="mt-auto pt-4">
        <div
          className="p-3 rounded-2xl border text-xs"
          style={{
            backgroundColor: currentPalette.lightBg,
            borderColor: currentPalette.ring,
          }}
        >
          <div
            className="flex items-center gap-1.5 font-bold mb-1"
            style={{ color: currentPalette.text }}
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Tip UniPlanner</span>
          </div>
          <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-[11px]">
            Registra tus evaluaciones al inicio del semestre para saber exactamente cuánto necesitas sacar en cada corte.
          </p>
        </div>
      </div>
    </aside>
  );
};
