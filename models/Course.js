const mongoose = require('mongoose');

// Define the Course schema
const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    instructor: {
        type: String,
        required: true,
        trim: true
    },
    imageUrl: {
        type: String,
        required: true,
        trim: true
    },
    courseCode: {
        type: String,
        required: true,
        unique: true, // Ensures course codes are unique
        trim: true
    },
    term: {
        type: String,
        required: true,
        trim: true
    },
    // Add any additional fields as needed
    createdAt: {
        type: Date,
        default: Date.now // Automatically set the created date
    },
    updatedAt: {
        type: Date,
        default: Date.now // Automatically set the updated date
    }
});

// Create the Course model
const Course = mongoose.model('Course', courseSchema);

// Export the model
module.exports = Course;
