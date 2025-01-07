import React, { useState, useEffect } from 'react';
    import {
      CssBaseline,
      ThemeProvider,
      createTheme,
      Box,
      IconButton
    } from '@mui/material';
    import { BrowserRouter, Routes, Route } from 'react-router-dom';
    import Dashboard from './components/Dashboard';
    import Brightness4Icon from '@mui/icons-material/Brightness4';
    import Brightness7Icon from '@mui/icons-material/Brightness7';
    
    function App() {
      const [darkMode, setDarkMode] = useState(
        localStorage.getItem('darkMode') === 'true',
      );
    
      useEffect(() => {
        localStorage.setItem('darkMode', darkMode);
        if (darkMode) {
          document.body.classList.add('dark');
        } else {
          document.body.classList.remove('dark');
        }
      }, [darkMode]);
    
      const theme = createTheme({
        palette: {
          mode: darkMode ? 'dark' : 'light',
        },
      });
    
      const toggleDarkMode = () => {
        setDarkMode(!darkMode);
      };
    
      return (
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', p: 1 }}>
            <IconButton onClick={toggleDarkMode} color="inherit">
              {darkMode ? <Brightness7Icon /> : <Brightness4Icon />}
            </IconButton>
          </Box>
          <BrowserRouter>
            <Routes>
              <Route path="/" element={<Dashboard />} />
            </Routes>
          </BrowserRouter>
        </ThemeProvider>
      );
    }
    
    export default App;
