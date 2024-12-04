import { useState, useEffect } from 'react';
import { CheckCircle, XCircle } from 'lucide-react';

const Toast = ({ message, duration = 3000, onClose, type = 'success' }) => {
    const [isVisible, setIsVisible] = useState(true);

    useEffect(() => {
        const timer = setTimeout(() => {
            setIsVisible(false);
            if (onClose) onClose();
        }, duration);

        return () => clearTimeout(timer);
    }, [duration, onClose]);

    if (!isVisible) return null;

    const isError = type === 'error';
    const Icon = isError ? XCircle : CheckCircle;
    const iconColor = isError ? 'text-red-400' : 'text-green-400';

    return (
        <div className="fixed bottom-8 right-8 z-50">
            <div className="bg-gray-800 shadow-xl rounded-lg p-6 flex items-center gap-3 animate-slideIn min-w-[300px]">
                <Icon className={`${iconColor} w-8 h-8`} />
                <span className="text-white text-lg">{message}</span>
            </div>
        </div>
    );
};

export default Toast;
