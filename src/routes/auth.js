const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin, adminLogout, getAdminProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', adminRegister); // Registration
router.post('/login', adminLogin);

// Profile is now public and returns auth status gracefully
router.get('/profile', getAdminProfile);

// Protected routes
router.post('/logout', auth, adminLogout);

module.exports = router;
