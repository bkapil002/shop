const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  email: { type: String, required: true },
  otp: { type: String, required: true },
  createdAt: { type: Date, default: Date.now, expires: 120  } // OTP expires in 2 minutes
});

const OTP = mongoose.model('OTP2', otpSchema);

module.exports = OTP;
