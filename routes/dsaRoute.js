const express = require('express');
const router = express.Router();
const path = require('path');

// Route to serve DSA JSON file
router.get('/questions', (req, res) => {
    res.sendFile(path.join(__dirname, '../data/DSA.json'));
});

// Route for rendering DSA questions page
router.get('/', (req, res) => {
    res.render('Coding_Question'); // Render your Pug file for DSA questions
});

module.exports = router;
