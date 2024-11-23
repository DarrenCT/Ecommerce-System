import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { format } from 'date-fns';

const SalesHistory = () => {
    const [orders, setOrders] = useState([]);  // Initialize as empty array
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    
    // Filter states
    const [filters, setFilters] = useState({
        customerId: '',
        productId: '',
        startDate: '',
        endDate: ''
    });

    // Fetch orders with current filters
    const fetchOrders = async () => {
        try {
            setLoading(true);
            setError(null);
            
            const queryParams = new URLSearchParams();
            Object.entries(filters).forEach(([key, value]) => {
                if (value) queryParams.append(key, value);
            });

            const response = await axios.get(`/api/orders/history?${queryParams}`);
            // Ensure we always set an array
            setOrders(Array.isArray(response.data) ? response.data : []);
        } catch (err) {
            setError('Failed to fetch sales history. Please try again later.');
            console.error('Error fetching sales history:', err);
            setOrders([]); // Reset to empty array on error
        } finally {
            setLoading(false);
        }
    };

    // Fetch orders on component mount and when filters change
    useEffect(() => {
        fetchOrders();
    }, [filters]);

    // Handle filter changes
    const handleFilterChange = (e) => {
        const { name, value } = e.target;
        setFilters(prev => ({
            ...prev,
            [name]: value
        }));
    };

    // Calculate total amount for all orders
    const totalSales = Array.isArray(orders) ? orders.reduce((sum, order) => sum + (order.totalAmount || 0), 0) : 0;

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Sales History</h1>
            
            {/* Filters */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
                <input
                    type="text"
                    name="customerId"
                    placeholder="Filter by Customer ID"
                    value={filters.customerId}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                />
                <input
                    type="text"
                    name="productId"
                    placeholder="Filter by Product ID"
                    value={filters.productId}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    name="startDate"
                    value={filters.startDate}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                />
                <input
                    type="date"
                    name="endDate"
                    value={filters.endDate}
                    onChange={handleFilterChange}
                    className="border p-2 rounded"
                />
            </div>

            {/* Total Sales */}
            <div className="mb-6">
                <p className="text-xl font-semibold">
                    Total Sales: ${totalSales.toFixed(2)}
                </p>
            </div>

            {/* Error Message */}
            {error && (
                <div className="bg-red-100 text-red-700 p-4 rounded mb-6">
                    {error}
                </div>
            )}

            {/* Loading State */}
            {loading ? (
                <div className="text-center">Loading...</div>
            ) : (
                /* Orders Table */
                <div className="overflow-x-auto">
                    <table className="min-w-full bg-white border rounded-lg">
                        <thead className="bg-gray-50">
                            <tr>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Order Date</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer ID</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Items</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total Amount</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Shipping Address</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                            {orders.map((order) => (
                                <tr key={order._id} className="hover:bg-gray-50">
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.createdAt}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.userId}
                                    </td>
                                    <td className="px-6 py-4 text-sm text-gray-500">
                                        <ul>
                                            {order.items?.map((item, index) => (
                                                <li key={index}>
                                                    {item.product?.name || 'Unknown Product'} - {item.quantity} x ${item.price?.toFixed(2) || '0.00'}
                                                </li>
                                            ))}
                                        </ul>
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        ${(order.totalAmount || 0).toFixed(2)}
                                    </td>
                                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                        {order.shippingAddress}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default SalesHistory;