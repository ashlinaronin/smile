import Vue from 'vue';

const baseUrl = 'http://localhost:3000';

async function postPhoto(imageBlob) {
  const requestUrl = `${baseUrl}/face-attributes`;
  const formData = new FormData();
  formData.append('file', imageBlob, 'thing.png');

  const response = await fetch(requestUrl, {
    method: 'post',
    body: formData,
  });

  const jsonResponse = await response.json();

  if (!jsonResponse.status === 'success') {
    throw new Error('Error connecting to API');
  }

  return jsonResponse;
}

/*
 * isSmiling - Given an imageBlob, return whether or not the face within it is smiling.
 * If no face is detected, returns null.
 * @param {Blob} imageBlob
 * @returns {Promise.<Boolean>}
 */
export default async function isSmiling(imageBlob) {
  const result = {
    smiling: null,
    error: null,
  };

  try {
    const jsonResponse = await postPhoto(imageBlob);
    const firstPhoto = jsonResponse.photos[0];

    if (firstPhoto.tags.length === 0) {
      result.error = 'No faces found';
      return result;
    }

    const firstFace = firstPhoto.tags[0];
    const smilingAttr = firstFace.attributes.smiling;

    if (!smilingAttr.hasOwnProperty('value')) {
      result.error = 'Smiling could not be determined';
      return result;
    }

    result.smiling = (smilingAttr.value === 'true');

    return result;
  } catch (err) {
    Vue.$log.error('Sky Biometry:', err);
    result.error = 'Error processing smile';
    return result;
  }
}
