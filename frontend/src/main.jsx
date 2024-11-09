import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter } from 'react-router-dom';
import RegistrationPage from './registration.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
  <StrictMode>
    <RegistrationPage />
  </StrictMode>
  </BrowserRouter>
);
