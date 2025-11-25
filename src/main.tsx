import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './components/Home';
import './styles/main.css';
import ThemeMaterialUI from './common/ThemeMaterialUI.js';
import { ThemeProvider } from '@emotion/react';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <ThemeProvider theme={ThemeMaterialUI}>
      <Home />
    </ThemeProvider>
  </StrictMode>
);
