const mongoose = require('mongoose');

const otpSchema = new mongoose.Schema({
  otpId: {
    type: String,
    required: true,
    unique: true,
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  otp: {
    type: String,
    required: true,
  },
  attempts: {
    type: Number,
    default: 0,
    max: 3,
  },
  createdAt: {
    type: Date,
    default: Date.now,
    expires: 110, // OTP expires after 5 minutes
  },
});

// Add indexes for optimization
otpSchema.index({ otpId: 1 }); // Unique index for otpId
otpSchema.index({ userId: 1, email: 1 }); // Compound index for userId and email

module.exports = mongoose.model('OTP', otpSchema);
