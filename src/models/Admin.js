const mongoose = require('mongoose');

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
  password: {              // Admin password (stored as plaintext per requirement)
    type: String,
    required: true,
    minlength: 1
  },
  role: {                  // Admin role
    type: String,
    enum: ['admin', 'super_admin'],
    default: 'admin'
  }
}, {
  timestamps: true         // Adds createdAt & updatedAt
});

// Plaintext comparison
adminSchema.methods.comparePassword = async function(candidatePassword) {
  return candidatePassword === this.password;
};

module.exports = mongoose.model('Admin', adminSchema);
