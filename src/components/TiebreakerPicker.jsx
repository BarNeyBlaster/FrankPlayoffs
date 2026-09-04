import React from "react";

export default function TiebreakerPicker({ teams, champion, score, onChampion, onScore }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Tie-Breaker</h3>
        <span className="text-[11px] text-white/30">Champion & final score</span>
      </div>

      <p className="text-[11px] text-white/40 mb-2">Super Bowl champion</p>
      <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5 mb-5">
        {teams.map((t) => {
          const selected = champion === t.id;
          return (
            <button
              key={t.id}
              onClick={() => onChampion(selected ? null : t.id)}
              className={`relative flex flex-col items-center gap-1 rounded-lg px-1 py-2 transition-all ${
                selected ? "ring-2 ring-amber-400" : "ring-1 ring-white/5 hover:bg-white/[0.05]"
              }`}
              style={selected ? { background: `linear-gradient(135deg, ${t.primary}33, ${t.secondary}22)` } : {}}
            >
              <div
                className="w-7 h-7 rounded-md flex items-center justify-center text-[9px] font-bold font-mono"
                style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
              >
                {t.abbr}
              </div>
              <span className="text-[10px] text-white/70 truncate w-full text-center">{t.name}</span>
            </button>
          );
        })}
      </div>

      <p className="text-[11px] text-white/40 mb-2">Final score</p>
      <div className="flex items-center gap-2">
        <input
          type="text"
          inputMode="numeric"
          value={score}
          onChange={(e) => onScore(e.target.value)}
          placeholder="e.g. 24-9"
          disabled={!champion}
          className="w-32 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-center focus:outline-none focus:border-amber-400/50 disabled:opacity-40"
        />
        <span className="text-[11px] text-white/40 ml-2">{champion ? "Final score of the game" : "Pick a champion first"}</span>
      </div>
    </div>
  );
}