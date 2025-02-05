const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 3000
const connectDatabase = require('./configs/database')
const verifyJWT = require('./middlewares/verifyAuth')



const allowedOrigins = ['*', 'https://assignment-client-gt2g4qbi7-hamza-ansaris-projects-39859990.vercel.app/'];  // Allow any origin
const corsOptions = {
    origin: allowedOrigins,  // This will allow requests from any origin
    methods: ['GET', 'POST', 'PUT', 'DELETE'],  // Specify allowed methods
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};

app.use(cors(corsOptions));
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


//Connect the mongoDB database
connectDatabase()



app.get('/', (req, res) => {
    res.send('Server API Running Well!')
})







app.listen(port, () => {
    console.log(`App Listening at port ${port}`)
})