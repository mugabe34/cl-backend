const Admin = require('../models/Admin');

const auth = async (req, res, next) => {
  try {
    // Debug: trace session basics
    if (!req.session) {
      console.warn('Auth middleware: req.session is undefined');
      return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    if (!req.session.adminId) {
      console.warn('Auth middleware: No adminId in session');
      return res.status(401).json({ message: 'Access denied. Please log in.' });
    }

    // Fetch admin from DB using session adminId
    const admin = await Admin.findById(req.session.adminId).select('-password');
    if (!admin) {
      // Clear invalid session
      req.session.destroy();
      console.warn('Auth middleware: Admin not found for session adminId');
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
