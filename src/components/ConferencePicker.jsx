import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronUp, ChevronDown, X, Check } from "lucide-react";
import { DIVISIONS, getTeamsByConference } from "@/data/nflTeams";

const SEED_LABELS = ["#1", "#2", "#3", "#4", "#5", "#6", "#7"];

export default function ConferencePicker({ conference, seeds, onChange }) {
  const confTeams = getTeamsByConference(conference);
  const selectedIds = seeds.filter(Boolean);
  const filled = selectedIds.length;
  const complete = filled === 7;

  const toggleTeam = (teamId) => {
    const idx = seeds.findIndex((s) => s === teamId);
    if (idx !== -1) {
      const next = [...seeds];
      next[idx] = null;
      onChange(next);
    } else if (filled < 7) {
      const next = [...seeds];
      const empty = next.findIndex((s) => s === null);
      if (empty !== -1) next[empty] = teamId;
      onChange(next);
    }
  };

  const moveSeed = (from, dir) => {
    const to = from + dir;
    if (to < 0 || to > 6) return;
    const next = [...seeds];
    const tmp = next[from];
    next[from] = next[to];
    next[to] = tmp;
    onChange(next);
  };

  const confColor = conference === "AFC" ? "#E31837" : "#0B5FBF";

  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] backdrop-blur-sm overflow-hidden">
      {/* Header */}
      <div className="flex items-center justify-between px-5 py-4 border-b border-white/10" style={{ background: `linear-gradient(90deg, ${confColor}22 0%, transparent 100%)` }}>
        <div className="flex items-center gap-3">
          <span className="text-2xl font-black tracking-tight" style={{ color: confColor }}>{conference}</span>
          <span className="text-xs text-white/50 font-medium uppercase tracking-wider">Conference</span>
        </div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-bold ${complete ? "text-emerald-400" : "text-white/60"}`}>{filled}/7</span>
          {complete && <Check className="w-4 h-4 text-emerald-400" />}
        </div>
      </div>

      <div className="grid md:grid-cols-2 gap-0">
        {/* Seeds panel */}
        <div className="p-5 border-b md:border-b-0 md:border-r border-white/10">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Playoff Teams</h3>
          </div>
          <div className="space-y-2">
            {SEED_LABELS.map((label, i) => {
              const teamId = seeds[i];
              const team = confTeams.find((t) => t.id === teamId);
              return (
                <div
                  key={i}
                  className={`flex items-center gap-2 rounded-lg border transition-all ${
                    team ? "border-white/15 bg-white/[0.04]" : "border-dashed border-white/10 bg-transparent"
                  }`}
                  style={team ? { boxShadow: `inset 3px 0 0 ${team.primary}` } : {}}
                >
                  <span className="w-7 text-center text-xs font-bold text-white/40">{label}</span>
                  <div className="flex-1 min-h-[36px] flex items-center">
                    {team ? (
                      <>
                        <span className="text-sm font-medium text-white/90 truncate flex-1 px-1">{team.name}</span>
                        <div className="flex items-center gap-0.5 pr-1">
                          <button onClick={() => moveSeed(i, -1)} disabled={i === 0} className="p-1 rounded hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed">
                            <ChevronUp className="w-3.5 h-3.5 text-white/60" />
                          </button>
                          <button onClick={() => moveSeed(i, 1)} disabled={i === 6} className="p-1 rounded hover:bg-white/10 disabled:opacity-20 disabled:cursor-not-allowed">
                            <ChevronDown className="w-3.5 h-3.5 text-white/60" />
                          </button>
                          <button onClick={() => toggleTeam(team.id)} className="p-1 rounded hover:bg-white/10">
                            <X className="w-3.5 h-3.5 text-white/40" />
                          </button>
                        </div>
                      </>
                    ) : (
                      <span className="text-xs text-white/20 px-1">Empty slot</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Teams grid */}
        <div className="p-5">
          <h3 className="text-xs font-bold uppercase tracking-wider text-white/50 mb-3">Select Teams</h3>
          <div className="space-y-3">
            {DIVISIONS.map((div) => (
              <div key={div}>
                <p className="text-[10px] uppercase tracking-wider text-white/30 mb-1.5">{div}</p>
                <div className="grid grid-cols-2 gap-1.5">
                  {confTeams.filter((t) => t.division === div).map((team) => {
                    const selected = selectedIds.includes(team.id);
                    const seedIdx = seeds.findIndex((s) => s === team.id);
                    return (
                      <button
                        key={team.id}
                        onClick={() => toggleTeam(team.id)}
                        disabled={!selected && filled >= 7}
                        className={`relative flex items-center gap-2 rounded-lg px-2.5 py-2 text-left transition-all ${
                          selected
                            ? "ring-1 ring-white/30"
                            : filled >= 7
                            ? "opacity-30 cursor-not-allowed bg-white/[0.02]"
                            : "bg-white/[0.03] hover:bg-white/[0.07] cursor-pointer ring-1 ring-white/5"
                        }`}
                        style={selected ? { background: `linear-gradient(135deg, ${team.primary}33, ${team.secondary}22)` } : {}}
                      >
                        <div
                          className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold font-mono shrink-0"
                          style={{ background: `linear-gradient(135deg, ${team.primary}, ${team.secondary})`, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
                        >
                          {team.abbr}
                        </div>
                        <span className="text-xs font-medium text-white/80 truncate">{team.name}</span>
                        <AnimatePresence>
                          {selected && (
                            <motion.span
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              exit={{ scale: 0 }}
                              className="ml-auto text-[9px] font-bold text-white/50"
                            >
                              #{seedIdx + 1}
                            </motion.span>
                          )}
                        </AnimatePresence>
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}