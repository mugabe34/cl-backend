const express = require('express');
const router = express.Router();
const {
  createChatUser,
  getChatUsers,
  updateChatUser
} = require('../controllers/chatUserController');
const auth = require('../middleware/auth');

// Public routes
router.post('/', createChatUser);

// Protected routes (admin only)
router.get('/', auth, getChatUsers);
router.put('/:id', auth, updateChatUser);

module.exports = router; 