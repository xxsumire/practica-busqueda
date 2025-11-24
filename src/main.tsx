import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import Home from './components/Home';
import './styles/main.css';
import '@fontsource/momo-trust-display';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Home />
  </StrictMode>
);
