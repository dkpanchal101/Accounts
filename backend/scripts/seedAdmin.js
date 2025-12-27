import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';

dotenv.config();

const seedAdmin = async () => {
  try {
    // Fix MongoDB URI if missing database name
    let mongoURI = process.env.MONGODB_URI;
    if (mongoURI && mongoURI.endsWith('/')) {
      mongoURI = mongoURI + 'bannerpro?retryWrites=true&w=majority';
      console.log('⚠️  Fixed MongoDB URI (added database name)');
    }
    
    await mongoose.connect(mongoURI || process.env.MONGODB_URI);
    console.log('MongoDB Connected');

    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('Admin user already exists');
      process.exit(0);
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      password: 'admin123' // Change this in production!
    });

    console.log('Admin user created successfully!');
    console.log('Username: admin');
    console.log('Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change the default password after first login!');
    
    process.exit(0);
  } catch (error) {
    console.error('Error seeding admin:', error);
    process.exit(1);
  }
};

seedAdmin();

