import clsx from 'clsx';
import { THEME, useTheme } from './context/ThemeProvider';
// import React from 'react'; // ⬅️ 삭제됨

export default function ThemeContent() {
  const { theme } = useTheme();

  const isLightMode = theme === THEME.LIGHT;

  return (
    <div
      className={clsx('p-4 h-full w-full', {
        'bg-white': isLightMode,
        'bg-gray-800': !isLightMode,
      })}
    >
      <h1
        className={clsx('text-4xl font-bold', {
          'text-black': isLightMode,
          'text-white': !isLightMode,
        })}
      >
        Theme Content
      </h1>
      <p
        className={clsx('mt-2', {
          'text-black': isLightMode,
          'text-white': !isLightMode,
        })}
      >
        Lorem ipsum dolor sit amet consectetur adipisicing elit. Maiores placeat
        amet dolore dolorum magnam magni facere vel sequi itaque obcaecati, at,
        minus perspiciatis error sint iste quas quam laboriosam recusandae esse
        provident.
      </p>
    </div>
  );
}
