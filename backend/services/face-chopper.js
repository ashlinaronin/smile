const sharp = require('sharp');

async function saveSmilesFromDonation(donation) {

  const smileWidth = donation.faceWidth / 3;
  const smileHeight = donation.faceHeight / 22;

  const smileLeftX = donation.mouthCenter.x - (smileWidth / 2);
  const smileTopY = donation.mouthCenter.y - (smileHeight / 2);

  const input = sharp('./uploads/1510459238548filething.png');
  // const input = sharp(donation.originalImageUrl);
  const output = `./uploads/smiles/${ donation._id }.png`;

  return input
    .extract({
      left: Math.ceil(smileLeftX),
      top: Math.ceil(smileTopY),
      width: Math.ceil(smileWidth),
      height: Math.ceil(smileHeight)
    })
    .toFile(output)
    .catch(err => {
      console.log('Error extracting smile from image:', err);
    });
}

module.exports = {
  saveSmilesFromDonation
};