import React, { useEffect, useState } from "react";
import { Crown } from "lucide-react";
import { base44 } from "../api/base44Client";
import { scorePrediction } from "../lib/scoring";

export default function Leaderboard() {
  const [official, setOfficial] = useState(null);
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const off = await base44.entities.OfficialResult.list("-updated_date", 1);
        if (off && off[0]) setOfficial(off[0]);
        const ps = await base44.entities.Prediction.list("-created_date", 100);
        setPreds(ps || []);
      } catch {
        /* ignore */
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  const ranked = preds
    .map((p) => ({ p, s: scorePrediction(p, official) }))
    .sort((a, b) => {
      if (b.s.correctCount !== a.s.correctCount) return b.s.correctCount - a.s.correctCount;
      const ac = a.s.champCorrect ? 1 : 0;
      const bc = b.s.champCorrect ? 1 : 0;
      if (bc !== ac) return bc - ac;
      const ad = a.s.scoreDiff == null ? Infinity : a.s.scoreDiff;
      const bd = b.s.scoreDiff == null ? Infinity : b.s.scoreDiff;
      if (ad !== bd) return ad - bd;
      const ae = a.s.exactScore ? 1 : 0;
      const be = b.s.exactScore ? 1 : 0;
      return be - ae;
    });

  if (loading) return <div className="text-center text-white/40 text-sm py-8">Loading leaderboard…</div>;

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center gap-3 mb-4">
        <Crown className="w-5 h-5 text-amber-400" />
        <h2 className="text-lg font-bold">Leaderboard</h2>
        <span className="text-xs text-white/40">{preds.length} {preds.length === 1 ? "entry" : "entries"}</span>
      </div>

      {!official ? (
        <p className="text-sm text-white/50 text-center py-6">Results aren't locked in yet. Come back after the field is set to see scores.</p>
      ) : ranked.length === 0 ? (
        <p className="text-sm text-white/50 text-center py-6">No predictions yet. Be the first!</p>
      ) : (
        <div className="space-y-2">
          {ranked.map((r, i) => (
            <div
              key={r.p.id || i}
              className={`flex items-center gap-3 rounded-lg px-3 py-2 ${
                i === 0 ? "bg-amber-400/10 border border-amber-400/30" : "bg-white/[0.02] border border-white/5"
              }`}
            >
              <span className={`w-6 text-center text-sm font-bold ${i === 0 ? "text-amber-400" : "text-white/40"}`}>{i + 1}</span>
              <span className="flex-1 text-sm font-medium truncate">{r.p.nickname || "Anonymous"}</span>
              {r.s.hasResults ? (
                <span className="text-sm font-bold">{r.s.correctCount}/14</span>
              ) : (
                <span className="text-xs text-white/30">pending</span>
              )}
              {r.s.tbLocked && r.s.champCorrect && <Crown className="w-4 h-4 text-amber-400" />}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}