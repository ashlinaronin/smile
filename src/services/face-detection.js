import { skyBioIsSmiling, skyBioGetEmotions } from 'services/sky-biometry';

export async function isSmiling(imageUrl) {
  return skyBioIsSmiling(imageUrl);
}

export async function getEmotions(imageUrl) {
  return skyBioGetEmotions(imageUrl);
}
