const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongo');
const fs = require('fs');
require('dotenv').config();

const app = express();

// Create uploads directory if it doesn't exist
const uploadsDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
}

// Connect to MongoDB (optional)
console.log('Attempting to connect to MongoDB...');
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/community-website', {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => {
    console.log('Successfully connected to MongoDB!');
    console.log('Database:', mongoose.connection.db.databaseName);
})
.catch(err => {
    console.log('MongoDB connection failed, running without database...');
    console.log('Error:', err.message);
    // Continue without database
});

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Session configuration (memory-based if MongoDB not available)
const sessionConfig = {
    secret: process.env.SESSION_SECRET || 'your-secret-key',
    resave: false,
    saveUninitialized: false
};

// Try to use MongoDB store if available, otherwise use memory store
try {
    if (mongoose.connection.readyState === 1) {
        sessionConfig.store = MongoStore.create({
            mongoUrl: process.env.MONGODB_URI || 'mongodb://localhost:27017/community-website',
            ttl: 24 * 60 * 60 // 1 day
        });
        console.log('Using MongoDB session store');
    } else {
        console.log('Using memory session store');
    }
} catch (error) {
    console.log('Using memory session store');
}

app.use(session(sessionConfig));

// Import routes
const authRoutes = require('./routes/auth');
const contactRoutes = require('./routes/contact');

// Use routes
app.use('/api/auth', authRoutes);
app.use('/api/contact', contactRoutes);

// Frontend routes
app.get('/', (req, res) => {
    res.render('index', { title: 'Home' });
});

app.get('/about', (req, res) => {
    res.render('about', { title: 'About Us' });
});

app.get('/gallery', (req, res) => {
    res.render('gallery', { title: 'Gallery' });
});

app.get('/contact', (req, res) => {
    res.render('contact', { title: 'Contact' });
});

app.get('/profile', (req, res) => {
    res.render('profile', { title: 'My Profile' });
});

app.get('/register', (req, res) => {
    res.render('register', { title: 'Register' });
});

app.get('/login', (req, res) => {
    res.render('login', { title: 'Login' });
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
}); 