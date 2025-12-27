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
    } else if (error.message.includes('ENOTFOUND')) {
      console.error('🌐 Network Error:');
    } else {
      console.error('Error:', error.message);
    }
    
    process.exit(1);
  }
};

testConnection();

