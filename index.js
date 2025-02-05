const express = require('express')
const app = express()
const cors = require('cors');
const port = process.env.PORT || 3000
const connectDatabase = require('./configs/database')



const allowedOrigins = ['https://tsbi.tech', 'http://localhost:5000', 'http://tsbi.tech'];
const corsOption = {
    origin: allowedOrigins,
    methods: ['GET', 'POST'],  // Specify allowed methods
    credentials: true,  // Allow credentials (cookies, authorization headers, etc.)
};
app.use(cors(corsOption));
app.use(express.json());
app.use('/api', require('./routes'));
app.use(express.static('public'));


//Connect the mongoDB database
connectDatabase()

const User = require("./models/user");



app.get('/', async (req, res) => {
    const newUser = new User({ name: "Admin", age: 30, email: "admin@admin.com", role: 'Employee', password: 'sdfesdf' });
    await newUser.save();
    res.send('Hello, World!');
});


app.listen(port, () => {
    console.log(`App Listening at port ${port}`)
})