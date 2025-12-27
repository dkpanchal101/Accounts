import mongoose from 'mongoose';
import User from '../models/User.js';

const seedAdmin = async () => {
  try {
    // Wait for MongoDB connection to be ready
    let retries = 10;
    while (retries > 0 && mongoose.connection.readyState !== 1) {
      await new Promise(resolve => setTimeout(resolve, 500));
      retries--;
    }
    
    if (mongoose.connection.readyState !== 1) {
      console.error('❌ MongoDB not connected, cannot seed admin');
      return;
    }
    
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
    console.error('   Full error:', error);
    // Don't exit - let server continue running
  }
};

export default seedAdmin;
