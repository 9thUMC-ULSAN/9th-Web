import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider';
import ThemeToggleButton from './ThemeToggleButton';
// import React from 'react'; // ⬅️ 삭제됨

export default function Navbar() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <nav
      className={clsx('p-4 w-full flex justify-end', {
        'bg-white': isLightMode,
        'bg-gray-800': !isLightMode,
      })}
    >
      <ThemeToggleButton />
    </nav>
  );
}
