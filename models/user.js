const mongoose = require("mongoose");

// Define Schema
const userSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: { type: Number, required: true },
    email: { type: String, required: true, unique: true },
    role: { type: String, required: true },
    password: { type: String, required: true },
    manager_email: { type: String }
});

// Create Model
const User = mongoose.model("User", userSchema);

module.exports = User;
