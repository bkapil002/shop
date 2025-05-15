const mongoose = require('mongoose');

const addressSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true // Fixed typo from "require" to "required"
    },
    name: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      enum: ['home', 'office', 'other'],
      default: 'home',
    },
    houseNo: {
      type: String,
      required: true,
    },
    landmark: {
      type: String,
      required: true,
    },
    phone: {
      type: String, 
      required: true,
    },
    state: {
      type: String,
      required: true,
    },
    areaPin: {
      type: String, 
      required: true,
    },
    isDefault: {
      type: Boolean,
      default: false,
    },
  },
  { timestamps: true }
);

// Pre-save hook to ensure only one default address per user
addressSchema.pre('save', async function (next) {
  if (this.isDefault) {
    await this.constructor.updateMany(
      { user: this.user, _id: { $ne: this._id } },
      { $set: { isDefault: false } }
    );
  }
  next();
});

module.exports = mongoose.model('Address', addressSchema);