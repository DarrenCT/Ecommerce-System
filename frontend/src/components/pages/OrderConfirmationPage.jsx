import { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import { transformImageData } from '../../utils/imageUtils';

const OrderConfirmationPage = () => {
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const orderId = location.state?.orderId;

    useEffect(() => {
        const fetchOrder = async () => {
            if (!orderId) {
                setError('No order ID provided');
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`/api/orders/${orderId}`);
                setOrder(response.data);
            } catch (error) {
                setError('Error fetching order details');
                console.error('Error:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchOrder();
    }, [orderId]);

    if (loading) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-xl">Loading order details...</div>
        </div>
    );

    if (error) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-xl text-red-600">{error}</div>
        </div>
    );

    if (!order) return (
        <div className="min-h-screen bg-gray-50 flex items-center justify-center">
            <div className="text-xl">Order not found</div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-[1200px] mx-auto px-4">
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    {/* Order Confirmation Header */}
                    <div className="text-center mb-8">
                        <div className="text-3xl font-bold text-green-600 mb-2">
                            Order Confirmed!
                        </div>
                        <div className="text-gray-600">
                            Thank you for your order. We'll send you a confirmation email shortly.
                        </div>
                        <div className="text-sm text-gray-500 mt-1">
                            Order ID: {order._id}
                        </div>
                    </div>

                    {/* Order Details */}
                    <div className="border-t border-b py-6 mb-6">
                        <h2 className="text-xl font-semibold mb-4">Order Details</h2>
                        {order.items.map((item) => (
                            <div key={item._id} className="flex items-center gap-4 py-4 border-b last:border-b-0">
                                <Link to={`/product/${item.product._id}`} className="w-24 h-24">
                                    <img
                                        src={transformImageData(item.product.main_image)}
                                        alt={item.product.item_name[0]?.value}
                                        className="w-full h-full object-contain"
                                    />
                                </Link>
                                <div className="flex-grow">
                                    <Link
                                        to={`/product/${item.product._id}`}
                                        className="hover:text-amazon-light hover:underline"
                                    >
                                        <h3 className="text-lg font-medium">
                                            {item.product.item_name[0]?.value}
                                        </h3>
                                    </Link>
                                    <div className="text-gray-600">
                                        Quantity: {item.quantity}
                                    </div>
                                    <div className="text-amazon-light">
                                        ${item.price.toFixed(2)} each
                                    </div>
                                </div>
                                <div className="text-lg font-bold">
                                    ${(item.price * item.quantity).toFixed(2)}
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <div className="flex justify-between items-center mb-8">
                        <div className="text-xl">
                            Total Amount:
                            <span className="font-bold ml-2">
                                ${order.totalAmount.toFixed(2)}
                            </span>
                        </div>
                        <Link
                            to="/"
                            className="bg-amazon-yellow hover:bg-amazon-orange text-black py-2 px-8 rounded-md"
                        >
                            Continue Shopping
                        </Link>
                    </div>

                    {/* Shipping Information */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <h3 className="font-semibold mb-2">Shipping Address</h3>
                            <div className="text-gray-600">
                                {order.shippingAddress}
                            </div>
                        </div>
                        <div>
                            <h3 className="font-semibold mb-2">Billing Address</h3>
                            <div className="text-gray-600">
                                {order.billingAddress}
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default OrderConfirmationPage;
