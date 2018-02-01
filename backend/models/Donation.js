const mongoose = require('mongoose');

let DonationSchema = new mongoose.Schema({
  originalImageUrl: { type: String, default: null },
  smileImageUrl: { type: String, default: null },
  facePresent: { type: Boolean, default: false },
  gender: { type: String, default: null },
  age: { type: Number, default: null },
  mood: { type: String, default: null },
  isSmiling: { type: Boolean, default: false },
  mouthCenter: {
    x: { type: Number, default: null },
    y: { type: Number, default: null }
  },
  faceWidth: { type: Number, default: null },
  faceHeight: { type: Number, default: null },
  imageTotalWidth: { type: Number, default: null },
  imageTotalHeight: { type: Number, default: null },
  rawResponse: mongoose.Schema.Types.Mixed
}, { timestamps: true });

const Donation = mongoose.model('Donation', DonationSchema);
module.exports = Donation;