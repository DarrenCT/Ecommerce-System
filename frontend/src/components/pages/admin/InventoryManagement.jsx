import React, { useState, useEffect } from 'react';
import axios from 'axios';


const InventoryManagement = () => {
    const [products, setProducts] = useState([]);
    const [selectedProduct, setSelectedProduct] = useState('');
    const [quantityChange, setQuantityChange] = useState(0);
    const [message, setMessage] = useState('');
    const [isError, setIsError] = useState(false);

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
    };

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                console.log('Fetching products...');
                const response = await axios.get('http://localhost:5000/api/products');
                console.log('Fetched products:', response.data);
                setProducts(response.data.products); 
            } catch (error) {
                console.error('Error fetching products:', error);
                setMessage('Failed to load products');
            }
        };
        fetchProducts();
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

        setMessage(response.data.message);
        setIsError(false); 
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
    return (
        <div>
            <h1 style={{ color: 'rgb(19, 25, 33)', fontWeight:'bold', fontSize:'2rem'}}>Inventory Management</h1>
            <br></br>
            <label htmlFor="product-select" style= {{fontWeight: 'bold'}}>Product ID:   </label>

            <input
             style={{
                backgroundColor: '#FFFFFF'}}
        type="text"
        id="product-id"
        value={selectedProduct}
        onChange={(e) => setSelectedProduct(e.target.value)}
        
    />

            <br></br><br></br>
            <label htmlFor="quantity-change" style={{fontWeight: 'bold'}}>Quantity Change:   </label>
            <input
                style={{
                    backgroundColor: '#FFFFFF'}}
                type="number"
                id="quantity-change"
                value={quantityChange}
                onChange={(e) => {
                    const value = e.target.value;
                    setQuantityChange(value === '' ? '' : Number(value));
                }}
            />
            <br></br><br></br>
            <button onClick={handleUpdate} disabled={!selectedProduct} style={{
        backgroundColor: 'rgb(254, 189, 105)', 
        border: 'none',
        borderRadius: '5px',
        padding: '10px 15px',
        fontSize: '16px',
        fontWeight: 'bold'
    }}>
        Update Inventory
            </button>
             {message && (
                <p style={isError ? styles.error : styles.success}>
                    {message}
                </p>
            )}
        </div>
    );
};

export default InventoryManagement;