import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DevAuthContext';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { cartService } from '../../services/cartService';

const CheckoutPage = () => {
    const { isAuthenticated, user } = useAuth();
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [formData, setFormData] = useState({
        shippingAddress: user?.address || '',
        creditCard: ''
    });

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/cart');
            return;
        }

        const fetchCart = async () => {
            try {
                const cartId = localStorage.getItem('cartId');
                if (!cartId) {
                    navigate('/cart');
                    return;
                }
                const response = await cartService.getCart(cartId);
                setCart(response);
            } catch (error) {
                setError('Error fetching cart data');
            } finally {
                setLoading(false);
            }
        };

        fetchCart();
    }, [isAuthenticated, navigate]);

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const updateQuantity = async (productId, newQuantity) => {
        try {
            const cartId = localStorage.getItem('cartId');
            await cartService.updateQuantity(cartId, productId, newQuantity);
            const updatedCart = await cartService.getCart(cartId);
            setCart(updatedCart);
        } catch (error) {
            console.error('Error updating quantity:', error);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!cart || !formData.shippingAddress || !formData.creditCard) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            const response = await axios.post('/api/orders', {
                cartId: cart.cartId,
                shippingAddress: formData.shippingAddress,
                creditCard: formData.creditCard
            });

            localStorage.removeItem('cartId');
            navigate('/order-confirmation', {
                state: { orderId: response.data.orderId }
            });
        } catch (error) {
            setError('Error creating order');
        }
    };

    if (loading) return <div>Loading...</div>;
    if (error) return <div>Error: {error}</div>;
    if (!cart) return <div>No cart found</div>;

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-[1200px] mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left Column - Forms */}
                    <div className="lg:col-span-2">
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Shipping Address</h2>
                                <textarea
                                    name="shippingAddress"
                                    value={formData.shippingAddress}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full h-32 p-2 border rounded-md"
                                    placeholder="Enter your shipping address"
                                />
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                                <input
                                    type="text"
                                    name="creditCard"
                                    value={formData.creditCard}
                                    onChange={handleInputChange}
                                    required
                                    className="w-full p-2 border rounded-md"
                                    placeholder="Enter credit card number"
                                />
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amazon-yellow hover:bg-amazon-orange text-black py-2 rounded-md"
                            >
                                Place Order
                            </button>
                        </form>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div className="lg:col-span-1">
                        <div className="bg-white p-6 rounded-lg shadow-sm">
                            <h2 className="text-xl font-semibold mb-4">Order Summary</h2>
                            <div className="space-y-4">
                                {cart.items.map((item) => (
                                    <div key={item.product._id} className="flex gap-4 border-b pb-4">
                                        <Link to={`/product/${item.product._id}`} className="w-20 h-20">
                                            <img
                                                src={item.product.main_image || 'https://via.placeholder.com/400'}
                                                alt={item.product.item_name[0]?.value}
                                                className="w-full h-full object-contain"
                                            />
                                        </Link>
                                        <div className="flex-grow">
                                            <Link
                                                to={`/product/${item.product._id}`}
                                                className="hover:text-amazon-light hover:underline"
                                            >
                                                <h3 className="text-sm font-medium">
                                                    {item.product.item_name[0]?.value}
                                                </h3>
                                            </Link>
                                            <div className="flex items-center gap-2 mt-2">
                                                <select
                                                    className="border rounded px-2 py-1 text-sm"
                                                    value={item.quantity}
                                                    onChange={(e) => updateQuantity(item.product._id, Number(e.target.value))}
                                                >
                                                    {Array.from(
                                                        { length: Math.min(10, item.product.quantity) },
                                                        (_, i) => i + 1
                                                    ).map(num => (
                                                        <option key={num} value={num}>
                                                            Qty: {num}
                                                        </option>
                                                    ))}
                                                </select>
                                                <span className="text-sm font-bold">
                                                    ${(item.product.price * item.quantity).toFixed(2)}
                                                </span>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                                <div className="border-t pt-4">
                                    <div className="flex justify-between font-bold">
                                        <span>Total</span>
                                        <span>${cart.totalAmount.toFixed(2)}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 