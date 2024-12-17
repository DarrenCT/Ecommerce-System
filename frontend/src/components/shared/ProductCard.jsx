import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import Toast from './Toast';
import { useAuth } from '../../context/DevAuthContext';
import { cartService } from '../../services/cartService'; 

const ProductCard = ({ product }) => {
    const [showToast, setShowToast] = useState(false);
    const [toastMessage, setToastMessage] = useState('');
    const [toastDuration, setToastDuration] = useState(3000);
    const [toastType, setToastType] = useState('success');
    const { isAuthenticated, user } = useAuth();

    const isOutOfStock = product.quantity <= 0;

    const addToCart = async () => {
        if (isOutOfStock) {
            setToastMessage('Sorry, this item is out of stock');
            setToastDuration(2000);
            setToastType('error');
            setShowToast(true);
            return;
        }

        try {
            const userId = isAuthenticated ? user.userId : null;
            const cart = await cartService.getOrCreateCart(userId);
            await cartService.addToCart(cart.cartId, product._id, 1);

            setToastMessage('Item added to cart successfully!');
            setToastDuration(3000);
            setToastType('success');
            setShowToast(true);
        } catch (error) {
            console.error('Error adding to cart:', error);
            setToastMessage('Error adding item to cart');
            setToastDuration(3000);
            setToastType('error');
            setShowToast(true);
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
                    {isOutOfStock && (
                        <p className="text-red-500 font-semibold mt-2">Out of Stock</p>
                    )}
                </Link>
                <button
                    onClick={addToCart}
                    disabled={isOutOfStock}
                    className={`w-full mt-4 py-2 rounded-md ${
                        isOutOfStock
                            ? 'bg-gray-300 cursor-not-allowed text-gray-500'
                            : 'bg-amazon-yellow hover:bg-amazon-orange text-black'
                    }`}
                >
                    {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                </button>
            </div>
            {showToast && (
                <Toast 
                    message={toastMessage}
                    duration={toastDuration}
                    type={toastType}
                    onClose={() => setShowToast(false)}
                />
            )}
        </>
    );
};

export default ProductCard;