import React from 'react';
import { Moon, Sun, Volume2, VolumeX, Palette, Check, Sparkles } from 'lucide-react';
import { useApp } from '../../context/AppContext';
import { THEME_PALETTES, ThemeColorKey } from '../../utils/themes';

export const ThemePaletteSelector: React.FC = () => {
  const { settings, toggleDarkMode, toggleSound, setThemeColor } = useApp();

  const handlePaletteSelect = (key: ThemeColorKey) => {
    setThemeColor(key);
  };

  const currentPalette = THEME_PALETTES[settings.themeColor] || THEME_PALETTES.indigo;

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl p-4 sm:p-5 border border-slate-200/80 dark:border-slate-800 shadow-xs space-y-4">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <div
              className="w-7 h-7 rounded-xl flex items-center justify-center text-white shadow-xs"
              style={{ backgroundColor: currentPalette.primary }}
            >
              <Palette className="w-3.5 h-3.5" />
            </div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white font-display">
              Personalización & Apariencia 🎨
            </h3>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            Elige tu paleta de color favorita: todo el fondo, tarjetas y botones se transformarán tanto en Modo Claro como en Modo Oscuro.
          </p>
        </div>
      </div>

      {/* Main Controls: Dark Mode & Sound Toggles */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
        {/* Dark Mode Toggle Card */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
          <div className="flex items-center gap-3">
            <div
              className="w-9 h-9 rounded-xl flex items-center justify-center transition-colors"
              style={{
                backgroundColor: settings.darkMode ? currentPalette.darkBg : currentPalette.lightBg,
                color: settings.darkMode ? currentPalette.textDark : currentPalette.text,
              }}
            >
              {settings.darkMode ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Modo {settings.darkMode ? 'Oscuro' : 'Claro'} 🌓
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                {settings.darkMode ? 'Fondo inmersivo nocturno activo' : 'Interfaz fresca y luminosa'}
              </p>
            </div>
          </div>

          <button
            id="profile-toggle-dark-mode"
            type="button"
            onClick={toggleDarkMode}
            style={{
              backgroundColor: settings.darkMode ? currentPalette.primary : undefined,
            }}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              !settings.darkMode ? 'bg-slate-300 dark:bg-slate-700' : ''
            }`}
            aria-label="Alternar modo oscuro"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.darkMode ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>

        {/* Sound Feedback Toggle Card */}
        <div className="flex items-center justify-between p-3.5 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/60 dark:border-slate-750">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              {settings.soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </div>
            <div>
              <h4 className="text-xs font-bold text-slate-900 dark:text-white">
                Sonido de clicks {settings.soundEnabled ? 'Activado' : 'Silenciado'} 🔊
              </h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                Respuesta acústica suave en clicks y tareas
              </p>
            </div>
          </div>

          <button
            id="profile-toggle-sound-feedback"
            type="button"
            onClick={toggleSound}
            className={`w-12 h-6 flex items-center rounded-full p-1 transition-colors ${
              settings.soundEnabled ? 'bg-emerald-600' : 'bg-slate-300 dark:bg-slate-700'
            }`}
            aria-label="Alternar efectos de sonido"
          >
            <div
              className={`bg-white w-4 h-4 rounded-full shadow-md transform transition-transform ${
                settings.soundEnabled ? 'translate-x-6' : 'translate-x-0'
              }`}
            />
          </button>
        </div>
      </div>

      {/* Color Palette Grid */}
      <div className="space-y-2.5 pt-1">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
            <Sparkles className="w-3.5 h-3.5" style={{ color: currentPalette.primary }} />
            Elige el tema de la aplicación:
          </h4>
          <span
            className="text-[11px] font-bold px-2 py-0.5 rounded-md transition-colors"
            style={{
              backgroundColor: settings.darkMode ? currentPalette.darkBg : currentPalette.lightBg,
              color: settings.darkMode ? currentPalette.textDark : currentPalette.text,
            }}
          >
            {currentPalette.name}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
          {(Object.keys(THEME_PALETTES) as ThemeColorKey[]).map((key) => {
            const palette = THEME_PALETTES[key];
            const isSelected = settings.themeColor === key;

            return (
              <button
                key={key}
                id={`theme-palette-${key}`}
                type="button"
                onClick={() => handlePaletteSelect(key)}
                style={
                  isSelected
                    ? {
                        borderColor: palette.primary,
                        backgroundColor: settings.darkMode ? palette.darkBg : palette.lightBg,
                      }
                    : undefined
                }
                className={`p-2.5 rounded-xl border text-left transition-all flex items-center justify-between group cursor-pointer ${
                  isSelected
                    ? 'shadow-xs ring-2 ring-opacity-40'
                    : 'border-slate-200/80 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-slate-300 dark:hover:border-slate-700'
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <div
                    className="w-7 h-7 rounded-lg flex items-center justify-center shadow-xs transition-transform group-hover:scale-105 shrink-0 relative"
                    style={{ backgroundColor: palette.primary }}
                  >
                    {isSelected && <Check className="w-4 h-4 text-white stroke-[3]" />}
                  </div>
                  <div>
                    <div className="flex items-center gap-1.5">
                      <p
                        className="text-xs font-bold leading-tight text-slate-900 dark:text-white"
                        style={isSelected ? { color: settings.darkMode ? palette.textDark : palette.text } : undefined}
                      >
                        {palette.name}
                      </p>
                    </div>
                    <p className="text-[10px] text-slate-500 dark:text-slate-400 mt-0.5 leading-tight">
                      {palette.subtitle}
                    </p>
                  </div>
                </div>
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
