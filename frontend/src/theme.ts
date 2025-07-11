// src/themes.ts
import { createTheme } from '@mui/material/styles';

export const lightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#7c3aed', // Lavanda profunda
    },
    secondary: {
      main: '#f59e0b', // Ámbar
    },
    background: {
      default: '#f4f4f5', // Gris claro neutro
      paper: '#ffffff',   // Fondo de tarjetas
    },
    text: {
      primary: '#111827', // Gris carbón
      secondary: '#6b7280', // Gris medio
    },
  },
  typography: {
    fontFamily: 'Poppins, Roboto, sans-serif',
  },
});

export const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#c084fc', // Lavanda suave
    },
    secondary: {
      main: '#fbbf24', // Ámbar brillante
    },
    background: {
      default: '#0f172a', // Carbón oscuro
      paper: '#1e293b',   // Azul grisáceo profundo
    },
    text: {
      primary: '#e2e8f0', // Gris claro
      secondary: '#94a3b8', // Azul gris claro
    },
  },
  
});