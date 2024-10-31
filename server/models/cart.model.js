import mongoose from "mongoose";

const cartItemSchema = new mongoose.Schema({
    product: {
        //reference to the product model in mongodb
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Product',
        required: true
    },
    quantity: {
        type: Number,
        required: true,
        min: 1
    }
});

const cartSchema = new mongoose.Schema({
    //unique id for the cart, so user can have a cart even if they are not logged in
    cartId: {
        type: String,
        required: true,
        unique: true
    },
    userId: {
        type: String,
        default: null
    },
    items: [cartItemSchema],
    totalAmount: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

// Method to calculate total amount
cartSchema.methods.calculateTotalAmount = async function() {
    let total = 0;
    for (const item of this.items) {
        const product = await mongoose.model('Product').findById(item.product);
        if (product) {
            total += product.price * item.quantity;
        }
    }
    this.totalAmount = total;
    return this.totalAmount;
};

const Cart = mongoose.model('Cart', cartSchema);
export default Cart;
