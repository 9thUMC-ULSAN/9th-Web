import { ThemeProvider, useTheme, THEME } from './context/ThemeProvider';
import Navbar from './NavBar';
import ThemeContent from './ThemeContent';
// import React from 'react'; // ⬅️ 삭제됨

const ContextPageWrapper = () => {
  const { theme } = useTheme();
  const isDarkMode = theme === THEME.DARK;

  return (
    <div
      className={`flex flex-col items-center justify-center h-screen ${
        isDarkMode ? 'dark' : ''
      } w-full`}
    >
      <Navbar />

      <main className="w-full grow">
        <ThemeContent />
      </main>
    </div>
  );
};

export default function ContextPage() {
  return (
    <ThemeProvider>
      <ContextPageWrapper />
    </ThemeProvider>
  );
}
