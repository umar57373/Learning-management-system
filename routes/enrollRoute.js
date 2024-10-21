const express = require('express');
const router = express.Router();
const crypto = require('crypto');

// Helper function to generate a random password
const generatePassword = (length = 8) => {
  return crypto.randomBytes(length).toString('hex');
};

let enrolledCourses = []; // Placeholder for storing enrolled courses and passwords

router.post('/subscribe', (req, res) => {
  const { courseTitle, email } = req.body;

  // Generate password
  const password = generatePassword(8);

  // Save enrollment info (in production, you'd save this to a database)
  enrolledCourses.push({ email, courseTitle, password });

  // Respond with success and the generated password
  res.json({ success: true, message: 'Enrolled successfully!', password });
});

router.get('/mycourse/:email', (req, res) => {
  const { email } = req.params;

  // Filter courses by user email
  const userCourses = enrolledCourses.filter(course => course.email === email);

  res.json({ success: true, courses: userCourses });
});

module.exports = router;
