const mongoose = require('mongoose');

let DonationSchema = new mongoose.Schema({
  facePresent: Boolean,
  gender: String,
  age: Number,
  mood: String,
  isSmiling: Boolean,
  mouthCenter: {
    x: Number,
    y: Number
  },
  rawResponse: mongoose.Schema.Types.Mixed
});

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;