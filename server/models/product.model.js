import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    image: { type: String, required: true },
    category: { type: String, required: true },
    genre: { type: String },
    brand: { type: String },
    description: { type: String },
    quantity: { type: Number, required: true },
});

const Product = mongoose.model('Product', productSchema);

export default Product;
