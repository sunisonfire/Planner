import React, { useRef, useEffect } from 'react';
import { Bell, CheckCheck, Clock, ExternalLink } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { useApp } from '../../context/AppContext';
import { TabType } from '../../types';

interface NotificationPanelProps {
  isOpen: boolean;
  onClose: () => void;
}

export const NotificationPanel: React.FC<NotificationPanelProps> = ({
  isOpen,
  onClose,
}) => {
  const {
    notifications,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    setActiveTab,
  } = useApp();
  const panelRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (panelRef.current && !panelRef.current.contains(e.target as Node)) {
        onClose();
      }
    };
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isOpen, onClose]);

  const handleNavigate = (tab?: string, id?: string) => {
    if (id) markNotificationAsRead(id);
    if (tab) setActiveTab(tab as TabType);
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          ref={panelRef}
          initial={{ opacity: 0, y: 10, scale: 0.96 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 10, scale: 0.96 }}
          transition={{ duration: 0.18 }}
          className="absolute right-0 top-12 sm:top-14 w-80 sm:w-96 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200/90 dark:border-slate-800 z-50 overflow-hidden"
        >
          <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 dark:border-slate-800 bg-slate-50/70 dark:bg-slate-900/70">
            <div className="flex items-center gap-2">
              <Bell className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
              <h4 className="text-sm font-bold text-slate-800 dark:text-slate-100 font-display">
                Notificaciones ({notifications.length})
              </h4>
            </div>
            {notifications.length > 0 && (
              <button
                type="button"
                onClick={markAllNotificationsAsRead}
                className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 dark:text-indigo-400 hover:text-indigo-700 dark:hover:text-indigo-300 transition-colors"
              >
                <CheckCheck className="w-3.5 h-3.5" />
                Marcar leídas
              </button>
            )}
          </div>

          <div className="max-h-96 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80">
            {notifications.length === 0 ? (
              <div className="py-10 px-4 text-center">
                <div className="w-10 h-10 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto mb-2">
                  <CheckCheck className="w-5 h-5" />
                </div>
                <p className="text-sm font-medium text-slate-700 dark:text-slate-200">
                  ¡Todo al día!
                </p>
                <p className="text-xs text-slate-400 dark:text-slate-500 mt-0.5">
                  No tienes tareas ni eventos urgentes pendientes de alerta.
                </p>
              </div>
            ) : (
              notifications.map((item) => {
                const isUrgent = item.type === 'urgent';
                const isWarning = item.type === 'warning';
                const isSuccess = item.type === 'success';

                return (
                  <div
                    key={item.id}
                    onClick={() => handleNavigate(item.linkTab, item.id)}
                    className={`p-3.5 transition-colors cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/60 ${
                      !item.read
                        ? 'bg-indigo-50/40 dark:bg-indigo-950/20'
                        : 'opacity-85'
                    }`}
                  >
                    <div className="flex items-start gap-2.5">
                      <span
                        className={`mt-0.5 w-2 h-2 rounded-full shrink-0 ${
                          isUrgent
                            ? 'bg-rose-500 ring-4 ring-rose-100 dark:ring-rose-950'
                            : isWarning
                            ? 'bg-amber-500 ring-4 ring-amber-100 dark:ring-amber-950'
                            : isSuccess
                            ? 'bg-emerald-500 ring-4 ring-emerald-100 dark:ring-emerald-950'
                            : 'bg-indigo-500 ring-4 ring-indigo-100 dark:ring-indigo-950'
                        }`}
                      />
                      <div className="flex-1 min-w-0">
                        <p className="text-xs font-bold text-slate-900 dark:text-slate-100 leading-snug">
                          {item.title}
                        </p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 mt-1 leading-relaxed">
                          {item.message}
                        </p>
                        <div className="flex items-center justify-between mt-2 pt-1">
                          <span className="inline-flex items-center gap-1 text-[10px] text-slate-400 dark:text-slate-500">
                            <Clock className="w-3 h-3" />
                            Alerta del sistema
                          </span>
                          <span className="inline-flex items-center gap-0.5 text-[11px] font-semibold text-indigo-600 dark:text-indigo-400 hover:underline">
                            Ver detalles
                            <ExternalLink className="w-3 h-3 ml-0.5" />
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
