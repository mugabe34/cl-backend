const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin, getAdminProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/admin/register', adminRegister); // New route for registration
router.post('/admin/login', adminLogin);

// Protected routes
router.get('/admin/profile', auth, getAdminProfile);

module.exports = router;
