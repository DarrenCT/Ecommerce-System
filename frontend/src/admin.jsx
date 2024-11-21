import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { DevAuthProvider } from './context/DevAuthContext';
import AdminLayout from './components/layouts/AdminLayout';
import AdminDashboard from './components/pages/admin/AdminDashboard';
import SalesHistory from './components/pages/admin/SalesHistory';
import InventoryManagement from './components/pages/admin/InventoryManagement';
import UserManagement from './components/pages/admin/UserManagement';

const AdminApp = () => {
    return (
        <DevAuthProvider>
            <Router basename="/admin.html">
                <Routes>
                    <Route path="/" element={<AdminLayout />}>
                        <Route index element={<AdminDashboard />} />
                        <Route path="sales" element={<SalesHistory />} />
                        <Route path="inventory" element={<InventoryManagement />} />
                        <Route path="users" element={<UserManagement />} />
                    </Route>
                    <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
            </Router>
        </DevAuthProvider>
    );
};

createRoot(document.getElementById('root')).render(
    <StrictMode>
        <AdminApp />
    </StrictMode>,
);