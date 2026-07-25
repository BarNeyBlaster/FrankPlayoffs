// Score a saved prediction against the official results.
// Set-based: a user is scored on how many of their 14 predicted playoff teams
// actually made the real playoff field. Tie-breakers (Super Bowl champion + final
// score) only apply once the admin locks them in.
export function scorePrediction(prediction, official) {
  const officialSeeds = official
    ? [...(official.afc_seeds || []), ...(official.nfc_seeds || [])].filter(Boolean)
    : [];
  const hasResults = officialSeeds.length === 14;
  if (!hasResults) {
    return { hasResults: false, total: 0, maxTotal: 0, correctCount: 0, tbLocked: false, champCorrect: null, scoreDiff: null, exactScore: null };
  }
  const offSet = new Set(officialSeeds);
  const predSeeds = [...(prediction.afc_seeds || []), ...(prediction.nfc_seeds || [])].filter(Boolean);
  let correctCount = 0;
  predSeeds.forEach((t) => {
    if (offSet.has(t)) correctCount++;
  });

  const tbChamp = official.sb_champion || null;
  const tbScore = official.sb_score_champ != null && official.sb_score_opp != null;
  const champCorrect = tbChamp ? prediction.sb_champion === tbChamp : null;
  let scoreDiff = null;
  let exactScore = null;
  if (tbScore && prediction.sb_score_champ != null && prediction.sb_score_opp != null) {
    const realTotal = Number(official.sb_score_champ) + Number(official.sb_score_opp);
    const predTotal = Number(prediction.sb_score_champ) + Number(prediction.sb_score_opp);
    scoreDiff = Math.abs(predTotal - realTotal);
    exactScore = prediction.sb_score_champ === official.sb_score_champ && prediction.sb_score_opp === official.sb_score_opp;
  }
  return { hasResults: true, total: correctCount, maxTotal: 14, correctCount, tbLocked: !!(tbChamp && tbScore), champCorrect, scoreDiff, exactScore };
}