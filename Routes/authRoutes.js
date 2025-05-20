const express = require('express');
const router = express.Router();
const { registerUser, loginUser, forgetPassword, resetPassword, logout } = require('../Controllers/authController');
const protect = require('../Middleware/authMiddleware');
const User = require('../Models/UserSchema')


// POST /api/auth/register
router.post('/register', registerUser);

// POST /api/auth/login
router.post('/login', loginUser);

router.post('/logout', logout);

router.post('/forget-password', forgetPassword);

router.post('/reset-password/:token', resetPassword);

// GET /api/auth/me — returns current logged-in user
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select('-password'); // remove password
    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch user' });
  }
});



// router.get('/admin', protect, (req, res) => {
//     res.json({
//         message: 'Welcome to your profile',
//         user: req.user, // user will be available because of the protect middleware
//     });
// });

router.get('/test', (req, res) => {
    console.log('✅ /api/auth/test hit');
    res.json({ msg: 'Test passed!' });
});

module.exports = router;
