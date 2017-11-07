export default async function (requestUrl, imageBlob) {
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
