// Score a saved prediction against the official results.
// Set-based per round: a team you advanced to a round counts as correct if it
// actually advanced to that same round. Points scale with round importance.
// As the admin locks in games round-by-round, only decided rounds are scored,
// and the running max reflects what has been decided so far.
const ROUNDS = [
  { key: "wc", label: "Wild Card", perPoint: 1, slots: ["wc1", "wc2", "wc3"] },
  { key: "div", label: "Divisional", perPoint: 2, slots: ["div1", "div2"] },
  { key: "cc", label: "Conference", perPoint: 4, slots: ["cc"] },
  { key: "sb", label: "Super Bowl", perPoint: 8, slots: [] },
];

function getRoundWinners(picks, roundKey) {
  const vals = [];
  if (!picks) return vals;
  if (roundKey === "sb") {
    if (picks.sb) vals.push(picks.sb);
    return vals;
  }
  const round = ROUNDS.find((r) => r.key === roundKey);
  ["afc", "nfc"].forEach((conf) => {
    const c = picks[conf] || {};
    round.slots.forEach((slot) => {
      if (c[slot]) vals.push(c[slot]);
    });
  });
  return vals;
}

function hasAnyOfficialPicks(picks) {
  if (!picks) return false;
  if (picks.sb) return true;
  return ["afc", "nfc"].some((conf) =>
    Object.values(picks[conf] || {}).some(Boolean)
  );
}

export function scorePrediction(prediction, official) {
  if (!official || !hasAnyOfficialPicks(official.picks)) {
    return { hasResults: false, total: 0, maxTotal: 0, correctCount: 0, breakdown: [] };
  }
  const breakdown = [];
  let total = 0;
  let correctCount = 0;
  let maxTotal = 0;
  ROUNDS.forEach((r) => {
    const offSet = new Set(getRoundWinners(official.picks, r.key));
    if (offSet.size === 0) {
      breakdown.push({ key: r.key, label: r.label, correct: 0, max: 0, points: 0, perPoint: r.perPoint, pending: true });
      return;
    }
    const predSet = new Set(getRoundWinners(prediction.picks, r.key));
    let correct = 0;
    predSet.forEach((t) => {
      if (offSet.has(t)) correct++;
    });
    const points = correct * r.perPoint;
    total += points;
    correctCount += correct;
    maxTotal += offSet.size * r.perPoint;
    breakdown.push({ key: r.key, label: r.label, correct, max: offSet.size, points, perPoint: r.perPoint });
  });
  return { hasResults: true, total, maxTotal, correctCount, breakdown };
}