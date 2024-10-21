const express = require('express');
const jwt = require('jsonwebtoken');
const User = require('../../models/User');
const { protect } = require('../../middleware/auth');
const multer = require('multer');
const path = require('path');
const { v4: uuidv4 } = require('uuid');

require('dotenv').config();  // Load environment variables

const router = express.Router();

// User registration
router.post('/register', async (req, res, next) => {
    try {
        const existingUser = await User.findOne({ email: req.body.email });
        if (existingUser) {
            return res.render('error', { message: 'User already exists. Please login or use a different email.' });
        }

        const newUser = new User(req.body);
        await newUser.save();
        res.render('register_success', { first_name: req.body.first_name });
    } catch (error) {
        console.log(error.message);
        const err = new Error('Registration is not successful. Try after sometime!');
        err.status = 500;
        return next(err); // Forward to error-handling middleware  
    }
});

// User login
router.post('/login', async (req, res, next) => {
    try {
        const user = await User.findOne({ email: req.body.email });

        if (!user) {
            return res.render('error', { message: 'Invalid email address. User does not exist.' });
        }

        const isMatch = await user.matchPassword(req.body.password);
        if (!isMatch) {
            return res.render('error', { message: 'Invalid password. Please try again.' });
        }

        req.session.userId = user.email;
        req.session.user = user;

        return res.redirect('/user/dashboard');
    } catch (error) {
        console.log(error.message);
        const err = new Error('Login is not successful. Try after sometime!');
        err.status = 500;
        return next(err); // Forward to error-handling middleware
    }
});

// User dashboard
router.get('/dashboard', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    res.render('user/dashboard', { user: req.session.user });
});

// User profile
router.get('/profile', (req, res) => {
    if (!req.session.userId) return res.redirect('/login');
    res.render('user/profile', { user: req.session.user });
});

// User logout
router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            const err = new Error('Logout is not successful. Try after sometime!');
            err.status = 500;
            return next(err); // Forward to error-handling middleware
        }

        res.redirect('/login');
    });
});



// Multer configuration for file uploads
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, '../../public/uploads/profile_pics'));
    },
    filename: (req, file, cb) => {
        const uniqueName = uuidv4();
        cb(null, uniqueName + path.extname(file.originalname));
    }
});

const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: (req, file, cb) => {
        const filetypes = /jpeg|jpg|png|gif/;
        const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
        const mimetype = filetypes.test(file.mimetype);

        if (mimetype && extname) {
            return cb(null, true);
        }
        cb(new Error('Error: File type not supported!'));
    }
});

// Edit profile picture
router.put('/edit-profile-pic/:id', upload.single('profile_pic'), async (req, res) => {
    try {
        if (!req.file) {
            return res.status(400).send('No file uploaded.');
        }

        const user = await User.findByIdAndUpdate(req.params.id, {
            profile_pic: req.file.filename
        }, { new: true });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        req.session.user = await User.findById(req.params.id);
        res.json({
            message: 'Profile Picture has been uploaded successfully!',
            file: req.file
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Edit personal information
router.put('/edit-personal-info/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        req.session.user = await User.findById(req.params.id);
        res.json({
            message: 'Personal information has been successfully updated'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Edit contact information
router.put('/edit-contact-info/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });

        if (!user) {
            return res.status(404).send('User not found.');
        }

        req.session.user = await User.findById(req.params.id);
        res.json({
            message: 'Contact information has been successfully updated'
        });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

// Delete user profile
router.delete('/delete-profile/:id', async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);

        if (!user) {
            return res.status(404).send('User not found.');
        }

        req.session.destroy((error) => {
            if (error) {
                const err = new Error('Logout is not successful. Try after sometime!');
                err.status = 500;
                return next(err); // Forward to error-handling middleware
            }
        });

        res.json({ message: 'User deleted successfully!' });
    } catch (err) {
        res.status(500).send(err.message);
    }
});

module.exports = router;
