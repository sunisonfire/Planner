import React, { useState } from 'react';
import { Bell, Sun, Moon, GraduationCap } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { NotificationPanel } from './NotificationPanel';
import { THEME_PALETTES } from '../../utils/themes';

export const Header: React.FC = () => {
  const { profile, settings, toggleDarkMode, unreadCount, setActiveTab } = useApp();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  const initial = profile?.name ? profile.name.trim().charAt(0).toUpperCase() : 'U';
  const currentPalette = THEME_PALETTES[settings.themeColor] || THEME_PALETTES.indigo;

  return (
    <header className="sticky top-0 z-40 w-full bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 transition-colors">
      <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between">
        {/* Left Branding */}
        <div className="flex items-center gap-3">
          <div
            onClick={() => setActiveTab('dashboard')}
            className="flex items-center gap-2.5 cursor-pointer group"
          >
            <div
              className="w-8 h-8 rounded-xl text-white flex items-center justify-center shadow-xs group-hover:scale-105 transition-transform"
              style={{
                background: `linear-gradient(135deg, ${currentPalette.primary}, ${currentPalette.gradientTo})`,
              }}
            >
              <GraduationCap className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="font-extrabold text-base tracking-tight text-slate-900 dark:text-white font-display">
                  UniPlanner
                </span>
                <span
                  className="text-[10px] uppercase font-bold tracking-wider px-1.5 py-0.5 rounded-md"
                  style={{
                    backgroundColor: currentPalette.lightBg,
                    color: currentPalette.text,
                  }}
                >
                  Uni
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400 -mt-0.5 hidden sm:block truncate max-w-[200px]">
                {profile?.career || 'Tu espacio académico'}
              </p>
            </div>
          </div>
        </div>

        {/* Right Actions */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          {/* Dark mode switch */}
          <button
            id="header-dark-mode-toggle"
            type="button"
            onClick={toggleDarkMode}
            aria-label={settings.darkMode ? 'Cambiar a modo claro' : 'Cambiar a modo oscuro'}
            className="p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
          >
            {settings.darkMode ? (
              <Sun className="w-4 h-4 text-amber-400 animate-spin-slow" />
            ) : (
              <Moon className="w-4 h-4 text-slate-600" />
            )}
          </button>

          {/* Notifications Bell */}
          <div className="relative">
            <button
              id="header-notification-bell"
              type="button"
              onClick={() => setIsNotifOpen((prev) => !prev)}
              aria-label="Abrir notificaciones"
              className="relative p-1.5 rounded-xl text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-0.5 right-0.5 min-w-[16px] h-[16px] px-0.5 bg-rose-500 text-white font-bold text-[9px] flex items-center justify-center rounded-full ring-2 ring-white dark:ring-slate-900 animate-pulse">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>
            <NotificationPanel
              isOpen={isNotifOpen}
              onClose={() => setIsNotifOpen(false)}
            />
          </div>

          {/* Profile pill */}
          <button
            id="header-profile-button"
            type="button"
            onClick={() => setActiveTab('profile')}
            className="flex items-center gap-2 pl-1.5 pr-2.5 py-1 rounded-full hover:bg-slate-100 dark:hover:bg-slate-800 transition-all border border-slate-200/80 dark:border-slate-750"
          >
            <div
              className="w-6 h-6 rounded-full text-white font-bold text-[11px] flex items-center justify-center shadow-xs"
              style={{ backgroundColor: profile?.avatarColor || currentPalette.primary }}
            >
              {initial}
            </div>
            <span className="text-xs font-semibold text-slate-800 dark:text-slate-200 hidden sm:inline">
              {profile?.name ? profile.name.split(' ')[0] : 'Mi Perfil'}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
};
