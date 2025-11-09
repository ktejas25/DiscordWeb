import { useEffect } from 'react';
import { useSettings } from './useSettings';

export function useTheme() {
  const { settings } = useSettings();

  useEffect(() => {
    if (!settings?.settings) return;

    // Apply theme
    const theme = settings.settings.theme || 'system';
    applyTheme(theme);

    // Apply font size
    const fontSize = settings.settings.fontSize || 'medium';
    applyFontSize(fontSize);

    // Apply reduced motion
    const reducedMotion = settings.settings.reducedMotion ?? false;
    document.documentElement.classList.toggle('reduce-motion', reducedMotion);

    // Listen for system theme changes
    if (theme === 'system') {
      const mediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
      const handler = () => applyTheme('system');
      mediaQuery.addEventListener('change', handler);
      return () => mediaQuery.removeEventListener('change', handler);
    }
  }, [settings?.settings]);

  const applyTheme = (theme: string) => {
    const root = document.documentElement;
    if (theme === 'system') {
      const isDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
      root.classList.toggle('dark', isDark);
      root.classList.toggle('light', !isDark);
    } else {
      root.classList.toggle('dark', theme === 'dark');
      root.classList.toggle('light', theme === 'light');
    }
  };

  const applyFontSize = (size: string) => {
    const root = document.documentElement;
    const sizes: Record<string, string> = { small: '14px', medium: '16px', large: '18px' };
    root.style.fontSize = sizes[size] || '16px';
  };
}
