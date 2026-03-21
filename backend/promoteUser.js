const mongoose = require('mongoose');
const User = require('./models/User');
const dotenv = require('dotenv');

dotenv.config();

const promoteUser = async (email) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to MongoDB');

    const user = await User.findOneAndUpdate(
      { email },
      { userType: 'Admin' },
      { new: true }
    );

    if (user) {
      console.log(`Success: ${email} is now an admin.`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }
  } catch (error) {
    console.error('Error:', error.message);
  } finally {
    mongoose.connection.close();
  }
};

const email = process.argv[2];
if (!email) {
  console.log('Please provide an email: node promoteUser.js [24cs10ne83@mitsgwl.ac.in]');
  process.exit(1);
}

promoteUser(email);
