const mongoose = require("mongoose");

// Define Schema
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    image_src: { type: String, required: true },
});

// Create Model
const Product = mongoose.model("Product", productSchema);

module.exports = Product;
