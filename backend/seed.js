/**
 * Seed script: creates a default admin user.
 * Run: node seed.js
 */
require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./app/modules/auth/auth.model');
const { MONGO_URI } = require('./config/env');

async function seed() {
  try {
    await mongoose.connect(MONGO_URI);
    console.log('Connected to MongoDB');

    const existingAdmin = await User.findOne({ email: 'admin@mentalhealth.com' });
    if (existingAdmin) {
      console.log('Admin user already exists');
    } else {
      await User.create({
        name: 'Admin',
        email: 'admin@mentalhealth.com',
        password: 'admin123',
        role: 'admin',
      });
      console.log('✅ Admin user created: admin@mentalhealth.com / admin123');
    }

    await mongoose.disconnect();
    console.log('Done');
    process.exit(0);
  } catch (error) {
    console.error('Seed error:', error);
    process.exit(1);
  }
}

seed();
