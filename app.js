const express = require('express');
const path = require('path');
const fs = require('fs');
const cookieParser = require('cookie-parser');
const url = require('url');
const session = require('express-session');
const cors = require('cors');  // Import CORS
const connectDB = require('./config/config');
require('dotenv').config();  // Load environment variables

connectDB(); // Connect to MongoDB

// Importing routes
const dsaRoute = require('./routes/dsaRoute');
const CoursesRoute = require('./routes/courses');
const userRoute = require('./routes/mongoDB/user');
const subscribeRoute = require('./routes/subscribe');

// Initialize express app
const app = express();

// CORS configuration
const corsOptions = {
    origin: 'https://learning-management-system-lxj1-2retco8nk.vercel.app', // Vercel URL
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
    allowedHeaders: ['Content-Type', 'Authorization'], // Allowed headers
    credentials: true, // If you want to support cookies or authorization headers
};

// Apply CORS middleware
app.use(cors(corsOptions));

// Template engine
app.set('view engine', 'pug');
app.set('views', path.join(__dirname, 'views'));

// Static files
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

// Session management
app.use(session({
    secret: process.env.SESSION_SECRET || 'your_secret_key',
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false } // Set to true if using HTTPS
}));

// Routing
app.use('/courses', CoursesRoute);
app.use('/dsa', dsaRoute);
app.use('/user', userRoute);
app.post('/subscribe', subscribeRoute);
app.post('/user/subscribe', subscribeRoute);

app.use((req, res, next) => {
    const viewName = url.parse(req.url, true).pathname.substring(1);
    const viewPath = path.join(__dirname, 'views', viewName);

    // Check if the view file exists
    if (fs.existsSync(viewPath + '.pug')) { // Adjust the file extension based on your template engine
        return res.render(viewName);
    } else {
        // If the view does not exist, render a custom 404 error page
        return res.status(404).render('error', {
            error: 'Page Not Found',
            status: 404,
            message: 'The page you are looking for does not exist.'
        });
    }
});

// Middleware - Error handling
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(err.status || 500).send(err.message || 'Internal Server Error');
});

// Start the server
const port = process.env.PORT || 3000; // Use environment variable for port
app.listen(port, () => {
    console.log(`Server is running @ http://localhost:${port}`);
});
