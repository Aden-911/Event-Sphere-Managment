const express = require('express');
const router = express.Router();
const { registerUser, loginUser } = require('../Controllers/authController');
const protect = require('../Middleware/authMiddleware');


// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

router.get('/admin', protect, (req, res) => {
    res.json({
        message: 'Welcome to your profile',
        user: req.user, // user will be available because of the protect middleware
    });
});

router.get('/test', (req, res) => {
    console.log('✅ /api/auth/test hit');
    res.json({ msg: 'Test passed!' });
});

module.exports = router;
