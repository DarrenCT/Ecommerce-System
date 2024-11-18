import { useEffect, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../shared/ProductCard';
import FilterSideBar from '../shared/FilterSideBar';
import SortControl from '../shared/SortControl'; // Import SortControl

const SearchResults = () => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState(null);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [sortOrder, setSortOrder] = useState('none'); // 'asc', 'desc', 'none'

    const query = searchParams.get('q');
    const currentPage = parseInt(searchParams.get('page')) || 1;

    useEffect(() => {
        const fetchSearchResults = async () => {
            try {
                setLoading(true);
                setError(null);
                const response = await axios.get(`/api/products/search`, {
                    params: {
                        q: query,
                        page: currentPage,
                        categories: Array.from(selectedCategories).join(',')
                    }
                });
                setProducts(response.data.products);
                setPagination(response.data.pagination);
                setCategories(response.data.categories || []);
            } catch (error) {
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
    }, [query, currentPage, selectedCategories]);

    const handlePageChange = (newPage) => {
        setSearchParams({ q: query, page: newPage.toString() });
    };

    const PaginationControls = () => {
        if (!pagination || pagination.totalPages <= 1) return null;

        return (
            <div className="flex justify-center items-center gap-4 mt-8 mb-4">
                <button
                    onClick={() => handlePageChange(currentPage - 1)}
                    disabled={!pagination.hasPrevPage}
                    className={`px-4 py-2 rounded ${pagination.hasPrevPage
                        ? 'bg-amazon-yellow hover:bg-amazon-orange text-black'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Previous
                </button>

                <span className="text-gray-600">
                    Page {pagination.currentPage} of {pagination.totalPages}
                </span>

                <button
                    onClick={() => handlePageChange(currentPage + 1)}
                    disabled={!pagination.hasNextPage}
                    className={`px-4 py-2 rounded ${pagination.hasNextPage
                        ? 'bg-amazon-yellow hover:bg-amazon-orange text-black'
                        : 'bg-gray-200 text-gray-500 cursor-not-allowed'
                        }`}
                >
                    Next
                </button>
            </div>
        );
    };

    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    // Sort the products based on sortOrder
    const sortedProducts = [...products].sort((a, b) => {
        if (sortOrder === 'asc') {
            return a.price - b.price;
        } else if (sortOrder === 'desc') {
            return b.price - a.price;
        }
        return 0; // No sorting
    });

    if (loading) return <div className="text-center py-4">Loading...</div>;
    if (error) return <div className="text-center text-red-600 py-4">{error}</div>;
    if (!query) return <div className="text-center py-4">Please enter a search term</div>;

    return (
        <div className="w-full flex">
            <FilterSideBar
                title="Category"
                items={categories}
                selectedItems={selectedCategories}
                onSelectionChange={setSelectedCategories}
            />

            <div className="flex-1 container mx-auto px-4">
                <h2 className="text-2xl font-semibold mb-6">
                    Search Results for "{query}"
                    {pagination && (
                        <span className="text-gray-500 text-lg ml-2">
                            ({pagination.totalProducts} products found)
                        </span>
                    )}
                </h2>

                {/* Sort Control */}
                <SortControl sortOrder={sortOrder} onSortChange={handleSortChange} />

                {sortedProducts.length === 0 ? (
                    <div className="text-center text-gray-600">
                        No products found matching your search
                    </div>
                ) : (
                    <>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {sortedProducts.map((product) => (
                                <ProductCard key={product._id} product={product} />
                            ))}
                        </div>
                        <PaginationControls />
                    </>
                )}
            </div>
        </div>
    );
};

export default SearchResults;