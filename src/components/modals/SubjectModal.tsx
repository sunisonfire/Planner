import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { Subject } from '../../types';
import { Check } from 'lucide-react';
import { parseScheduleTextToSlots } from '../../utils/schedule';

interface SubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  subjectToEdit?: Subject | null;
}

const PRESET_COLORS = [
  '#10b981', // Emerald
  '#3b82f6', // Blue
  '#8b5cf6', // Violet
  '#ec4899', // Pink
  '#f59e0b', // Amber
  '#06b6d4', // Cyan
  '#ef4444', // Red
  '#6366f1', // Indigo
  '#14b8a6', // Teal
  '#84cc16', // Lime
];

export const SubjectModal: React.FC<SubjectModalProps> = ({
  isOpen,
  onClose,
  subjectToEdit,
}) => {
  const { addSubject, updateSubject } = useApp();

  const [name, setName] = useState('');
  const [code, setCode] = useState('');
  const [color, setColor] = useState(PRESET_COLORS[0]);
  const [classroom, setClassroom] = useState('');
  const [professor, setProfessor] = useState('');
  const [schedule, setSchedule] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (subjectToEdit) {
      setName(subjectToEdit.name);
      setCode(subjectToEdit.code || '');
      setColor(subjectToEdit.color || PRESET_COLORS[0]);
      setClassroom(subjectToEdit.classroom || '');
      setProfessor(subjectToEdit.professor || '');
      setSchedule(subjectToEdit.schedule || '');
      setError('');
    } else {
      setName('');
      setCode('');
      setColor(PRESET_COLORS[Math.floor(Math.random() * PRESET_COLORS.length)]);
      setClassroom('');
      setProfessor('');
      setSchedule('');
      setError('');
    }
  }, [subjectToEdit, isOpen]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Por favor escribe el nombre de la materia.');
      return;
    }

    const trimmedSchedule = schedule.trim() || undefined;
    const subjectId = subjectToEdit ? subjectToEdit.id : `subj-${Date.now()}`;
    const generatedSlots = trimmedSchedule ? parseScheduleTextToSlots(trimmedSchedule, subjectId, classroom.trim() || undefined) : undefined;

    if (subjectToEdit) {
      updateSubject(subjectToEdit.id, {
        name: name.trim(),
        code: code.trim() || undefined,
        color,
        classroom: classroom.trim() || undefined,
        professor: professor.trim() || undefined,
        schedule: trimmedSchedule,
        slots: generatedSlots,
      });
    } else {
      addSubject({
        name: name.trim(),
        code: code.trim() || undefined,
        color,
        classroom: classroom.trim() || undefined,
        professor: professor.trim() || undefined,
        schedule: trimmedSchedule,
        slots: generatedSlots,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={subjectToEdit ? 'Editar Materia' : 'Nueva Materia'}
      subtitle="Organiza tus cursos y horarios del semestre"
    >
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 text-xs rounded-xl bg-rose-50 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 border border-rose-200 dark:border-rose-800">
            {error}
          </div>
        )}

        {/* Name */}
        <div>
          <label
            htmlFor="subject-name-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Nombre de la materia <span className="text-rose-500">*</span>
          </label>
          <input
            id="subject-name-input"
            type="text"
            placeholder="Ej. Bases de Datos / Programación Web"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            autoFocus
          />
        </div>

        {/* Code & Color */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="subject-code-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Código (opcional)
            </label>
            <input
              id="subject-code-input"
              type="text"
              placeholder="Ej. BD-301 / MAT-201"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5">
              Color identificador
            </label>
            <div className="flex items-center gap-1.5 flex-wrap pt-1">
              {PRESET_COLORS.map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setColor(c)}
                  className="w-6 h-6 rounded-full flex items-center justify-center transition-transform hover:scale-110 active:scale-95"
                  style={{ backgroundColor: c }}
                  aria-label={`Seleccionar color ${c}`}
                >
                  {color === c && <Check className="w-3.5 h-3.5 text-white stroke-[3]" />}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Professor & Classroom */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="subject-prof-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Profesor(a) (opcional)
            </label>
            <input
              id="subject-prof-input"
              type="text"
              placeholder="Ej. Dra. Elena Ramos"
              value={professor}
              onChange={(e) => setProfessor(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="subject-classroom-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Aula / Salón (opcional)
            </label>
            <input
              id="subject-classroom-input"
              type="text"
              placeholder="Ej. Sala 402 / Lab 2"
              value={classroom}
              onChange={(e) => setClassroom(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Schedule */}
        <div>
          <label
            htmlFor="subject-schedule-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Horario semanal (opcional)
          </label>
          <input
            id="subject-schedule-input"
            type="text"
            placeholder="Ej. Lun y Mié 10:00 AM - 12:00 PM"
            value={schedule}
            onChange={(e) => setSchedule(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
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
            id="subject-save-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            {subjectToEdit ? 'Guardar Cambios' : 'Crear Materia'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
