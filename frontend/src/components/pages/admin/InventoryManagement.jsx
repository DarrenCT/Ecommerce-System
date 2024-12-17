import React, { useState, useEffect } from 'react';
import axios from 'axios';

const InventoryManagement = () => {
    const [outOfStockProducts, setOutOfStockProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantityChange, setQuantityChange] = useState(0);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);
    const [loading, setLoading] = useState(false);

    const styles = {
        error: {
            color: 'red',
            fontWeight: 'bold',
            marginTop: '10px',
        },
        success: {
            color: 'green',
            fontWeight: 'bold',
            marginTop: '10px',
        },
        container: {
            padding: '20px',
            maxWidth: '1200px',
            margin: '0 auto',
        },
        grid: {
            display: 'grid',
            gridTemplateColumns: '1fr 1fr',
            gap: '20px',
            marginTop: '20px',
        },
        outOfStockSection: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        productItem: {
            padding: '10px',
            margin: '5px 0',
            border: '1px solid #eee',
            borderRadius: '4px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
        },
        updateSection: {
            backgroundColor: '#fff',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
        },
        input: {
            padding: '8px',
            borderRadius: '4px',
            border: '1px solid #ddd',
            marginLeft: '10px',
        },
        button: {
            backgroundColor: 'rgb(254, 189, 105)',
            border: 'none',
            borderRadius: '5px',
            padding: '10px 15px',
            fontSize: '16px',
            cursor: 'pointer',
            transition: 'background-color 0.2s',
        },
    };

    const fetchOutOfStockProducts = async () => {
        setLoading(true);
        try {
            const response = await axios.get('http://localhost:5000/api/products/out-of-stock');
            setOutOfStockProducts(response.data.products);
        } catch (error) {
            console.error('Error fetching out-of-stock products:', error);
            setMessage('Failed to load out-of-stock products');
            setIsError(true);
        }
        setLoading(false);
    };

    useEffect(() => {
        fetchOutOfStockProducts();
    }, []);

    const handleUpdate = async () => {
        if (!selectedProduct || quantityChange === '') {
            setMessage('Please enter a valid product ID and quantity change.');
            setIsError(true);
            return;
        }

        try {
            const response = await axios.put(`http://localhost:5000/api/products/${selectedProduct}/quantity`, {
                quantityChange: Number(quantityChange),
            });

            // Refresh the out-of-stock products list after update
            await fetchOutOfStockProducts();

            setMessage(response.data.message);
            setIsError(false);
            setQuantityChange(0); // Reset quantity input after successful update
        } catch (error) {
            if (error.response?.status === 404) {
                setMessage('Product ID not found. Please check the ID and try again.');
            } else if (error.response?.status === 400) {
                setMessage(error.response?.data?.message || 'Invalid quantity.');
            } else {
                setMessage('Failed to update inventory. Please try again later.');
            }
            setIsError(true);
        }
    };

    const handleProductClick = (productId) => {
        setSelectedProduct(productId);
        setQuantityChange(0); // Reset quantity change when selecting a new product
    };

    return (
        <div style={styles.container}>
            <h1 style={{ color: 'rgb(19, 25, 33)', fontWeight: 'bold', fontSize: '2rem', marginBottom: '20px' }}>
                Inventory Management
            </h1>

            <div style={styles.grid}>
                {/* Out of Stock Products Section */}
                <div style={styles.outOfStockSection}>
                    <h2 style={{ marginBottom: '15px', color: 'rgb(19, 25, 33)', fontSize: '1.5rem' }}>
                        Out of Stock Products
                    </h2>
                    {loading ? (
                        <div>Loading...</div>
                    ) : outOfStockProducts.length === 0 ? (
                        <p>No products are currently out of stock.</p>
                    ) : (
                        <div style={{ maxHeight: '600px', overflowY: 'auto' }}>
                            {outOfStockProducts.map((product) => (
                                <div
                                    key={product._id}
                                    style={{
                                        ...styles.productItem,
                                        backgroundColor: selectedProduct === product._id ? '#f0f0f0' : 'white',
                                    }}
                                    onClick={() => handleProductClick(product._id)}
                                >
                                    <div>
                                        <div style={{ fontWeight: 'bold' }}>{product.name}</div>
                                        <div style={{ fontSize: '0.9em', color: '#666' }}>Brand: {product.brand}</div>
                                        <div style={{ fontSize: '0.8em', color: '#888' }}>ID: {product._id}</div>
                                    </div>
                                    <span style={{ color: 'red', fontWeight: 'bold' }}>
                                        Stock: {product.quantity}
                                    </span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Update Inventory Section */}
                <div style={styles.updateSection}>
                    <h2 style={{ marginBottom: '15px', color: 'rgb(19, 25, 33)', fontSize: '1.5rem' }}>
                        Update Inventory
                    </h2>
                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="product-id" style={{ fontWeight: 'bold' }}>
                            Product ID:
                        </label>
                        <input
                            style={styles.input}
                            type="text"
                            id="product-id"
                            value={selectedProduct}
                            onChange={(e) => setSelectedProduct(e.target.value)}
                        />
                    </div>

                    <div style={{ marginBottom: '15px' }}>
                        <label htmlFor="quantity-change" style={{ fontWeight: 'bold' }}>
                            Quantity Change:
                        </label>
                        <input
                            style={styles.input}
                            type="number"
                            id="quantity-change"
                            value={quantityChange}
                            onChange={(e) => {
                                const value = e.target.value;
                                setQuantityChange(value === '' ? '' : Number(value));
                            }}
                        />
                    </div>

                    <button
                        onClick={handleUpdate}
                        disabled={!selectedProduct}
                        style={{
                            ...styles.button,
                            opacity: !selectedProduct ? 0.5 : 1,
                        }}
                    >
                        Update Inventory
                    </button>

                    {message && (
                        <div style={isError ? styles.error : styles.success}>
                            {message}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default InventoryManagement;