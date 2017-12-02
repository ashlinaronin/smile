import Vue from 'vue';
import postPhoto from './post-photo';

export default async function skyBioGetEmotions(imageBlob) {
  const result = {
    attributes: {},
    error: null,
  };

  try {
    const skyBioUrl = `${process.env.API_BASE_URL}/emotion-detection/sky-biometry`;
    const jsonResponse = await postPhoto(skyBioUrl, imageBlob);
    const firstPhoto = jsonResponse.photos[0];

    if (firstPhoto.tags.length === 0) {
      result.error = 'No faces found';
      return result;
    }

    const firstFace = firstPhoto.tags[0];
    result.attributes = firstFace.attributes;

    if (result.attributes.smiling.value === 'false') {
      result.error = 'Smile not detected';
    }

    return result;
  } catch (err) {
    Vue.$log.error('Sky Biometry:', err);
    result.error = 'Error processing face';
    return result;
  }
}
