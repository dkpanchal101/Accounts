import mongoose from 'mongoose';
import dotenv from 'dotenv';
import User from '../models/User.js';
import bcrypt from 'bcryptjs';

dotenv.config();

const testAdmin = async () => {
  try {
    console.log('🔍 Testing Admin User...\n');
    
    // Fix MongoDB URI if missing database name
    let mongoURI = process.env.MONGODB_URI;
    if (mongoURI && mongoURI.endsWith('/')) {
      mongoURI = mongoURI + 'bannerpro?retryWrites=true&w=majority';
      console.log('⚠️  Fixed MongoDB URI (added database name)');
    }
    
    await mongoose.connect(mongoURI || process.env.MONGODB_URI);
    console.log('✅ MongoDB Connected\n');

    // Check if admin exists
    const admin = await User.findOne({ username: 'admin' });
    
    if (!admin) {
      console.log('❌ Admin user not found!');
      console.log('Creating admin user...\n');
      
      const newAdmin = await User.create({
        username: 'admin',
        password: 'admin123'
      });
      
      console.log('✅ Admin user created!');
      console.log('   Username: admin');
      console.log('   Password: admin123\n');
    } else {
      console.log('✅ Admin user exists');
      console.log('   Username:', admin.username);
      console.log('   Created:', admin.createdAt);
      
      // Test password
      console.log('\n🔐 Testing password...');
      const isMatch = await admin.matchPassword('admin123');
      
      if (isMatch) {
        console.log('✅ Password is correct!');
      } else {
        console.log('❌ Password mismatch!');
        console.log('   Resetting password...');
        
        // Reset password
        admin.password = 'admin123';
        await admin.save();
        console.log('✅ Password reset to: admin123');
      }
    }
    
    await mongoose.connection.close();
    console.log('\n✅ Test completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Error:', error.message);
    process.exit(1);
  }
};

testAdmin();

