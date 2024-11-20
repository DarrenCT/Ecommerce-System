import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/DevAuthContext';

const CheckoutPage = () => {
    const { isAuthenticated } = useAuth();
    const navigate = useNavigate();

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/cart');
        }
    }, [isAuthenticated, navigate]);

    return (
        <div className="min-h-screen bg-gray-50 py-8">
            <div className="max-w-[1200px] mx-auto px-4">
                <h1 className="text-3xl font-bold mb-8">Checkout</h1>

                {/* Placeholder content for now */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                    <p className="text-lg text-gray-600">
                        Checkout functionality coming soon...
                    </p>
                </div>
            </div>
        </div>
    );
};

export default CheckoutPage; 