// Score a saved prediction against the official results.
// Set-based: a user is scored on how many of their 14 predicted playoff teams
// actually made the real playoff field. No bracket, no champion — just the field.
export function scorePrediction(prediction, official) {
  const officialSeeds = official
    ? [...(official.afc_seeds || []), ...(official.nfc_seeds || [])].filter(Boolean)
    : [];
  const hasResults = officialSeeds.length === 14;
  if (!hasResults) {
    return { hasResults: false, total: 0, maxTotal: 0, correctCount: 0 };
  }
  const offSet = new Set(officialSeeds);
  const predSeeds = [...(prediction.afc_seeds || []), ...(prediction.nfc_seeds || [])].filter(Boolean);
  let correctCount = 0;
  predSeeds.forEach((t) => {
    if (offSet.has(t)) correctCount++;
  });
  return { hasResults: true, total: correctCount, maxTotal: 14, correctCount };
}