import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const CustomerDetails = () => {
    const { id } = useParams(); // Get customer ID from the URL
    const navigate = useNavigate();
    const [customer, setCustomer] = useState(null);
    const [loading, setLoading] = useState(false);

    // Fetch customer details on page load
    useEffect(() => {
        const fetchCustomer = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`/api/customers/${id}`);
                setCustomer(response.data);
            } catch (error) {
                console.error('Error fetching customer details:', error);
                alert('Failed to fetch customer details');
            }
            setLoading(false);
        };

        fetchCustomer();
    }, [id]);

    // Handle updates to customer information
    const handleUpdate = async (e) => {
        e.preventDefault();
        const updatedData = {
            name: e.target.name.value,
            email: e.target.email.value,
            phoneNumber: e.target.phoneNumber.value,
            address: e.target.address.value,
        };

        try {
            await axios.put(`/api/customers/${id}`, updatedData);
            alert('Customer information updated successfully');
            navigate('/users'); // Redirect back to user management page
        } catch (error) {
            console.error('Error updating customer:', error);
            alert('Failed to update customer information');
        }
    };

    if (loading) return (
        <div className="flex justify-center items-center h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto p-6">
            <div className="flex justify-between items-center mb-8">
                <h1 className="text-3xl font-bold text-gray-800">Customer Details</h1>
                <button
                    onClick={() => navigate('/users')}
                    className="bg-gray-600 text-white px-4 py-2 rounded-lg hover:bg-gray-700 transition duration-200 flex items-center"
                >
                    <span>← Back to Users</span>
                </button>
            </div>
            {customer ? (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <form onSubmit={handleUpdate} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Name</label>
                                <input
                                    type="text"
                                    name="name"
                                    defaultValue={customer.name}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                                <input
                                    type="email"
                                    name="email"
                                    defaultValue={customer.email}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                <input
                                    type="text"
                                    name="phoneNumber"
                                    defaultValue={customer.phoneNumber || ''}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-2">Address</label>
                                <input
                                    type="text"
                                    name="address"
                                    defaultValue={customer.address || ''}
                                    className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition duration-200"
                                />
                            </div>
                        </div>
                        <div className="flex justify-end mt-6">
                            <button
                                type="submit"
                                className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition duration-200"
                            >
                                Update Customer
                            </button>
                        </div>
                    </form>
                </div>
            ) : (
                <div className="bg-white rounded-lg shadow-lg p-6">
                    <p className="text-gray-600">No customer data found.</p>
                </div>
            )}
        </div>
    );
};

export default CustomerDetails;
