import { useTheme, THEME } from "./Context/ThemeProvider" 
import ThemeToggleButton from "./ThemeToggleButton"; 

import clsx from "clsx"; 

export default function Navbar() { 
    const { theme, toggleTheme } = useTheme(); 

    const isLightMode = theme === THEME.LIGHT; 

    console.log(theme); 

    return(
        <nav className={clsx(
                'fixed top-10 right-10 p-10 w-full flex justify-end',
        )}> 
            <ThemeToggleButton/> 
        </nav> 
    ) 
};