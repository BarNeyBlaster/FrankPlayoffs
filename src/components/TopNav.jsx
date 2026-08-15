import React from "react";
import { Link, useLocation } from "react-router-dom";
import { Trophy, ClipboardList } from "lucide-react";

export default function TopNav() {
  const { pathname } = useLocation();
  const linkClass = (p) =>
    `flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition ${
      pathname === p ? "bg-white/10 text-white" : "text-white/50 hover:text-white hover:bg-white/5"
    }`;
  return (
    <nav className="flex items-center justify-center gap-2 mb-8">
      <Link to="/" className={linkClass("/")}><Trophy className="w-4 h-4" /> Predictor</Link>
      <Link to="/results" className={linkClass("/results")}><ClipboardList className="w-4 h-4" /> Official Results</Link>
    </nav>
  );
}