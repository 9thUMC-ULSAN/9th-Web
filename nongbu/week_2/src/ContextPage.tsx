import { type ReactElement } from "react"; 
import Navbar from "./Navbar"; 
import ThemeContent from "./ThemeContent"; 
import { useTheme, THEME } from "./Context/ThemeProvider"; // 💡 useTheme 추가
import clsx from "clsx"; // 💡 clsx 추가

export default function ContextPage(): 
ReactElement { 
    // ContextPage가 ThemeProvider 안에 렌더링되고 있으므로 useTheme 사용 가능
    const { theme } = useTheme(); 
    const isLightMode = theme === THEME.LIGHT;
    
    return ( 
        // 💡 1. 최상위 DIV에 'dark' 클래스만 조건부로 토글
        <div className={clsx(
            'flex flex-col items-center justify-start min-h-screen w-full',
            { 'dark': !isLightMode } // isLightMode가 아닐 때 'dark' 클래스 적용
        )}> 
            <Navbar/> 
            <main className="flex-1 w-full"> 
                <ThemeContent/> 
            </main> 
        </div> 
    ); 
}