import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

const UserManagement = () => {
    const [users, setUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const navigate = useNavigate(); // For navigation to the details page

    // Fetch all users on page load
    useEffect(() => {
        const fetchUsers = async () => {
            try {
                const response = await axios.get('/api/customers');
                setUsers(response.data);
            } catch (error) {
                console.error('Error fetching users:', error);
            }
        };

        fetchUsers();
    }, []);

    // Filter users based on search query
    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase())
    );

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">User Management</h1>

            {/* Search Bar */}
            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Search by name or email"
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="p-2 border rounded w-full"
                />
            </div>

            {/* User List Table */}
            <table className="w-full border-collapse border border-gray-300">
                <thead>
                    <tr className="bg-gray-200">
                        <th className="border p-2">Name</th>
                        <th className="border p-2">Email</th>
                        <th className="border p-2">Actions</th>
                    </tr>
                </thead>
                <tbody>
                    {filteredUsers.map((user) => (
                        <tr key={user._id} className="hover:bg-gray-100">
                            <td className="border p-2">{user.name}</td>
                            <td className="border p-2">{user.email}</td>
                            <td className="border p-2 text-center">
                                <button
                                    className="bg-blue-500 text-white p-2 rounded"
                                    onClick={() => navigate(`/admin/customers/${user._id}`)}
                                >
                                    View/Update
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default UserManagement;
