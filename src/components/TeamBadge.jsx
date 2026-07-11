import React from "react";
import { getTeamById } from "@/data/nflTeams";

export default function TeamBadge({ teamId, size = "md", showName = true, className = "" }) {
  const team = typeof teamId === "string" ? getTeamById(teamId) : teamId;
  if (!team) return null;

  const sizes = {
    sm: "w-7 h-7 text-[9px]",
    md: "w-9 h-9 text-[10px]",
    lg: "w-12 h-12 text-xs",
  };

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      <div
        className={`${sizes[size]} rounded-md flex items-center justify-center font-bold font-mono shrink-0 ring-1 ring-white/10 shadow-sm`}
        style={{
          background: `linear-gradient(135deg, ${team.primary} 0%, ${team.primary} 50%, ${team.secondary} 50%, ${team.secondary} 100%)`,
          color: team.secondary === "#FFFFFF" || team.secondary === "#FFB612" || team.secondary === "#FFD100" || team.secondary === "#FFC62F" || team.secondary === "#D7A22A" || team.secondary === "#D3BC8D" || team.secondary === "#A5ACAF" || team.secondary === "#B0B7BC" ? "#fff" : "#fff",
          textShadow: "0 1px 2px rgba(0,0,0,0.6)",
        }}
      >
        {team.abbr}
      </div>
      {showName && (
        <span className="text-sm font-medium text-white/90 truncate">
          {team.name}
        </span>
      )}
    </div>
  );
}