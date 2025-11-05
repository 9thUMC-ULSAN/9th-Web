import { THEME, useTheme } from './context/ThemeProvider';
import clsx from 'clsx';

// React import는 제거되었습니다.

export default function ThemeToggleButton() {
  const { theme, toggleTheme } = useTheme();

  // useTheme이 ThemeContext의 기본값을 반환할 수 있으므로 안전하게 처리합니다.
  const currentTheme = theme || THEME.LIGHT;

  const isLightMode = currentTheme === THEME.LIGHT;

  // ⭐️⭐️ 콘솔에 현재 상태가 정확히 찍히는지 확인하세요! ⭐️⭐️
  console.log(
    `[버튼 상태] Theme: ${currentTheme}, isLightMode: ${isLightMode}`
  );

  return (
    <button
      onClick={toggleTheme}
      // !important 접두사를 사용하여 다른 CSS 규칙보다 우선순위를 높입니다.
      className={clsx(
        'px-4 py-2 mt-4 rounded-md transition-all font-medium shadow-lg',
        {
          '!bg-black !text-white hover:bg-gray-800': !isLightMode,
          '!bg-white !text-black hover:bg-gray-100': isLightMode,
        }
      )}
    >
      {isLightMode ? '🌙 다크 모드' : '☀️ 라이트 모드'}
    </button>
  );
}
