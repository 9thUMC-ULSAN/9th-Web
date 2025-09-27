import {useTheme, THEME } from './Context/ThemeProvider'; 
import clsx from 'clsx'; 

export default function ThemeToggleButton() { 
    const {theme, toggleTheme} = useTheme(); 
    const isLightMode = theme === THEME.LIGHT; 
    return ( 
        <button onClick={toggleTheme} 
        className={clsx('px-6 py-3 mt-4 shadow-lg rounded-2xl cursor-pointer transition-all w-30 h-10', { 
                'bg-black text-white' : !isLightMode, 
            'bg-white text-black' : isLightMode, 
            } 
        )}> 
            {isLightMode? '🌙 다크 모드' : '☀️ 라이트 모드'} 
        </button> 
    ) 
};

