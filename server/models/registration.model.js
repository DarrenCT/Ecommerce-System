import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

// Credit Card Schema
const creditCardSchema = new mongoose.Schema({
    cardNumber: { type: String, required: true },
    expiryDate: { type: String, required: true },
    cvv: { type: String, required: true },
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
    creditCards: [creditCardSchema], // Array of Credit Card objects
    createdAt: {
        type: Date,
        default: Date.now
    }
});

// Create the User Model
const User = mongoose.model('User', registrationSchema);

export default User;
