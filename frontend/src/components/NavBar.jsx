// Icons from lucide-react library
import { Search, ShoppingCart, User } from "lucide-react"

const NavBar = () => {
    return (
        <nav className="w-full bg-amazon text-white sticky top-0 z-50">
            <div className="flex items-center justify-between p-2 max-w-[1500px] mx-auto">
                <div className="flex items-center">
                    <h1 className="text-2xl font-bold">E-Store</h1>
                </div>

                <div className="flex flex-1 items-center max-w-2xl mx-4">
                    <select className="h-10 w-20 rounded-l-md bg-gray-100 text-black px-2 border-r border-gray-300">
                        <option value="all">All</option>
                        <option value="products">Products</option>
                        <option value="categories">Categories</option>
                    </select>
                    <input
                        type="text"
                        placeholder="Search products..."
                        className="h-10 flex-1 px-4 text-black"
                    />
                    <button className="h-10 px-4 bg-amazon-yellow hover:bg-amazon-orange rounded-r-md">
                        {/* Search icon from lucide-react */}
                        <Search className="h-5 w-5 text-black" />
                    </button>
                </div>

                <div className="flex items-center space-x-6">
                    <button className="flex items-center space-x-1">
                        {/* Shopping Cart icon from lucide-react */}
                        <ShoppingCart className="h-6 w-6" />
                        <span>Cart</span>
                    </button>
                    <button className="flex items-center space-x-1">
                        {/* User icon from lucide-react */}
                        <User className="h-6 w-6" />
                        <span>Profile</span>
                    </button>
                </div>
            </div>
        </nav>
    )
}

export default NavBar 