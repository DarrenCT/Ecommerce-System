import { useEffect, useState } from 'react';
import axios from 'axios';
import ProductCard from '../shared/ProductCard';

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

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await axios.get('/api/products');
                console.log('API Response:', response.data);
                const productsData = response.data.products;
                setProducts(productsData);

                // Extract unique categories from the second level of the hierarchy
                const uniqueCategories = [...new Set(productsData.map(product => {
                    console.log('Product node:', product.node);
                    if (product.node && product.node[0] && product.node[0].node_name) {
                        const nodePath = product.node[0].node_name.split('/');
                        console.log('Node path:', nodePath);
                        return nodePath[2];
                    }
                    return null;
                }))].filter(Boolean);
                console.log('Unique categories:', uniqueCategories);
                setCategories(uniqueCategories);
            } catch (error) {
                console.error('Error fetching products:', error);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, []);

    // Filter products based on selected category
    const filteredProducts = selectedCategories.size > 0
        ? products.filter(product => {
            if (product.node && product.node[0] && product.node[0].node_name) {
                const nodePath = product.node[0].node_name.split('/');
                return selectedCategories.has(nodePath[2]);
            }
            return false;
        })
        : products;

    if (loading) return <div>Loading products...</div>;

    return (
        <div className="w-full flex">
            {/* Category Sidebar */}
            <div className="w-64 min-h-screen bg-gray-100 p-4 border-r">
                <h3 className="text-lg font-semibold mb-4">Category</h3>
                <div className="max-h-[calc(100vh-8rem)] overflow-y-auto">
                    {categories.map((category) => (
                        <div key={category} className="mb-2">
                            <label className="flex items-center space-x-2 cursor-pointer hover:bg-gray-200 p-2 rounded">
                                <input
                                    type="checkbox"
                                    checked={selectedCategories.has(category)}
                                    onChange={() => {
                                        const newSelectedCategories = new Set(selectedCategories);
                                        if (selectedCategories.has(category)) {
                                            newSelectedCategories.delete(category);
                                        } else {
                                            newSelectedCategories.add(category);
                                        }
                                        setSelectedCategories(newSelectedCategories);
                                    }}
                                    className="form-checkbox text-amazon-yellow"
                                />
                                <span className="text-gray-700">{category}</span>
                            </label>
                        </div>
                    ))}
                </div>
            </div>

            {/* Product Grid */}
            <div className="flex-1 p-6">
                <h2 className="text-2xl font-semibold mb-6">
                    {selectedCategories.size > 0
                        ? Array.from(selectedCategories).join(' & ')
                        : 'All Products'}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                    {filteredProducts.map((product) => (
                        <ProductCard key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default ProductCatalog; 