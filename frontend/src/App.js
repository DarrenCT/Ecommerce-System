import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import Sidebar from './components/shared/Sidebar';
import ProductCard from './components/pages/ProductCard';

const App = () => {
  return (
    <Router>
      <div className="min-h-screen bg-gray-50">
        <NavBar />
        <div className="flex">
          <Sidebar />
          <main className="flex-1 p-6">
            <Routes>
              <Route path="/" element={<ProductCard />} />
              <Route path="/navbar" element={<NavBar />} />
              <Route path="/sidebar" element={<Sidebar />} />
            </Routes>
          </main>
        </div>
      </div>
    </Router>
  );
};

export default App;
