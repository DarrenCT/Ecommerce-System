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

    if (loading) return <p>Loading...</p>;

    return (
        <div className="p-6">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold">Customer Details</h1>
                <button
                    onClick={() => navigate('/users')}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                >
                    Back to Users
                </button>
            </div>
            {customer ? (
                <form onSubmit={handleUpdate}>
                    <div className="mb-4">
                        <label className="block mb-2">Name:</label>
                        <input
                            type="text"
                            name="name"
                            defaultValue={customer.name}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Email:</label>
                        <input
                            type="email"
                            name="email"
                            defaultValue={customer.email}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Phone Number:</label>
                        <input
                            type="text"
                            name="phoneNumber"
                            defaultValue={customer.phoneNumber || ''}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <div className="mb-4">
                        <label className="block mb-2">Address:</label>
                        <input
                            type="text"
                            name="address"
                            defaultValue={customer.address || ''}
                            className="p-2 border rounded w-full"
                        />
                    </div>
                    <button
                        type="submit"
                        className="bg-green-500 text-white p-2 rounded"
                    >
                        Save Changes
                    </button>
                </form>
            ) : (
                <p>No customer details available.</p>
            )}
        </div>
    );
};

export default CustomerDetails;
