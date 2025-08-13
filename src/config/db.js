const mongoose = require('mongoose');
require('dotenv').config();

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/croshete');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error('MongoDB connection error:', error);
    console.log('Please make sure MongoDB is running or update MONGODB_URI in .env file');
    console.log('For local development, install MongoDB and run: mongod');
    console.log('For cloud deployment, use MongoDB Atlas and update MONGODB_URI');
    // Don't exit process, let the server continue without DB
  }
};

module.exports = connectDB; 