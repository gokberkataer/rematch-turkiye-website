const express = require('express');
const router = express.Router();
const Contact = require('../models/Contact');
const { isAuthenticated } = require('../middleware/auth');

// Submit contact form (requires authentication)
router.post('/', isAuthenticated, async (req, res) => {
    try {
        const { name, email, subject, message } = req.body;
        
        const contact = new Contact({
            name,
            email,
            subject,
            message,
            date: new Date(),
            userId: req.user._id // Store the user ID with the message
        });

        await contact.save();
        res.status(201).json({ message: 'Mesajınız başarıyla gönderildi.' });
    } catch (error) {
        console.error('Contact form error:', error);
        res.status(500).json({ error: 'Mesajınız gönderilemedi. Lütfen tekrar deneyin.' });
    }
});

// Get all contact messages (admin only)
router.get('/', isAuthenticated, async (req, res) => {
    try {
        const messages = await Contact.find().sort({ date: -1 });
        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ error: 'Mesajlar alınamadı.' });
    }
});

module.exports = router; 