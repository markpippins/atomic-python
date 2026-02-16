import { createTheme } from '@mui/material/styles';

// Visual Studio inspired theme with modern enhancements
export const vsLightTheme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#007ACC', // Visual Studio blue
      light: '#3399FF',
      dark: '#005A9E',
    },
    secondary: {
      main: '#68217A', // Visual Studio purple
      light: '#9966CC',
      dark: '#4A005F',
    },
    background: {
      default: '#F8FAFC', // Softer light background
      paper: '#FFFFFF', // White cards/papers
    },
    text: {
      primary: '#1E1E1E', // Dark gray text
      secondary: '#606060', // Lighter gray text
    },
    divider: '#E0E0E0',
    success: {
      main: '#4CAF50',
      light: '#81C784',
      dark: '#388E3C',
    },
    warning: {
      main: '#FF9800',
      light: '#FFB74D',
      dark: '#F57C00',
    },
    error: {
      main: '#F44336',
      light: '#EF9A9A',
      dark: '#D32F2F',
    },
    info: {
      main: '#2196F3',
      light: '#64B5F6',
      dark: '#1976D2',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners for modern look
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#bfbfbf #f5f5f5',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#bfbfbf',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#f5f5f5',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.02), 0px 4px 8px rgba(0, 0, 0, 0.04)',
          backgroundColor: '#FFFFFF',
          color: '#1E1E1E',
          borderBottom: '1px solid #E0E0E0',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.08), 0px 1px 3px rgba(0, 0, 0, 0.04)',
          border: '1px solid rgba(0, 0, 0, 0.08)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.12), 0px 2px 6px rgba(0, 0, 0, 0.08)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '10px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #E0E0E0',
          boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.05)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: '#E3F2FD !important',
            color: '#1976D2',
            '&:hover': {
              backgroundColor: '#BBDEFB !important',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
          backgroundColor: '#E0E0E0',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});

export const vsDarkTheme = createTheme({
  palette: {
    mode: 'dark',
    primary: {
      main: '#4DA8E7', // Lighter blue for dark theme
      light: '#7DC2F2',
      dark: '#1C9BD9',
    },
    secondary: {
      main: '#C792EA', // Lighter purple for dark theme
      light: '#D1A8F0',
      dark: '#B573D0',
    },
    background: {
      default: '#0F1419', // Darker background for better contrast
      paper: '#1A2028', // Slightly lighter for cards
    },
    text: {
      primary: '#E6E6E6', // Lighter gray text
      secondary: '#A0AEC0', // Softer secondary text
    },
    divider: '#2D3748',
    success: {
      main: '#6ECB63',
      light: '#8DD582',
      dark: '#4FA845',
    },
    warning: {
      main: '#F2B857',
      light: '#F4C774',
      dark: '#E09A3D',
    },
    error: {
      main: '#E57373',
      light: '#EF9A9A',
      dark: '#D32F2F',
    },
    info: {
      main: '#6FC5DA',
      light: '#8ED6E2',
      dark: '#50A7BA',
    },
  },
  typography: {
    fontFamily: [
      '"Inter"',
      'Roboto',
      '"Helvetica Neue"',
      'Arial',
      'sans-serif',
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(','),
    h4: {
      fontWeight: 600,
    },
    h6: {
      fontWeight: 600,
    },
    button: {
      textTransform: 'none',
      fontWeight: 500,
    },
  },
  shape: {
    borderRadius: 12, // More rounded corners for modern look
  },
  components: {
    MuiCssBaseline: {
      styleOverrides: {
        body: {
          scrollbarColor: '#6b6b6b #2b2b2b',
          '&::-webkit-scrollbar, & *::-webkit-scrollbar': {
            width: 8,
            height: 8,
          },
          '&::-webkit-scrollbar-thumb, & *::-webkit-scrollbar-thumb': {
            borderRadius: 8,
            backgroundColor: '#6b6b6b',
            minHeight: 24,
          },
          '&::-webkit-scrollbar-track, & *::-webkit-scrollbar-track': {
            backgroundColor: '#2b2b2b',
          },
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.02), 0px 4px 8px rgba(0, 0, 0, 0.04)',
          backgroundColor: '#1A2028',
          color: '#E6E6E6',
          borderBottom: '1px solid #2D3748',
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          borderRadius: 16,
          boxShadow: '0px 2px 10px rgba(0, 0, 0, 0.15), 0px 1px 3px rgba(0, 0, 0, 0.1)',
          border: '1px solid rgba(255, 255, 255, 0.08)',
          transition: 'box-shadow 0.3s ease, transform 0.2s ease',
          '&:hover': {
            boxShadow: '0px 4px 16px rgba(0, 0, 0, 0.25), 0px 2px 6px rgba(0, 0, 0, 0.15)',
            transform: 'translateY(-2px)',
          },
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          borderRadius: 8,
          fontWeight: 500,
          padding: '10px 16px',
          boxShadow: 'none',
          '&:hover': {
            boxShadow: 'none',
          },
        },
        contained: {
          boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.2)',
          '&:hover': {
            boxShadow: '0px 4px 8px rgba(0, 0, 0, 0.3)',
            transform: 'translateY(-1px)',
          },
        },
        outlined: {
          borderWidth: '1px',
          '&:hover': {
            borderWidth: '1px',
          },
        },
      },
    },
    MuiDrawer: {
      styleOverrides: {
        paper: {
          borderRight: '1px solid #2D3748',
          backgroundColor: '#1A2028',
          color: '#E6E6E6',
          boxShadow: '2px 0px 10px rgba(0, 0, 0, 0.15)',
        },
      },
    },
    MuiListItemButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          margin: '4px 8px',
          '&.Mui-selected': {
            backgroundColor: '#2D3A4F !important',
            color: '#4DA8E7',
            '&:hover': {
              backgroundColor: '#35445D !important',
            },
          },
        },
      },
    },
    MuiLinearProgress: {
      styleOverrides: {
        root: {
          borderRadius: 4,
          height: 8,
          backgroundColor: '#2D3748',
        },
        bar: {
          borderRadius: 4,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 16,
        },
      },
    },
  },
});