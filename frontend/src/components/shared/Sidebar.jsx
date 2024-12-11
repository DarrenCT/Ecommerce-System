import { Link } from 'react-router-dom';

const Sidebar = () => {
    const menuItems = [
        { title: 'Your Account', href: '/profile' },
        { title: 'Orders', href: '/orders' },
        { title: 'Department', href: '/department' },
        { title: 'Help', href: '/help' },
        { title: 'Logout', href: '/' },
    ];

    return (
        <div className="w-64 bg-white border-r min-h-screen">
            <div className="p-4">
                <h2 className="font-semibold mb-4">Functions</h2>
                <div className="space-y-2">
                    {menuItems.map((item) => (
                        <Link
                            key={item.title}
                            to={item.href}
                            className="block px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
                        >
                            {item.title}
                        </Link>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default Sidebar;