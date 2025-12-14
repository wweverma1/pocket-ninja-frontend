import { createTheme } from '@mui/material/styles';

// Define a safe default shadow for higher indices
const defaultShadow = '0px 0px 0px rgba(0,0,0,0)'; 
const customShadows = [
  'none',
  '0px 2px 4px rgba(0,0,0,0.05)',
  '0px 4px 8px rgba(0,0,0,0.08)',
  '0px 8px 16px rgba(0,0,0,0.1)',
  '0px 12px 24px rgba(0,0,0,0.12)',
];

// MUI requires 25 shadow values (index 0 to 24)
// Fill the rest with the default shadow to prevent warnings when elevation > 4 is used.
const allShadows = [...customShadows];
while (allShadows.length < 25) {
    allShadows.push(defaultShadow);
}

// Color palette inspired by Japanese aesthetics
const pocketNinjaTheme = createTheme({
  palette: {
    primary: {
      main: '#2C3E50', // Deep navy - sophisticated and trustworthy
      light: '#34495E',
      dark: '#1A252F',
      contrastText: '#FFFFFF',
    },
    secondary: {
      main: '#E74C3C', // Vibrant red - savings/urgency
      light: '#EC7063',
      dark: '#C0392B',
      contrastText: '#FFFFFF',
    },
    success: {
      main: '#27AE60', // Green for savings
      light: '#52BE80',
      dark: '#1E8449',
    },
    background: {
      default: '#F8F9FA',
      paper: '#FFFFFF',
    },
    text: {
      primary: '#2C3E50',
      secondary: '#7F8C8D',
    },
  },
  typography: {
    fontFamily: '"Noto Sans JP", "Roboto", "Helvetica", "Arial", sans-serif',
    h1: {
      fontSize: '2rem',
      fontWeight: 700,
      lineHeight: 1.2,
      '@media (min-width:600px)': {
        fontSize: '2.5rem',
      },
    },
    h2: {
      fontSize: '1.5rem',
      fontWeight: 600,
      lineHeight: 1.3,
      '@media (min-width:600px)': {
        fontSize: '2rem',
      },
    },
    h3: {
      fontSize: '1.25rem',
      fontWeight: 600,
      lineHeight: 1.4,
    },
    body1: {
      fontSize: '1rem',
      lineHeight: 1.6,
    },
    body2: {
      fontSize: '0.875rem',
      lineHeight: 1.5,
    },
  },
  shape: {
    borderRadius: 12,
  },
  // FIXED: Extended shadows array to 25 elements to prevent warnings
  shadows: allShadows,
  components: {
    MuiButton: {
      styleOverrides: {
        root: {
          textTransform: 'none',
          fontWeight: 600,
          padding: '10px 24px',
          fontSize: '1rem',
        },
        contained: {
          boxShadow: '0px 4px 8px rgba(0,0,0,0.1)',
          '&:hover': {
            boxShadow: '0px 6px 12px rgba(0,0,0,0.15)',
          },
        },
      },
    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0px 4px 12px rgba(0,0,0,0.08)',
          '&:hover': {
            boxShadow: '0px 6px 16px rgba(0,0,0,0.12)',
          },
          transition: 'box-shadow 0.3s ease',
        },
      },
    },
    MuiAppBar: {
      styleOverrides: {
        root: {
          boxShadow: '0px 2px 8px rgba(0,0,0,0.1)',
        },
      },
    },
  },
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 960,
      lg: 1280,
      xl: 1920,
    },
  },
});

export default pocketNinjaTheme;