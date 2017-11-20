const mongoose = require('mongoose');
mongoose.Promise = global.Promise;
const Donor = require('../models/Donor');
const skyBiometryParser = require('./skyBiometryParser');

async function init() {
  try {
    await mongoose.connect('mongodb://127.0.0.1/smile', { useMongoClient: true });
  }
  catch (err) {
    console.log('Error connecting to MongoDB', err);
  }
}

async function createNewDonor() {
  let newDonor = new Donor({});
  let response = await newDonor.save();
  console.log('saved new user', response);
  return response._id;
}

async function addSmileToDonor(donorId, skybiojson) {
  let donor = await Donor.findOne({ _id: donorId });

  if (typeof donor === 'undefined') {
    donor = createNewUser();
  }

  const donation = skyBiometryParser.skyBioResponseToDonation(skybiojson);
  const donationSaveResponse = await donation.save();

  donor.donations.push(donation);
  return await donor.save();
}

module.exports = {
  init,
  createNewDonor,
  addSmileToDonor
};