const express = require('express');
const router = express.Router();
const User = require("../models/user");
const Product = require("../models/product");
const Order = require("../models/order");
const { hashPassword } = require('../utils/auth');
const upload = require('../middlewares/fileUpload');

/* User Routes */

// Get all users
router.get('/users', async (req, res) => {
    try {
        const users = await User.find({ role: { $ne: "Admin" } });
        res.status(200).json(users);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

// Get a single user by ID
router.get('/users/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: "User not found" });
        res.status(200).json(user);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch user" });
    }
});

// Insert a new user
router.post('/users/add', async (req, res) => {
    try {
        const body = req.body;
        console.log('Body = ', body)
        const hashedPassword = await hashPassword(body.password)
        const user = { ...body, password: hashedPassword };
        const newUser = new User(user);
        await newUser.save();
        res.status(201).json({ message: "User created successfully", user: newUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add user" });
    }
});

// Update a user
router.put('/users/update/:id', async (req, res) => {
    try {
        const updatedUser = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!updatedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User updated successfully", user: updatedUser });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update user" });
    }
});

// Delete a user
router.delete('/users/delete/:id', async (req, res) => {
    try {
        const deletedUser = await User.findByIdAndDelete(req.params.id);
        if (!deletedUser) return res.status(404).json({ message: "User not found" });
        res.status(200).json({ message: "User deleted successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to delete user" });
    }
});

/* Product Routes */

// Get all products
router.get('/products', async (req, res) => {
    try {
        const products = await Product.find();
        res.status(200).json(products);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch products" });
    }
});

// Get a single product by ID
router.get('/products/:id', async (req, res) => {
    try {
        const product = await Product.findById(req.params.id);
        if (!product) return res.status(404).json({ message: "Product not found" });
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch product" });
    }
});

// Insert a new product
router.post('/products/add', upload.single('image_src'), async (req, res) => {
    try {
        const body = req.body
        const product = { ...body, image_src: `/uploads/images/${req.file.filename}` }
        const newProduct = new Product(product);
        await newProduct.save();
        res.status(201).json({ message: "Product added successfully" });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to add product" });
    }
});

// Update a product
router.put('/products/update/:id', upload.single('image_src'), async (req, res) => {
    try {
        const { id } = req.params;
        const body = req.body;

        // Find existing product
        const existingProduct = await Product.findById(id);
        if (!existingProduct) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Update product details
        const updatedData = {
            ...body,
            image_src: req.file ? `/uploads/images/${req.file.filename}` : existingProduct.image_src
        };

        const updatedProduct = await Product.findByIdAndUpdate(id, updatedData, { new: true });

        res.status(200).json({ message: "Product updated successfully", product: updatedProduct });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to update product" });
    }
});

router.delete('/products/delete/:id', async (req, res) => {
    try {
        const { id } = req.params;

        // Find the product to delete
        const productToDelete = await Product.findById(id);

        if (!productToDelete) {
            return res.status(404).json({ message: "Product not found" });
        }

        // Delete the product
        await Product.findByIdAndDelete(id);


        // Optionally delete the image file if you are storing it locally
        if (productToDelete.image_src) {
            const path = `.${productToDelete.image_src}`; // Construct the path to the image.  The "." is important!
            try {
                await fs.promises.unlink(path); // Use fs.promises for async file deletion
                console.log('Image deleted successfully:', path);
            } catch (imageError) {
                console.error('Error deleting image:', imageError);
                // If image deletion fails, log the error but don't stop the product deletion
            }
        }

        res.status(200).json({ message: "Product deleted successfully" });

    } catch (error) {
        console.error("Error deleting product:", error);
        res.status(500).json({ error: "Failed to delete product" });
    }
});






//UTILS

//Get all managers emails
router.get('/users/managers/emails', async (req, res) => {
    try {
        const managers = await User.find({ role: 'Manager' });
        const emails = managers.map(item => item.email)
        res.status(200).json(emails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch users" });
    }
});

//Update status of order
router.post('/orders/status', async (req, res) => {
    try {
        const { status, id } = req.body;
        console.log('Status = ', status)
        console.log('ID = ', id)
        // Find the order by ID and update its status
        const order = await Order.findByIdAndUpdate(
            id,
            { order_status: status },
            { new: true } // Return the updated order document
        );

        res.status(200).json({
            message: 'Order status updated successfully',
            order: order,
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

router.get('/orders/:email', async (req, res) => {
    try {
        const email = req.params.email;
        const user = await User.findOne({ email });

        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        if (user.role === 'Manager') {
            const teamMembers = await User.find({ manager_email: email });
            const teamMemberIds = teamMembers.map(item => item._id.toString()); // Convert ObjectId to string if needed

            const orders = await Order.find({ customer_id: { $in: teamMemberIds } });
            const ordersWithCustomerDetails = await Promise.all(
                orders.map(async (order) => {
                    const customer = await User.findById(order.customer_id);
                    return {
                        ...order.toObject(),
                        customer_details: customer || null // Add customer details or null if not found
                    };
                })
            );
            return res.status(200).json(ordersWithCustomerDetails);
        }


        // Fetch orders
        const orders = await Order.find();

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

        return res.status(200).json(ordersWithCustomerDetails);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: "Failed to fetch orders" });
    }
});





module.exports = router;