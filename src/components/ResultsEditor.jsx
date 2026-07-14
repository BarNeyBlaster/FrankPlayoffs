import React, { useState } from "react";
import { useBracket } from "@/hooks/useBracket";
import { base44 } from "@/api/base44Client";
import ConferencePicker from "@/components/ConferencePicker";
import PlayoffBracket from "@/components/PlayoffBracket";

export default function ResultsEditor({ initial, onSaved }) {
  const bracket = useBracket(initial);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errMsg, setErrMsg] = useState("");

  const handleSave = async () => {
    if (!bracket.bothReady) return;
    setSaving(true);
    const payload = {
      afc_seeds: bracket.afcSeeds,
      nfc_seeds: bracket.nfcSeeds,
      picks: bracket.picks,
      season: "2026",
    };
    if (bracket.champion) {
      payload.champion = bracket.champion.id;
      payload.champion_name = `${bracket.champion.city} ${bracket.champion.name}`;
    }
    try {
      setErrMsg("");
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
      setErrMsg(
        (e && (e.message || e.error)) ||
          "Could not save. Check your connection and try again."
      );
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
          <PlayoffBracket afcSeeds={bracket.afcSeeds} nfcSeeds={bracket.nfcSeeds} picks={bracket.picks} onPick={bracket.handlePick} allowTbd />
        </section>
      )}

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleSave}
            disabled={!bracket.bothReady || saving}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {saving ? "Saving…" : bracket.champion ? (initial && initial.id ? "Update Official Results" : "Lock In Results") : "Save Progress"}
          </button>
          {savedMsg && <span className="text-sm text-emerald-400 font-medium">✓ Saved — leaderboard updated</span>}
          {errMsg && <span className="text-sm text-red-400 font-medium text-center max-w-md">{errMsg}</span>}
        </div>
        {!bracket.champion && bracket.bothReady && (
          <p className="text-xs text-white/40 text-center max-w-md">
            You can save partial results as games are decided — the leaderboard will score whatever has been locked in so far.
          </p>
        )}
      </div>
    </>
  );
}