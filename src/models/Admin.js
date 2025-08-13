const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const adminSchema = new mongoose.Schema({
  username: {              // Your admin username
    type: String,
    required: true,
    unique: true,
    trim: true,
    minlength: 3
  },
  email: {                 // Admin email
    type: String,
    required: true,
    unique: true,
    trim: true,
    lowercase: true
  },
  password: {              // Admin password
    type: String,
    required: true,
    minlength: 6
  },
  role: {                  // Admin role
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  }
}, {
  timestamps: true         // Adds createdAt & updatedAt
});

// Hash password before saving
adminSchema.pre('save', async function(next) {
  if (!this.isModified('password')) return next();
  
  try {
    const salt = await bcrypt.genSalt(12);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

// Method to compare passwords
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return bcrypt.compare(candidatePassword, this.password);
};

module.exports = mongoose.model('Admin', adminSchema);
