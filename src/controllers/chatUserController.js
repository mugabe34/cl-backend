const ChatUser = require('../models/ChatUser');

// @desc    Create chat user
// @route   POST /api/chat-users
// @access  Public
const createChatUser = async (req, res) => {
  try {
    const { username, phone, country, email } = req.body;
    
    if (!username || !phone || !country) {
      return res.status(400).json({ message: 'Username, phone, and country are required' });
    }
    
    // Check if user already exists
    const existingUser = await ChatUser.findOne({ phone });
    if (existingUser) {
      // Update last contact time
      existingUser.lastContact = new Date();
      await existingUser.save();
      return res.json({ message: 'Welcome back! We will contact you soon.', user: existingUser });
    }
    
    const chatUser = new ChatUser({
      username,
      phone,
      country,
      email
    });
    
    const savedUser = await chatUser.save();
    res.status(201).json({ message: 'Thank you! We will contact you soon.', user: savedUser });
  } catch (error) {
    console.error('Create chat user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Get all chat users (admin only)
// @route   GET /api/chat-users
// @access  Private
const getChatUsers = async (req, res) => {
  try {
    const { page = 1, limit = 20, status } = req.query;
    
    const filter = {};
    if (status && status !== 'all') {
      filter.status = status;
    }
    
    const skip = (Number(page) - 1) * Number(limit);
    
    const users = await ChatUser.find(filter)
      .sort({ lastContact: -1 })
      .skip(skip)
      .limit(Number(limit));
    
    const total = await ChatUser.countDocuments(filter);
    
    res.json({
      users,
      totalPages: Math.ceil(total / Number(limit)),
      currentPage: Number(page),
      total
    });
  } catch (error) {
    console.error('Get chat users error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// @desc    Update chat user status
// @route   PUT /api/chat-users/:id
// @access  Private
const updateChatUser = async (req, res) => {
  try {
    const { status } = req.body;
    
    const user = await ChatUser.findByIdAndUpdate(
      req.params.id,
      { status },
      { new: true, runValidators: true }
    );
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (error) {
    console.error('Update chat user error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createChatUser,
  getChatUsers,
  updateChatUser
}; 