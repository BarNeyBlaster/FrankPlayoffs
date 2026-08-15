import React from "react";
import { Lock } from "lucide-react";
import { useAuth } from "@/lib/AuthContext";

const ADMIN_EMAIL = "mcast5283@gmail.com";

export default function AdminRoute({ children }) {
  const { user, isLoadingAuth, authError } = useAuth();

  if (isLoadingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950">
        <div className="w-8 h-8 border-4 border-white/10 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (authError?.type === "auth_required" || !user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <div>
          <Lock className="w-10 h-10 mx-auto mb-3 text-amber-400" />
          <p className="text-sm text-white/60">Sign in to access this page.</p>
        </div>
      </div>
    );
  }

  if (user.email !== ADMIN_EMAIL) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-zinc-950 text-white p-6 text-center">
        <div>
          <Lock className="w-10 h-10 mx-auto mb-3 text-red-400" />
          <p className="text-sm text-white/60">You don't have access to this page.</p>
        </div>
      </div>
    );
  }

  return children;
}