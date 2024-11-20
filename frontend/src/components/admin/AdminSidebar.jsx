import { Link, useLocation } from 'react-router-dom';
import { BarChart3, Package, Users, History } from 'lucide-react';

const AdminSidebar = () => {
    const location = useLocation();

    const menuItems = [
        { title: 'Dashboard', icon: BarChart3, href: '/admin' },
        { title: 'Sales History', icon: History, href: '/admin/sales' },
        { title: 'Inventory', icon: Package, href: '/admin/inventory' },
        { title: 'Users', icon: Users, href: '/admin/users' },
    ];

    return (
        <div className="w-64 min-h-screen bg-white border-r">
            <div className="p-4">
                <h2 className="text-xl font-bold mb-4">Admin Panel</h2>
                <nav className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.href}
                            to={item.href}
                            className={`flex items-center space-x-2 px-4 py-2 rounded-md transition-colors ${location.pathname === item.href
                                    ? 'bg-amazon-yellow text-black'
                                    : 'hover:bg-gray-100'
                                }`}
                        >
                            <item.icon className="w-5 h-5" />
                            <span>{item.title}</span>
                        </Link>
                    ))}
                </nav>
            </div>
        </div>
    );
};

export default AdminSidebar; 