import mongoose from "mongoose";

const productSchema = new mongoose.Schema({
    item_id: { type: String, required: true },
    item_name: [{
        language_tag: String,
        value: String
    }],
    price: { type: Number, required: true },
    brand: [{
        language_tag: String,
        value: String
    }],
    main_image: { type: Buffer },
    quantity: { type: Number, required: true, default: 100 },
    node: [{
        node_id: Number,
        node_name: String
    }]
});

const Product = mongoose.model('Product', productSchema);

export default Product;
