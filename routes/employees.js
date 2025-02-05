const Route = require('express')
const router = Route()
const Order = require("../models/order");
const User = require("../models/user");



/* User Routes */


//Get all the products
router.get('/products', (req, res) => {
    try {
        res.status(200).json({})
    } catch (error) {
        console.log(error)
    }
})

//Insert one order
router.post('/orders/place-order', async (req, res) => {
    try {
        const { email, productDetails } = req.body
        console.log('Email = ', email)
        const customer = await User.findOne({ email })
        const orderDetails = { customer_id: customer._id, customer_name: customer.name, product_details: productDetails, order_status: 'Pending' }
        const newOrder = new Order(orderDetails);
        await newOrder.save();
        res.status(200).json({ message: 'Order placed successfully!' })
    } catch (error) {
        console.log(error)
    }
})

router.get('/my-orders/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        // Fetch orders
        const orders = await Order.find({ customer_id: user._id });

        // Populate customer details for each order
        const ordersWithCustomerDetails = await Promise.all(
            orders.map(async (order) => {
                const customer = await User.findById(order.customer_id);
                return {
                    ...order.toObject(),
                    customer_details: customer || null // Add customer details or null if not found
                };
            })
        );

        res.status(200).json(ordersWithCustomerDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});



module.exports = router