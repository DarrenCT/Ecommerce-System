import mongoose from "mongoose";
//example of a model
const productSchema = new mongoose.Schema({
    name:{type: String, required: true},
    price:{type: Number, required: true},
});

const Product = mongoose.model('Product', productSchema); //model name, schema

export default Product;