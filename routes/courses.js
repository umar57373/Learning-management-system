const express = require('express');
const router = express.Router();
const path = require('path');
const fs = require('fs');
const User = require('../models/User');
const Course = require('../models/Course');

// Route to serve courses JSON file
router.get('/courses-data', (req, res) => {
    res.sendFile(path.join(__dirname, '../data/courses.json'));
});

// Route for rendering purchase page
router.get('/purchase', (req, res) => {
    res.render('user/purchase');
});

// Route for enrolling in a course
router.post('/enroll', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const { email, courseName } = req.body;

        // Fetch the user by ID
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: 'User not found' });
        }

        // Fetch the course by its name
        const course = await Course.findOne({ title: courseName });
        if (!course) {
            return res.status(404).json({ success: false, message: 'Course not found' });
        }

        // Check if the user is already enrolled in the course
        if (user.enrolled_courses.some(enrolledCourse => enrolledCourse.courseId.equals(course._id))) {
            return res.status(400).json({ success: false, message: 'You are already enrolled in this course.' });
        }

        // Add the course to the user's enrolled courses
        user.enrolled_courses.push({ courseId: course._id, email });
        await user.save();

        res.json({ success: true, message: 'Successfully enrolled in the course!' });
    } catch (error) {
        console.error('Error enrolling in course:', error);
        res.status(500).json({ success: false, message: 'An error occurred during enrollment.' });
    }
});

// Route to view enrolled courses
router.get('/mycourses', async (req, res) => {
    try {
        const userId = req.session.user._id;
        const user = await User.findById(userId).populate('enrolled_courses.courseId');

        res.render('user/mycourses', { courses: user.enrolled_courses.map(ec => ec.courseId) });
    } catch (error) {
        console.error('Error fetching enrolled courses:', error);
        res.status(500).json({ success: false, message: 'Failed to load enrolled courses.' });
    }
});

module.exports = router;
