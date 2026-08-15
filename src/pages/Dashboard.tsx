import React, { useState } from 'react';
import {
  BookOpen,
  CheckSquare,
  Target,
  Calendar,
  Plus,
  ArrowRight,
  Flame,
  AlertTriangle,
  Clock,
  Sparkles,
  CheckCircle2,
  ChevronRight,
  Calculator,
  Timer,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { getGreeting, getDaysUntil, formatShortDate, formatDisplayDate } from '../utils/dates';
import { PriorityBadge, SubjectBadge } from '../components/common/Badge';
import { ProgressBar } from '../components/common/ProgressBar';
import { TaskModal } from '../components/modals/TaskModal';
import { EventModal } from '../components/modals/EventModal';
import { GoalModal } from '../components/modals/GoalModal';
import { Task } from '../types';

export const Dashboard: React.FC = () => {
  const {
    profile,
    subjects,
    tasks,
    events,
    goals,
    toggleTask,
    setActiveTab,
  } = useApp();

  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isGoalModalOpen, setIsGoalModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);

  const greetingInfo = getGreeting(profile?.name || '');
  const subjectMap = new Map(subjects.map((s) => [s.id, s]));

  // Pending tasks sorted by due date
  const pendingTasks = tasks
    .filter((t) => !t.completed)
    .sort((a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime());

  // Active goals
  const activeGoals = goals.filter((g) => !g.completed && g.progress < 100);

  // Next upcoming item (task or event)
  const combinedUpcoming = [
    ...pendingTasks.map((t) => ({
      id: t.id,
      title: t.title,
      date: t.dueDate,
      type: 'task' as const,
      subjectId: t.subjectId,
      priority: t.priority,
    })),
    ...events.map((e) => ({
      id: e.id,
      title: e.title,
      date: e.date,
      type: e.type,
      subjectId: e.subjectId,
      time: e.time,
    })),
  ]
    .filter((item) => getDaysUntil(item.date) >= 0)
    .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime());

  const nextUpcoming = combinedUpcoming[0] || null;

  // Urgent alerts for tasks due today, tomorrow, or in 2-3 days
  const urgentTaskAlerts = pendingTasks
    .map((t) => {
      const days = getDaysUntil(t.dueDate);
      const subject = subjectMap.get(t.subjectId);
      if (days === 0) {
        return {
          id: t.id,
          level: 'urgent',
          badge: '🚨 VENCE HOY',
          message: `¡"${t.title}" vence hoy!`,
          subjectName: subject?.name,
          color: 'bg-rose-500/10 border-rose-500/30 text-rose-700 dark:text-rose-300',
          dot: 'bg-rose-500',
        };
      }
      if (days === 1) {
        return {
          id: t.id,
          level: 'high',
          badge: '🔥 VENCE MAÑANA',
          message: `¡Tu tarea "${t.title}" vence mañana!`,
          subjectName: subject?.name,
          color: 'bg-amber-500/10 border-amber-500/30 text-amber-800 dark:text-amber-300',
          dot: 'bg-amber-500',
        };
      }
      if (days === 2 || days === 3) {
        return {
          id: t.id,
          level: 'warning',
          badge: `⚠️ EN ${days} DÍAS`,
          message: `Te quedan ${days} días para entregar "${t.title}".`,
          subjectName: subject?.name,
          color: 'bg-indigo-500/10 border-indigo-500/30 text-indigo-800 dark:text-indigo-300',
          dot: 'bg-indigo-500',
        };
      }
      return null;
    })
    .filter(Boolean);

  return (
    <div className="space-y-4 pb-8">
      {/* 1. Dynamic Greeting Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display tracking-tight">
              {greetingInfo.greeting} {greetingInfo.icon}
            </h1>
          </div>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400">
            Aquí tienes todo lo importante de hoy · {formatDisplayDate(new Date().toISOString().split('T')[0])}
          </p>
        </div>

        {/* Quick action trigger */}
        <div className="flex items-center gap-2">
          <button
            id="dashboard-new-task-btn"
            type="button"
            onClick={() => {
              setEditingTask(null);
              setIsTaskModalOpen(true);
            }}
            className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            <Plus className="w-4 h-4" />
            Nueva tarea
          </button>
        </div>
      </div>

      {/* 2. Resumen Académico Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {/* Materias */}
        <div
          onClick={() => setActiveTab('subjects')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-blue-50 dark:bg-blue-950/50 text-blue-600 dark:text-blue-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <BookOpen className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
              Ver todas →
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {subjects.length}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Materias inscritas
          </p>
        </div>

        {/* Tareas Pendientes */}
        <div
          onClick={() => setActiveTab('tasks')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 dark:text-indigo-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <CheckSquare className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
              Gestionar →
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {pendingTasks.length}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Tareas pendientes
          </p>
        </div>

        {/* Metas */}
        <div
          onClick={() => setActiveTab('goals')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Target className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
              Progreso →
            </span>
          </div>
          <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
            {activeGoals.length}
          </p>
          <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mt-0.5">
            Metas activas
          </p>
        </div>

        {/* Próximo Evento / Tarea */}
        <div
          onClick={() => setActiveTab('calendar')}
          className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all cursor-pointer group shadow-xs"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="w-10 h-10 rounded-xl bg-purple-50 dark:bg-purple-950/50 text-purple-600 dark:text-purple-400 flex items-center justify-center group-hover:scale-110 transition-transform">
              <Calendar className="w-5 h-5" />
            </div>
            <span className="text-xs font-semibold text-slate-400 group-hover:text-indigo-600 transition-colors">
              Agenda →
            </span>
          </div>
          <p className="text-sm font-bold text-slate-900 dark:text-white truncate">
            {nextUpcoming ? nextUpcoming.title : 'Sin eventos'}
          </p>
          <p className="text-xs font-medium text-purple-600 dark:text-purple-400 mt-0.5">
            {nextUpcoming
              ? `${formatShortDate(nextUpcoming.date)}${
                  (nextUpcoming as { time?: string }).time
                    ? ` · ${(nextUpcoming as { time?: string }).time}`
                    : ''
                }`
              : 'Disfruta tu tiempo'}
          </p>
        </div>
      </div>

      {/* 3. Task Deadlines Smart Alert Banner System */}
      {urgentTaskAlerts.length > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400">
              <Flame className="w-4 h-4 text-rose-500" />
              Alertas de entregas prioritarias
            </div>
            <span className="text-xs text-slate-400">
              {urgentTaskAlerts.length} aviso{urgentTaskAlerts.length > 1 ? 's' : ''}
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
            {urgentTaskAlerts.slice(0, 4).map((alert) => (
              <div
                key={alert!.id}
                className={`p-3.5 rounded-2xl border flex items-center justify-between gap-3 transition-all hover:scale-[1.01] ${alert!.color}`}
              >
                <div className="flex items-center gap-3 min-w-0">
                  <span className={`w-2.5 h-2.5 rounded-full shrink-0 ${alert!.dot}`} />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-[10px] font-extrabold tracking-wider uppercase px-2 py-0.5 rounded-md bg-white/60 dark:bg-slate-900/60 shadow-2xs">
                        {alert!.badge}
                      </span>
                      {alert!.subjectName && (
                        <span className="text-xs font-medium opacity-80 truncate">
                          {alert!.subjectName}
                        </span>
                      )}
                    </div>
                    <p className="text-xs font-bold mt-1 text-slate-900 dark:text-white truncate">
                      {alert!.message}
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  onClick={() => setActiveTab('tasks')}
                  className="p-1.5 rounded-xl hover:bg-black/5 dark:hover:bg-white/10 shrink-0 text-slate-700 dark:text-slate-200"
                  aria-label="Ir a tareas"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 4. Split Dashboard Grid: Tasks & Goals/Timeline */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Left Column: Próximas tareas */}
        <div className="lg:col-span-7 space-y-6">
          {/* Tasks Section Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Próximas tareas
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Ordenadas por fecha de entrega
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('tasks')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ver todas ({tasks.length})
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {pendingTasks.length === 0 ? (
                <div className="py-10 text-center rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800">
                  <div className="w-12 h-12 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
                    ✨ ¡Todo limpio!
                  </h4>
                  <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                    No tienes tareas pendientes por ahora. ¡Disfruta tu tiempo libre!
                  </p>
                </div>
              ) : (
                pendingTasks.slice(0, 5).map((task) => {
                  const sub = subjectMap.get(task.subjectId);
                  const days = getDaysUntil(task.dueDate);

                  return (
                    <div
                      key={task.id}
                      className="group flex items-start justify-between gap-3 p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 hover:bg-slate-100/80 dark:hover:bg-slate-800 border border-slate-200/60 dark:border-slate-750 transition-all"
                    >
                      <div className="flex items-start gap-3 min-w-0">
                        {/* Checkbox */}
                        <button
                          type="button"
                          onClick={() => toggleTask(task.id)}
                          className="mt-0.5 w-5 h-5 rounded-lg border-2 border-slate-300 dark:border-slate-600 hover:border-indigo-600 dark:hover:border-indigo-400 flex items-center justify-center transition-colors shrink-0"
                          aria-label={`Completar tarea ${task.title}`}
                        >
                          <div className="w-2.5 h-2.5 rounded-sm bg-transparent group-hover:bg-indigo-500/20" />
                        </button>

                        <div className="min-w-0">
                          <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                            {task.title}
                          </p>
                          <div className="flex flex-wrap items-center gap-2 mt-1.5">
                            {sub && (
                              <SubjectBadge
                                name={sub.name}
                                color={sub.color}
                                code={sub.code}
                              />
                            )}
                            <PriorityBadge priority={task.priority} />
                          </div>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span
                          className={`text-xs font-bold ${
                            days <= 1
                              ? 'text-rose-600 dark:text-rose-400'
                              : days <= 3
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-slate-500 dark:text-slate-400'
                          }`}
                        >
                          {days === 0
                            ? 'Hoy'
                            : days === 1
                            ? 'Mañana'
                            : `${formatShortDate(task.dueDate)}`}
                        </span>
                        <p className="text-[10px] text-slate-400">
                          {days > 1 ? `en ${days} días` : 'urgente'}
                        </p>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Quick Action Tiles */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 sm:gap-3">
            <button
              type="button"
              onClick={() => {
                setEditingTask(null);
                setIsTaskModalOpen(true);
              }}
              className="p-3.5 rounded-2xl bg-indigo-50/50 dark:bg-indigo-950/30 hover:bg-indigo-50 dark:hover:bg-indigo-950/50 border border-indigo-100 dark:border-indigo-900/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-indigo-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Plus className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-indigo-900 dark:text-indigo-200">
                + Nueva tarea
              </p>
              <p className="text-[11px] text-indigo-600/80 dark:text-indigo-400">
                Agenda entrega
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('pomodoro')}
              className="p-3.5 rounded-2xl bg-rose-50/50 dark:bg-rose-950/30 hover:bg-rose-50 dark:hover:bg-rose-950/50 border border-rose-100 dark:border-rose-900/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-rose-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Timer className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-rose-900 dark:text-rose-200">
                Pomodoro ⏱️
              </p>
              <p className="text-[11px] text-rose-600/80 dark:text-rose-400">
                Bloque de estudio
              </p>
            </button>

            <button
              type="button"
              onClick={() => setIsEventModalOpen(true)}
              className="p-3.5 rounded-2xl bg-purple-50/50 dark:bg-purple-950/30 hover:bg-purple-50 dark:hover:bg-purple-950/50 border border-purple-100 dark:border-purple-900/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-purple-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Calendar className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-purple-900 dark:text-purple-200">
                + Nuevo evento
              </p>
              <p className="text-[11px] text-purple-600/80 dark:text-purple-400">
                Parcial o examen
              </p>
            </button>

            <button
              type="button"
              onClick={() => setActiveTab('grades')}
              className="p-3.5 rounded-2xl bg-emerald-50/50 dark:bg-emerald-950/30 hover:bg-emerald-50 dark:hover:bg-emerald-950/50 border border-emerald-100 dark:border-emerald-900/40 text-left transition-all group"
            >
              <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center mb-2 group-hover:scale-105 transition-transform">
                <Calculator className="w-4 h-4" />
              </div>
              <p className="text-xs font-bold text-emerald-900 dark:text-emerald-200">
                Calculadora
              </p>
              <p className="text-[11px] text-emerald-600/80 dark:text-emerald-400">
                Notas & cortes
              </p>
            </button>
          </div>
        </div>

        {/* Right Column: Metas & Próximas Fechas */}
        <div className="lg:col-span-5 space-y-6">
          {/* Metas Card */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Tus metas
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Progreso académico del semestre
                </p>
              </div>
              <button
                type="button"
                onClick={() => setIsGoalModalOpen(true)}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                + Nueva
              </button>
            </div>

            <div className="space-y-3">
              {goals.length === 0 ? (
                <div className="py-6 text-center text-xs text-slate-400 dark:text-slate-500">
                  🎯 Todavía no tienes metas definidas.
                  <button
                    type="button"
                    onClick={() => setIsGoalModalOpen(true)}
                    className="block mx-auto mt-2 text-indigo-600 font-semibold hover:underline"
                  >
                    Crear mi primera meta
                  </button>
                </div>
              ) : (
                goals.slice(0, 3).map((goal) => (
                  <div
                    key={goal.id}
                    className="p-3.5 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750 space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-900 dark:text-slate-100 truncate pr-2">
                        {goal.title}
                      </span>
                      <span className="text-xs font-extrabold text-indigo-600 dark:text-indigo-400">
                        {goal.progress}%
                      </span>
                    </div>
                    <ProgressBar progress={goal.progress} size="sm" />
                    {goal.deadline && (
                      <p className="text-[10px] text-slate-400 flex items-center gap-1">
                        <Clock className="w-3 h-3" />
                        Límite: {formatShortDate(goal.deadline)}
                      </p>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>

          {/* Próximas fechas en el Calendario */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Próximas fechas
                </h3>
                <p className="text-xs text-slate-400 dark:text-slate-500">
                  Exámenes y eventos cercanos
                </p>
              </div>
              <button
                type="button"
                onClick={() => setActiveTab('calendar')}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                Ver calendario
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>

            <div className="space-y-2.5">
              {combinedUpcoming.length === 0 ? (
                <p className="text-xs text-slate-400 text-center py-4">
                  📅 Tu calendario está libre de eventos próximos.
                </p>
              ) : (
                combinedUpcoming.slice(0, 4).map((item) => {
                  const sub = item.subjectId ? subjectMap.get(item.subjectId) : null;
                  const isExam = item.type === 'exam';

                  return (
                    <div
                      key={item.id}
                      className="flex items-center justify-between p-3 rounded-2xl bg-slate-50/70 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750 text-xs"
                    >
                      <div className="flex items-center gap-2.5 min-w-0">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center text-xs font-bold shrink-0 ${
                            isExam
                              ? 'bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300'
                              : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                          }`}
                        >
                          {isExam ? 'Ex' : 'Ev'}
                        </div>
                        <div className="min-w-0">
                          <p className="font-bold text-slate-900 dark:text-slate-100 truncate">
                            {item.title}
                          </p>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">
                            {sub ? sub.name : 'General'}
                          </p>
                        </div>
                      </div>

                      <span className="font-semibold text-slate-600 dark:text-slate-300 shrink-0 ml-2">
                        {formatShortDate(item.date)}
                      </span>
                    </div>
                  );
                })
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Modals */}
      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => {
          setIsTaskModalOpen(false);
          setEditingTask(null);
        }}
        taskToEdit={editingTask}
      />
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => setIsEventModalOpen(false)}
      />
      <GoalModal
        isOpen={isGoalModalOpen}
        onClose={() => setIsGoalModalOpen(false)}
      />
    </div>
  );
};
