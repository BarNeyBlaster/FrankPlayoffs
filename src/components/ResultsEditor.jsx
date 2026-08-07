import React, { useEffect, useState } from "react";
import { useBracket } from "@/hooks/useBracket";
import { base44 } from "@/api/base44Client";
import { getTeamById } from "@/data/nflTeams";
import ConferencePicker from "@/components/ConferencePicker";
import TiebreakerPicker from "@/components/TiebreakerPicker";

export default function ResultsEditor({ initial, onSaved }) {
  const bracket = useBracket(initial);
  const [saving, setSaving] = useState(false);
  const [savedMsg, setSavedMsg] = useState(false);
  const [errMsg, setErrMsg] = useState("");
  const [tbChamp, setTbChamp] = useState(initial?.sb_champion || null);
  const [score, setScore] = useState(
    initial?.sb_score_champ != null && initial?.sb_score_opp != null
      ? `${initial.sb_score_champ}-${initial.sb_score_opp}`
      : ""
  );

  useEffect(() => {
    if (tbChamp && ![...bracket.afcSeeds, ...bracket.nfcSeeds].includes(tbChamp)) setTbChamp(null);
  }, [bracket.afcSeeds, bracket.nfcSeeds, tbChamp]);

  const fieldTeams = [...bracket.afcSeeds, ...bracket.nfcSeeds].filter(Boolean).map(getTeamById);

  const handleSave = async () => {
    if (!bracket.bothReady) return;
    setSaving(true);
    const payload = {
      afc_seeds: bracket.afcSeeds,
      nfc_seeds: bracket.nfcSeeds,
      season: "2026",
    };
    const match = score.trim().match(/^(\d{1,3})-(\d{1,3})$/);
    if (match) {
      payload.sb_score_champ = parseInt(match[1], 10);
      payload.sb_score_opp = parseInt(match[2], 10);
    }
    if (tbChamp) {
      payload.sb_champion = tbChamp;
      const t = getTeamById(tbChamp);
      if (t) payload.sb_champion_name = `${t.city} ${t.name}`;
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
          <div className="flex items-center gap-3 mb-4">
            <span className="w-6 h-6 rounded-full bg-white/10 flex items-center justify-center text-[11px] font-bold">★</span>
            <h2 className="text-base font-bold">Tie-Breaker</h2>
            <span className="text-xs text-white/40">Lock the Super Bowl champion &amp; final score when decided</span>
          </div>
          <TiebreakerPicker
            teams={fieldTeams}
            champion={tbChamp}
            score={score}
            onChampion={setTbChamp}
            onScore={setScore}
          />
        </section>
      )}

      <div className="flex flex-col items-center gap-2">
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
          <button
            onClick={handleSave}
            disabled={!bracket.bothReady || saving}
            className="px-6 py-3 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm hover:from-amber-300 hover:to-amber-400 disabled:opacity-40 disabled:cursor-not-allowed transition-all"
          >
            {saving ? "Saving…" : initial && initial.id ? "Update Official Field" : "Lock In Field"}
          </button>
          {savedMsg && <span className="text-sm text-emerald-400 font-medium">✓ Saved — leaderboard updated</span>}
          {errMsg && <span className="text-sm text-red-400 font-medium text-center max-w-md">{errMsg}</span>}
        </div>
        {!bracket.bothReady && (
          <p className="text-xs text-white/40 text-center max-w-md">
            Select all 14 playoff teams (7 per conference) to lock in the official field and score every prediction.
          </p>
        )}
      </div>
    </>
  );
}