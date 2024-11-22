import { useState, useEffect } from 'react';
import { CheckCircle } from 'lucide-react';

const Toast = ({ message, duration = 3000, onClose }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 z-50">
            <div className="bg-white shadow-lg rounded-lg p-4 flex items-center gap-2 animate-slideIn">
                <CheckCircle className="text-green-500 w-5 h-5" />
                <span className="text-gray-800">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
