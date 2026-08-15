export type ThemeColorKey = 
  | 'indigo'
  | 'emerald'
  | 'violet'
  | 'rose'
  | 'amber'
  | 'cyan'
  | 'blue'
  | 'fuchsia'
  | 'slate';

export interface ThemePalette {
  id: ThemeColorKey;
  name: string;
  subtitle: string;
  primary: string;           // HEX for primary buttons & swatches
  primaryHover: string;      // Primary button hover
  lightBg: string;           // Soft badge/pill background in light mode
  darkBg: string;            // Soft badge/pill background in dark mode
  text: string;              // Primary text in light mode
  textDark: string;          // Primary text in dark mode
  gradientTo: string;        // Secondary gradient tone
  ring: string;              // Focus ring / accent border
  
  // Dynamic App Backgrounds & Surface Atmospheres
  // Light Mode
  bgAppLight: string;        // Full page background (light)
  bgSurfaceLight: string;    // Cards, modals, headers (light)
  bgSubtleLight: string;     // Secondary inputs, table headers (light)
  borderLight: string;       // Borders in light mode
  textMainLight: string;     // Main headings and text in light mode
  textMutedLight: string;    // Subtitles in light mode
  
  // Dark Mode
  bgAppDark: string;         // Full page background (dark)
  bgSurfaceDark: string;     // Cards, modals, headers (dark)
  bgSubtleDark: string;      // Secondary inputs, table headers (dark)
  borderDark: string;        // Borders in dark mode
  textMainDark: string;      // Main headings and text in dark mode
  textMutedDark: string;     // Subtitles in dark mode
}

