import { useAuth } from '../../context/DevAuthContext';
import { Link } from 'react-router-dom';

const AdminNavBar = () => {
    const { user, logout } = useAuth();

    return (
        <nav className="bg-amazon text-white">
            <div className="max-w-[1500px] mx-auto px-4 py-3 flex justify-between items-center">
                <Link to="/" className="text-xl font-bold">
                    Admin Panel
                </Link>
                <div className="flex items-center space-x-4">
                    <span>Welcome, {user?.name || 'Admin'}</span>
                    <Link to="/" className="hover:text-amazon-yellow">
                        View Store
                    </Link>
                    <button
                        onClick={logout}
                        className="hover:text-amazon-yellow"
                    >
                        Logout
                    </button>
                </div>
            </div>
        </nav>
    );
};

export default AdminNavBar; 