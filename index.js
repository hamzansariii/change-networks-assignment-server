const express = require('express');
const app = express();
const cors = require('cors');
const port = process.env.PORT || 3000;
const connectDatabase = require('./configs/database');
const verifyJWT = require('./middlewares/verifyAuth');

// List of allowed origins (no wildcard)
const allowedOrigins = [
    'https://assignment-client-git-main-hamza-ansaris-projects-39859990.vercel.app',
    'https://assignment-client-gt2g4qbi7-hamza-ansaris-projects-39859990.vercel.app',
    'https://assignment-client-plum.vercel.app',
    'https://assignment-client-hamza-ansaris-projects-39859990.vercel.app'
];

// CORS options configuration
const corsOptions = {
    origin: (origin, callback) => {
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true); // Allow the origin
        } else {
            callback(new Error('Not allowed by CORS')); // Reject the origin
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
};

// Enable CORS for all routes
app.use(cors(corsOptions));
// Explicitly handle OPTIONS requests
app.options('*', cors(corsOptions));

app.use(express.json());
app.use('/api', require('./routes'));
app.use(express.static('public'));

// Apply the JWT middleware for all routes except /login
app.use((req, res, next) => {
    if (req.path === '/api/login' || req.path === '/') {
        return next(); // Skip JWT verification for the login route
    }
    verifyJWT(req, res, next); // Apply JWT middleware to all other routes
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
