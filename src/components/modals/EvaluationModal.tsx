import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Evaluation } from '../../types';

interface EvaluationModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectId: string;
  evalToEdit?: Evaluation | null;
  currentTotalWeight?: number;
  maxGrade?: number;
}

export const EvaluationModal: React.FC<EvaluationModalProps> = ({
  isOpen,
  onClose,
  subjectId,
  evalToEdit,
  currentTotalWeight = 0,
  maxGrade = 5.0,
}) => {
  const { addEvaluation, updateEvaluation } = useApp();

  const [name, setName] = useState('');
  const [weight, setWeight] = useState<number | string>(25);
  const [grade, setGrade] = useState<number | string>('');
  const [isGraded, setIsGraded] = useState(false);
  const [error, setError] = useState('');

  const availableWeight = Math.max(
    0,
    100 - (currentTotalWeight - (evalToEdit ? evalToEdit.weight : 0))
  );

  useEffect(() => {
    if (evalToEdit) {
      setName(evalToEdit.name);
      setWeight(evalToEdit.weight);
      setGrade(evalToEdit.grade !== undefined ? evalToEdit.grade : '');
      setIsGraded(evalToEdit.isGraded);
      setError('');
    } else {
      setName('');
      setWeight(availableWeight > 0 ? availableWeight : 20);
      setGrade('');
      setIsGraded(false);
      setError('');
    }
  }, [evalToEdit, isOpen, availableWeight]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor ingresa un nombre para la evaluación.');
      return;
    }

    const numWeight = Number(weight);
    if (isNaN(numWeight) || numWeight <= 0 || numWeight > 100) {
      setError('El porcentaje debe ser un número entre 1% y 100%.');
      return;
    }

    let numGrade: number | undefined = undefined;
    if (isGraded) {
      numGrade = Number(grade);
      if (isNaN(numGrade) || numGrade < 0 || numGrade > maxGrade) {
        setError(`La nota obtenida debe estar entre 0.0 y ${maxGrade}.`);
        return;
      }
    }

    if (evalToEdit) {
      updateEvaluation(subjectId, evalToEdit.id, {
        name: name.trim(),
        weight: numWeight,
        grade: isGraded ? numGrade : undefined,
        isGraded,
      });
    } else {
      addEvaluation(subjectId, {
        name: name.trim(),
        weight: numWeight,
        grade: isGraded ? numGrade : undefined,
        isGraded,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={evalToEdit ? 'Editar Evaluación' : 'Nueva Evaluación'}
      subtitle="Define el peso porcentual y tu calificación"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        {/* Evaluation Name */}
        <div>
          <label
            htmlFor="eval-name-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Nombre de la evaluación <span className="text-rose-500">*</span>
          </label>
          <input
            id="eval-name-input"
            type="text"
            placeholder="Ej. Parcial 1 / Taller Práctico / Proyecto Final"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            autoFocus
          />
        </div>

        {/* Weight (%) */}
        <div>
          <div className="flex justify-between items-center mb-1.5">
            <label
              htmlFor="eval-weight-input"
              className="text-xs font-semibold text-slate-700 dark:text-slate-300"
            >
              Porcentaje del curso (%) <span className="text-rose-500">*</span>
            </label>
            <span className="text-[11px] text-slate-400">
              Disponible: {availableWeight}%
            </span>
          </div>
          <div className="relative">
            <input
              id="eval-weight-input"
              type="number"
              min="1"
              max="100"
              step="0.5"
              placeholder="Ej. 30"
              value={weight}
              onChange={(e) => setWeight(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all pr-8"
            />
            <span className="absolute right-3 top-2.5 text-sm font-semibold text-slate-400">
              %
            </span>
          </div>
        </div>

        {/* Already Graded Toggle */}
        <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750 space-y-3">
          <label className="flex items-center justify-between cursor-pointer">
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200">
              ¿Ya tienes la nota de esta evaluación?
            </span>
            <input
              id="eval-isgraded-toggle"
              type="checkbox"
              checked={isGraded}
              onChange={(e) => setIsGraded(e.target.checked)}
              className="w-4 h-4 text-indigo-600 rounded-sm focus:ring-indigo-500 accent-indigo-600 cursor-pointer"
            />
          </label>

          {isGraded && (
            <div>
              <label
                htmlFor="eval-grade-input"
                className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1"
              >
                Nota obtenida (Escala 0.0 - {maxGrade.toFixed(1)})
              </label>
              <input
                id="eval-grade-input"
                type="number"
                min="0"
                max={maxGrade}
                step="0.01"
                placeholder={`Ej. 4.2`}
                value={grade}
                onChange={(e) => setGrade(e.target.value)}
                className="w-full px-3.5 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
              />
            </div>
          )}
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
            id="eval-save-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            {evalToEdit ? 'Guardar Cambios' : 'Agregar Evaluación'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
