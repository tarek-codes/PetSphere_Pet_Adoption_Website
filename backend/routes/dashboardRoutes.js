const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Staff/Admin Dashboard - returns JSON (frontend is React SPA)
router.get('/staff-dashboard', async (req, res) => {
    if (req.session.role !== 'staff') {
        return res.status(403).json({ message: 'Access denied' });
    }
    try {
        const users = await User.find({ isVerified: false });
        res.json({ users });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Approve User
router.post('/approve-user/:id', async (req, res) => {
    try {
        await User.findByIdAndUpdate(req.params.id, { isVerified: true });
        res.json({ message: 'User approved successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

// Reject User
router.post('/reject-user/:id', async (req, res) => {
    try {
        await User.findByIdAndDelete(req.params.id);
        res.json({ message: 'User rejected and removed' });
    } catch (err) {
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;