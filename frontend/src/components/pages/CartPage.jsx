import { useState, useEffect } from 'react';
import axios from 'axios';
import { Trash2 } from 'lucide-react';

/**
 * CartPage Component
 * Displays the shopping cart contents and checkout section
 * Handles cart operations like updating quantities and removing items
 */
const CartPage = () => {
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    /**
     * Retrieves cartId from localStorage or creates a new cart
     * @returns {Promise<string|null>} The cart ID or null if creation fails
     */
    const getCartId = async () => {
        let cartId = localStorage.getItem('cartId');
        if (!cartId) {
            cartId = await createNewCart();
        }
        return cartId;
    };

    /**
     * Creates a new cart on the server
     * @returns {Promise<string|null>} The new cart ID or null if creation fails
     */
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

    /**
     * Fetches the current cart data from the server
     */
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

    /**
     * Updates the quantity of an item in the cart
     * @param {string} productId - The ID of the product to update
     * @param {number} newQuantity - The new quantity to set
     */
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

    /**
     * Removes an item from the cart
     * @param {string} productId - The ID of the product to remove
     */
    const removeItem = async (productId) => {
        try {
            const cartId = await getCartId();
            await axios.delete(`/api/cart/${cartId}/items/${productId}`);
            fetchCart(); // Refresh cart data
        } catch (error) {
            console.error('Error removing item:', error);
        }
    };

    // Initial cart fetch on component mount
    useEffect(() => {
        fetchCart();
    }, []);

    useEffect(() => {
        if (cart) {
            console.log(cart.items.map(item => item.product.main_image));
        }
    }, [cart]);

    // Loading and error states
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
                                        src={item.product.main_image || 'https://via.placeholder.com/400'}
                                        alt={item.product.item_name[0]?.value || 'Product Image'}
                                        className="w-32 h-32 object-contain"
                                    />
                                    <div className="flex-grow">
                                        <h3 className="text-lg font-medium">{item.product.item_name[0]?.value || 'Product Name'}</h3>
                                        <div className="text-sm mt-1">
                                            {item.product.quantity > 0 ? (
                                                <span className="text-green-600">
                                                    In Stock ({item.product.quantity} available)
                                                </span>
                                            ) : (
                                                <span className="text-red-600">Out of Stock</span>
                                            )}
                                        </div>
                                        <div className="flex gap-4 mt-2">
                                            <select
                                                className="border rounded px-2 py-1"
                                                value={item.quantity}
                                                onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                                            >
                                                {Array.from({ length: Math.max(1, Math.min(10, item.product.quantity || 0)) }, (_, i) => (
                                                    <option key={i + 1} value={i + 1}>
                                                        Qty: {i + 1}
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
                                        ${(item.product.price * item.quantity).toFixed(2)}
                                        <div className="text-sm text-gray-500">
                                            ${item.product.price.toFixed(2)} each
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <div className="text-right text-xl mt-4">
                            Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items):
                            <span className="font-bold">
                                ${cart.totalAmount.toFixed(2)}
                            </span>
                        </div>
                    </div>

                    {/* Checkout Section */}
                    <div className="lg:w-72">
                        <div className="bg-white p-4 rounded-lg shadow-sm">
                            <div className="text-lg mb-4">
                                Subtotal ({cart.items.reduce((acc, item) => acc + item.quantity, 0)} items):
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