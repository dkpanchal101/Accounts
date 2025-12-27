import mongoose from 'mongoose';
import dotenv from 'dotenv';

dotenv.config();

const testConnection = async () => {
  console.log('🔍 Testing MongoDB Connection...\n');
  
  if (!process.env.MONGODB_URI) {
    console.error('❌ MONGODB_URI is not set in .env file');
    process.exit(1);
  }

  // Mask password in URI for display
  const maskedURI = process.env.MONGODB_URI.replace(/:([^:@]+)@/, ':***@');
  console.log('📝 Connection String:', maskedURI);
  console.log('');

  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log('✅ Connection Successful!');
    console.log(`   Host: ${conn.connection.host}`);
    console.log(`   Database: ${conn.connection.name}`);
    console.log(`   Ready State: ${conn.connection.readyState === 1 ? 'Connected' : 'Not Connected'}`);
    
    await mongoose.connection.close();
    console.log('\n✅ Connection test passed!');
    process.exit(0);
  } catch (error) {
    console.error('\n❌ Connection Failed!\n');
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('🔐 Authentication Error:');
      console.error('   Your username or password is incorrect.');
      console.error('\n   Fix:');
      console.error('   1. Check your MongoDB Atlas username');
      console.error('   2. Replace <db_password> with your actual password');
      console.error('   3. If password has special characters, URL-encode them:');
      console.error('      @ → %40, # → %23, % → %25, & → %26, / → %2F');
      console.error('\n   Example:');
      console.error('   WRONG: mongodb+srv://user:pass@word@cluster...');
      console.error('   RIGHT: mongodb+srv://user:pass%40word@cluster...');
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network Error:');
      console.error('   Cannot reach MongoDB server.');
      console.error('\n   Fix:');
      console.error('   1. Check your internet connection');
      console.error('   2. Verify MongoDB Atlas cluster is running');
      console.error('   3. Check Network Access in MongoDB Atlas (whitelist your IP)');
    } else {
      console.error('Error:', error.message);
    }
    
    console.error('\n📖 See backend/FIX_ENV.md for detailed instructions');
    process.exit(1);
  }
};

testConnection();

