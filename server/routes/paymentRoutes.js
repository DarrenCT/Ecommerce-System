import express from 'express';

const router = express.Router();

// Global counter for payment attempts
let paymentAttempts = 0;

router.post('/api/payments/validate', (req, res) => {
    try {
        const { creditCard } = req.body;
        
        // Increment global counter
        paymentAttempts++;

        // Reject every third attempt
        if (paymentAttempts % 3 === 0) {
            return res.status(400).json({
                success: false,
                message: 'Payment declined. Please try again with a different card.'
            });
        }

        // Success response
        res.json({
            success: true,
            message: 'Payment validated successfully'
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            message: 'Error processing payment',
            error: error.message
        });
    }
});

export default router;
