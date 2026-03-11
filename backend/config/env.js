require('dotenv').config();

module.exports = {
  PORT: process.env.PORT || 5000,
  MONGO_URI: process.env.MONGO_URI || 'mongodb://localhost:27017/mental_health',
  JWT_SECRET: process.env.JWT_SECRET || 'supersecret',
  OPENAI_API_KEY: process.env.OPENAI_API_KEY || '',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASS: process.env.EMAIL_PASS || '',
  NODE_ENV: process.env.NODE_ENV || 'development',
};
