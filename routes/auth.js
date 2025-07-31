const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const User = require('../models/User');

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, email, password } = req.body;
        console.log('Registration attempt for:', username);

        // Check if user already exists
        const existingUser = await User.findOne({ $or: [{ username }, { email }] });
        if (existingUser) {
            console.log('User already exists:', existingUser.username);
            return res.status(400).json({ error: 'Bu kullanıcı adı veya e-posta adresi zaten kullanılıyor.' });
        }

        // Create new user
        const user = new User({
            username,
            email,
            password
        });

        await user.save();
        console.log('User registered successfully:', username);
        res.status(201).json({ message: 'Kayıt başarılı! Giriş yapabilirsiniz.' });
    } catch (error) {
        console.error('Registration error:', error);
        res.status(500).json({ error: 'Kayıt işlemi başarısız oldu.' });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;
        console.log('Login attempt for:', username);

        // Find user by username
        const user = await User.findOne({ username });
        if (!user) {
            console.log('User not found:', username);
            return res.status(400).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
        }

        console.log('User found:', {
            username: user.username,
            email: user.email,
            hasPassword: !!user.password
        });

        console.log('User found, comparing passwords...');
        // Check password using the model's method
        const isMatch = await user.comparePassword(password);
        console.log('Password match:', isMatch);

        if (!isMatch) {
            console.log('Password mismatch for user:', username);
            return res.status(400).json({ error: 'Kullanıcı adı veya şifre hatalı.' });
        }

        // Set session
        req.session.userId = user._id;
        console.log('Login successful for:', username);
        res.json({ 
            message: 'Giriş başarılı!',
            user: {
                id: user._id,
                username: user.username,
                email: user.email
            }
        });
    } catch (error) {
        console.error('Login error:', error);
        res.status(500).json({ error: 'Giriş işlemi başarısız oldu.' });
    }
});

// Logout
router.post('/logout', (req, res) => {
    req.session.destroy();
    res.json({ message: 'Çıkış yapıldı.' });
});

// Get current user
router.get('/me', async (req, res) => {
    try {
        if (!req.session.userId) {
            return res.status(401).json({ error: 'Oturum açılmamış.' });
        }

        const user = await User.findById(req.session.userId).select('-password');
        if (!user) {
            return res.status(404).json({ error: 'Kullanıcı bulunamadı.' });
        }

        res.json(user);
    } catch (error) {
        console.error('Get user error:', error);
        res.status(500).json({ error: 'Kullanıcı bilgileri alınamadı.' });
    }
});

module.exports = router; 