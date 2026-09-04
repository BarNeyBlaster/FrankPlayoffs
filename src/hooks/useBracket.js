import { useState } from "react";

export function useBracket(initial) {
  const [afcSeeds, setAfcSeeds] = useState(
    (initial && initial.afc_seeds) ? initial.afc_seeds : Array(7).fill(null)
  );
  const [nfcSeeds, setNfcSeeds] = useState(
    (initial && initial.nfc_seeds) ? initial.nfc_seeds : Array(7).fill(null)
  );

  const bothReady =
    afcSeeds.filter(Boolean).length === 7 && nfcSeeds.filter(Boolean).length === 7;

  const handleSeedsChange = (conf, seeds) => {
    if (conf === "AFC") setAfcSeeds(seeds);
    else setNfcSeeds(seeds);
  };

  const reset = () => {
    setAfcSeeds(Array(7).fill(null));
    setNfcSeeds(Array(7).fill(null));
  };

  return { afcSeeds, nfcSeeds, bothReady, handleSeedsChange, reset };
}