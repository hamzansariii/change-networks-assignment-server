const express = require('express');
const router = express.Router();
const verifyJWT = require("../middlewares/verifyAuth");
const Order = require("../models/order");
const User = require("../models/user");

/* Order Routes */

// Get all orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json(orders);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});

// Get a single order by ID
router.get('/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id);
        if (!order) return res.status(404).json({ message: "Order not found" });
        res.status(200).json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch order" });
    }
});

// Insert a new order
router.post('/orders/add', async (req, res) => {
    try {
        const newOrder = new Order(req.body);
        await newOrder.save();
        res.status(201).json({ message: "Order added successfully", order: newOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add order" });
    }
});

// Update an order
router.put('/orders/update/:id', async (req, res) => {
    try {
        const updatedOrder = await Order.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedOrder) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order updated successfully", order: updatedOrder });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update order" });
    }
});

// Delete an order
router.delete('/orders/delete/:id', async (req, res) => {
    try {
        const deletedOrder = await Order.findByIdAndDelete(req.params.id);
        if (!deletedOrder) return res.status(404).json({ message: "Order not found" });
        res.status(200).json({ message: "Order deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete order" });
    }
});

router.get('/my-team/:email', async (req, res) => {
    try {
        const email = req.params.email;

        // Find team members whose manager's email matches the given email
        const teamMembers = await User.find({ manager_email: email });

        if (!teamMembers.length) {
            return res.status(404).json({ message: "No team members found" });
        }

        // Get their IDs
        const teamMemberIds = teamMembers.map(user => user._id.toString());

        // Find all orders related to these team members
        const orders = await Order.find({ customer_id: { $in: teamMemberIds } });

        // Map team members and attach their order count
        const teamWithOrderCount = teamMembers.map(user => {
            const userOrders = orders.filter(order => order.customer_id.toString() === user._id.toString());
            return {
                ...user.toObject(),
                order_count: userOrders.length
            };
        });

        res.status(200).json(teamWithOrderCount);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch team data" });
    }
});

module.exports = router;
