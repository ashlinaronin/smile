const ALL_SMILES_ERROR = 'Display: Error getting all smiles';
const NEW_SMILES_ERROR = 'Display: Error getting new smiles';

let lastSmileTimestamp;

export async function getAllSmiles() {
  try {
    const allSmilesUrl = `${process.env.API_BASE_URL}/display/all-smiles`;
    const response = await fetch(allSmilesUrl);

    if (!response.ok) return Promise.reject(ALL_SMILES_ERROR);

    const allSmiles = await response.json();

    if (allSmiles.length > 0) {
      lastSmileTimestamp = allSmiles[0].createdAt;
    }

    return allSmiles;
  } catch (err) {
    return Promise.reject(ALL_SMILES_ERROR, err);
  }
}

export async function getNewSmiles() {
  try {
    if (typeof lastSmileTimestamp === 'undefined') {
      return getAllSmiles();
    }

    const newSmilesUrl = `${process.env.API_BASE_URL}/display/new-smiles/${lastSmileTimestamp}`;
    const response = await fetch(newSmilesUrl);

    if (!response.ok) return Promise.reject(NEW_SMILES_ERROR);

    const allSmiles = await response.json();

    if (allSmiles.length > 0) {
      lastSmileTimestamp = allSmiles[0].createdAt;
    }

    return allSmiles;
  } catch (err) {
    return Promise.reject(NEW_SMILES_ERROR, err);
  }
}
