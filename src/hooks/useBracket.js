import { useState } from "react";
import { getTeamById } from "@/data/nflTeams";

const EMPTY_SEEDS = () => Array(7).fill(null);
const EMPTY_PICKS = () => ({ afc: {}, nfc: {}, sb: null });

// Clear downstream rounds when an earlier pick changes.
const DOWNSTREAM = {
  wc1: ["div1", "div2", "cc"],
  wc2: ["div1", "div2", "cc"],
  wc3: ["div1", "div2", "cc"],
  div1: ["cc"],
  div2: ["cc"],
  cc: [],
};

// Shared state for a playoff bracket (seeds + picks). Used by both the
// predictor (Home) and the official-results editor (Results).
export function useBracket(initial) {
  const init = initial || {};
  const [afcSeeds, setAfcSeeds] = useState(() =>
    Array.isArray(init.afc_seeds) && init.afc_seeds.length === 7 ? [...init.afc_seeds] : EMPTY_SEEDS()
  );
  const [nfcSeeds, setNfcSeeds] = useState(() =>
    Array.isArray(init.nfc_seeds) && init.nfc_seeds.length === 7 ? [...init.nfc_seeds] : EMPTY_SEEDS()
  );
  const [picks, setPicks] = useState(() =>
    init.picks
      ? { afc: { ...(init.picks.afc || {}) }, nfc: { ...(init.picks.nfc || {}) }, sb: init.picks.sb || null }
      : EMPTY_PICKS()
  );

  const bothReady = afcSeeds.every(Boolean) && nfcSeeds.every(Boolean);
  const champion = picks.sb ? getTeamById(picks.sb) : null;

  const handlePick = (conf, gameKey, teamId) => {
    setPicks((prev) => {
      const next = { ...prev, [conf]: { ...prev[conf] } };
      if (conf === "sb") {
        next.sb = teamId;
        return next;
      }
      if (next[conf][gameKey] === teamId) {
        delete next[conf][gameKey];
      } else {
        next[conf][gameKey] = teamId;
      }
      const toClear = DOWNSTREAM[gameKey] || [];
      toClear.forEach((k) => delete next[conf][k]);
      next.sb = null;
      return next;
    });
  };

  const handleSeedsChange = (conf, newSeeds) => {
    if (conf === "AFC") setAfcSeeds(newSeeds);
    else setNfcSeeds(newSeeds);
    setPicks(EMPTY_PICKS());
  };

  const reset = () => {
    setAfcSeeds(EMPTY_SEEDS());
    setNfcSeeds(EMPTY_SEEDS());
    setPicks(EMPTY_PICKS());
  };

  return { afcSeeds, nfcSeeds, picks, bothReady, champion, handlePick, handleSeedsChange, reset };
}