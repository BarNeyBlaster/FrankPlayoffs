import React from "react";
import { Lock, ShieldAlert, LogIn, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import { useAuth } from "@/lib/AuthContext";

// Only this account may access the admin (Official Results) panel.
const ADMIN_EMAIL = "mcast5283@gmail.com";

export default function AdminRoute({ children }) {
  const { user, isAuthenticated, isLoadingAuth, authChecked, navigateToLogin } = useAuth();

  if (isLoadingAuth || !authChecked) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  // Not signed in → prompt to sign in
  if (!isAuthenticated || !user) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-amber-400/10 flex items-center justify-center mx-auto mb-4">
            <Lock className="w-6 h-6 text-amber-400" />
          </div>
          <h1 className="text-xl font-black text-white mb-2">Admin access required</h1>
          <p className="text-sm text-white/50 mb-6">
            You need to be signed in as an admin to enter official results.
          </p>
          <button
            onClick={navigateToLogin}
            className="w-full inline-flex items-center justify-center gap-2 px-4 py-2.5 rounded-lg bg-gradient-to-r from-amber-400 to-amber-500 text-black font-bold text-sm hover:from-amber-300 hover:to-amber-400 transition-all"
          >
            <LogIn className="w-4 h-4" /> Sign in
          </button>
          <Link
            to="/"
            className="mt-4 inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
          >
            <ArrowLeft className="w-3 h-3" /> Back to predictor
          </Link>
        </div>
      </div>
    );
  }

  // Signed in but not the allowed admin account → deny
  if (user.role !== "admin" || (user.email || "").toLowerCase() !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen bg-zinc-950 flex items-center justify-center px-4">
        <div className="max-w-sm w-full rounded-2xl border border-white/10 bg-white/[0.03] p-8 text-center">
          <div className="w-12 h-12 rounded-full bg-red-500/10 flex items-center justify-center mx-auto mb-4">
            <ShieldAlert className="w-6 h-6 text-red-400" />
          </div>
          <h1 className="text-xl font-black text-white mb-2">Not authorized</h1>
          <p className="text-sm text-white/50">
            Only the designated admin account can enter official results. You're signed in as{" "}
            <span className="text-white/80 font-medium">{user.email}</span>.
          </p>
          <Link
            to="/"
            className="mt-6 inline-flex items-center gap-1 text-xs text-white/40 hover:text-white/70"
          >
            <ArrowLeft className="w-3 h-3" /> Back to predictor
          </Link>
        </div>
      </div>
    );
  }

  return children;
}