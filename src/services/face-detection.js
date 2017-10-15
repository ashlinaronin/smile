import skyBiometryIsSmiling from 'services/sky-biometry';

export default async function isSmiling(imageUrl) {
  return skyBiometryIsSmiling(imageUrl);
}
