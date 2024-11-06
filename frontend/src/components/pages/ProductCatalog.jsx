import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../shared/ProductCard';

/**
 * ProductCatalog Component
 * Displays a grid of product cards showing all available products
 * Fetches product data from the server on component mount
 */
const ProductCatalog = () => {
    // State for managing products data and loading state
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    /**
     * Fetches products from the server when component mounts
     * Updates products state and handles loading state
     */
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                setProducts(response.data.products);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Show loading state while fetching products
    if (loading) return <div>Loading products...</div>;

    return (
        <div>
            <h2 className="text-2xl font-semibold mb-6">Popular Products</h2>
            {/* Responsive grid layout for product cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {products.map((product) => (
                    <ProductCard key={product._id} product={product} />
                ))}
            </div>
        </div>
    );
};

export default ProductCatalog; 