import Vue from 'vue';

const baseUrl = 'http://localhost:3000';

async function postPhoto(imageBlob) {
  const requestUrl = `${baseUrl}/kairos`;
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

export default async function kairosGetEmotions(imageBlob) {
  const result = {
    attributes: {},
    error: null,
  };

  try {
    const jsonResponse = await postPhoto(imageBlob);

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
