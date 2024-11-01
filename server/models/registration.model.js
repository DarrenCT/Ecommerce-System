import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
        unique: true,
        match: /.+\@.+\..+/ // basic email validation
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



const User = mongoose.model('User', userSchema);
export default User;
