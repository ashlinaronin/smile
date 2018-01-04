import Vue from 'vue';
import postPhoto from './post-photo';

export default async function skyBioGetEmotions(imageBlob) {
  const result = {
    originalImageUrl: null,
    smileUrl: null,
    attributes: {},
    error: null,
  };

  try {
    const skyBioUrl = `${process.env.API_BASE_URL}/emotion-detection/sky-biometry`;
    const jsonResponse = await postPhoto(skyBioUrl, imageBlob);

    if (!jsonResponse.smileUrl) {
      result.error = 'Mouth not found';
      return result;
    }

    result.smileUrl = jsonResponse.smileUrl;

    const firstPhoto = jsonResponse.externalServiceResponse.photos[0];
    result.originalImageUrl = firstPhoto.url;

    if (firstPhoto.tags.length === 0) {
      result.error = 'We couldn\'t detect your face';
      return result;
    }

    const firstFace = firstPhoto.tags[0];
    result.attributes = firstFace.attributes;

    if (result.attributes.smiling.value === 'false') {
      result.error = 'Looks like you\'re not smiling';
    }

    return result;
  } catch (err) {
    Vue.$log.error('Sky Biometry:', err);
    result.error = 'We couldn\'t process your donation';
    return result;
  }
}
