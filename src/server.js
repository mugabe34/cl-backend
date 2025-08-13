const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const path = require('path');
const mongoose = require('mongoose');
const session = require('express-session');
require('dotenv').config();

const connectDB = require('./config/db');

// Initialize express
const app = express();

// Connect to database
connectDB().catch(console.error);

// Middleware
app.use(cors({
  origin: true, // reflect request origin to allow any URL
  credentials: true,
  optionsSuccessStatus: 200
}));
app.use(morgan('dev'));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Session middleware
app.use(session({
  secret: process.env.SESSION_SECRET || 'your-secret-key',
  resave: false,
  saveUninitialized: false,
  cookie: {
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true,
    sameSite: process.env.SAME_SITE || 'lax',
    maxAge: 24 * 60 * 60 * 1000 // 24 hours
  }
}));

// Serve uploaded files
app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

// Routes
app.use('/api/admin', require('./routes/auth')); // Updated: auth routes include register/login/profile
app.use('/api/products', require('./routes/products'));
app.use('/api/chat-users', require('./routes/chatUsers'));
// Keep this if you have separate admin routes
app.use('/api/admin-dashboard', require('./routes/admin'));

// Site settings (simple placeholder)
app.get('/api/site-settings', (req, res) => {
  res.json({
    siteName: 'Croshete',
    currency: 'USD',
    contactEmail: 'support@example.com',
    socials: {
      instagram: 'https://instagram.com/croshete',
      facebook: 'https://facebook.com/croshete'
    }
  });
});

// Debug session route (temporary)
app.get('/api/debug/session', (req, res) => {
  res.json({
    hasSession: !!req.session,
    session: req.session || null,
    cookies: req.headers.cookie || null
  });
});

// Health check
app.get('/health', (req, res) => {
  res.json({
    status: 'OK',
    timestamp: new Date().toISOString(),
    database: mongoose.connection.readyState === 1 ? 'connected' : 'disconnected'
  });
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);

  if (err.name === 'MulterError') {
    return res.status(400).json({ message: 'File upload error: ' + err.message });
  }

  if (err.name === 'MongooseServerSelectionError') {
    return res.status(503).json({ message: 'Database connection error. Please try again later.' });
  }

  res.status(500).json({ message: 'Something went wrong!' });
});

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({ message: 'Route not found' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌍 Environment: ${process.env.NODE_ENV || 'development'}`);
  console.log(`📊 Health check: http://localhost:${PORT}/health`);
  console.log(`🔗 API Base: http://localhost:${PORT}/api`);
});
