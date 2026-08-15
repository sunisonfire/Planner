import React from 'react';
import { LucideIcon } from 'lucide-react';

interface EmptyStateProps {
  icon: LucideIcon;
  title: string;
  description: string;
  actionText?: string;
  onAction?: () => void;
  iconColor?: string;
}

export const EmptyState: React.FC<EmptyStateProps> = ({
  icon: Icon,
  title,
  description,
  actionText,
  onAction,
  iconColor = 'text-indigo-600 dark:text-indigo-400 bg-indigo-50 dark:bg-indigo-950/50',
}) => {
  return (
    <div className="flex flex-col items-center justify-center p-8 sm:p-12 text-center rounded-2xl border-2 border-dashed border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/40">
      <div
        className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-4 ${iconColor}`}
      >
        <Icon className="w-7 h-7" />
      </div>
      <h4 className="text-base font-semibold text-slate-800 dark:text-slate-200 font-display">
        {title}
      </h4>
      <p className="text-sm text-slate-500 dark:text-slate-400 max-w-sm mt-1 mb-5 leading-relaxed">
        {description}
      </p>
      {actionText && onAction && (
        <button
          type="button"
          onClick={onAction}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold bg-indigo-600 hover:bg-indigo-700 text-white transition-all shadow-xs hover:shadow-md active:scale-95"
        >
          {actionText}
        </button>
      )}
    </div>
  );
};
