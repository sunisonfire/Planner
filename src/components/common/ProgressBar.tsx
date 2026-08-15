import React from 'react';

interface ProgressBarProps {
  progress: number; // 0 - 100
  color?: string;
  size?: 'sm' | 'md' | 'lg';
  showLabel?: boolean;
  animate?: boolean;
}

export const ProgressBar: React.FC<ProgressBarProps> = ({
  progress,
  color,
  size = 'md',
  showLabel = false,
  animate = true,
}) => {
  const cleanProgress = Math.min(100, Math.max(0, progress));

  const sizeClasses = {
    sm: 'h-1.5',
    md: 'h-2.5',
    lg: 'h-4',
  };

  const getGradientColor = () => {
    if (color) return color;
    if (cleanProgress >= 100) return 'bg-emerald-500';
    if (cleanProgress >= 70) return 'bg-indigo-600';
    if (cleanProgress >= 40) return 'bg-blue-500';
    return 'bg-amber-500';
  };

  return (
    <div className="w-full">
      {showLabel && (
        <div className="flex justify-between items-center mb-1 text-xs font-semibold text-slate-600 dark:text-slate-300">
          <span>Progreso</span>
          <span>{cleanProgress}%</span>
        </div>
      )}
      <div
        className={`w-full bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden ${sizeClasses[size]}`}
      >
        <div
          className={`h-full rounded-full ${
            color ? '' : getGradientColor()
          } ${animate ? 'transition-all duration-500 ease-out' : ''}`}
          style={{
            width: `${cleanProgress}%`,
            backgroundColor: color || undefined,
          }}
        />
      </div>
    </div>
  );
};
