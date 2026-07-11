import React, { useState } from "react";
import { useBracket } from "@/hooks/useBracket";
import { base44 } from "@/api/base44Client";
import ConferencePicker from "@/components/ConferencePicker";
import PlayoffBracket from "@/components/PlayoffBracket";

export default function ResultsEditor({ initial, onSaved }) {
  const bracket = useBracket(initial);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);

  const handleSave = async () => {
    if (!bracket.bothReady || !bracket.champion) return;
    setSaving(true);
    const payload = {
      afc_seeds: bracket.afcSeeds,
      nfc_seeds: bracket.nfcSeeds,
      picks: bracket.picks,
      champion: bracket.champion.id,
      champion_name: `${bracket.champion.city} ${bracket.champion.name}`,
      season: "2026",
    };
    try {
      let record;
      if (initial && initial.id) {
        record = await base44.entities.OfficialResult.update(initial.id, payload);
      } else {
        record = await base44.entities.OfficialResult.create(payload);
      }
      if (onSaved) onSaved(record);
      setSavedMsg(true);
      setTimeout(() => setSavedMsg(false), 2500);
    } catch (e) {
      console.error(e);
    } finally {
      setSaving(false);
    }
  };

  return (
    <>
      <section className="mb-8">
        <div className="grid lg:grid-cols-2 gap-5">
          <ConferencePicker conference="AFC" seeds={bracket.afcSeeds} onChange={(s) => bracket.handleSeedsChange("AFC", s)} />
          <ConferencePicker conference="NFC" seeds={bracket.nfcSeeds} onChange={(s) => bracket.handleSeedsChange("NFC", s)} />
        </div>
      </section>

      {bracket.bothReady && (
        <section className="mb-8">
          <PlayoffBracket afcSeeds={bracket.afcSeeds} nfcSeeds={bracket.nfcSeeds} picks={bracket.picks} onPick={bracket.handlePick} />
        </section>
      )}

      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <button
          onClick={handleSave}
          disabled={!bracket.champion || saving}
          className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
        >
          {saving ? "Saving…" : initial && initial.id ? "Update Official Results" : "Lock In Results"}
        </button>
        {savedMsg && <span className="text-sm text-emerald-400 font-medium">✓ Saved — leaderboard updated</span>}
      </div>
    </>
  );
}