import { useEffect, useState, useRef } from 'react';
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
    const [paymentError, setPaymentError] = useState(null);
    const [paymentAttempts, setPaymentAttempts] = useState(0);
    const [userData, setUserData] = useState(null);
    const [formData, setFormData] = useState({
        useDefaultAddress: true,
        useDefaultCard: true,
        alternateAddress: '',
        alternateCard: ''
    });
    const creditCardInputRef = useRef(null);

    useEffect(() => {
        if (user) {
            console.log('Current user:', user); // Debug log
        }
    }, [user]);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const response = await axios.get('/api/auth/profile');
                setUserData(response.data.user);
                console.log('Fetched user data:', response.data.user); // Debug log
            } catch (error) {
                console.error('Error fetching user data:', error);
                setError('Error loading user data');
            }
        };

        if (isAuthenticated) {
            fetchUserData();
        }
    }, [isAuthenticated]);

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

    useEffect(() => {
        if (paymentError && creditCardInputRef.current) {
            creditCardInputRef.current.focus();
        }
    }, [paymentError]);

    const defaultAddress = userData?.address || user?.address || 'No address saved';
    const defaultCard = userData?.creditCards?.[0]?.cardNumber || user?.creditCards?.[0]?.cardNumber || '';
    const lastFourDigits = defaultCard ? defaultCard.slice(-4) : 'XXXX';
    const cardExpiry = userData?.creditCards?.[0]?.expiryDate || user?.creditCards?.[0]?.expiryDate || '';

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

    const processDummyPayment = async (creditCard) => {
        const response = await axios.post('/api/payments/validate', {
            creditCard
        });
        
        if (!response.data.success) {
            throw new Error(response.data.message);
        }
        
        return true;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const selectedAddress = formData.useDefaultAddress ? defaultAddress : formData.alternateAddress;
        const selectedCard = formData.useDefaultCard ? defaultCard : formData.alternateCard;

        if (!cart || !selectedAddress || !selectedCard) {
            setError('Please fill in all required fields');
            return;
        }

        try {
            setLoading(true);
            setPaymentError(null);
            setError(null);

            // Process payment first
            await processDummyPayment(selectedCard);

            // Create order
            const orderData = {
                cartId: cart.cartId,
                userId: user.userId,
                shippingAddress: selectedAddress,
                billingAddress: selectedAddress,
            };

            const response = await axios.post('/api/orders', orderData);

            if (response.data.orderId) {
                localStorage.removeItem('cartId');
                navigate('/order-confirmation', {
                    state: { 
                        orderId: response.data.orderId,
                        message: 'Order placed successfully!'
                    }
                });
            } else {
                setError('Failed to create order. Please try again.');
            }
        } catch (error) {
            console.error('Error:', error);
            if (error.response?.status === 400 && error.response?.data?.message?.includes('Payment')) {
                setPaymentError(error.response.data.message);
            } else {
                setError(error.response?.data?.message || 'Error creating order. Please try again.');
            }
        } finally {
            setLoading(false);
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
                                <div className="mb-4">
                                    <label className="flex items-center space-x-2 mb-4">
                                        <input
                                            type="checkbox"
                                            checked={formData.useDefaultAddress}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                useDefaultAddress: e.target.checked
                                            }))}
                                            className="form-checkbox"
                                            disabled={!defaultAddress || defaultAddress === 'No address saved'}
                                        />
                                        <span>Use Default Address</span>
                                    </label>

                                    {formData.useDefaultAddress ? (
                                        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="font-medium text-gray-700">Default Address:</p>
                                            <p className="mt-1 text-gray-600">{defaultAddress}</p>
                                        </div>
                                    ) : (
                                        <textarea
                                            name="alternateAddress"
                                            value={formData.alternateAddress}
                                            onChange={handleInputChange}
                                            required
                                            className="w-full h-32 p-2 border rounded-md"
                                            placeholder="Enter shipping address"
                                        />
                                    )}
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-lg shadow-sm">
                                <h2 className="text-xl font-semibold mb-4">Payment Information</h2>
                                <div className="mb-4">
                                    <label className="flex items-center space-x-2 mb-4">
                                        <input
                                            type="checkbox"
                                            checked={formData.useDefaultCard}
                                            onChange={(e) => setFormData(prev => ({
                                                ...prev,
                                                useDefaultCard: e.target.checked
                                            }))}
                                            className="form-checkbox"
                                            disabled={!defaultCard}
                                        />
                                        <span>Use Default Credit Card</span>
                                    </label>

                                    {formData.useDefaultCard ? (
                                        <div className="p-3 bg-gray-50 rounded-md border border-gray-200">
                                            <p className="font-medium text-gray-700">Default Card:</p>
                                            <p className="mt-1 text-gray-600">
                                                {defaultCard ? `Card ending in ${lastFourDigits}` : 'No card saved'}
                                            </p>
                                            {cardExpiry && (
                                                <p className="mt-1 text-gray-600">Expires: {cardExpiry}</p>
                                            )}
                                        </div>
                                    ) : (
                                        <div className="space-y-4">
                                            <input
                                                type="text"
                                                name="alternateCard"
                                                value={formData.alternateCard}
                                                onChange={handleInputChange}
                                                required
                                                className="w-full p-2 border rounded-md"
                                                placeholder="Enter credit card number"
                                                ref={creditCardInputRef}
                                            />
                                        </div>
                                    )}
                                </div>
                                {paymentError && (
                                    <div className="text-red-500 mt-2 text-sm">
                                        {paymentError}
                                    </div>
                                )}
                            </div>

                            <button
                                type="submit"
                                className="w-full bg-amazon-yellow hover:bg-amazon-orange text-black py-2 rounded-md"
                                disabled={loading}
                            >
                                {loading ? 'Processing...' : 'Place Order'}
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