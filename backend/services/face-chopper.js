const sharp = require('sharp');
const fetch = require('isomorphic-fetch');

const SMILE_WIDTH_TO_FACE_WIDTH_RATIO = 0.5;
const SMILE_HEIGHT_TO_FACE_HEIGHT_RATIO = 0.2;

async function saveSmilesFromDonation(donation) {
  // SkyBiometry coordinates appear to be in the range of 0-100... wtf? We can work with it...
  const smileWidth = (donation.faceWidth / 100) * donation.imageTotalWidth * SMILE_WIDTH_TO_FACE_WIDTH_RATIO;
  const smileHeight = (donation.faceHeight / 100) * donation.imageTotalHeight * SMILE_HEIGHT_TO_FACE_HEIGHT_RATIO;
  const smileLeftX = ((donation.mouthCenter.x / 100) * donation.imageTotalWidth) - (smileWidth / 2);
  const smileTopY = ((donation.mouthCenter.y / 100) * donation.imageTotalHeight) - (smileHeight / 2);

  const file = await fetchImage(donation.originalImageUrl);
  const input = sharp(file);
  const output = `./uploads/smiles/${ donation._id }.png`;

  try {
    const imageExtractResult = await input
      .extract({
        left: Math.ceil(smileLeftX),
        top: Math.ceil(smileTopY),
        width: Math.ceil(smileWidth),
        height: Math.ceil(smileHeight)
      })
      .toFile(output);

    console.log('FaceChopper: Extracted smile:', imageExtractResult);

    donation.smileImageUrl = output;
    await donation.save();
    console.log('FaceChopper: Saved smile with image URL');
  }
  catch (err) {
    console.log('FaceChopper: Error extracting smile from image:', err);
  }
}

async function fetchImage(url) {
  try {
    const response = await fetch(url);
    if (response.ok) {
      return await response.buffer();
    } else {
      return Promise.reject('FaceChopper: Error fetching original donation image');
    }
  }
  catch (err) {
    console.log('FaceChopper: Error fetching original donation image');
  }
}

module.exports = {
  saveSmilesFromDonation
};