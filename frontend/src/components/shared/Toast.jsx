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
        <div className="fixed bottom-8 right-8 z-50">
            <div className="bg-gray-800 shadow-xl rounded-lg p-6 flex items-center gap-3 animate-slideIn min-w-[300px]">
                <CheckCircle className="text-green-400 w-8 h-8" />
                <span className="text-white text-lg">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
