import skyBioGetEmotions from 'services/sky-biometry';

export default async function getEmotions(imageUrl) {
  try {
    const skyBioPromise = skyBioGetEmotions(imageUrl);

    return {
      resultsByProvider: [
        {
          provider: 'skyBiometry',
          results: await skyBioPromise,
        },
      ],
      error: null,
    };
  } catch (err) {
    return {
      resultsByProvider: [],
      error: err,
    };
  }
}
