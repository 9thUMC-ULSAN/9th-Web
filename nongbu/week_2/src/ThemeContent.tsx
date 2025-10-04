import Todo from './components/Todo'; 
import { useTheme, THEME } from "./Context/ThemeProvider"; 
import clsx from 'clsx';
import './App.css'

export default function ThemeContent() { 
    const { theme, toggleTheme } = useTheme(); 
    const isLightMode = theme === THEME.LIGHT; 
    return ( 
        <div className={clsx('flex flex-col items-center justify-center min-h-screen min-w-screen', isLightMode? 'bg-white' : 'bg-gray-800'
        )}>
            <Todo/> 
        </div>
    )
}

