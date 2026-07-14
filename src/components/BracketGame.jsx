import React from "react";
import { motion } from "framer-motion";

// A single matchup row in the bracket.
// teamA/teamB: team objects or null. winnerId: selected winner team id or null.
// onPick(teamId): called when user clicks a team. disabled: both teams not yet known.
export default function BracketGame({ teamA, teamB, winnerId, onPick, seedA, seedB, conferenceColor, allowTbd }) {
  const ready = teamA && teamB;
  const cc = conferenceColor || "#888";
  const tbdPicked = winnerId === "TBD";

  const renderRow = (team, seed, isWinner, isPicked) => {
    if (!team) {
      return (
        <div className="flex items-center gap-2 px-3 py-2 opacity-30">
          <div className="w-6 h-6 rounded-md bg-white/5" />
          <span className="text-xs text-white/30">TBD</span>
        </div>
      );
    }
    return (
      <button
        onClick={() => ready && !isPicked && onPick(team.id)}
        disabled={!ready}
        className={`w-full flex items-center gap-2 px-3 py-2 transition-all ${
          ready ? "cursor-pointer hover:bg-white/10" : "cursor-default"
        } ${isWinner ? "" : ready ? "opacity-60 hover:opacity-100" : ""}`}
        style={isWinner ? { background: `linear-gradient(90deg, ${team.primary}44, transparent)` } : {}}
      >
        <div
          className="w-6 h-6 rounded-md flex items-center justify-center text-[8px] font-bold font-mono shrink-0"
          style={{ background: `linear-gradient(135deg, ${team.primary}, ${team.secondary})`, color: "#fff", textShadow: "0 1px 2px rgba(0,0,0,0.6)" }}
        >
          {team.abbr}
        </div>
        <span className={`text-xs font-medium truncate ${isWinner ? "text-white" : "text-white/70"}`}>{team.name}</span>
        {seed && <span className="ml-auto text-[9px] font-bold text-white/30">#{seed}</span>}
        {isWinner && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="ml-auto w-1.5 h-1.5 rounded-full"
            style={{ background: cc }}
          />
        )}
      </button>
    );
  };

  return (
    <div className="rounded-lg overflow-hidden border border-white/10 bg-black/20" style={{ boxShadow: winnerId ? `inset 0 0 0 1px ${cc}66` : "none" }}>
      {renderRow(teamA, seedA, winnerId === teamA?.id, winnerId === teamA?.id)}
      <div className="h-px bg-white/5" />
      {renderRow(teamB, seedB, winnerId === teamB?.id, winnerId === teamB?.id)}
      {allowTbd && (
        <>
          <div className="h-px bg-white/5" />
          <button
            onClick={() => onPick("TBD")}
            className={`w-full flex items-center gap-2 px-3 py-2 transition-all ${
              tbdPicked ? "" : "hover:bg-white/10 opacity-60 hover:opacity-100"
            }`}
            style={tbdPicked ? { background: "linear-gradient(90deg, #52525b55, transparent)" } : {}}
          >
            <div className="w-6 h-6 rounded-md flex items-center justify-center text-[10px] font-bold shrink-0 bg-white/10 text-white/50">?</div>
            <span className={`text-xs font-medium ${tbdPicked ? "text-white" : "text-white/50"}`}>TBD</span>
            {tbdPicked && (
              <motion.span
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="ml-auto w-1.5 h-1.5 rounded-full"
                style={{ background: cc }}
              />
            )}
          </button>
        </>
      )}
    </div>
  );
}