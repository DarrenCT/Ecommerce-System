import jwt from 'jsonwebtoken';
import User from '../models/registration.model.js';

const auth = async (req, res, next) => {
    try {
        const token = req.header('Authorization')?.replace('Bearer ', '');
        
        if (!token) {
            throw new Error();
        }

        const decoded = jwt.verify(token, process.env.JWT_SECRET);
        const user = await User.findOne({ userId: decoded.userId });

        if (!user) {
            throw new Error();
        }

        req.token = token;
        req.user = user;
        next();
    } catch (error) {
        res.status(401).json({ message: 'Please authenticate.' });
    }
};

// Middleware for checking admin role
const adminAuth = async (req, res, next) => {
    try {
        await auth(req, res, () => {
            if (!req.user.isAdmin) {
                throw new Error('Not authorized as admin');
            }
            next();
        });
    } catch (error) {
        res.status(403).json({ message: 'Not authorized as admin.' });
    }
};

export { auth, adminAuth };
