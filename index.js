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
        // Allow the origin if it matches one of the allowedOrigins or if there is no origin (e.g. during server-to-server requests)
        if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'));
        }
    },
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Ensure OPTIONS is included
    credentials: true,  // Allow credentials (cookies, authorization headers)
};

// Enable CORS for all routes
app.use(cors(corsOptions));

// Explicitly handle OPTIONS requests (for preflight requests)
app.options('*', (req, res, next) => {
    console.log('Handling OPTIONS request');
    cors(corsOptions)(req, res, next);
});

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
