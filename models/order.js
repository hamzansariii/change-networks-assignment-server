const mongoose = require("mongoose");

// Define Schema
const orderSchema = new mongoose.Schema({
    customer_id: { type: String, required: true },
    customer_name: { type: String, required: true },
    product_details: { type: JSON, required: true },
    order_status: { type: String, required: true, index: false },
});

// Create Model
const Order = mongoose.model("Order", orderSchema);

Order.syncIndexes();

module.exports = Order;
