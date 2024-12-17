import { BrowserRouter as Router, Routes, Route, useLocation, Outlet } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import ProductCatalog from './components/pages/ProductCatalog';
import CartPage from './components/pages/CartPage';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import { DevAuthProvider } from './context/DevAuthContext';
import SearchResults from './components/pages/SearchResults';
import RegistrationPage from './components/pages/registration.jsx';
import SignInPage from './components/pages/sign_in.jsx';
import MyAccount from './components/pages/myAccount.jsx';
import CheckoutPage from './components/pages/CheckoutPage';
import OrderConfirmationPage from './components/pages/OrderConfirmationPage';
import UserManagement from './components/pages/admin/UserManagement';
import CustomerDetails from './components/pages/admin/CustomerDetails';

// General Layout Component
const AppLayout = () => {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-gray-50">
      {['/register', '/sign_in'].includes(location.pathname) || <NavBar />}
      <div className="flex">
        <main className="flex-1">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <DevAuthProvider>
      <Router>
        <Routes>
          {/* Layout for pages with NavBar and Sidebar */}
          <Route element={<AppLayout />}>
            <Route path="/" element={<ProductCatalog />} />
            <Route path="/register" element={<RegistrationPage />} />
            <Route path="/sign_in" element={<SignInPage />} />
            <Route path="/profile" element={<MyAccount />} />
            <Route path="/cart" element={<CartPage />} />
            <Route path="/product/:id" element={<ProductDetailsPage />} />
            <Route path="/search" element={<SearchResults />} />
            <Route path="/checkout" element={<CheckoutPage />} />
            <Route path="/order-confirmation" element={<OrderConfirmationPage />} />
            <Route path="/admin/customers" element={<UserManagement />} />
            <Route path="/admin/customers/:id" element={<CustomerDetails />} />
          </Route>
        </Routes>
      </Router>
    </DevAuthProvider>
  );
};

export default App;
