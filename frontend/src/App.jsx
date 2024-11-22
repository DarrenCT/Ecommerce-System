import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import Sidebar from './components/shared/Sidebar';
import ProductCatalog from './components/pages/ProductCatalog';
import CartPage from './components/pages/CartPage';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import { DevAuthProvider } from './context/DevAuthContext';
import SearchResults from './components/pages/SearchResults';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';


// Create a separate component for the layout that uses useLocation
const AppLayout = () => {
  const location = useLocation();
  const showGeneralSidebar = location.pathname !== '/' &&
    location.pathname !== '/search' &&
    location.pathname !== '/checkout' &&
    location.pathname !== '/cart' &&
    !location.pathname.startsWith('/order-confirmation');

  return (
    <div className="min-h-screen bg-gray-50">
      <NavBar />
      <div className="flex">
        {showGeneralSidebar && <Sidebar />}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Main App component that provides the Router context
const App = () => {
  return (
    <DevAuthProvider>
      <Router>
        <Routes>
          <Route element={<AppLayout />}>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/search" element={<SearchResults />} />
          </Route>
        </Routes>
      </Router>
    </DevAuthProvider>
  );
};

export default App;
