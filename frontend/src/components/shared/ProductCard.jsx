import axios from 'axios';

//tailwind css product card
const ProductCard = ({ product }) => {
    const addToCart = async () => {
        try {
            const cartId = localStorage.getItem('cartId');
            if (!cartId) {
                const response = await axios.post('/api/cart');
                localStorage.setItem('cartId', response.data.cartId);
            }

            await axios.post(`/api/cart/${cartId}/items`, {
                productId: product._id,
                quantity: 1
            });

            // You might want to show a success message or update cart count
        } catch (error) {
            console.error('Error adding to cart:', error);
        }
    };

    return (
        <div className="bg-white p-4 rounded-lg shadow-md hover:scale-105 transition-transform">
            <img
                src={product.image || 'https://via.placeholder.com/400'}
                alt={product.name}
                className="w-full h-48 object-contain rounded-md mb-4"
            />
            <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
            <p className="text-2xl font-bold text-amazon-light">${product.price}</p>
            <button
                onClick={addToCart}
                className="w-full mt-4 bg-amazon-yellow hover:bg-amazon-orange text-black py-2 rounded-md"
            >
                Add to Cart
            </button>
        </div>
    )
}

export default ProductCard