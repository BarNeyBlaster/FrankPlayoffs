// Score a saved prediction against the official results.
// Set-based per round: a team you advanced to a round counts as correct if it
// actually advanced to that same round. Points scale with round importance.
const ROUNDS = [
  { key: "wc", label: "Wild Card", perPoint: 1, maxCorrect: 6, slots: ["wc1", "wc2", "wc3"] },
  { key: "div", label: "Divisional", perPoint: 2, maxCorrect: 4, slots: ["div1", "div2"] },
  { key: "cc", label: "Conference", perPoint: 4, maxCorrect: 2, slots: ["cc"] },
  { key: "sb", label: "Super Bowl", perPoint: 8, maxCorrect: 1, slots: [] },
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

export function scorePrediction(prediction, official) {
  if (!official || !official.picks) {
    return { hasResults: false, total: 0, maxTotal: 0, correctCount: 0, breakdown: [] };
  }
  const breakdown = [];
  let total = 0;
  let correctCount = 0;
  let maxTotal = 0;
  ROUNDS.forEach((r) => {
    const predSet = new Set(getRoundWinners(prediction.picks, r.key));
    const offSet = new Set(getRoundWinners(official.picks, r.key));
    let correct = 0;
    predSet.forEach((t) => {
      if (offSet.has(t)) correct++;
    });
    const points = correct * r.perPoint;
    total += points;
    correctCount += correct;
    maxTotal += r.maxCorrect * r.perPoint;
    breakdown.push({ key: r.key, label: r.label, correct, max: r.maxCorrect, points, perPoint: r.perPoint });
  });
  return { hasResults: true, total, maxTotal, correctCount, breakdown };
}