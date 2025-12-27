import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    // Wait a bit for MongoDB connection to be ready
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Check if admin already exists
    const adminExists = await User.findOne({ username: 'admin' });
    
    if (adminExists) {
      console.log('✅ Admin user already exists');
      return;
    }

    // Create admin user
    const admin = await User.create({
      username: 'admin',
      password: 'admin123'
    });

    console.log('✅ Admin user created automatically on startup!');
    console.log('   Username: admin');
    console.log('   Password: admin123');
    console.log('   ⚠️  IMPORTANT: Change the default password after first login!');
  } catch (error) {
    console.error('❌ Error auto-seeding admin:', error.message);
    // Don't exit - let server continue running
  }
};

export default seedAdmin;

