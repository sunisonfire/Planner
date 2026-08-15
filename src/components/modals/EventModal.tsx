import React, { useState, useEffect } from 'react';
import { Modal } from '../common/Modal';
import { useApp } from '../../context/AppContext';
import { CalendarEvent, EventType } from '../../types';
import { formatToYMD } from '../../utils/dates';

interface EventModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventToEdit?: CalendarEvent | null;
  defaultDate?: string;
}

export const EventModal: React.FC<EventModalProps> = ({
  isOpen,
  onClose,
  eventToEdit,
  defaultDate,
}) => {
  const { subjects, addEvent, updateEvent } = useApp();

  const [title, setTitle] = useState('');
  const [date, setDate] = useState('');
  const [time, setTime] = useState('');
  const [type, setType] = useState<EventType>('exam');
  const [subjectId, setSubjectId] = useState('');
  const [location, setLocation] = useState('');
  const [description, setDescription] = useState('');
  const [error, setError] = useState('');

  useEffect(() => {
    if (eventToEdit) {
      setTitle(eventToEdit.title);
      setDate(eventToEdit.date);
      setTime(eventToEdit.time || '');
      setType(eventToEdit.type);
      setSubjectId(eventToEdit.subjectId || '');
      setLocation(eventToEdit.location || '');
      setDescription(eventToEdit.description || '');
      setError('');
    } else {
      setTitle('');
      setDate(defaultDate || formatToYMD(new Date()));
      setTime('08:00');
      setType('exam');
      setSubjectId(subjects.length > 0 ? subjects[0].id : '');
      setLocation('');
      setDescription('');
      setError('');
    }
  }, [eventToEdit, defaultDate, isOpen, subjects]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Por favor escribe un título para el evento.');
      return;
    }
    if (!date) {
      setError('Por favor selecciona una fecha.');
      return;
    }

    if (eventToEdit) {
      updateEvent(eventToEdit.id, {
        title: title.trim(),
        date,
        time: time || undefined,
        type,
        subjectId: subjectId || undefined,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      });
    } else {
      addEvent({
        title: title.trim(),
        date,
        time: time || undefined,
        type,
        subjectId: subjectId || undefined,
        location: location.trim() || undefined,
        description: description.trim() || undefined,
      });
    }

    onClose();
  };

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title={eventToEdit ? 'Editar Evento' : 'Nuevo Evento o Parcial'}
      subtitle="Programa exámenes, sustentaciones y recordatorios"
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
            htmlFor="event-title-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Título del evento o examen <span className="text-rose-500">*</span>
          </label>
          <input
            id="event-title-input"
            type="text"
            placeholder="Ej. Parcial 1 de Bases de Datos"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            autoFocus
          />
        </div>

        {/* Type & Subject */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-type-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Tipo de evento
            </label>
            <select
              id="event-type-select"
              value={type}
              onChange={(e) => setType(e.target.value as EventType)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="exam">📝 Parcial / Examen</option>
              <option value="task">📋 Tarea / Entrega</option>
              <option value="event">📅 Evento / Clase</option>
              <option value="reminder">🔔 Recordatorio</option>
            </select>
          </div>

          <div>
            <label
              htmlFor="event-subject-select"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Materia asociada (opcional)
            </label>
            <select
              id="event-subject-select"
              value={subjectId}
              onChange={(e) => setSubjectId(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            >
              <option value="">General / Ninguna</option>
              {subjects.map((sub) => (
                <option key={sub.id} value={sub.id}>
                  {sub.name} {sub.code ? `(${sub.code})` : ''}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Date & Time */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label
              htmlFor="event-date-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Fecha <span className="text-rose-500">*</span>
            </label>
            <input
              id="event-date-input"
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>

          <div>
            <label
              htmlFor="event-time-input"
              className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
            >
              Hora (opcional)
            </label>
            <input
              id="event-time-input"
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
            />
          </div>
        </div>

        {/* Location */}
        <div>
          <label
            htmlFor="event-location-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Lugar, aula o enlace virtual (opcional)
          </label>
          <input
            id="event-location-input"
            type="text"
            placeholder="Ej. Aula 302 / Zoom / Laboratorio"
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-750 bg-white dark:bg-slate-800/80 text-sm text-slate-900 dark:text-white placeholder:text-slate-400 focus:outline-hidden focus:ring-2 focus:ring-indigo-500 transition-all"
          />
        </div>

        {/* Description */}
        <div>
          <label
            htmlFor="event-desc-input"
            className="block text-xs font-semibold text-slate-700 dark:text-slate-300 mb-1.5"
          >
            Temas o notas adicionales
          </label>
          <textarea
            id="event-desc-input"
            rows={2}
            placeholder="Temas a evaluar, fórmulas permitidas..."
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
            id="event-save-btn"
            type="submit"
            className="px-5 py-2.5 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white shadow-xs hover:shadow-md transition-all active:scale-95"
          >
            {eventToEdit ? 'Guardar Cambios' : 'Agendar Evento'}
          </button>
        </div>
      </form>
    </Modal>
  );
};
