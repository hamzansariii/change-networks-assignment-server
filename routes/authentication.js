const Route = require('express')
const router = Route()
const verifyJWT = require("../middlewares/verifyAuth");
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user'); // Adjust the path to your model
const { hashPassword, verifyPassword } = require('../utils/auth')

router.post('/login', async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email });
        console.log('User = ', user)
        if (!user) {
            return res.status(404).json({ login: false, message: 'User not found' });
        }

        if (await verifyPassword(password, user.password) == true) {
            const token = jwt.sign(
                { email, role: user.role },
                process.env.JWT_SECRET,
                { expiresIn: '6h' }
            );
            return res.status(200).json({
                login: true,
                message: 'Login successful',
                token,
                role: user.role,
                email,
            });
        }
        return res.status(401).json({ login: false, message: 'Invalid password' });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ login: false, message: 'Server error' });
    }
});

router.get('/verify-token', verifyJWT, (req, res) => {
    res.status(200).json({ auth: true, email: req.email, role: req.role })
})


module.exports = router