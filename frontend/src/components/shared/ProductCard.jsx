import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import Toast from './Toast';

//tailwind css product card
const ProductCard = ({ product }) => {
    const [showToast, setShowToast] = useState(false);

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

            setShowToast(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <>
            <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
                <Link to={`/product/${product._id}`}>
                    <img
                        src={product.image || 'https://via.placeholder.com/400'}
                        alt={product.name}
                        className="w-full h-48 object-contain rounded-md mb-4"
                    />
                    <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                    <p className="text-2xl font-bold text-amazon-light">${product.price}</p>
                </Link>
                <button
                    onClick={addToCart}
                    className="w-full mt-4 bg-amazon-yellow hover:bg-amazon-orange text-black py-2 rounded-md"
                >
                    Add to Cart
                </button>
            </div>
            {showToast && (
                <Toast 
                    message="Item added to cart successfully!"
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
};

export default ProductCard;