const ALL_SMILES_ERROR = 'Display: Error getting all smiles';

export default async function getAllSmiles() {
  try {
    const allSmilesUrl = `${process.env.API_BASE_URL}/display/all-smiles`;
    const response = await fetch(allSmilesUrl);

    if (!response.ok) return Promise.reject(ALL_SMILES_ERROR);

    return await response.json();
  } catch (err) {
    return Promise.reject(ALL_SMILES_ERROR, err);
  }
}
