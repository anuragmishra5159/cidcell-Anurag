require('dotenv').config();
const mongoose = require('mongoose');
const User = require('./models/User');

const email = process.argv[2];

if (!email) {
  console.error('Please provide an email address. Usage: node promoteMentor.js <email>');
  process.exit(1);
}

mongoose.connect(process.env.MONGO_URI)
.then(async () => {
    console.log('Connected to MongoDB');
    
    const user = await User.findOneAndUpdate(
      { email },
      { userType: 'mentor' },
      { new: true }
    );

    if (user) {
      console.log(`Success: ${user.email} is now a mentor.`);
    } else {
      console.log(`Error: User with email ${email} not found.`);
    }

    mongoose.disconnect();
})
.catch(err => {
    console.error('Database connection error:', err);
    process.exit(1);
});
