import Vue from 'vue';
import postPhoto from './post-photo';

export default async function kairosGetEmotions(imageBlob) {
  const result = {
    attributes: {},
    error: null,
  };

  try {
    const kairosUrl = `${process.env.API_BASE_URL}/emotion-detection/kairos`;

    const jsonResponse = await postPhoto(kairosUrl, imageBlob);
    const firstPhoto = jsonResponse.frames[0];

    if (firstPhoto.people.length === 0) {
      result.error = 'No faces found';
      return result;
    }

    const firstFace = firstPhoto.people[0];

    result.attributes = Object.assign(
      {},
      firstFace.appearance,
      firstFace.demographics,
      firstFace.emotions,
    );

    return result;
  } catch (err) {
    Vue.$log.error('Kairos:', err);
    result.error = 'Error processing face';
    return result;
  }
}
