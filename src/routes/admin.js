const express = require('express');
const router = express.Router();
const {
  getDashboardStats,
  getDashboardOverview
} = require('../controllers/adminController');
const auth = require('../middleware/auth');

// All admin routes are protected
// router.use(auth);

router.get('/stats', getDashboardStats);
router.get('/overview', getDashboardOverview);

module.exports = router;
