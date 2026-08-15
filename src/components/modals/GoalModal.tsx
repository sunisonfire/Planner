import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Goal } from '../../types';

interface GoalModalProps {
  isOpen: boolean;
  onClose: () => void;
  goalToEdit?: Goal | null;
}

export const GoalModal: React.FC<GoalModalProps> = ({
  isOpen,
  onClose,
  goalToEdit,
}) => {
  const { addGoal, updateGoal } = useApp();

  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [deadline, setDeadline] = useState('');
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState('');

  useEffect(() => {
    if (goalToEdit) {
      setTitle(goalToEdit.title);
      setDescription(goalToEdit.description || '');
      setDeadline(goalToEdit.deadline || '');
      setProgress(goalToEdit.progress);
      setError('');
    } else {
      setTitle('');
      setDescription('');
      setDeadline('');
      setProgress(0);
      setError('');
    }
  }, [goalToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor ingresa un título para la meta.');
      return;
    }

    const cleanProgress = Math.min(100, Math.max(0, Number(progress) || 0));

    if (goalToEdit) {
      updateGoal(goalToEdit.id, {
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        progress: cleanProgress,
        completed: cleanProgress >= 100,
      });
    } else {
      addGoal({
        title: title.trim(),
        description: description.trim() || undefined,
        deadline: deadline || undefined,
        progress: cleanProgress,
        completed: cleanProgress >= 100,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={goalToEdit ? 'Editar Meta' : 'Nueva Meta Académica'}
      subtitle="Define objetivos claros para tu semestre universitario"
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
            htmlFor="goal-title-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Título de la meta <span className="text-rose-500">*</span>
          </label>
          <input
            id="goal-title-input"
            type="text"
            placeholder="Ej. Promedio ponderado superior a 4.2"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            autoFocus
          />
        </div>

        {/* Progress Slider */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="goal-progress-slider"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Progreso actual: <span className="text-indigo-600 dark:text-indigo-400 font-bold">{progress}%</span>
            </label>
            {progress >= 100 && (
              <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                🎉 ¡Completada!
              </span>
            )}
          </div>
          <input
            id="goal-progress-slider"
            type="range"
            min="0"
            max="100"
            step="5"
            value={progress}
            onChange={(e) => setProgress(Number(e.target.value))}
            className="w-full h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-indigo-600"
          />
          <div className="flex justify-between text-[10px] text-slate-400 mt-1">
            <span>0% (Inicio)</span>
            <span>50% (Mitad)</span>
            <span>100% (Lograda)</span>
          </div>
        </div>

        {/* Deadline */}
        <div>
          <label
            htmlFor="goal-deadline-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Fecha límite estimada (opcional)
          </label>
          <input
            id="goal-deadline-input"
            type="date"
            value={deadline}
            onChange={(e) => setDeadline(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="goal-desc-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Detalles o plan de acción
          </label>
          <textarea
            id="goal-desc-input"
            rows={3}
            placeholder="¿Qué pasos vas a seguir para cumplir esta meta?"
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
            id="goal-save-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            {goalToEdit ? 'Guardar Cambios' : 'Crear Meta'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
