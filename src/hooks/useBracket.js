import { useState } from "react";

const EMPTY_SEEDS = () => Array(7).fill(null);

// Shared state for the playoff field (7 AFC + 7 NFC team selections). Used by
// both the predictor (Home) and the official-results editor (Results).
export function useBracket(initial) {
  const init = initial || {};
  const [afcSeeds, setAfcSeeds] = useState(() =>
    Array.isArray(init.afc_seeds) && init.afc_seeds.length === 7 ? [...init.afc_seeds] : EMPTY_SEEDS()
  );
  const [nfcSeeds, setNfcSeeds] = useState(() =>
    Array.isArray(init.nfc_seeds) && init.nfc_seeds.length === 7 ? [...init.nfc_seeds] : EMPTY_SEEDS()
  );

  const bothReady = afcSeeds.every(Boolean) && nfcSeeds.every(Boolean);

  const handleSeedsChange = (conf, newSeeds) => {
    if (conf === "AFC") setAfcSeeds(newSeeds);
    else setNfcSeeds(newSeeds);
  };

  const reset = () => {
    setAfcSeeds(EMPTY_SEEDS());
    setNfcSeeds(EMPTY_SEEDS());
  };

  return { afcSeeds, nfcSeeds, bothReady, handleSeedsChange, reset };
}