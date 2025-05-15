const express = require('express');
const Address = require('../Model/Address');
const { auth } = require('../middleware/auth');
const router = express.Router();

router.post('/address', auth, async (req, res) => {
  try {
    const { houseNo, landmark, areaPin, name, state, phone, type } = req.body;
    const user = req.user._id;

    // Validate phone number
    const indianPhoneRegex = /^\+91\d{10}$/;
    if (!indianPhoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid Indian phone number. Check the number.' });
    }

    // Validate houseNo
    const houseNoWords = houseNo.trim().split(/\s+/);
    if (houseNoWords.length < 3) {
      return res.status(400).json({ success: false, message: 'House number must be at least 3 words long' });
    }

    // Validate landmark
    const landmarkWords = landmark.trim().split(/\s+/);
    if (landmarkWords.length < 4) {
      return res.status(400).json({ success: false, message: 'Landmark must be at least 4 words long' });
    }

    // Validate areaPin
    const areaPinRegex = /^\d{6}$/;
    if (!areaPinRegex.test(areaPin)) {
      return res.status(400).json({ success: false, message: 'Area PIN must be a 6-digit number' });
    }

    // Check for duplicate address
    const existingAddress = await Address.findOne({
      user,
      houseNo,
      landmark,
      areaPin,
      name,
      state,
      phone
    });

    if (existingAddress) {
      return res.status(400).json({ success: false, message: 'Address already exists' });
    }

    const addressData = {
      type,
      houseNo,
      landmark,
      areaPin,
      name,
      state,
      phone,
      user
    };

    // If this is the user's first address, make it default
    const addressCount = await Address.countDocuments({ user });
    if (addressCount === 0) {
      addressData.isDefault = true;
    }

    const address = new Address(addressData);
    await address.save();
    res.status(201).json({ success: true, data: address });
  } catch (error) {
    res.status(400).json({ success: false, message: error.message });
  }
});

router.get('/check-user-details', auth, async (req, res) => {
  try {
    const userDetails = await Address.findOne({ user: req.user._id });
    if (userDetails) {
      res.json(userDetails);
    } else {
      res.status(404).json({ message: 'User details not found' });
    }
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

router.put('/:id', auth, async (req, res) => {
  try {
    const { id } = req.params;
    const { houseNo, landmark, areaPin, name, state, phone} = req.body;

    // Validate phone number
    const indianPhoneRegex = /^\+91\d{10}$/;
    if (!indianPhoneRegex.test(phone)) {
      return res.status(400).json({ success: false, message: 'Invalid Indian phone number. Check the number.' });
    }

    // Validate houseNo
    const houseNoWords = houseNo.trim().split(/\s+/);
    if (houseNoWords.length < 3) {
      return res.status(400).json({ success: false, message: 'House number must be at least 3 words long' });
    }

    // Validate landmark
    const landmarkWords = landmark.trim().split(/\s+/);
    if (landmarkWords.length < 4) {
      return res.status(400).json({ success: false, message: 'Landmark must be at least 4 words long' });
    }

    // Validate pincode
    const pincodeRegex = /^\d{6}$/;
    if (!pincodeRegex.test(areaPin)) {
      return res.status(400).json({ success: false, message: 'PIN code must be a 6-digit number' });
    }

    const updatedDetails = await Address.findByIdAndUpdate(
      id,
      { phone, houseNo, landmark, areaPin, state, name },
      { new: true } 
    );

    if (!updatedDetails) {
      return res.status(404).json({ success: false, message: 'Address not found' });
    }

    res.json({ success: true, data: updatedDetails });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

module.exports = router;