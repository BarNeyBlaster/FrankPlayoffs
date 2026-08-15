import React from "react";
import { getTeamById } from "../data/nflTeams";

const SIZES = {
  sm: "w-5 h-5 text-[8px]",
  md: "w-7 h-7 text-[9px]",
  lg: "w-10 h-10 text-[11px]",
};

export default function TeamBadge({ team: teamOrId, size = "md", showName = false }) {
  const team = typeof teamOrId === "string" ? getTeamById(teamOrId) : teamOrId;
  if (!team) return null;
  return (
    <div className="inline-flex items-center gap-2">
      <div
        className={`${SIZES[size]} rounded-md flex items-center justify-center font-bold font-mono`}
        style={{
          background: `linear-gradient(135deg, ${team.primary}, ${team.secondary})`,
          color: "#fff",
          textShadow: "0 1px 2px rgba(0,0,0,0.6)",
        }}
      >
        {team.abbr}
      </div>
      {showName && <span className="text-sm text-white/80">{team.name}</span>}
    </div>
  );
}