import React, { createContext, useState, ReactNode } from 'react';

interface ThemeContextType {
  theme: string;
  setTheme: (theme: string) => void;
}

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeProvider: React.FC<ThemeProviderProps> = ({ children }) => {
  const [theme, setTheme] = useState<string>('light'); // Default theme

  return (
    <ThemeContext.Provider value={{ theme, setTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};
