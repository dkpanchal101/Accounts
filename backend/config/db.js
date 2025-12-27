import mongoose from 'mongoose';

const connectDB = async () => {
  try {
    if (!process.env.MONGODB_URI) {
      console.error('❌ Error: MONGODB_URI is not defined in .env file');
      process.exit(1);
    }

    const conn = await mongoose.connect(process.env.MONGODB_URI);
    
    console.log(`✅ MongoDB Connected: ${conn.connection.host}`);
    console.log(`📊 Database: ${conn.connection.name}`);
  } catch (error) {
    console.error('❌ MongoDB Connection Error:');
    
    if (error.message.includes('authentication failed') || error.message.includes('bad auth')) {
      console.error('   → Authentication failed. Please check:');
      console.error('     1. Username and password in MONGODB_URI');
      console.error('     2. Replace <db_password> with actual password');
      console.error('     3. URL-encode special characters in password (@ → %40, # → %23, etc.)');
      console.error('   See backend/FIX_ENV.md for detailed instructions');
    } else if (error.message.includes('ENOTFOUND') || error.message.includes('getaddrinfo')) {
      console.error('   → Cannot reach MongoDB server. Check:');
      console.error('     1. Internet connection');
      console.error('     2. MongoDB Atlas cluster is running');
      console.error('     3. Network Access IP whitelist in MongoDB Atlas');
    } else if (error.message.includes('MongoServerError')) {
      console.error('   → MongoDB server error:', error.message);
    } else {
      console.error('   →', error.message);
    }
    
    process.exit(1);
  }
};

export default connectDB;

