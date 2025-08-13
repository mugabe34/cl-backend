const express = require('express');
const router = express.Router();
const {
  createChatUser,
  getChatUsers,
  updateChatUser
} = require('../controllers/chatUserController');
const auth = require('../middleware/auth');

// Protect all chat user routes
// router.use(auth);
router.post('/', createChatUser);
router.get('/', getChatUsers);
router.put('/:id', updateChatUser);

module.exports = router;
