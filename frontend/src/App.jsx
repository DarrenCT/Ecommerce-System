import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import NavBar from './components/shared/NavBar';
import Sidebar from './components/shared/Sidebar';
import ProductCatalog from './components/pages/ProductCatalog';
import CartPage from './components/pages/CartPage';
import ProductDetailsPage from './components/pages/ProductDetailsPage';
import { DevAuthProvider } from './context/DevAuthContext';
import SearchResults from './components/pages/SearchResults';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import SalesHistory from './components/pages/admin/SalesHistory';
import InventoryManagement from './components/pages/admin/InventoryManagement';
import UserManagement from './components/pages/admin/UserManagement';

// Create a separate component for the layout that uses useLocation
const AppLayout = () => {
  const location = useLocation();
  const showGeneralSidebar = location.pathname !== '/' && location.pathname !== '/search';

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
          {/* Admin Routes */}
          <Route path="/admin" element={<AdminLayout />}>
            <Route index element={<AdminDashboard />} />
            <Route path="sales" element={<SalesHistory />} />
            <Route path="inventory" element={<InventoryManagement />} />
            <Route path="users" element={<UserManagement />} />
          </Route>

          {/* Existing Customer Routes */}
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
