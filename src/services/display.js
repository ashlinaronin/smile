const SMILES_ERROR = 'Display: Error getting smiles';

let lastSmileTimestamp;

async function callSmileApi(smileApiUrl) {
  try {
    const response = await fetch(smileApiUrl);

    if (!response.ok) return Promise.reject(SMILES_ERROR);

    const smiles = await response.json();

    if (smiles.length > 0) {
      lastSmileTimestamp = smiles[0].createdAt;
    }

    return smiles;
  } catch (err) {
    return Promise.reject(SMILES_ERROR, err);
  }
}

export async function getAllSmiles() {
  const allSmilesUrl = `${process.env.API_BASE_URL}/display/all-smiles`;
  return callSmileApi(allSmilesUrl);
}

export async function getNewSmiles() {
  if (typeof lastSmileTimestamp === 'undefined') {
    return getAllSmiles();
  }

  const newSmilesUrl = `${process.env.API_BASE_URL}/display/new-smiles/${lastSmileTimestamp}`;
  return callSmileApi(newSmilesUrl);
}
