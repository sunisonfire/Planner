import React, { useState, useMemo } from 'react';
import {
  Calculator,
  Plus,
  Edit2,
  Trash2,
  AlertCircle,
  Sparkles,
  Award,
  BookOpen,
  Info,
  CheckCircle2,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { calculateSubjectGrades } from '../utils/grades';
import { Evaluation } from '../types';
import { EvaluationModal } from '../components/modals/EvaluationModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { SubjectModal } from '../components/modals/SubjectModal';
import { ProgressBar } from '../components/common/ProgressBar';

export const Grades: React.FC = () => {
  const {
    subjects,
    getSubjectGrades,
    updateSubjectGrades,
    deleteEvaluation,
  } = useApp();

  const [selectedSubjectId, setSelectedSubjectId] = useState<string>(() => {
    return subjects.length > 0 ? subjects[0].id : '';
  });

  const [isEvalModalOpen, setIsEvalModalOpen] = useState(false);
  const [evalToEdit, setEvalToEdit] = useState<Evaluation | null>(null);
  const [evalToDelete, setEvalToDelete] = useState<Evaluation | null>(null);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);

  // If selected subject was deleted or not set, fallback to first available
  const activeSubjectId = subjects.some((s) => s.id === selectedSubjectId)
    ? selectedSubjectId
    : subjects[0]?.id || '';

  const activeSubject = subjects.find((s) => s.id === activeSubjectId);
  const subjectGrades = getSubjectGrades(activeSubjectId);

  const calculations = useMemo(() => {
    return calculateSubjectGrades(
      subjectGrades.evaluations,
      subjectGrades.minPassingGrade,
      subjectGrades.maxGrade
    );
  }, [subjectGrades]);

  const handleMinPassingGradeChange = (val: number) => {
    updateSubjectGrades(activeSubjectId, {
      ...subjectGrades,
      minPassingGrade: val,
    });
  };

  const handleMaxGradeChange = (val: number) => {
    updateSubjectGrades(activeSubjectId, {
      ...subjectGrades,
      maxGrade: val,
    });
  };

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            Calculadora de Notas 🧮
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Calcula el promedio ponderado y descubre cuánto necesitas sacar para aprobar
          </p>
        </div>

        {subjects.length > 0 && (
          <button
            id="grades-add-eval-btn"
            type="button"
            onClick={() => {
              setEvalToEdit(null);
              setIsEvalModalOpen(true);
            }}
            className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95 shrink-0"
          >
            <Plus className="w-4 h-4" />
            + Agregar evaluación
          </button>
        )}
      </div>

      {subjects.length === 0 ? (
        <div className="p-12 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center space-y-4 shadow-xs">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 dark:bg-indigo-950/50 text-indigo-600 flex items-center justify-center mx-auto">
            <BookOpen className="w-7 h-7" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
            Primero agrega tus materias
          </h3>
          <p className="text-xs sm:text-sm text-slate-500 max-w-sm mx-auto">
            Para calcular tus notas ponderadas necesitas tener al menos una materia registrada.
          </p>
          <button
            type="button"
            onClick={() => setIsSubjectModalOpen(true)}
            className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-bold shadow-xs transition-all"
          >
            + Crear mi primera materia
          </button>
        </div>
      ) : (
        <div className="space-y-6">
          {/* Subject Switcher Tabs */}
          <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
            {subjects.map((sub) => {
              const isCurrent = sub.id === activeSubjectId;
              return (
                <button
                  key={sub.id}
                  type="button"
                  onClick={() => setSelectedSubjectId(sub.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-2xl text-xs font-bold transition-all whitespace-nowrap border shrink-0 ${
                    isCurrent
                      ? 'bg-indigo-600 text-white border-indigo-600 shadow-sm shadow-indigo-500/20'
                      : 'bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-300 border-slate-200/80 dark:border-slate-800 hover:border-indigo-300'
                  }`}
                >
                  <span
                    className="w-2.5 h-2.5 rounded-full"
                    style={{ backgroundColor: sub.color }}
                  />
                  <span>{sub.name}</span>
                </button>
              );
            })}
          </div>

          {/* Configuration Banner: Minimum passing grade & max grade */}
          <div className="bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-3xl border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <span
                className="w-4 h-4 rounded-full shrink-0"
                style={{ backgroundColor: activeSubject?.color || '#6366f1' }}
              />
              <div>
                <h2 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  {activeSubject?.name} {activeSubject?.code ? `(${activeSubject.code})` : ''}
                </h2>
                <p className="text-xs text-slate-400">
                  Ajusta la nota aprobatoria y la escala del curso
                </p>
              </div>
            </div>

            <div className="flex items-center gap-4 flex-wrap">
              <div className="flex items-center gap-2">
                <label
                  htmlFor="min-passing-grade-input"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Nota mínima para aprobar:
                </label>
                <input
                  id="min-passing-grade-input"
                  type="number"
                  step="0.1"
                  min="0"
                  max={subjectGrades.maxGrade || 5.0}
                  value={subjectGrades.minPassingGrade}
                  onChange={(e) => handleMinPassingGradeChange(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs font-bold text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>

              <div className="flex items-center gap-2">
                <label
                  htmlFor="max-grade-input"
                  className="text-xs font-semibold text-slate-600 dark:text-slate-300"
                >
                  Nota máxima:
                </label>
                <input
                  id="max-grade-input"
                  type="number"
                  step="0.1"
                  min="1"
                  max="100"
                  value={subjectGrades.maxGrade}
                  onChange={(e) => handleMaxGradeChange(Number(e.target.value))}
                  className="w-16 px-2 py-1 text-xs font-bold text-center rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-900 dark:text-white"
                />
              </div>
            </div>
          </div>

          {/* Key Calculation Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {/* Nota Acumulada */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-1">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                Nota Acumulada
              </p>
              <div className="flex items-baseline gap-2">
                <span className="text-3xl sm:text-4xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                  {calculations.accumulatedGrade.toFixed(2)}
                </span>
                <span className="text-xs text-slate-400">
                  / {subjectGrades.maxGrade.toFixed(1)}
                </span>
              </div>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                Puntos ganados hasta ahora
              </p>
            </div>

            {/* Porcentaje Evaluado */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Evaluado
                </p>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {calculations.gradedPercentage}%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {calculations.gradedPercentage}%
              </p>
              <ProgressBar progress={calculations.gradedPercentage} size="sm" />
            </div>

            {/* Porcentaje Restante */}
            <div className="p-5 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-2">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider">
                  Por evaluar
                </p>
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300">
                  {calculations.remainingPercentage}%
                </span>
              </div>
              <p className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white font-display">
                {calculations.remainingPercentage}%
              </p>
              <ProgressBar
                progress={calculations.remainingPercentage}
                color="#f59e0b"
                size="sm"
              />
            </div>
          </div>

          {/* Diagnostic: "¿Qué necesitas sacar?" */}
          <div
            className={`p-6 rounded-3xl border shadow-xs space-y-3 transition-all ${
              calculations.status === 'passed_already' || calculations.status === 'finished_passed'
                ? 'bg-emerald-500/10 border-emerald-500/30 text-emerald-950 dark:text-emerald-200'
                : calculations.status === 'impossible' || calculations.status === 'finished_failed'
                ? 'bg-rose-500/10 border-rose-500/30 text-rose-950 dark:text-rose-200'
                : 'bg-indigo-500/10 border-indigo-500/30 text-indigo-950 dark:text-indigo-200'
            }`}
          >
            <div className="flex items-center gap-2 text-xs font-bold uppercase tracking-wider opacity-80">
              <Sparkles className="w-4 h-4" />
              Diagnóstico del corte académico
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <h3 className="text-lg sm:text-xl font-bold font-display">
                  {calculations.statusMessage}
                </h3>
                {calculations.requiredGrade !== null && calculations.requiredGrade > 0 && calculations.requiredGrade <= subjectGrades.maxGrade && (
                  <p className="text-xs opacity-80">
                    Fórmula aplicada: ({subjectGrades.minPassingGrade} - {calculations.accumulatedGrade}) / {calculations.remainingPercentage}% restante.
                  </p>
                )}
              </div>

              {calculations.requiredGrade !== null && calculations.requiredGrade > 0 && calculations.requiredGrade <= subjectGrades.maxGrade && (
                <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 text-center shrink-0 shadow-xs">
                  <span className="text-[11px] font-bold text-slate-400 block uppercase">
                    Nota mínima requerida
                  </span>
                  <span className="text-3xl font-extrabold text-indigo-600 dark:text-indigo-400 font-display">
                    {calculations.requiredGrade.toFixed(2)}
                  </span>
                </div>
              )}
            </div>
          </div>

          {/* Percentage Sum Warning if not 100% */}
          {calculations.totalConfiguredPercentage !== 100 && (
            <div className="p-3.5 rounded-2xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 flex items-center gap-3 text-xs">
              <AlertCircle className="w-4 h-4 shrink-0 text-amber-600" />
              <span>
                Los porcentajes de tus evaluaciones suman actualmente{' '}
                <strong>{calculations.totalConfiguredPercentage}%</strong>. Se recomienda que sumen exactamente 100% para un cálculo perfecto.
              </span>
            </div>
          )}

          {/* Evaluations Table Section */}
          <div className="bg-white dark:bg-slate-900 rounded-3xl p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-base font-bold text-slate-900 dark:text-white font-display">
                  Evaluaciones de la materia ({subjectGrades.evaluations.length})
                </h3>
                <p className="text-xs text-slate-400">
                  Parciales, quices, talleres, laboratorios y proyectos
                </p>
              </div>

              <button
                type="button"
                onClick={() => {
                  setEvalToEdit(null);
                  setIsEvalModalOpen(true);
                }}
                className="inline-flex items-center gap-1 text-xs font-bold text-indigo-600 dark:text-indigo-400 hover:underline"
              >
                <Plus className="w-3.5 h-3.5" />
                + Agregar evaluación
              </button>
            </div>

            {subjectGrades.evaluations.length === 0 ? (
              <div className="py-12 text-center rounded-2xl bg-slate-50/50 dark:bg-slate-800/30 border border-slate-100 dark:border-slate-800 space-y-2">
                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300">
                  No has agregado evaluaciones para {activeSubject?.name}
                </p>
                <p className="text-[11px] text-slate-400 max-w-sm mx-auto">
                  Agrega las notas estipuladas en el sílabo o programa de la materia para proyectar tu nota.
                </p>
                <button
                  type="button"
                  onClick={() => {
                    setEvalToEdit(null);
                    setIsEvalModalOpen(true);
                  }}
                  className="mt-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold transition-all shadow-xs"
                >
                  + Agregar primera evaluación
                </button>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-100 dark:border-slate-800 text-slate-400 font-bold uppercase tracking-wider">
                      <th className="py-3 px-3">Evaluación</th>
                      <th className="py-3 px-3">Peso (%)</th>
                      <th className="py-3 px-3">Estado</th>
                      <th className="py-3 px-3">Nota obtenida</th>
                      <th className="py-3 px-3 text-right">Aporte ponderado</th>
                      <th className="py-3 px-3 text-right">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-800/80">
                    {subjectGrades.evaluations.map((ev) => {
                      const contribution =
                        ev.isGraded && ev.grade !== undefined
                          ? ((ev.grade * ev.weight) / 100).toFixed(2)
                          : '—';

                      return (
                        <tr
                          key={ev.id}
                          className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40 transition-colors"
                        >
                          <td className="py-3.5 px-3 font-bold text-slate-900 dark:text-white">
                            {ev.name}
                          </td>
                          <td className="py-3.5 px-3 font-semibold text-slate-600 dark:text-slate-300">
                            {ev.weight}%
                          </td>
                          <td className="py-3.5 px-3">
                            {ev.isGraded ? (
                              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-bold text-[10px]">
                                <CheckCircle2 className="w-3 h-3" />
                                Calificada
                              </span>
                            ) : (
                              <span className="inline-flex items-center px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400 font-medium text-[10px]">
                                Pendiente
                              </span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 font-extrabold text-sm text-slate-900 dark:text-white">
                            {ev.isGraded && ev.grade !== undefined ? (
                              <span>{Number(ev.grade).toFixed(2)}</span>
                            ) : (
                              <span className="text-slate-400 font-normal">Pendiente</span>
                            )}
                          </td>
                          <td className="py-3.5 px-3 text-right font-bold text-indigo-600 dark:text-indigo-400">
                            +{contribution}
                          </td>
                          <td className="py-3.5 px-3 text-right">
                            <div className="flex items-center justify-end gap-1">
                              <button
                                type="button"
                                onClick={() => {
                                  setEvalToEdit(ev);
                                  setIsEvalModalOpen(true);
                                }}
                                className="p-1.5 text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                aria-label="Editar evaluación"
                              >
                                <Edit2 className="w-3.5 h-3.5" />
                              </button>
                              <button
                                type="button"
                                onClick={() => setEvalToDelete(ev)}
                                className="p-1.5 text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors"
                                aria-label="Eliminar evaluación"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Modals */}
      <EvaluationModal
        isOpen={isEvalModalOpen}
        onClose={() => {
          setIsEvalModalOpen(false);
          setEvalToEdit(null);
        }}
        subjectId={activeSubjectId}
        evalToEdit={evalToEdit}
        currentTotalWeight={calculations.totalConfiguredPercentage}
        maxGrade={subjectGrades.maxGrade}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => setIsSubjectModalOpen(false)}
      />

      <ConfirmationModal
        isOpen={!!evalToDelete}
        onClose={() => setEvalToDelete(null)}
        onConfirm={() => {
          if (evalToDelete) {
            deleteEvaluation(activeSubjectId, evalToDelete.id);
            setEvalToDelete(null);
          }
        }}
        title="Eliminar evaluación"
        message={`¿Seguro que deseas eliminar la evaluación "${evalToDelete?.name}"?`}
        confirmText="Eliminar evaluación"
      />
    </div>
  );
};
