// src/AppWithTheme.tsx
import { useState } from 'react';
import { ThemeProvider, CssBaseline } from '@mui/material';
import { darkTheme, lightTheme } from './theme';
import App from './App';

function AppWithTheme() {
  const [mode, setMode] = useState<'light' | 'dark'>('dark');

  const toggleTheme = () => {
    setMode((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const currentTheme = mode === 'dark' ? darkTheme : lightTheme;

  return (
    <ThemeProvider theme={currentTheme}>
      <CssBaseline />
      <App onToggleTheme={toggleTheme} themeMode={mode} />
    </ThemeProvider>
  );
}

export default AppWithTheme;
