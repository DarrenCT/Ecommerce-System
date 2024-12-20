import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../shared/ProductCard';
import FilterSideBar from '../shared/FilterSideBar';
import SortControl from '../shared/SortControl';

/**
 * ProductCatalog Component
 * Displays a grid of product cards showing all available products
 * Fetches product data from the server on component mount
 */
const ProductCatalog = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [categories, setCategories] = useState([]);
    const [selectedCategories, setSelectedCategories] = useState(new Set());
    const [sortOrder, setSortOrder] = useState('none'); // 'price-asc', 'price-desc', 'name-asc', 'name-desc', 'none'

    const fetchProducts = async () => {
        try {
            setLoading(true);
            const response = await axios.get('/api/products');
            console.log('API Response:', response.data);
            const productsData = response.data.products;
            setProducts(productsData);

            // Extract unique categories from the second level of the hierarchy
            const uniqueCategories = [...new Set(productsData.map(product => {
                if (product.node && product.node[0] && product.node[0].node_name) {
                    const nodePath = product.node[0].node_name.split('/');
                    return nodePath[3];
                }
                return null;
            }))].filter(Boolean);
            setCategories(uniqueCategories);
        } catch (error) {
            console.error('Error fetching products:', error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchProducts();
    }, []);

    // Function to handle sort change
    const handleSortChange = (e) => {
        setSortOrder(e.target.value);
    };

    // Filter products based on selected category
    const filteredProducts = selectedCategories.size > 0
        ? products.filter(product => {
            if (product.node && product.node[0] && product.node[0].node_name) {
                const nodePath = product.node[0].node_name.split('/');
                return selectedCategories.has(nodePath[3]);
            }
            return false;
        })
        : products;

    // Sort the filtered products based on sortOrder
    const sortedProducts = [...filteredProducts].sort((a, b) => {
        switch (sortOrder) {
            case 'price-asc':
                return a.price - b.price;
            case 'price-desc':
                return b.price - a.price;
            case 'name-asc':
                return a.name.localeCompare(b.name);
            case 'name-desc':
                return b.name.localeCompare(a.name);
            default:
                return 0; // No sorting
        }
    });

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="w-full flex">
            <FilterSideBar
                title="Category"
                items={categories}
                selectedItems={selectedCategories}
                onSelectionChange={setSelectedCategories}
            />

            {/* Product Grid */}
            <div className="flex-1 p-6">
                <div className="flex justify-between items-center mb-6">
                    <h2 className="text-2xl font-semibold">
                        {selectedCategories.size > 0
                            ? Array.from(selectedCategories).join(' & ')
                            : 'All Products'}
                    </h2>
                    <button
                        onClick={fetchProducts}
                        className="bg-amazon-yellow hover:bg-amazon-orange text-black px-4 py-2 rounded-md"
                    >
                        Refresh Products
                    </button>
                </div>

                {/* Sort Control */}
                <SortControl sortOrder={sortOrder} onSortChange={handleSortChange} />

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {sortedProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCatalog; 