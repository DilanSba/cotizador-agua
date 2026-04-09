import React, { useState, useEffect } from 'react';
import { Moon, Sun } from 'lucide-react';

export const DarkModeToggle = () => {
  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.body.classList.add('dark-mode-active');
    } else {
      document.body.classList.remove('dark-mode-active');
    }
  }, [isDark]);

  return (
    <button
      onClick={() => setIsDark(!isDark)}
      className="p-2 sm:p-2.5 rounded-full bg-white border border-slate-200 shadow-sm hover:bg-slate-50 transition-all text-slate-600 flex items-center justify-center hover:scale-110 active:scale-95 no-invert"
      title={isDark ? "Modo Claro" : "Modo Oscuro"}
    >
      {isDark ? <Sun className="w-4 h-4 sm:w-5 sm:h-5 text-amber-500" /> : <Moon className="w-4 h-4 sm:w-5 sm:h-5" />}
    </button>
  );
};
