import { Outlet } from 'react-router-dom';
import AdminSidebar from '../admin/AdminSidebar';
import AdminNavBar from '../admin/AdminNavBar';

const AdminLayout = () => {
    return (
        <div className="min-h-screen bg-gray-50">
            <AdminNavBar />
            <div className="flex">
                <AdminSidebar />
                <main className="flex-1 p-6">
                    <Outlet />
                </main>
            </div>
        </div>
    );
};

export default AdminLayout;