export const THEME_PALETTES: Record<ThemeColorKey, ThemePalette> = {
  indigo: {
    id: 'indigo',
    name: 'Índigo Real',
    subtitle: 'Clásico & Académico',
    primary: '#4f46e5',
    primaryHover: '#4338ca',
    lightBg: '#eef2ff',
    darkBg: 'rgba(79, 70, 229, 0.22)',
    text: '#4f46e5',
    textDark: '#a5b4fc',
    gradientTo: '#7c3aed',
    ring: 'rgba(79, 70, 229, 0.4)',
    
    bgAppLight: '#f5f7fc',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#eef2ff',
    borderLight: '#e0e7ff',
    textMainLight: '#0f172a',
    textMutedLight: '#64748b',
    
    bgAppDark: '#080d1a',
    bgSurfaceDark: '#0f172a',
    bgSubtleDark: '#17223b',
    borderDark: '#1e2d4d',
    textMainDark: '#f8fafc',
    textMutedDark: '#94a3b8',
  },
  emerald: {
    id: 'emerald',
    name: 'Esmeralda & Menta',
    subtitle: 'Fresco & Concentración',
    primary: '#059669',
    primaryHover: '#047857',
    lightBg: '#ecfdf5',
    darkBg: 'rgba(5, 150, 105, 0.22)',
    text: '#059669',
    textDark: '#6ee7b7',
    gradientTo: '#0d9488',
    ring: 'rgba(5, 150, 105, 0.4)',
    
    bgAppLight: '#f0fdf4',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#ecfdf5',
    borderLight: '#bbf7d0',
    textMainLight: '#064e3b',
    textMutedLight: '#047857',
    
    bgAppDark: '#041610',
    bgSurfaceDark: '#08251c',
    bgSubtleDark: '#0e382b',
    borderDark: '#134e3e',
    textMainDark: '#ecfdf5',
    textMutedDark: '#a7f3d0',
  },
  violet: {
    id: 'violet',
    name: 'Violeta & Lavanda',
    subtitle: 'Creativo & Moderno',
    primary: '#7c3aed',
    primaryHover: '#6d28d9',
    lightBg: '#f5f3ff',
    darkBg: 'rgba(124, 58, 237, 0.22)',
    text: '#7c3aed',
    textDark: '#c4b5fd',
    gradientTo: '#9333ea',
    ring: 'rgba(124, 58, 237, 0.4)',
    
    bgAppLight: '#f8f6fe',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#f5f3ff',
    borderLight: '#ede9fe',
    textMainLight: '#2e1065',
    textMutedLight: '#6d28d9',
    
    bgAppDark: '#0e071c',
    bgSurfaceDark: '#180d2e',
    bgSubtleDark: '#241445',
    borderDark: '#351c63',
    textMainDark: '#f5f3ff',
    textMutedDark: '#c4b5fd',
  },
  rose: {
    id: 'rose',
    name: 'Rosa & Carmín',
    subtitle: 'Enérgico & Vibrante',
    primary: '#e11d48',
    primaryHover: '#be123c',
    lightBg: '#fff1f2',
    darkBg: 'rgba(225, 29, 72, 0.22)',
    text: '#e11d48',
    textDark: '#fda4af',
    gradientTo: '#db2777',
    ring: 'rgba(225, 29, 72, 0.4)',
    
    bgAppLight: '#fff5f6',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#fff1f2',
    borderLight: '#ffe4e6',
    textMainLight: '#881337',
    textMutedLight: '#be123c',
    
    bgAppDark: '#17060b',
    bgSurfaceDark: '#260c14',
    bgSubtleDark: '#3b1320',
    borderDark: '#541b2e',
    textMainDark: '#fff1f2',
    textMutedDark: '#fecdd3',
  },
  amber: {
    id: 'amber',
    name: 'Ámbar & Atardecer',
    subtitle: 'Cálido & Optimista',
    primary: '#d97706',
    primaryHover: '#b45309',
    lightBg: '#fffbeb',
    darkBg: 'rgba(217, 119, 6, 0.22)',
    text: '#d97706',
    textDark: '#fcd34d',
    gradientTo: '#ea580c',
    ring: 'rgba(217, 119, 6, 0.4)',
    
    bgAppLight: '#fefcf6',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#fffbeb',
    borderLight: '#fef3c7',
    textMainLight: '#78350f',
    textMutedLight: '#b45309',
    
    bgAppDark: '#140c04',
    bgSurfaceDark: '#221507',
    bgSubtleDark: '#35210c',
    borderDark: '#4e3113',
    textMainDark: '#fef3c7',
    textMutedDark: '#fde68a',
  },
  cyan: {
    id: 'cyan',
    name: 'Océano & Cian',
    subtitle: 'Tranquilo & Claro',
    primary: '#0891b2',
    primaryHover: '#0e7490',
    lightBg: '#ecfeff',
    darkBg: 'rgba(8, 145, 178, 0.22)',
    text: '#0891b2',
    textDark: '#67e8f9',
    gradientTo: '#0284c7',
    ring: 'rgba(8, 145, 178, 0.4)',
    
    bgAppLight: '#f0fcfd',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#ecfeff',
    borderLight: '#cffafe',
    textMainLight: '#164e63',
    textMutedLight: '#0e7490',
    
    bgAppDark: '#041318',
    bgSurfaceDark: '#082129',
    bgSubtleDark: '#0d323e',
    borderDark: '#124859',
    textMainDark: '#ecfeff',
    textMutedDark: '#a5f3fc',
  },
  blue: {
    id: 'blue',
    name: 'Azul Zafiro',
    subtitle: 'Formal & Profesional',
    primary: '#2563eb',
    primaryHover: '#1d4ed8',
    lightBg: '#eff6ff',
    darkBg: 'rgba(37, 99, 235, 0.22)',
    text: '#2563eb',
    textDark: '#93c5fd',
    gradientTo: '#4f46e5',
    ring: 'rgba(37, 99, 235, 0.4)',
    
    bgAppLight: '#f4f8fe',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#eff6ff',
    borderLight: '#dbeafe',
    textMainLight: '#1e3a8a',
    textMutedLight: '#1d4ed8',
    
    bgAppDark: '#07101e',
    bgSurfaceDark: '#0c1a30',
    bgSubtleDark: '#13284a',
    borderDark: '#1c3966',
    textMainDark: '#eff6ff',
    textMutedDark: '#bfdbfe',
  },
  fuchsia: {
    id: 'fuchsia',
    name: 'Fucsia Neón',
    subtitle: 'Audaz & Dinámico',
    primary: '#c026d3',
    primaryHover: '#a21caf',
    lightBg: '#fdf4ff',
    darkBg: 'rgba(192, 38, 211, 0.22)',
    text: '#c026d3',
    textDark: '#f0abfc',
    gradientTo: '#db2777',
    ring: 'rgba(192, 38, 211, 0.4)',
    
    bgAppLight: '#fdf5fd',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#fdf4ff',
    borderLight: '#fae8ff',
    textMainLight: '#701a75',
    textMutedLight: '#a21caf',
    
    bgAppDark: '#160517',
    bgSurfaceDark: '#260a27',
    bgSubtleDark: '#3a113c',
    borderDark: '#521955',
    textMainDark: '#fdf4ff',
    textMutedDark: '#f5d0fe',
  },
  slate: {
    id: 'slate',
    name: 'Pizarra & Minimal',
    subtitle: 'Monocromo & Sobrio',
    primary: '#334155',
    primaryHover: '#1e293b',
    lightBg: '#f1f5f9',
    darkBg: 'rgba(51, 65, 85, 0.3)',
    text: '#334155',
    textDark: '#cbd5e1',
    gradientTo: '#0f172a',
    ring: 'rgba(51, 65, 85, 0.4)',
    
    bgAppLight: '#f8fafc',
    bgSurfaceLight: '#ffffff',
    bgSubtleLight: '#f1f5f9',
    borderLight: '#e2e8f0',
    textMainLight: '#0f172a',
    textMutedLight: '#475569',
    
    bgAppDark: '#080c14',
    bgSurfaceDark: '#111724',
    bgSubtleDark: '#1b2438',
    borderDark: '#26334f',
    textMainDark: '#f8fafc',
    textMutedDark: '#94a3b8',
  },
};

