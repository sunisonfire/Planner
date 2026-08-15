import React from 'react';
import { Clock, MapPin, User, BookOpen, Plus } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { WEEKDAYS_SPANISH, getAllSubjectSlots, formatTimeSlot } from '../../utils/schedule';
import { Subject, Weekday } from '../../types';

interface WeeklyScheduleViewProps {
  onAddSubject?: () => void;
  onSelectSubject?: (subject: Subject) => void;
}

export const WeeklyScheduleView: React.FC<WeeklyScheduleViewProps> = ({
  onAddSubject,
  onSelectSubject,
}) => {
  const { subjects, settings } = useApp();

  const allSlots = React.useMemo(() => getAllSubjectSlots(subjects), [subjects]);

  // Hours range for grid: 06:00 to 21:00
  const hours = [6, 7, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21];

  // Group slots by day (1 = Lun .. 6 = Sáb)
  const weekdaysToShow = WEEKDAYS_SPANISH.filter((d) => d.key !== 0); // Lun to Sáb

  // Helper to calculate top and height in % or px
  const getSlotStyle = (startTime: string, endTime: string) => {
    const [startH, startM] = startTime.split(':').map((v) => parseInt(v, 10) || 0);
    const [endH, endM] = endTime.split(':').map((v) => parseInt(v, 10) || 0);

    const minHour = 6;
    const startMinutesFromMin = (startH - minHour) * 60 + startM;
    const durationMinutes = (endH * 60 + endM) - (startH * 60 + startM);

    // Each hour slot is 64px
    const topPx = (startMinutesFromMin / 60) * 64;
    const heightPx = Math.max(36, (durationMinutes / 60) * 64);

    return {
      top: `${topPx}px`,
      height: `${heightPx}px`,
    };
  };

  const hasAnySlots = allSlots.length > 0;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-3xl p-4 sm:p-6 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-5">
      {/* Top Info Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <h3 className="text-base sm:text-lg font-extrabold text-slate-900 dark:text-white font-display">
            Horario Semanal de Clases
          </h3>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Vista organizada de tus clases y aulas de Lunes a Sábado
          </p>
        </div>

        {/* Legend of subjects */}
        <div className="flex items-center gap-2 flex-wrap">
          {subjects.map((sub) => (
            <div
              key={sub.id}
              onClick={() => onSelectSubject?.(sub)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg text-xs font-semibold bg-slate-100 dark:bg-slate-800/80 text-slate-700 dark:text-slate-200 cursor-pointer hover:scale-105 transition-transform"
            >
              <span className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: sub.color }} />
              <span className="truncate max-w-[120px]">{sub.name}</span>
            </div>
          ))}
        </div>
      </div>

      {!hasAnySlots ? (
        <div className="py-12 px-4 text-center rounded-2xl bg-slate-50 dark:bg-slate-850/50 border border-dashed border-slate-200 dark:border-slate-800">
          <BookOpen className="w-12 h-12 text-slate-300 dark:text-slate-600 mx-auto mb-3" />
          <h4 className="text-sm font-bold text-slate-800 dark:text-slate-200">
            No tienes materias con horario registrado
          </h4>
          <p className="text-xs text-slate-500 dark:text-slate-400 max-w-md mx-auto mt-1 mb-4">
            Agrega o edita tus materias en la sección de Materias e incluye su horario (ej. &quot;Lun y Mié 10:00 AM - 12:00 PM&quot;).
          </p>
          {onAddSubject && (
            <button
              type="button"
              onClick={onAddSubject}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-xs"
            >
              <Plus className="w-4 h-4" />
              Configurar Materias
            </button>
          )}
        </div>
      ) : (
        /* Weekly Time-Grid container with responsive horizontal scroll */
        <div className="overflow-x-auto">
          <div className="min-w-[700px] select-none">
            {/* Header: Days */}
            <div className="grid grid-cols-7 border-b border-slate-200 dark:border-slate-800 pb-2">
              <div className="text-center text-xs font-bold text-slate-400 dark:text-slate-500 py-1">
                Hora
              </div>
              {weekdaysToShow.map((d) => {
                const todayDayOfWeek = new Date().getDay();
                const isToday = todayDayOfWeek === d.key;
                return (
                  <div
                    key={d.key}
                    className={`text-center py-1.5 px-1 rounded-xl mx-0.5 ${
                      isToday
                        ? 'bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 font-extrabold'
                        : 'text-slate-700 dark:text-slate-300 font-bold'
                    }`}
                  >
                    <span className="text-xs uppercase tracking-wider block">{d.short}</span>
                    <span className="text-[11px] font-medium text-slate-400 dark:text-slate-500">
                      {d.label}
                    </span>
                  </div>
                );
              })}
            </div>

            {/* Time Grid Body */}
            <div className="relative grid grid-cols-7 mt-2" style={{ height: `${hours.length * 64}px` }}>
              {/* Hour lines and labels (Column 1) */}
              <div className="relative border-r border-slate-100 dark:border-slate-800/80">
                {hours.map((h, i) => {
                  const displayTime = `${h % 12 === 0 ? 12 : h % 12}:00 ${h >= 12 ? 'PM' : 'AM'}`;
                  return (
                    <div
                      key={h}
                      className="absolute w-full text-right pr-2.5 text-[11px] font-semibold text-slate-400 dark:text-slate-500"
                      style={{ top: `${i * 64}px`, transform: 'translateY(-50%)' }}
                    >
                      {displayTime}
                    </div>
                  );
                })}
              </div>

              {/* Day Columns (Columns 2 to 7) */}
              {weekdaysToShow.map((dayObj) => {
                const daySlots = allSlots.filter((s) => s.slot.dayOfWeek === dayObj.key);
                const isToday = new Date().getDay() === dayObj.key;

                return (
                  <div
                    key={dayObj.key}
                    className={`relative border-r border-slate-100 dark:border-slate-800/80 last:border-r-0 ${
                      isToday ? 'bg-indigo-50/20 dark:bg-indigo-950/20' : ''
                    }`}
                  >
                    {/* Hour row guidelines */}
                    {hours.map((h, i) => (
                      <div
                        key={h}
                        className="absolute w-full border-t border-slate-100 dark:border-slate-800/60"
                        style={{ top: `${i * 64}px` }}
                      />
                    ))}

                    {/* Classes rendered as floating blocks */}
                    {daySlots.map(({ slot, subject }) => {
                      const style = getSlotStyle(slot.startTime, slot.endTime);
                      return (
                        <div
                          key={slot.id}
                          onClick={() => onSelectSubject?.(subject)}
                          className="absolute left-1 right-1 rounded-xl p-2 sm:p-2.5 overflow-hidden transition-all hover:scale-[1.02] hover:z-20 cursor-pointer shadow-xs border flex flex-col justify-between"
                          style={{
                            ...style,
                            backgroundColor: `${subject.color}18`,
                            borderColor: `${subject.color}60`,
                            borderLeftWidth: '4px',
                            borderLeftColor: subject.color,
                          }}
                        >
                          <div className="min-w-0">
                            <div className="flex items-center justify-between gap-1 mb-0.5">
                              <span
                                className="font-extrabold text-xs truncate"
                                style={{ color: subject.color }}
                              >
                                {subject.name}
                              </span>
                              {subject.code && (
                                <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase shrink-0">
                                  {subject.code}
                                </span>
                              )}
                            </div>

                            <div className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                              <Clock className="w-3 h-3 text-slate-400 shrink-0" />
                              <span>
                                {formatTimeSlot(slot.startTime)} - {formatTimeSlot(slot.endTime)}
                              </span>
                            </div>
                          </div>

                          {(slot.classroom || subject.classroom || subject.professor) && (
                            <div className="mt-1 pt-1 border-t border-slate-200/50 dark:border-slate-700/50 flex items-center justify-between gap-1 text-[10px] text-slate-500 dark:text-slate-400 truncate">
                              {(slot.classroom || subject.classroom) && (
                                <span className="inline-flex items-center gap-1 truncate font-medium">
                                  <MapPin className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                                  {slot.classroom || subject.classroom}
                                </span>
                              )}
                              {subject.professor && !slot.classroom && !subject.classroom && (
                                <span className="inline-flex items-center gap-1 truncate font-medium">
                                  <User className="w-2.5 h-2.5 shrink-0 text-slate-400" />
                                  {subject.professor}
                                </span>
                              )}
                            </div>
                          )}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
