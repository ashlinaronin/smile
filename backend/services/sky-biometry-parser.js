const Donation = require('../models/Donation');

function skyBioResponseToDonation(skyBioResponse) {

  let donation = new Donation({
    rawResponse: skyBioResponse
  });

  const firstPhoto = skyBioResponse.photos[0];

  if (firstPhoto.tags.length === 0) {
    donation.facePresent = false;
    return donation;
  }

  const firstFace = firstPhoto.tags[0];
  const attributes = firstFace.attributes;

  donation.originalImageUrl = firstPhoto.url;
  donation.gender = attributes.gender.value;
  donation.age = attributes.age_est.value;
  donation.mood = attributes.mood.value;
  donation.isSmiling = attributes.smiling.value;

  donation.faceWidth = firstFace.width;
  donation.faceHeight = firstFace.height;
  donation.imageTotalWidth = firstPhoto.width;
  donation.imageTotalHeight = firstPhoto.height;
  donation.mouthCenter.x = firstFace.mouth_center.x;
  donation.mouthCenter.y = firstFace.mouth_center.y;

  return donation;
}

module.exports = {
  skyBioResponseToDonation
};