export function applyThemeToDOM(themeId: ThemeColorKey, isDarkMode: boolean): void {
  if (typeof document === 'undefined') return;
  const root = document.documentElement;
  const palette = THEME_PALETTES[themeId] || THEME_PALETTES.indigo;

  // Set theme id & dark class
  root.setAttribute('data-theme', palette.id);
  if (isDarkMode) {
    root.classList.add('dark');
  } else {
    root.classList.remove('dark');
  }

  // Set core CSS variables for Tailwind & Styles
  root.style.setProperty('--color-primary', palette.primary);
  root.style.setProperty('--color-primary-hover', palette.primaryHover);
  root.style.setProperty('--color-primary-light-bg', palette.lightBg);
  root.style.setProperty('--color-primary-dark-bg', palette.darkBg);
  root.style.setProperty('--color-primary-text', palette.text);
  root.style.setProperty('--color-primary-text-dark', palette.textDark);
  root.style.setProperty('--color-primary-gradient-to', palette.gradientTo);
  root.style.setProperty('--color-primary-ring', palette.ring);

  // Dynamic Background & Surface variables based on Light / Dark mode
  if (isDarkMode) {
    root.style.setProperty('--bg-app', palette.bgAppDark);
    root.style.setProperty('--bg-surface', palette.bgSurfaceDark);
    root.style.setProperty('--bg-subtle', palette.bgSubtleDark);
    root.style.setProperty('--border-color', palette.borderDark);
    root.style.setProperty('--text-main', palette.textMainDark);
    root.style.setProperty('--text-muted', palette.textMutedDark);
  } else {
    root.style.setProperty('--bg-app', palette.bgAppLight);
    root.style.setProperty('--bg-surface', palette.bgSurfaceLight);
    root.style.setProperty('--bg-subtle', palette.bgSubtleLight);
    root.style.setProperty('--border-color', palette.borderLight);
    root.style.setProperty('--text-main', palette.textMainLight);
    root.style.setProperty('--text-muted', palette.textMutedLight);
  }
}

// Backward compatibility alias
export function applyThemeColorToDOM(themeId: ThemeColorKey): void {
  const isDark = typeof document !== 'undefined' && document.documentElement.classList.contains('dark');
  applyThemeToDOM(themeId, isDark);
}
