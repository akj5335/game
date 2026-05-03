const mongoose = require('mongoose');
const User = require('../models/User');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') });

const promoteToAdmin = async (phoneNumber) => {
  try {
    await mongoose.connect(process.env.MONGO_URI);
    console.log('Connected to DB...');

    const user = await User.findOneAndUpdate(
      { phoneNumber },
      { role: 'admin' },
      { new: true }
    );

    if (!user) {
      console.log('❌ User not found with that phone number.');
    } else {
      console.log(`✅ User ${user.name} promoted to ADMIN successfully!`);
    }
    process.exit();
  } catch (err) {
    console.error('Error:', err);
    process.exit(1);
  }
};

const phone = process.argv[2];
if (!phone) {
  console.log('Please provide a phone number: node promoteAdmin.js <phone_number>');
  process.exit(1);
}

promoteToAdmin(phone);
