import React, { useState, useEffect } from 'react';
import axios from 'axios';


const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantityChange, setQuantityChange] = useState(0);
    const [message, setMessage] = useState('');



    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products...');
                const response = await axios.get('http://localhost:5000/api/products');
                console.log('Fetched products:', response.data); // Log fetched data
                setProducts(response.data);
            } catch (error) {
                console.error('Error fetching products:', error);
                setMessage('Failed to load products');
            }
        };
        fetchProducts();
    }, []);
    

    const handleUpdate = async () => {
        try {
            const response = await axios.put(`/api/products/${selectedProduct}/quantity`, {
                quantityChange,
            });
            setMessage(response.data.message);
        } catch (error) {
            console.error('Error updating product:', error);
            setMessage(error.response?.data?.message || 'Failed to update inventory');
        }
    };

    return (
        <div>
            dco<h1>Inventory Management</h1>
            {message && <p>{message}</p>}

            <label htmlFor="product-select">Select Product:</label>
            <select
                id="product-select"
                value={selectedProduct}
                onChange={(e) => setSelectedProduct(e.target.value)}
            >
                <option value="">-- Select a Product --</option>
                {products.map((product) => (
                    <option key={product._id} value={product._id}>
                        {product.item_name[0]?.value || 'Unnamed Product'}
                    </option>
                ))}
            </select>

            <label htmlFor="quantity-change">Quantity Change:</label>
            <input
                type="number"
                id="quantity-change"
                value={quantityChange}
                onChange={(e) => setQuantityChange(Number(e.target.value))}
            />

            <button onClick={handleUpdate} disabled={!selectedProduct}>
                Update Inventory
            </button>
        </div>
    );
};

export default InventoryManagement;