// App.js
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import RegistrationPage from './registration.jsx';
import SignInPage from './sign_in.jsx';

function App() {
  return (
    <Routes>
      <Route path="/register" element={<RegistrationPage />} />
      <Route path="/sign_in" element={<SignInPage />} />
    </Routes>
  );
}

export default App;

