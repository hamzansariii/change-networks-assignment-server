const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 3000
const connectDatabase = require('./configs/database')
const verifyJWT = require('./middlewares/verifyAuth')



const allowedOrigins = ['*'];

const corsOptions = {
    origin: allowedOrigins,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],  // Ensure OPTIONS is included
    credentials: true,
};

app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Explicitly handle OPTIONS requests

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