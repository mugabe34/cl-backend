const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    // Check if user is authenticated via session
    if (!req.session || !req.session.adminId) {
      return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    // Fetch admin from DB using session adminId
    const admin = await Admin.findById(req.session.adminId).select('-password');
    if (!admin) {
      // Clear invalid session
      req.session.destroy();
      return res.status(401).json({ message: 'Invalid session. Please log in again.' });
    }

    // Attach admin to request
    req.admin = admin;
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    res.status(401).json({ message: 'Authentication error.' });
  }
};

module.exports = auth;
