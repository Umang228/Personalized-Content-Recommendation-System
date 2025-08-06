import { createTheme } from '@mui/material/styles';

const theme = createTheme({
  palette: {
    mode: 'light',
    primary: {
      main: '#5e60ce',
    },
    secondary: {
      main: '#f72585',
    },
    background: {
      default: '#f9f9fb',
    },
  },
  typography: {
    fontFamily: 'Inter, Roboto, sans-serif',
    fontWeightMedium: 600,
    h4: { fontWeight: 700 },
  },
});

export default theme;
