import skyBioGetEmotions from 'services/sky-biometry';
import kairosGetEmotions from 'services/kairos';

export default async function getEmotions(imageUrl) {
  try {
    const skyBioPromise = skyBioGetEmotions(imageUrl);
    const kairosPromise = kairosGetEmotions(imageUrl);

    return {
      resultsByProvider: [
        {
          provider: 'skyBiometry',
          results: await skyBioPromise,
        },
        {
          provider: 'kairos',
          results: await kairosPromise,
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
