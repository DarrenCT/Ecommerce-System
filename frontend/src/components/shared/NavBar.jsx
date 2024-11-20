import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Search, ShoppingCart, User } from "lucide-react"
import { useAuth } from '../../context/DevAuthContext';

const NavBar = () => {
    const { user, isAuthenticated, login, logout } = useAuth();
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate();

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
        }
    };

    return (
        <nav className="w-full bg-amazon text-white sticky top-0 z-50">
            <div className="flex items-center justify-between p-2 max-w-[1500px] mx-auto">
                <div className="flex items-center">
                    <Link to="/" className="text-2xl font-bold hover:text-amazon-yellow">
                        E-Store
                    </Link>
                </div>

                <form onSubmit={handleSearch} className="flex flex-1 items-center max-w-2xl mx-4">
                    <select className="h-10 w-20 rounded-l-md bg-gray-100 text-black px-2 border-r border-gray-300">
                        <option value="all">All</option>
                        <option value="products">Products</option>
                        <option value="categories">Categories</option>
                    </select>
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search products..."
                        className="h-10 flex-1 px-4 text-black"
                    />
                    <button type="submit" className="h-10 px-4 bg-amazon-yellow hover:bg-amazon-orange rounded-r-md">
                        <Search className="h-5 w-5 text-black" />
                    </button>
                </form>

                <div className="flex items-center space-x-6">
                    <Link
                        to="/cart"
                        className="flex items-center space-x-1 hover:text-amazon-yellow"
                    >
                        <ShoppingCart className="h-6 w-6" />
                        <span>Cart</span>
                    </Link>
                    <button
                        onClick={isAuthenticated ? logout : login}
                        className="flex items-center space-x-1"
                    >
                        <User className="h-6 w-6" />
                        <span>{isAuthenticated ? 'Logout' : 'Login'}</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar 