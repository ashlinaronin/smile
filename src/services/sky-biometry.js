import Vue from 'vue';

const baseUrl = 'http://localhost:3000';

/*
 * isSmiling - Given an imageBlob, return whether or not the face within it is smiling.
 * If no face is detected, returns null.
 * @param {Blob} imageBlob
 * @returns {Promise.<Boolean>}
 */
export default async function isSmiling(imageBlob) {
  const requestUrl = `${baseUrl}/face-attributes`;

  const formData = new FormData();
  formData.append('file', imageBlob, 'thing.png');

  const response = await fetch(requestUrl, {
    method: 'post',
    headers: {
      Accept: 'application/json',
      'Content-Type': 'multipart/form-data',
    },
    body: formData,
  });

  const jsonResponse = await response.json();

  if (!jsonResponse.status === 'success') {
    Vue.$log.error('Sky Biometry: Error connecting to API');
  }

  const firstPhoto = jsonResponse.photos[0];

  if (firstPhoto.tags.length === 0) {
    Vue.$log.info('Sky Biometry: No faces found in image');
    return null;
  }

  const firstFace = firstPhoto.tags[0];
  const attrs = firstFace.attributes;
  const smiling = attrs.smiling;
  return smiling.value === 'true';
}
