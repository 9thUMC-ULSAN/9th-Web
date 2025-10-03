import { THEME, useTheme } from './context/ThemeProvider'
import clsx from 'clsx'

export default function ThemeContent() {
  const { theme } = useTheme()
  
  const isLightMode = theme === THEME.LIGHT
  return (
    <div className={clsx('p-4 h-dvh w-full',
      isLightMode ? 'bg-white' : 'bg-gray-800'
    )}
    >
      <h1 className={clsx('text-wxl font-bold',
        isLightMode ? 'text-black' : 'text-white'
      )}
      >
        Theme Content
      </h1>
      <p className={clsx('mt-2', isLightMode ? 'text-black' : 'text-white')}
      >
        Lorem, ipsum dolor sit amet consectetur adipisicing elit. 
        Ad, officia eius placeat ea dolores dicta voluptates illum nihil. 
        Veniam dolorum, recusandae ipsam pariatur reiciendis natus id earum tempora quidem explicabo!
      </p>
    </div>
  )
}