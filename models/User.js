const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
require('dotenv').config();  // Ensure environment variables are loaded

// Define the User Schema
const userSchema = new mongoose.Schema({
    first_name: {
        type: String,
        required: true,
        trim: true // Trims whitespace
    },
    last_name: {
        type: String,
        required: true,
        trim: true // Trims whitespace
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true, // Ensures email is stored in lowercase
        trim: true // Trims whitespace
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true,
        trim: true,
        validate: {
            validator: function(v) {
                return /^\d{10}$/.test(v); // Simple regex for validating 10-digit phone numbers
            },
            message: props => `${props.value} is not a valid phone number!`
        }
    },
    profile_pic: {
        type: String,
        default: 'default.png' // Default profile picture
    },
    createdAt: {
        type: Date,
        default: Date.now // Automatically set creation date
    }
});

// Pre-save hook to hash password
userSchema.pre('save', async function(next) {
    if (!this.isModified('password')) {
        return next();
    }

    // Hash the password with a salt round of 10
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

// Method to match password for login
userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

// Method to generate JWT
userSchema.methods.getSignedJwtToken = function() {
    return jwt.sign({ id: this._id }, process.env.JWT_SECRET, { expiresIn: '30d' });
};

// Create the User model
const User = mongoose.model('User', userSchema);
module.exports = User;
