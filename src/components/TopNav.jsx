import React from "react";
import { NavLink } from "react-router-dom";
import { Trophy, ClipboardCheck } from "lucide-react";

export default function TopNav() {
  const linkClass = ({ isActive }) =>
    `flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors ${
      isActive ? "bg-white/10 text-white" : "text-white/50 hover:text-white/80"
    }`;

  return (
    <nav className="flex items-center gap-1 mb-6">
      <NavLink to="/" className={linkClass} end>
        <Trophy className="w-3.5 h-3.5" /> Predictor
      </NavLink>
      <NavLink to="/results" className={linkClass}>
        <ClipboardCheck className="w-3.5 h-3.5" /> Official Results
      </NavLink>
    </nav>
  );
}