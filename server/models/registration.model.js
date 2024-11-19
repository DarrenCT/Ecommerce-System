import mongoose from "mongoose";
import { v4 as uuidv4 } from 'uuid';

const registrationSchema = new mongoose.Schema({
    userId: {
        type: String,
        default: () => uuidv4(),  
        
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

const User = mongoose.model('User', registrationSchema);

export default User;
