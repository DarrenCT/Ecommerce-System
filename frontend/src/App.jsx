import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import Sidebar from './components/shared/Sidebar';
import ProductCatalog from './components/pages/ProductCatalog';
import CartPage from './components/pages/CartPage';
import { DevAuthProvider } from './context/DevAuthContext';

const App = () => {
  return (
    <DevAuthProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <NavBar />
          <div className="flex">
            <Sidebar />
            <main className="flex-1 p-6">
              <Routes>
                <Route path="/" element={<ProductCatalog />} />
                <Route path="/cart" element={<CartPage />} />
              </Routes>
            </main>
          </div>
        </div>
      </Router>
    </DevAuthProvider>
  );
};

export default App;
