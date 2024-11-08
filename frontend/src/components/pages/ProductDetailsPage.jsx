import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

const transformImageData = (imageData) => {
    if (!imageData) return 'https://via.placeholder.com/400';
    if (imageData.type === 'Buffer' && imageData.data) {
        const buffer = new Uint8Array(imageData.data);
        const base64 = btoa(String.fromCharCode.apply(null, buffer));
        return `data:image/jpeg;base64,${base64}`;
    }
    return 'https://via.placeholder.com/400';
};

const ProductDetailsPage = () => {
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const { id } = useParams();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                setLoading(true);
                const response = await axios.get(`/api/products/${id}`);
                setProduct(response.data);

            } catch (error) {
                console.error('Error fetching product:', error);
                setError('Error fetching product details');
            } finally {
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    const addToCart = async () => {
        try {
            let cartId = localStorage.getItem('cartId');
            if (!cartId) {
                const response = await axios.post('/api/cart');
                cartId = response.data.cartId;
                localStorage.setItem('cartId', cartId);
            }

            await axios.post(`/api/cart/${cartId}/items`, {
                productId: product._id,
                quantity: 1
            });
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!product) return <div>Product not found</div>;

    return (
        <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* Product Image */}
                <div className="flex justify-center items-center">
                    <img
                        src={transformImageData(product.main_image)}
                        alt={product.item_name?.[0]?.value || 'Product Image'}
                        className="max-w-full h-auto object-contain"
                    />
                </div>

                {/* Product Details */}
                <div>
                    <h1 className="text-3xl font-bold mb-4">
                        {product.item_name?.[0]?.value || 'Product Name'}
                    </h1>
                    <div className="text-gray-600 mb-4">
                        Brand: {product.brand?.[0]?.value || 'Unknown Brand'}
                    </div>
                    <div className="text-3xl font-bold text-amazon-light mb-6">
                        ${product.price?.toFixed(2)}
                    </div>

                    {/* Stock Status */}
                    <div className="mb-6">
                        <span className={`text-lg ${product.quantity > 0 ? 'text-green-600' : 'text-red-600'}`}>
                            {product.quantity > 0 ? `In Stock (${product.quantity} available)` : 'Out of Stock'}
                        </span>
                    </div>

                    {/* Add to Cart Button */}
                    <button
                        onClick={addToCart}
                        disabled={product.quantity === 0}
                        className={`w-full max-w-xs bg-amazon-yellow hover:bg-amazon-orange text-black py-2 px-4 rounded-md mb-6 
                            ${product.quantity === 0 ? 'opacity-50 cursor-not-allowed' : ''}`}
                    >
                        Add to Cart
                    </button>

                    {/* Product Description */}
                    <div className="border-t pt-6">
                        <h2 className="text-xl font-bold mb-4">About this item</h2>
                        <ul className="list-disc pl-6 space-y-2">
                            {product.bullet_point && product.bullet_point.length > 0 ? (
                                product.bullet_point.slice(0, 4).map((point, index) => (
                                    <li key={index} className="text-gray-700">
                                        {point.value}
                                    </li>
                                ))
                            ) : (
                                <li>Product description not available</li>
                            )}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ProductDetailsPage; 