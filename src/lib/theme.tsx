import type { ReactNode } from 'react';
import React from 'react';
import { createTheme, ThemeProvider, StyledEngineProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Strict Govt-Grade Unified Portal Palette (Meets WCAG Contrast Audits & SIH High-Fidelity Standards)
export const theme = createTheme({
  palette: {
    primary: { main: '#0f172a', light: '#1e293b', dark: '#020617', contrastText: '#ffffff' }, // Deep Slate
    secondary: { main: '#d97706', light: '#f59e0b', dark: '#b45309', contrastText: '#ffffff' }, // Warm Amber (Tribal Identity)
    error: { main: '#dc2626' },
    warning: { main: '#ea580c' },
    success: { main: '#16a34a' },
    background: { default: '#f8fafc', paper: '#ffffff' },
    text: { primary: '#0f172a', secondary: '#475569' },
  },
  typography: {
    fontFamily: ['Inter', 'Plus Jakarta Sans', '-apple-system', 'sans-serif'].join(','),
    button: { textTransform: 'none', fontWeight: 600 },
  },
  components: {
    MuiButton: {
      defaultProps: { disableElevation: true },
      styleOverrides: {
        root: { borderRadius: '6px', padding: '8px 16px' },
      },
    },
    MuiPaper: {
      styleOverrides: {
        rounded: { borderRadius: '0.75rem' },
      },
    },
  },
});

// Backward compatibility alias for legacy imports
export const appTheme = theme;

export const ThemeConfig: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <StyledEngineProvider injectFirst>
    <ThemeProvider theme={theme}>
      <CssBaseline />
      {children}
    </ThemeProvider>
  </StyledEngineProvider>
);

// Backward compatibility alias for existing main.tsx
export const AppThemeProvider = ThemeConfig;
