const mongoose = require('mongoose');
const DonationModel = require('./Donation');

let DonorSchema = new mongoose.Schema({
  faceId: String,
  gender: String,
  age: Number,
  donations: [DonationModel.schema]
});

const Donor = mongoose.model('Donor', DonorSchema);
module.exports = Donor;