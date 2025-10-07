import { Children, createContext, useState, type PropsWithChildren, useContext } from "react";

export enum THEME {
  DARK = 'DARK',
  LIGHT = 'LIGHT',
}

type TTheme = THEME.DARK | THEME.LIGHT

interface IThemeContext {
  theme: TTheme
  toggleTheme: () => void
}

export const ThemeContext = createContext<IThemeContext | undefined>(undefined)

export const ThemeProvider = ({children}: PropsWithChildren) => {
  const [theme, setTheme] = useState<TTheme>(THEME.LIGHT)

  const toggleTheme = () => {
    setTheme((prevTheme) => 
      prevTheme === THEME.LIGHT ? THEME.DARK : THEME.LIGHT
    )
  }
  
  return (
      <ThemeContext.Provider value = {{ theme, toggleTheme }}>
        {children}
      </ThemeContext.Provider>
    )
}

export const useTheme = () => {
  const context = useContext(ThemeContext)    

  if (!context) {
    throw new Error('useTheme must be used within a ThemeProvider')
  }

  return context
}