import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { Crown, AlertCircle, BarChart3 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import { scorePrediction } from "@/lib/scoring";
import { getTeamById } from "@/data/nflTeams";

export default function Leaderboard({ predictions }) {
  const [official, setOfficial] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      try {
        const res = await base44.entities.OfficialResult.list("-updated_date", 1);
        setOfficial(res && res[0] ? res[0] : null);
      } catch {
        setOfficial(null);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  if (loading) {
    return <div className="text-center py-8 text-white/30 text-sm">Loading leaderboard…</div>;
  }

  if (!predictions || predictions.length === 0) {
    return (
      <div className="text-center py-8 text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
        No predictions yet — be the first to lock one in!
      </div>
    );
  }

  const ranked = predictions
    .map((p) => ({ prediction: p, score: scorePrediction(p, official) }))
    .sort((a, b) => b.score.total - a.score.total);

  const hasResults = ranked[0]?.score.hasResults;

  return (
    <div>
      {!hasResults && (
        <div className="flex items-center gap-2 mb-4 px-4 py-3 rounded-xl border border-amber-500/20 bg-amber-500/[0.04] text-xs text-amber-200/70">
          <AlertCircle className="w-4 h-4 shrink-0" />
          <span>Official results aren't locked in yet — scores will appear once they're entered.</span>
          <Link to="/results" className="ml-auto underline underline-offset-2 text-amber-300 hover:text-amber-200 whitespace-nowrap">
            Enter results →
          </Link>
        </div>
      )}

      <div className="space-y-2">
        {ranked.map(({ prediction: p, score }, i) => {
          const champ = getTeamById(p.champion);
          return (
            <div
              key={p.id}
              className={`flex items-center gap-3 rounded-xl border px-4 py-3 ${
                hasResults && i === 0 ? "border-amber-400/30 bg-amber-400/[0.06]" : "border-white/10 bg-white/[0.03]"
              }`}
            >
              <div className="w-6 flex items-center justify-center text-white/40 text-sm font-bold">
                {hasResults && i === 0 ? <Crown className="w-4 h-4 text-amber-400" /> : i + 1}
              </div>
              <div className="flex-1 min-w-0">
                <div className="text-sm font-bold text-white/90 truncate">{p.nickname}</div>
                {champ && (
                  <div className="flex items-center gap-1.5 mt-0.5">
                    <div
                      className="w-4 h-4 rounded shrink-0"
                      style={{ background: `linear-gradient(135deg, ${champ.primary}, ${champ.secondary})` }}
                    />
                    <span className="text-[11px] text-white/40 truncate">
                      {champ.city} {champ.name}
                    </span>
                  </div>
                )}
              </div>
              {hasResults ? (
                <div className="text-right shrink-0">
                  <div className="text-lg font-black text-white leading-none">
                    {score.total}
                    <span className="text-xs font-medium text-white/40">/{score.maxTotal}</span>
                  </div>
                  <div className="text-[10px] text-white/40 mt-1 flex items-center gap-1 justify-end">
                    <BarChart3 className="w-2.5 h-2.5" />
                    {score.correctCount} correct
                  </div>
                </div>
              ) : (
                <div className="text-xs text-white/30 shrink-0">Pending</div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}