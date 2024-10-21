const mongoose = require('mongoose');
require('dotenv').config();  // Load environment variables

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI); // Use the correct environment variable
        console.log('MongoDB connected');
    } catch (error) {
        console.error(`MongoDB connection failed: ${error.message}`);
        process.exit(1); // Exit process with failure
    }
};

module.exports = connectDB;
