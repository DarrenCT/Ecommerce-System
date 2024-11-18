import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import Sidebar from './components/shared/Sidebar';
import ProductCatalog from './components/pages/ProductCatalog';
import CartPage from './components/pages/CartPage';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import { DevAuthProvider } from './context/DevAuthContext';
import SearchResults from './components/pages/SearchResults';
import RegistrationPage from './components/pages/registration.jsx';
import SignInPage from './components/pages/sign_in.jsx';

const AppContent = () => {
  const location = useLocation();
  const showNavBarAndSidebar = !['/register', '/sign_in'].includes(location.pathname);

  return (
    <div className="min-h-screen bg-gray-50">
      {showNavBarAndSidebar && <NavBar />}
      <div className="flex">
        {showNavBarAndSidebar && <Sidebar />}
        <main className="flex-1 p-6">
          <Routes>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/sign_in" element={<SignInPage />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/search" element={<SearchResults />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <DevAuthProvider>
      <Router>
        <AppContent />
      </Router>
    </DevAuthProvider>
  );
};

export default App;
