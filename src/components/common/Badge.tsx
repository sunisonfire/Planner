import React from 'react';
import { Priority, EventType } from '../../types';

interface PriorityBadgeProps {
  priority: Priority;
}

export const PriorityBadge: React.FC<PriorityBadgeProps> = ({ priority }) => {
  const configs = {
    high: {
      label: 'Alta',
      bg: 'bg-rose-50 dark:bg-rose-950/50 text-rose-700 dark:text-rose-300 border-rose-200 dark:border-rose-800/60',
      dot: 'bg-rose-500',
    },
    medium: {
      label: 'Media',
      bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      dot: 'bg-amber-500',
    },
    low: {
      label: 'Baja',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
    },
  };

  const config = configs[priority] || configs.medium;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

interface EventTypeBadgeProps {
  type: EventType;
}

export const EventTypeBadge: React.FC<EventTypeBadgeProps> = ({ type }) => {
  const configs = {
    exam: {
      label: 'Parcial / Examen',
      bg: 'bg-purple-50 dark:bg-purple-950/50 text-purple-700 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
      dot: 'bg-purple-500',
    },
    task: {
      label: 'Tarea',
      bg: 'bg-blue-50 dark:bg-blue-950/50 text-blue-700 dark:text-blue-300 border-blue-200 dark:border-blue-800/60',
      dot: 'bg-blue-500',
    },
    event: {
      label: 'Evento',
      bg: 'bg-emerald-50 dark:bg-emerald-950/50 text-emerald-700 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
      dot: 'bg-emerald-500',
    },
    reminder: {
      label: 'Recordatorio',
      bg: 'bg-amber-50 dark:bg-amber-950/50 text-amber-700 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
      dot: 'bg-amber-500',
    },
  };

  const config = configs[type] || configs.event;

  return (
    <span
      className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold border ${config.bg} whitespace-nowrap`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${config.dot}`} />
      {config.label}
    </span>
  );
};

interface SubjectBadgeProps {
  name: string;
  color?: string;
  code?: string;
}

export const SubjectBadge: React.FC<SubjectBadgeProps> = ({ name, color = '#6366f1', code }) => {
  return (
    <span
      className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg text-xs font-medium bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200 whitespace-nowrap"
      style={{ borderLeft: `3px solid ${color}` }}
    >
      {code ? `${code} · ${name}` : name}
    </span>
  );
};
