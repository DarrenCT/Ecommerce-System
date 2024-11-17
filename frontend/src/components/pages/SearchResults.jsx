import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../shared/ProductCard';

const SearchResults = () => {
    const [searchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const query = searchParams.get('q');

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                console.log('Fetching search results for:', query); // Debug log
                const response = await axios.get(`/api/products/search?q=${encodeURIComponent(query)}`);
                console.log('Search response:', response.data); // Debug log
                setProducts(response.data.products);
            } catch (error) {
                console.error('Search error:', error.response?.data || error);
                setError(error.response?.data?.message || 'Failed to fetch search results');
            } finally {
                setLoading(false);
            }
        };

        if (query) {
            fetchSearchResults();
        } else {
            setLoading(false);
        }
    }, [query]);

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-600 py-4">{error}</div>;
    if (!query) return <div className="text-center py-4">Please enter a search term</div>;

    return (
        <div className="container mx-auto px-4">
            <h2 className="text-2xl font-semibold mb-6">
                Search Results for "{query}"
            </h2>
            {products.length === 0 ? (
                <div className="text-center text-gray-600">
                    No products found matching your search
                </div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {products.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            )}
        </div>
    );
};

export default SearchResults;