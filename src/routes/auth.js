const express = require('express');
const router = express.Router();
const { adminRegister, adminLogin, adminLogout, getAdminProfile } = require('../controllers/authController');
const auth = require('../middleware/auth');

// Public routes
router.post('/register', adminRegister); // Registration
router.post('/login', adminLogin);


router.get('/profile',  getAdminProfile);
router.post('/logout', adminLogout);

module.exports = router;
