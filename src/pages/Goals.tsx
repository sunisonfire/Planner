import React, { useState } from 'react';
import {
  Target,
  Plus,
  Edit2,
  Trash2,
  CheckCircle2,
  Sparkles,
  Calendar,
  Award,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Goal } from '../types';
import { ProgressBar } from '../components/common/ProgressBar';
import { GoalModal } from '../components/modals/GoalModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { formatDisplayDate } from '../utils/dates';

export const Goals: React.FC = () => {
  const { goals, updateGoalProgress, deleteGoal } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToEdit, setGoalToEdit] = useState<Goal | null>(null);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  const activeGoals = goals.filter((g) => !g.completed && g.progress < 100);
  const completedGoals = goals.filter((g) => g.completed || g.progress >= 100);

  const handleIncrement = (goal: Goal, amount: number) => {
    const nextVal = Math.min(100, Math.max(0, goal.progress + amount));
    updateGoalProgress(goal.id, nextVal);
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            Mis metas académicas 🎯
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Define objetivos de semestre, notas promedio y proyectos clave
          </p>
        </div>

        <button
          id="goals-add-btn"
          type="button"
          onClick={() => {
            setGoalToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          + Nueva meta
        </button>
      </div>

      {goals.length === 0 ? (
        <EmptyState
          icon={Target}
          title="🎯 Todavía no tienes metas"
          description="Crea tu primer objetivo académico del semestre y sigue tu progreso paso a paso."
          actionText="+ Crear mi primera meta"
          onAction={() => {
            setGoalToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-8">
          {/* Active Goals Section */}
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-base font-bold text-slate-900 dark:text-white font-display flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-indigo-600" />
                En progreso ({activeGoals.length})
              </h2>
            </div>

            {activeGoals.length === 0 ? (
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center text-xs text-slate-400">
                ¡Todas tus metas actuales están completadas! Puedes agregar nuevos desafíos.
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {activeGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 transition-all shadow-xs space-y-4 flex flex-col justify-between"
                  >
                    <div className="space-y-2">
                      <div className="flex items-start justify-between gap-3">
                        <h3 className="text-base font-bold text-slate-900 dark:text-white leading-snug">
                          {goal.title}
                        </h3>
                        <div className="flex items-center gap-1 shrink-0">
                          <button
                            type="button"
                            onClick={() => {
                              setGoalToEdit(goal);
                              setIsModalOpen(true);
                            }}
                            className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            aria-label="Editar meta"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setGoalToDelete(goal)}
                            className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                            aria-label="Eliminar meta"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </div>

                      {goal.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          {goal.description}
                        </p>
                      )}

                      {goal.deadline && (
                        <div className="flex items-center gap-1 text-[11px] text-slate-400">
                          <Calendar className="w-3 h-3" />
                          Límite: {formatDisplayDate(goal.deadline)}
                        </div>
                      )}
                    </div>

                    {/* Progress Bar & Quick Adjustments */}
                    <div className="space-y-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between text-xs font-bold">
                        <span className="text-slate-500 dark:text-slate-400">Progreso</span>
                        <span className="text-indigo-600 dark:text-indigo-400 text-sm">
                          {goal.progress}%
                        </span>
                      </div>

                      <ProgressBar progress={goal.progress} size="md" />

                      {/* Quick Increments */}
                      <div className="flex items-center justify-between gap-1.5 pt-1">
                        <div className="flex items-center gap-1">
                          <button
                            type="button"
                            onClick={() => handleIncrement(goal, -10)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            -10%
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIncrement(goal, 10)}
                            className="px-2 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-[11px] font-semibold text-slate-700 dark:text-slate-300 transition-colors"
                          >
                            +10%
                          </button>
                          <button
                            type="button"
                            onClick={() => handleIncrement(goal, 25)}
                            className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/50 hover:bg-indigo-100 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 transition-colors"
                          >
                            +25%
                          </button>
                        </div>

                        <button
                          type="button"
                          onClick={() => updateGoalProgress(goal.id, 100)}
                          className="px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white text-[11px] font-bold transition-all shadow-2xs"
                        >
                          ¡Completar 100%!
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Completed Goals Section */}
          {completedGoals.length > 0 && (
            <div className="space-y-4 pt-4 border-t border-slate-200 dark:border-slate-800">
              <div className="flex items-center gap-2">
                <Award className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Metas alcanzadas ({completedGoals.length})
                </h2>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {completedGoals.map((goal) => (
                  <div
                    key={goal.id}
                    className="p-5 rounded-3xl bg-emerald-50/40 dark:bg-emerald-950/20 border border-emerald-200/80 dark:border-emerald-900/40 space-y-3"
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-5 h-5 text-emerald-600 dark:text-emerald-400 shrink-0" />
                        <h3 className="text-sm font-bold text-slate-900 dark:text-white">
                          {goal.title}
                        </h3>
                      </div>
                      <button
                        type="button"
                        onClick={() => setGoalToDelete(goal)}
                        className="p-1 text-slate-400 hover:text-rose-600"
                        aria-label="Eliminar meta"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    <ProgressBar progress={100} color="#10b981" size="sm" />

                    <div className="flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
                      <span>🎉 ¡Meta 100% completada!</span>
                      <button
                        type="button"
                        onClick={() => updateGoalProgress(goal.id, 90)}
                        className="text-[11px] text-slate-500 hover:underline"
                      >
                        Reabrir meta
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Modals */}
      <GoalModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setGoalToEdit(null);
        }}
        goalToEdit={goalToEdit}
      />

      <ConfirmationModal
        isOpen={!!goalToDelete}
        onClose={() => setGoalToDelete(null)}
        onConfirm={() => {
          if (goalToDelete) {
            deleteGoal(goalToDelete.id);
            setGoalToDelete(null);
          }
        }}
        title="Eliminar meta"
        message={`¿Seguro que deseas eliminar la meta "${goalToDelete?.title}"?`}
        confirmText="Eliminar meta"
      />
    </div>
  );
};
