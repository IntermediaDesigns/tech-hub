import { ThemeSettings } from '../lib/types';
import { useTheme } from '../hooks/useTheme';
import { ThemeContext } from './theme-context';

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const { theme, setTheme } = useTheme();

  const updateTheme = (newSettings: Partial<ThemeSettings>) => {
    setTheme(current => ({ ...current, ...newSettings }));
  };

  return (
    <ThemeContext.Provider value={{ theme, updateTheme }}>
      {children}
    </ThemeContext.Provider>
  );
}