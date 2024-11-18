import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import RegistrationPage from './registration.jsx';
import SignInPage from './sign_in.jsx';

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <StrictMode>
      <Routes>
        <Route path="/register" element={<RegistrationPage />} />
        <Route path="/sign_in" element={<SignInPage />} />
      </Routes>
    </StrictMode>
  </BrowserRouter>
);
