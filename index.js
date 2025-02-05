const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const connectDatabase = require('./configs/database');
const verifyJWT = require('./middlewares/verifyAuth');

// List of allowed origins (no wildcard)
const allowedOrigins = ['http://localhost:5000', 'https://change-networks-assignment-client.onrender.com'];

// CORS options configuration
const corsOption = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};
// CORS configuration
app.use(cors(corsOption));

// Middleware to parse JSON body
app.use(express.json());

// Use routes from '/api' folder (make sure you have this setup in ./routes)
app.use('/api', require('./routes'));

// Serve static files from the "public" directory
app.use(express.static('public'));

// Apply the JWT middleware for all routes except /login
app.use((req, res, next) => {
    // Skip JWT verification for the login route
    if (req.path === '/api/login' || req.path === '/') {
        return next();
    }
    verifyJWT(req, res, next);  // Apply JWT middleware to all other routes
});

// Connect to the MongoDB database
connectDatabase();

// Root route
app.get('/', (req, res) => {
    res.send('Server API Running Well!');
});

// Start the server
app.listen(port, () => {
    console.log(`App Listening at port ${port}`);
});
