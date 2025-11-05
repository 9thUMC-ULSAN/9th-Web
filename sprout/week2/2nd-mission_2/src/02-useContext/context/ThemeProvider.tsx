import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react'; // ReactNode만 타입으로 가져와 오류 회피

export enum THEME {
  LIGHT = 'LIGHT',
  DARK = 'DARK',
}

export type TTheme = THEME.LIGHT | THEME.DARK;

interface IThemeContext {
  theme: TTheme;
  toggleTheme: () => void;
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined);

// ProviderProps를 직접 정의합니다.
interface ProviderProps {
  children: ReactNode;
}

export const ThemeProvider = ({ children }: ProviderProps) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT);

  const toggleTheme = (): void => {
    setTheme(
      (prevTheme): THEME =>
        prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    );
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const context = useContext(ThemeContext);

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider');
  }

  return context as IThemeContext;
};
