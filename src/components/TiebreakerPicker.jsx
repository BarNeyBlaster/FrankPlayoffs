import React from "react";

export default function TiebreakerPicker({ teams, champion, scoreChamp, scoreOpp, onChampion, onScoreChamp, onScoreOpp }) {
  return (
    <div className="rounded-2xl border border-white/10 bg-white/[0.03] p-5">
      <div className="flex items-center justify-between mb-1">
        <h3 className="text-xs font-bold uppercase tracking-wider text-white/50">Tie-Breaker</h3>
        <span className="text-[10px] text-white/30">Champion &amp; final score</span>
      </div>
      <p className="text-xs text-white/40 mb-4">Pick the Super Bowl champion, then guess the final score. Used to break ties on the leaderboard.</p>

      {/* Champion picker */}
      <p className="text-[11px] text-white/40 mb-2">Super Bowl champion</p>
      {teams.length === 0 ? (
        <p className="text-xs text-white/30">Pick your 14 teams first.</p>
      ) : (
        <div className="flex flex-wrap gap-2 mb-5">
          {teams.map((t) => {
            const selected = champion === t.id;
            return (
              <button
                key={t.id}
                onClick={() => onChampion(t.id)}
                className={`flex items-center gap-1.5 rounded-lg px-2.5 py-1.5 transition-all ${
                  selected ? "ring-1 ring-amber-400/60" : "bg-white/[0.04] hover:bg-white/[0.08] ring-1 ring-white/5"
                }`}
                style={selected ? { background: `linear-gradient(135deg, ${t.primary}33, ${t.secondary}22)` } : {}}
              >
                <div
                  className="w-5 h-5 rounded-md flex items-center justify-center text-[8px] font-bold font-mono shrink-0"
                  style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.secondary})`, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
                >
                  {t.abbr}
                </div>
                <span className="text-xs font-medium text-white/80">{t.name}</span>
              </button>
            );
          })}
        </div>
      )}

      {/* Final score */}
      <p className="text-[11px] text-white/40 mb-2">Final score</p>
      <div className="flex items-center gap-2">
        <input
          type="number"
          min="0"
          max="99"
          value={scoreChamp}
          onChange={(e) => onScoreChamp(e.target.value)}
          placeholder="Champ"
          disabled={!champion}
          className="w-20 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-center focus:outline-none focus:border-amber-400/50 disabled:opacity-40"
        />
        <span className="text-white/40 font-bold">:</span>
        <input
          type="number"
          min="0"
          max="99"
          value={scoreOpp}
          onChange={(e) => onScoreOpp(e.target.value)}
          placeholder="Opp"
          disabled={!champion}
          className="w-20 px-3 py-2 rounded-lg bg-black/30 border border-white/10 text-sm text-center focus:outline-none focus:border-amber-400/50 disabled:opacity-40"
        />
        <span className="text-[11px] text-white/40 ml-2">{champion ? "Champion : Opponent" : "Pick a champion first"}</span>
      </div>
    </div>
  );
}