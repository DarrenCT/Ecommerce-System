import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    // Get cartId from localStorage or create new one
    const getCartId = async () => {
        let cartId = localStorage.getItem('cartId');
        if (!cartId) {
            cartId = await createNewCart();
        }
        return cartId;
    };

    const createNewCart = async () => {
        try {
            const response = await axios.post('/api/cart');
            const cartId = response.data.cartId;
            localStorage.setItem('cartId', cartId);
            return cartId;
        } catch (error) {
            console.error('Error creating cart:', error);
            setError('Error creating cart');
            return null;
        }
    };

    const fetchCart = async () => {
        try {
            setLoading(true);
            const cartId = await getCartId();
            if (!cartId) {
                setError('Could not create or retrieve cart');
                return;
            }
            const response = await axios.get(`/api/cart/${cartId}`);
            setCart(response.data);
        } catch (error) {
            console.error('Error fetching cart:', error);
            setError('Error fetching cart data');
        } finally {
            setLoading(false);
        }
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const cartId = await getCartId();
            await axios.put(`/api/cart/${cartId}/items/${productId}`, {
                quantity: newQuantity
            });
            fetchCart(); // Refresh cart data
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const removeItem = async (productId) => {
        try {
            const cartId = await getCartId();
            await axios.delete(`/api/cart/${cartId}/items/${productId}`);
            fetchCart(); // Refresh cart data
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    useEffect(() => {
        fetchCart();
    }, []);

    if (loading) return <div>Loading cart...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!cart) return <div>No cart found</div>;

    return (
        <div className="min-h-screen bg-gray-50">
            <div className="max-w-[1500px] mx-auto p-4">
                <div className="flex flex-col lg:flex-row gap-6">
                    {/* Cart Items Section */}
                    <div className="flex-grow bg-white p-6 rounded-lg shadow-sm">
                        <div className="flex justify-between border-b pb-4">
                            <h1 className="text-2xl font-bold">Shopping Cart</h1>
                            <span className="text-amazon-light">Price</span>
                        </div>

                        {cart.items.map((item) => (
                            <div key={item.product._id} className="py-4 border-b">
                                <div className="flex gap-4">
                                    <img
                                        src={item.product.image}
                                        alt={item.product.name}
                                        className="w-32 h-32 object-contain"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-medium">{item.product.name}</h3>
                                        <div className="text-sm text-green-600 mt-1">
                                            In Stock
                                        </div>
                                        <div className="flex gap-4 mt-2">
                                            <select
                                                className="border rounded px-2 py-1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                                            >
                                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(num => (
                                                    <option key={num} value={num}>
                                                        Qty: {num}
                                                    </option>
                                                ))}
                                            </select>
                                            <button
                                                onClick={() => removeItem(item.product._id)}
                                                className="text-amazon-light hover:underline flex items-center gap-1"
                                            >
                                                <Trash2 className="w-4 h-4" />
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                    <div className="text-lg font-bold">
                                        ${item.product.price.toFixed(2)}
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="text-right text-xl mt-4">
                            Subtotal ({cart.items.length} items):
                            <span className="font-bold">
                                ${cart.totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Checkout Section */}
                    <div className="lg:w-72">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-lg mb-4">
                                Subtotal ({cart.items.length} items):
                                <span className="font-bold">
                                    ${cart.totalAmount.toFixed(2)}
                                </span>
                            </div>
                            <button className="w-full bg-amazon-yellow hover:bg-amazon-orange text-black py-2 rounded-md">
                                Proceed to Checkout
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CartPage; 