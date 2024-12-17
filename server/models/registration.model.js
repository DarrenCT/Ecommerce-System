import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Credit Card Schema
const creditCardSchema = new mongoose.Schema({
    cardId: {
        type: String,
        required: true,
        unique: true
    },
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
});

//shipping address schema
const shippingAddressSchema = new mongoose.Schema({
    street: { type: String, required: true },
    city: { type: String, required: true },
    province: { type: String, required: true },
    postalCode: { type: String, required: true },
    country: { type: String, required: true },
});

//purchase history schema
const purchaseHistorySchema = new mongoose.Schema({
    orderId: { type: mongoose.Schema.Types.ObjectId, ref: 'Order' },
    date: { type: Date, default: Date.now },
    items: [
        {
            productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product' },
            quantity: { type: Number, required: true },
        },
    ],
    totalAmount: { type: Number, required: true }, // Total amount for the order
});


// User (Registration) Schema
const registrationSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: () => uuidv4(), // Generate a unique ID for each user
    },
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // Basic email validation
    },
    password: {
        type: String,
        required: true
    },
    name: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        default: ""
    },
    address: {
        type: String,
        default: ""
    },
    shippingAddresses: [shippingAddressSchema], 
    purchaseHistory: [purchaseHistorySchema],
    creditCards: [creditCardSchema], // Array of Credit Card objects
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User Model
const User = mongoose.model('User', registrationSchema);

export default User;
