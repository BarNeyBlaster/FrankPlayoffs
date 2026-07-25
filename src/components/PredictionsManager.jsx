import React, { useEffect, useState } from "react";
import { Trash2 } from "lucide-react";
import { base44 } from "@/api/base44Client";
import moment from "moment";

export default function PredictionsManager() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [deletingId, setDeletingId] = useState(null);

  const load = async () => {
    try {
      const res = await base44.entities.Prediction.list("-created_date", 100);
      setItems(res || []);
    } catch {
      setItems([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    load();
  }, []);

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this prediction? This cannot be undone.")) return;
    setDeletingId(id);
    try {
      await base44.entities.Prediction.delete(id);
      setItems((prev) => prev.filter((p) => p.id !== id));
    } catch (e) {
      console.error(e);
    } finally {
      setDeletingId(null);
    }
  };

  if (loading) {
    return <div className="text-center py-6 text-white/30 text-sm">Loading predictions…</div>;
  }

  if (items.length === 0) {
    return (
      <div className="text-center py-6 text-white/30 text-sm border border-dashed border-white/10 rounded-xl">
        No predictions submitted yet.
      </div>
    );
  }

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] divide-y divide-white/5 overflow-hidden">
      {items.map((p) => {
        const teamCount = [...(p.afc_seeds || []), ...(p.nfc_seeds || [])].filter(Boolean).length;
        return (
          <div key={p.id} className="flex items-center gap-3 px-4 py-3">
            <div className="flex-1 min-w-0">
              <div className="text-sm font-bold text-white/90 truncate">{p.nickname}</div>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="text-[11px] text-white/40 truncate">{teamCount} teams picked</span>
                <span className="text-[10px] text-white/20 ml-2">{moment(p.created_date).fromNow()}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              disabled={deletingId === p.id}
              className="shrink-0 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-red-500/20 bg-red-500/[0.04] text-red-300 text-xs font-semibold hover:bg-red-500/[0.1] hover:border-red-500/30 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              <Trash2 className="w-3.5 h-3.5" />
              {deletingId === p.id ? "Deleting…" : "Delete"}
            </button>
          </div>
        );
      })}
    </div>
  );
}