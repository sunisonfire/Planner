import React, { useState, useMemo } from 'react';
import {
  Plus,
  Search,
  Filter,
  CheckCircle2,
  Calendar,
  Edit2,
  Trash2,
  ArrowUpDown,
  Check,
  Sparkles,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Task, Priority } from '../types';
import { PriorityBadge, SubjectBadge } from '../components/common/Badge';
import { TaskModal } from '../components/modals/TaskModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { EmptyState } from '../components/common/EmptyState';
import { getDueAlert, formatDisplayDate, getDaysUntil } from '../utils/dates';

type SortOption = 'dueDateAsc' | 'dueDateDesc' | 'priority' | 'title' | 'subject';

export const Tasks: React.FC = () => {
  const { tasks, subjects, toggleTask, deleteTask, playSound } = useApp();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [taskToEdit, setTaskToEdit] = useState<Task | null>(null);
  const [taskToDelete, setTaskToDelete] = useState<Task | null>(null);

  // Filters & Dynamic Ordering
  const [statusFilter, setStatusFilter] = useState<'all' | 'pending' | 'completed'>('pending');
  const [subjectFilter, setSubjectFilter] = useState<string>('all');
  const [priorityFilter, setPriorityFilter] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [sortBy, setSortBy] = useState<SortOption>('dueDateAsc');

  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const priorityScore: Record<Priority, number> = {
    high: 3,
    medium: 2,
    low: 1,
  };

  const filteredTasks = useMemo(() => {
    return tasks
      .filter((task) => {
        // Status filter
        if (statusFilter === 'pending' && task.completed) return false;
        if (statusFilter === 'completed' && !task.completed) return false;

        // Subject filter
        if (subjectFilter !== 'all' && task.subjectId !== subjectFilter) return false;

        // Priority filter
        if (priorityFilter !== 'all' && task.priority !== priorityFilter) return false;

        // Search query
        if (searchQuery.trim()) {
          const q = searchQuery.toLowerCase();
          const titleMatch = task.title.toLowerCase().includes(q);
          const descMatch = task.description?.toLowerCase().includes(q);
          const sub = subjectMap.get(task.subjectId);
          const subMatch = sub ? sub.name.toLowerCase().includes(q) : false;
          if (!titleMatch && !descMatch && !subMatch) return false;
        }

        return true;
      })
      .sort((a, b) => {
        // First sort by completion if in "all" view
        if (statusFilter === 'all' && a.completed !== b.completed) {
          return a.completed ? 1 : -1;
        }

        // Dynamic Sorting based on user selection
        switch (sortBy) {
          case 'dueDateAsc':
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
          case 'dueDateDesc':
            return new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime();
          case 'priority':
            return (priorityScore[b.priority] || 0) - (priorityScore[a.priority] || 0);
          case 'title':
            return a.title.localeCompare(b.title);
          case 'subject': {
            const subA = subjectMap.get(a.subjectId)?.name || '';
            const subB = subjectMap.get(b.subjectId)?.name || '';
            return subA.localeCompare(subB);
          }
          default:
            return new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime();
        }
      });
  }, [tasks, statusFilter, subjectFilter, priorityFilter, searchQuery, sortBy, subjectMap]);

  const pendingCount = tasks.filter((t) => !t.completed).length;
  const completedCount = tasks.filter((t) => t.completed).length;

  return (
    <div className="space-y-4 pb-8">
      {/* Header & Main Action */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            Mis tareas 📝
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Organiza tus entregas, talleres y proyectos académicos con orden dinámico
          </p>
        </div>

        <button
          id="tasks-add-btn"
          type="button"
          onClick={() => {
            playSound('pop');
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
          className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
        >
          <Plus className="w-4 h-4" />
          + Nueva tarea
        </button>
      </div>

      {/* Filter & Dynamic Ordering Toolbar */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-3">
        {/* Status Tabs & Search */}
        <div className="flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
          {/* Status Tabs */}
          <div className="flex items-center gap-1.5 p-1 rounded-xl bg-slate-100 dark:bg-slate-800 shrink-0 overflow-x-auto">
            <button
              type="button"
              onClick={() => setStatusFilter('pending')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'pending'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Pendientes ({pendingCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('completed')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'completed'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Completadas ({completedCount})
            </button>
            <button
              type="button"
              onClick={() => setStatusFilter('all')}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
                statusFilter === 'all'
                  ? 'bg-white dark:bg-slate-900 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              Todas ({tasks.length})
            </button>
          </div>

          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 absolute left-3 top-2.5 text-slate-400" />
            <input
              id="tasks-search-input"
              type="text"
              placeholder="Buscar por título, materia o descripción..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-9 pr-4 py-2 text-xs rounded-xl border border-slate-200 dark:border-slate-750 bg-slate-50/50 dark:bg-slate-800/60 text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500"
            />
          </div>
        </div>

        {/* Secondary dropdown filters and Dynamic Sort */}
        <div className="flex flex-wrap items-center justify-between gap-2.5 pt-2 border-t border-slate-100 dark:border-slate-800/80">
          <div className="flex flex-wrap items-center gap-2">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Filtros:</span>
            </div>

            {/* Subject Filter */}
            <select
              id="tasks-filter-subject"
              value={subjectFilter}
              onChange={(e) => setSubjectFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200"
            >
              <option value="all">Todas las materias</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name}
                </option>
              ))}
            </select>

            {/* Priority Filter */}
            <select
              id="tasks-filter-priority"
              value={priorityFilter}
              onChange={(e) => setPriorityFilter(e.target.value)}
              className="px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800 text-xs text-slate-700 dark:text-slate-200"
            >
              <option value="all">Todas las prioridades</option>
              <option value="high">🔴 Alta</option>
              <option value="medium">🟡 Media</option>
              <option value="low">🟢 Baja</option>
            </select>
          </div>

          {/* Dynamic Order Selector */}
          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400" />
              <span className="hidden sm:inline">Orden:</span>
            </div>
            <select
              id="tasks-sort-select"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="px-2.5 py-1 rounded-lg border border-indigo-200 dark:border-indigo-900 bg-indigo-50/50 dark:bg-indigo-950/40 text-xs font-semibold text-indigo-700 dark:text-indigo-300"
            >
              <option value="dueDateAsc">📅 Próximas a vencer</option>
              <option value="dueDateDesc">📆 Fecha más lejana</option>
              <option value="priority">🔥 Mayor prioridad</option>
              <option value="title">🔤 Título A-Z</option>
              <option value="subject">📚 Por Materia</option>
            </select>

            {(subjectFilter !== 'all' || priorityFilter !== 'all' || searchQuery) && (
              <button
                type="button"
                onClick={() => {
                  setSubjectFilter('all');
                  setPriorityFilter('all');
                  setSearchQuery('');
                }}
                className="text-xs font-semibold text-rose-600 dark:text-rose-400 hover:underline ml-2"
              >
                Limpiar
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Task List */}
      {filteredTasks.length === 0 ? (
        <EmptyState
          icon={CheckCircle2}
          title={
            statusFilter === 'completed'
              ? 'Aún no tienes tareas completadas'
              : '✨ Todo limpio'
          }
          description={
            statusFilter === 'completed'
              ? 'Cuando marques tus tareas como terminadas aparecerán aquí.'
              : 'No tienes tareas pendientes que coincidan con los filtros seleccionados.'
          }
          actionText="+ Crear nueva tarea"
          onAction={() => {
            setTaskToEdit(null);
            setIsModalOpen(true);
          }}
        />
      ) : (
        <div className="space-y-3">
          {filteredTasks.map((task) => {
            const sub = subjectMap.get(task.subjectId);
            const alertInfo = getDueAlert(task.dueDate);
            const isFinished = task.completed;

            return (
              <div
                key={task.id}
                className={`group p-4 sm:p-5 rounded-2xl border transition-all ${
                  isFinished
                    ? 'bg-slate-50/60 dark:bg-slate-900/40 border-slate-200/50 dark:border-slate-800/50 opacity-70'
                    : 'bg-white dark:bg-slate-900 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300 dark:hover:border-indigo-800 shadow-xs'
                }`}
              >
                <div className="flex items-start justify-between gap-4">
                  {/* Checkbox and Info */}
                  <div className="flex items-start gap-3.5 min-w-0 flex-1">
                    <button
                      type="button"
                      onClick={() => toggleTask(task.id)}
                      className={`mt-0.5 w-6 h-6 rounded-xl border-2 flex items-center justify-center transition-all shrink-0 ${
                        isFinished
                          ? 'bg-emerald-600 border-emerald-600 text-white'
                          : 'border-slate-300 dark:border-slate-600 hover:border-indigo-600'
                      }`}
                      aria-label={isFinished ? 'Marcar como pendiente' : 'Marcar como completada'}
                    >
                      {isFinished && <Check className="w-3.5 h-3.5 stroke-[3]" />}
                    </button>

                    <div className="min-w-0 flex-1">
                      <div className="flex flex-wrap items-center gap-2 mb-1">
                        {sub && (
                          <SubjectBadge
                            name={sub.name}
                            color={sub.color}
                            code={sub.code}
                          />
                        )}
                        <PriorityBadge priority={task.priority} />
                        
                        {!isFinished && alertInfo.type !== 'none' && (
                          <span
                            className={`px-2 py-0.5 rounded-md text-[10px] font-extrabold uppercase tracking-wider ${
                              alertInfo.type === 'urgent'
                                ? 'bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                                : alertInfo.type === 'high'
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300'
                                : alertInfo.type === 'overdue'
                                ? 'bg-red-100 text-red-700 dark:bg-red-950 dark:text-red-300'
                                : 'bg-indigo-100 text-indigo-700 dark:bg-indigo-950 dark:text-indigo-300'
                            }`}
                          >
                            {alertInfo.badgeText}
                          </span>
                        )}
                      </div>

                      <h3
                        className={`text-base font-bold text-slate-900 dark:text-white leading-snug ${
                          isFinished ? 'line-through text-slate-400 dark:text-slate-500' : ''
                        }`}
                      >
                        {task.title}
                      </h3>

                      {task.description && (
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {task.description}
                        </p>
                      )}

                      <div className="flex items-center gap-4 mt-3 text-xs text-slate-400 dark:text-slate-500">
                        <span className="inline-flex items-center gap-1">
                          <Calendar className="w-3.5 h-3.5" />
                          Entrega: <strong className="text-slate-700 dark:text-slate-300">{formatDisplayDate(task.dueDate)}</strong>
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-1 shrink-0 opacity-80 sm:opacity-0 group-hover:opacity-100 transition-opacity">
                    <button
                      type="button"
                      onClick={() => {
                        playSound('pop');
                        setTaskToEdit(task);
                        setIsModalOpen(true);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Editar tarea"
                    >
                      <Edit2 className="w-4 h-4" />
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        playSound('pop');
                        setTaskToDelete(task);
                      }}
                      className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-slate-800 transition-colors"
                      aria-label="Eliminar tarea"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Modals */}
      <TaskModal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          setTaskToEdit(null);
        }}
        taskToEdit={taskToEdit}
      />

      <ConfirmationModal
        isOpen={!!taskToDelete}
        onClose={() => setTaskToDelete(null)}
        onConfirm={() => {
          if (taskToDelete) {
            deleteTask(taskToDelete.id);
            setTaskToDelete(null);
          }
        }}
        title="Eliminar tarea"
        message={`¿Seguro que quieres eliminar la tarea "${taskToDelete?.title}"? Esta acción no se puede deshacer.`}
        confirmText="Eliminar tarea"
      />
    </div>
  );
};
