import { skyBioIsSmiling, skyBioGetEmotions } from 'services/sky-biometry';
import kairosGetEmotions from 'services/kairos';

export async function isSmiling(imageUrl) {
  return skyBioIsSmiling(imageUrl);
}

export async function getEmotions(imageUrl) {
  const skyBioPromise = skyBioGetEmotions(imageUrl);
  const kairosPromise = kairosGetEmotions(imageUrl);

  return {
    skyBiometry: await skyBioPromise,
    kairos: await kairosPromise,
    error: null,
  };
}
