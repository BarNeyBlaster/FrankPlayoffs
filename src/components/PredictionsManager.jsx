import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { base44 } from "../api/base44Client";
import { getTeamById } from "../data/nflTeams";

export default function PredictionsManager() {
  const [preds, setPreds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState(null);

  const load = async () => {
    try {
      const res = await base44.entities.Prediction.list("-created_date", 100);
      setPreds(res || []);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    setBusy(id);
    try {
      await base44.entities.Prediction.delete(id);
      await load();
    } catch {
      /* ignore */
    } finally {
      setBusy(null);
    }
  };

  if (loading) return <div className="text-white/40 text-sm">Loading…</div>;
  if (!preds.length) return <div className="text-white/40 text-sm">No predictions submitted yet.</div>;

  return (
    <div className="space-y-2">
      {preds.map((p) => {
        const champ = getTeamById(p.sb_champion);
        return (
          <div key={p.id} className="flex items-center gap-3 rounded-lg border border-white/10 bg-white/[0.02] px-4 py-3">
            <div className="flex-1">
              <p className="text-sm font-medium">{p.nickname || "Anonymous"}</p>
              <p className="text-xs text-white/40">
                {champ ? `Champion: ${champ.city} ${champ.name}` : "No champion picked"}
                {p.sb_score_champ != null && p.sb_score_opp != null ? ` · ${p.sb_score_champ}-${p.sb_score_opp}` : ""}
              </p>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              disabled={busy === p.id}
              className="p-2 rounded-lg hover:bg-red-500/10 text-red-400/70 disabled:opacity-40"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
}