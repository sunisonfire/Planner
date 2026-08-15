import React, { useState, useMemo } from 'react';
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Calendar as CalendarIcon,
  Clock,
  MapPin,
  Trash2,
  Edit2,
  CheckCircle2,
  BookOpen,
  LayoutGrid,
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import {
  getCalendarDays,
  formatToYMD,
  formatDisplayDate,
  formatDayOfWeek,
  getDaysUntil,
} from '../utils/dates';
import { CalendarEvent, EventType, Subject } from '../types';
import { EventTypeBadge, SubjectBadge } from '../components/common/Badge';
import { EventModal } from '../components/modals/EventModal';
import { TaskModal } from '../components/modals/TaskModal';
import { SubjectModal } from '../components/modals/SubjectModal';
import { ConfirmationModal } from '../components/common/ConfirmationModal';
import { WeeklyScheduleView } from '../components/calendar/WeeklyScheduleView';

export const Calendar: React.FC = () => {
  const { events, tasks, subjects, deleteEvent, toggleTask } = useApp();

  const today = new Date();
  const [viewMode, setViewMode] = useState<'month' | 'week'>('month');
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth());
  const [selectedDate, setSelectedDate] = useState<string>(formatToYMD(today));

  const [isEventModalOpen, setIsEventModalOpen] = useState(false);
  const [isTaskModalOpen, setIsTaskModalOpen] = useState(false);
  const [isSubjectModalOpen, setIsSubjectModalOpen] = useState(false);
  const [subjectToEdit, setSubjectToEdit] = useState<Subject | null>(null);
  const [eventToEdit, setEventToEdit] = useState<CalendarEvent | null>(null);
  const [eventToDelete, setEventToDelete] = useState<CalendarEvent | null>(null);

  const monthNames = [
    'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
    'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
  ];

  const daysOfWeekShort = ['Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb', 'Dom'];

  const subjectMap = useMemo(() => new Map(subjects.map((s) => [s.id, s])), [subjects]);

  const calendarGrid = useMemo(() => {
    return getCalendarDays(currentYear, currentMonth);
  }, [currentYear, currentMonth]);

  // Group events and tasks by date
  const eventsByDate = useMemo(() => {
    const map = new Map<string, CalendarEvent[]>();
    events.forEach((ev) => {
      const arr = map.get(ev.date) || [];
      arr.push(ev);
      map.set(ev.date, arr);
    });
    return map;
  }, [events]);

  const tasksByDate = useMemo(() => {
    const map = new Map<string, typeof tasks>();
    tasks.forEach((t) => {
      const arr = map.get(t.dueDate) || [];
      arr.push(t);
      map.set(t.dueDate, arr);
    });
    return map;
  }, [tasks]);

  const handlePrevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((prev) => prev - 1);
    } else {
      setCurrentMonth((prev) => prev - 1);
    }
  };

  const handleNextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((prev) => prev + 1);
    } else {
      setCurrentMonth((prev) => prev + 1);
    }
  };

  const handleGoToday = () => {
    const now = new Date();
    setCurrentYear(now.getFullYear());
    setCurrentMonth(now.getMonth());
    setSelectedDate(formatToYMD(now));
  };

  // Selected Day's items
  const selectedDayEvents = eventsByDate.get(selectedDate) || [];
  const selectedDayTasks = tasksByDate.get(selectedDate) || [];
  const totalItemsOnSelectedDay = selectedDayEvents.length + selectedDayTasks.length;

  return (
    <div className="space-y-4 pb-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white font-display">
            Calendario Académico 📅
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-0.5">
            Visualiza tus parciales, entregas y horario semanal de clases
          </p>
        </div>

        <div className="flex items-center gap-2 flex-wrap">
          {/* Toggle View Mode: Month vs Weekly Schedule */}
          <div className="flex items-center bg-slate-100 dark:bg-slate-800 p-1 rounded-xl border border-slate-200/60 dark:border-slate-700/60">
            <button
              id="calendar-view-month-btn"
              type="button"
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'month'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <CalendarIcon className="w-3.5 h-3.5" />
              Mes
            </button>
            <button
              id="calendar-view-week-btn"
              type="button"
              onClick={() => setViewMode('week')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                viewMode === 'week'
                  ? 'bg-white dark:bg-slate-700 text-indigo-600 dark:text-indigo-400 shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              <Clock className="w-3.5 h-3.5" />
              Horario Semanal
            </button>
          </div>

          {viewMode === 'month' && (
            <button
              type="button"
              onClick={handleGoToday}
              className="px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-750 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors"
            >
              Hoy
            </button>
          )}

          {viewMode === 'month' ? (
            <button
              id="calendar-add-event-btn"
              type="button"
              onClick={() => {
                setEventToEdit(null);
                setIsEventModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              + Nuevo evento
            </button>
          ) : (
            <button
              id="schedule-add-subject-btn"
              type="button"
              onClick={() => {
                setSubjectToEdit(null);
                setIsSubjectModalOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-xs hover:shadow-md transition-all active:scale-95"
            >
              <Plus className="w-4 h-4" />
              + Configurar Horario
            </button>
          )}
        </div>
      </div>

      {/* Main Content View */}
      {viewMode === 'week' ? (
        <WeeklyScheduleView
          onAddSubject={() => {
            setSubjectToEdit(null);
            setIsSubjectModalOpen(true);
          }}
          onSelectSubject={(subj) => {
            setSubjectToEdit(subj);
            setIsSubjectModalOpen(true);
          }}
        />
      ) : (
        /* Main Grid: Calendar Month on Left, Day Details on Right */
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Month View Card */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
          {/* Navigation Controls */}
          <div className="flex items-center justify-between">
            <h2 className="text-lg sm:text-xl font-extrabold text-slate-900 dark:text-white font-display">
              {monthNames[currentMonth]} {currentYear}
            </h2>
            <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl">
              <button
                type="button"
                onClick={handlePrevMonth}
                aria-label="Mes anterior"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <button
                type="button"
                onClick={handleNextMonth}
                aria-label="Mes siguiente"
                className="p-1.5 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-white dark:hover:bg-slate-700 transition-colors"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Days of week header */}
          <div className="grid grid-cols-7 gap-1 text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-1">
            {daysOfWeekShort.map((day) => (
              <div key={day} className="py-1 uppercase tracking-wider text-[11px]">
                {day}
              </div>
            ))}
          </div>

          {/* Days grid */}
          <div className="grid grid-cols-7 gap-1.5 sm:gap-2">
            {calendarGrid.map((day) => {
              const isSelected = day.dateString === selectedDate;
              const dayEvts = eventsByDate.get(day.dateString) || [];
              const dayTsks = tasksByDate.get(day.dateString) || [];
              const hasExams = dayEvts.some((e) => e.type === 'exam');
              const hasTasks = dayTsks.length > 0;
              const hasEvents = dayEvts.some((e) => e.type !== 'exam');

              return (
                <div
                  key={day.dateString}
                  onClick={() => setSelectedDate(day.dateString)}
                  className={`min-h-[72px] sm:min-h-[88px] p-1.5 sm:p-2 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                    isSelected
                      ? 'border-indigo-600 ring-2 ring-indigo-500/20 bg-indigo-50/40 dark:bg-indigo-950/40'
                      : day.isToday
                      ? 'border-indigo-300 dark:border-indigo-800 bg-white dark:bg-slate-800/80 shadow-2xs'
                      : day.isCurrentMonth
                      ? 'border-slate-100 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-850/40 hover:border-slate-300 dark:hover:border-slate-700'
                      : 'border-transparent bg-transparent opacity-35'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs sm:text-sm font-extrabold w-6 h-6 flex items-center justify-center rounded-full ${
                        day.isToday
                          ? 'bg-indigo-600 text-white'
                          : isSelected
                          ? 'text-indigo-600 dark:text-indigo-400'
                          : 'text-slate-800 dark:text-slate-200'
                      }`}
                    >
                      {day.dayNumber}
                    </span>

                    {(dayEvts.length > 0 || dayTsks.length > 0) && (
                      <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500">
                        {dayEvts.length + dayTsks.length}
                      </span>
                    )}
                  </div>

                  {/* Indicators / Chips */}
                  <div className="space-y-1 mt-1 overflow-hidden">
                    {/* Exam indicator */}
                    {hasExams && (
                      <div className="truncate text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-purple-100 dark:bg-purple-950 text-purple-700 dark:text-purple-300">
                        📝 Parcial
                      </div>
                    )}
                    {/* Tasks indicator */}
                    {hasTasks && (
                      <div className="truncate text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                        📋 {dayTsks.length} Tarea{dayTsks.length > 1 ? 's' : ''}
                      </div>
                    )}
                    {/* General events */}
                    {!hasExams && hasEvents && (
                      <div className="truncate text-[10px] font-bold px-1.5 py-0.5 rounded-md bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
                        📅 Evento
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Selected Day Agenda Drawer (Right Column) */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl p-5 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs flex flex-col justify-between space-y-4">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-600 dark:text-indigo-400">
                  {formatDayOfWeek(selectedDate)}
                </span>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white font-display">
                  {formatDisplayDate(selectedDate)}
                </h3>
              </div>
              <span className="text-xs px-2.5 py-1 rounded-full font-bold bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300">
                {totalItemsOnSelectedDay} item{totalItemsOnSelectedDay === 1 ? '' : 's'}
              </span>
            </div>

            {/* List for the selected day */}
            <div className="mt-4 space-y-3 max-h-[460px] overflow-y-auto pr-1">
              {totalItemsOnSelectedDay === 0 ? (
                <div className="py-12 text-center">
                  <div className="w-12 h-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto mb-2">
                    <CalendarIcon className="w-6 h-6" />
                  </div>
                  <p className="text-xs font-bold text-slate-700 dark:text-slate-300">
                    Sin eventos ni entregas este día
                  </p>
                  <p className="text-[11px] text-slate-400 mt-1">
                    Usa los botones inferiores para programar una actividad.
                  </p>
                </div>
              ) : (
                <>
                  {/* Events & Exams */}
                  {selectedDayEvents.map((ev) => {
                    const sub = ev.subjectId ? subjectMap.get(ev.subjectId) : null;
                    return (
                      <div
                        key={ev.id}
                        className="p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-750 space-y-2 group"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <EventTypeBadge type={ev.type} />
                          <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button
                              type="button"
                              onClick={() => {
                                setEventToEdit(ev);
                                setIsEventModalOpen(true);
                              }}
                              className="p-1 text-slate-400 hover:text-indigo-600"
                            >
                              <Edit2 className="w-3.5 h-3.5" />
                            </button>
                            <button
                              type="button"
                              onClick={() => setEventToDelete(ev)}
                              className="p-1 text-slate-400 hover:text-rose-600"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </div>

                        <div>
                          <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                            {ev.title}
                          </h4>
                          {ev.description && (
                            <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5">
                              {ev.description}
                            </p>
                          )}
                        </div>

                        <div className="flex flex-wrap items-center gap-3 pt-1 text-[11px] text-slate-400">
                          {ev.time && (
                            <span className="flex items-center gap-1">
                              <Clock className="w-3 h-3 text-indigo-500" />
                              {ev.time}
                            </span>
                          )}
                          {ev.location && (
                            <span className="flex items-center gap-1">
                              <MapPin className="w-3 h-3 text-slate-400" />
                              {ev.location}
                            </span>
                          )}
                          {sub && (
                            <SubjectBadge
                              name={sub.name}
                              color={sub.color}
                              code={sub.code}
                            />
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Tasks on this day */}
                  {selectedDayTasks.map((tsk) => {
                    const sub = subjectMap.get(tsk.subjectId);
                    return (
                      <div
                        key={tsk.id}
                        className="p-3.5 rounded-2xl bg-indigo-50/40 dark:bg-indigo-950/20 border border-indigo-100 dark:border-indigo-900/40 space-y-2"
                      >
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-extrabold uppercase px-2 py-0.5 rounded-md bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300">
                            📋 Entrega de tarea
                          </span>
                          <button
                            type="button"
                            onClick={() => toggleTask(tsk.id)}
                            className="text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline"
                          >
                            {tsk.completed ? '✓ Terminada' : 'Pendiente'}
                          </button>
                        </div>
                        <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                          {tsk.title}
                        </h4>
                        {sub && (
                          <SubjectBadge
                            name={sub.name}
                            color={sub.color}
                            code={sub.code}
                          />
                        )}
                      </div>
                    );
                  })}
                </>
              )}
            </div>
          </div>

          {/* Quick buttons */}
          <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
            <button
              type="button"
              onClick={() => {
                setEventToEdit(null);
                setIsEventModalOpen(true);
              }}
              className="px-3 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold text-center transition-all"
            >
              + Examen / Evento
            </button>
            <button
              type="button"
              onClick={() => setIsTaskModalOpen(true)}
              className="px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300 text-xs font-semibold text-center transition-all"
            >
              + Tarea para este día
            </button>
          </div>
        </div>
      </div>
      )}

      {/* Modals */}
      <EventModal
        isOpen={isEventModalOpen}
        onClose={() => {
          setIsEventModalOpen(false);
          setEventToEdit(null);
        }}
        eventToEdit={eventToEdit}
        defaultDate={selectedDate}
      />

      <TaskModal
        isOpen={isTaskModalOpen}
        onClose={() => setIsTaskModalOpen(false)}
        defaultDueDate={selectedDate}
      />

      <SubjectModal
        isOpen={isSubjectModalOpen}
        onClose={() => {
          setIsSubjectModalOpen(false);
          setSubjectToEdit(null);
        }}
        subjectToEdit={subjectToEdit}
      />

      <ConfirmationModal
        isOpen={!!eventToDelete}
        onClose={() => setEventToDelete(null)}
        onConfirm={() => {
          if (eventToDelete) {
            deleteEvent(eventToDelete.id);
            setEventToDelete(null);
          }
        }}
        title="Eliminar evento"
        message={`¿Seguro que deseas eliminar "${eventToDelete?.title}" de tu calendario?`}
        confirmText="Eliminar evento"
      />
    </div>
  );
};
