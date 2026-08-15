import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Task, Priority } from '../../types';
import { formatToYMD } from '../../utils/dates';

interface TaskModalProps {
  isOpen: boolean;
  onClose: () => void;
  taskToEdit?: Task | null;
  defaultSubjectId?: string;
  defaultDueDate?: string;
}

export const TaskModal: React.FC<TaskModalProps> = ({
  isOpen,
  onClose,
  taskToEdit,
  defaultSubjectId,
  defaultDueDate,
}) => {
  const { subjects, addTask, updateTask } = useApp();

  const [title, setTitle] = useState('');
  const [subjectId, setSubjectId] = useState('');
  const [description, setDescription] = useState('');
  const [dueDate, setDueDate] = useState('');
  const [priority, setPriority] = useState<Priority>('medium');
  const [error, setError] = useState('');

  useEffect(() => {
    if (taskToEdit) {
      setTitle(taskToEdit.title);
      setSubjectId(taskToEdit.subjectId);
      setDescription(taskToEdit.description || '');
      setDueDate(taskToEdit.dueDate);
      setPriority(taskToEdit.priority);
      setError('');
    } else {
      setTitle('');
      setSubjectId(defaultSubjectId || (subjects.length > 0 ? subjects[0].id : ''));
      setDescription('');
      setDueDate(defaultDueDate || formatToYMD(new Date()));
      setPriority('medium');
      setError('');
    }
  }, [taskToEdit, defaultSubjectId, defaultDueDate, isOpen, subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor escribe un título para la tarea.');
      return;
    }
    if (!subjectId) {
      setError('Por favor selecciona una materia.');
      return;
    }
    if (!dueDate) {
      setError('Por favor selecciona una fecha de entrega.');
      return;
    }

    if (taskToEdit) {
      updateTask(taskToEdit.id, {
        title: title.trim(),
        subjectId,
        description: description.trim() || undefined,
        dueDate,
        priority,
      });
    } else {
      addTask({
        title: title.trim(),
        subjectId,
        description: description.trim() || undefined,
        dueDate,
        priority,
        completed: false,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={taskToEdit ? 'Editar Tarea' : 'Nueva Tarea'}
      subtitle="Organiza tus entregas universitarias a tiempo"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        {/* Title */}
        <div>
          <label
            htmlFor="task-title-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Título de la tarea <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-title-input"
            type="text"
            placeholder="Ej. Taller 2 de Álgebra Lineal"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            autoFocus
          />
        </div>

        {/* Subject & Priority Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="task-subject-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Materia <span className="text-rose-500">*</span>
            </label>
            <select
              id="task-subject-select"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              {subjects.length === 0 ? (
                <option value="">Sin materias registradas</option>
              ) : (
                subjects.map((sub) => (
                  <option key={sub.id} value={sub.id}>
                    {sub.name} {sub.code ? `(${sub.code})` : ''}
                  </option>
                ))
              )}
            </select>
          </div>

          <div>
            <label
              htmlFor="task-priority-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Prioridad
            </label>
            <select
              id="task-priority-select"
              value={priority}
              onChange={(e) => setPriority(e.target.value as Priority)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="low">🟢 Baja</option>
              <option value="medium">🟡 Media</option>
              <option value="high">🔴 Alta</option>
            </select>
          </div>
        </div>

        {/* Due Date */}
        <div>
          <label
            htmlFor="task-duedate-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Fecha de entrega <span className="text-rose-500">*</span>
          </label>
          <input
            id="task-duedate-input"
            type="date"
            value={dueDate}
            onChange={(e) => setDueDate(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="task-desc-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Descripción o notas (opcional)
          </label>
          <textarea
            id="task-desc-input"
            rows={3}
            placeholder="Instrucciones, enlace de entrega, formato requerido..."
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all resize-none"
          />
        </div>

        {/* Actions */}
        <div className="flex items-center justify-end gap-3 pt-4 border-t border-slate-100 dark:border-slate-800">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 text-sm font-medium text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
          >
            Cancelar
          </button>
          <button
            id="task-save-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            {taskToEdit ? 'Guardar Cambios' : 'Crear Tarea'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
