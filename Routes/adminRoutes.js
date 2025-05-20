const express = require('express');
const router = express.Router();
const User = require('../Models/UserSchema');
const adminOnly = require('../Middleware/authMiddleware');

router.get('/users', adminOnly, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied : Admin only!!' })
        }
        const users = await User.find().select('-password');
        res.json(users)
    } catch (err) {
        console.error("Failed to fetch users", err.message);
        res.status(500).json({ message: 'Server Error' })
    }
});

router.put('/users/:id/role', adminOnly, async (req, res) => {
    try {
        const { role } = req.body;
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied' });
        }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });
        user.role = role;
        await user.save();
        res.json({ message: 'User role updated', user });
    } catch (err) {
        console.error('Role update error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
})

router.delete('/users/:id', adminOnly, async (req, res) => {
    try {
        if (req.user.role !== 'admin') {
            return res.status(403).json({ message: 'Access denied : Admin only!!' })
        }
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found!' });

        res.json({ message: 'User deleted successfully' });
    } catch (err) {
        console.error('Delete error:', err.message);
        res.status(500).json({ message: 'Server error' });
    }
})

module.exports = router;